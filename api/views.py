from rest_framework import viewsets, status, mixins 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action 
from .models import Transaction, User, Stock, Holding 
from .serializers import TransactionSerializer, UserSerializer
from decimal import Decimal
from django.db import transaction
from django.db.models import F, Sum, DecimalField


# --- TransactionViewSet (ACTUALIZADO) ---
class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint para Transacciones (Depósito, Retiro, Compra, Venta).
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtra para que solo muestre las transacciones del usuario logueado.
        """
        return Transaction.objects.filter(user=self.request.user).order_by('-timestamp')

    # 'atomic' asegura que si algo falla (ej. no hay fondos),
    # no se guarde ningún cambio en la BBDD (no se resta balance, etc.)
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Sobrescribimos el método POST para manejar los 4 tipos de lógica:
        - deposit
        - withdrawal
        - buy
        - sell
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        validated_data = serializer.validated_data
        type = validated_data.get('type')
        user = request.user

        # --- LÓGICA DE DEPÓSITO / RETIRO (ya la teníamos) ---
        if type in ['deposit', 'withdrawal']:
            amount = Decimal(validated_data.get('total_amount'))
            
            if type == 'deposit':
                user.balance += amount
                user.save()
                
            elif type == 'withdrawal':
                if user.balance < amount:
                    return Response({"error": "Fondos insuficientes."}, status=status.HTTP_400_BAD_REQUEST)
                user.balance -= amount
                user.save()
                # Guardamos el monto como negativo para egresos
                validated_data['total_amount'] = -amount 

            # Guardamos y devolvemos la transacción
            serializer.save(user=user, status='completed')
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        # --- LÓGICA DE COMPRA / VENTA (NUEVO) ---
        elif type in ['buy', 'sell']:
            
            stock = validated_data.get('stock') # El objeto Stock (gracias al serializer)
            quantity = validated_data.get('quantity')
            unit_price = stock.current_price # ¡Usamos el precio actual!
            total_amount = Decimal(unit_price * quantity)

            if type == 'buy':
                if user.balance < total_amount:
                    # Opcional: crea la tx como 'failed'
                    serializer.save(user=user, status='failed', unit_price=unit_price, total_amount=-total_amount)
                    return Response({"error": "Fondos insuficientes para la compra."}, status=status.HTTP_400_BAD_REQUEST)
                
                # 1. Restar balance
                user.balance -= total_amount
                user.save()

                # 2. Actualizar/Crear Posición (Portafolio)
                # get_or_create es perfecto para esto
                holding, created = Holding.objects.get_or_create(
                    user=user, 
                    stock=stock,
                    defaults={'quantity': 0, 'average_cost_price': 0}
                )
                
                # Cálculo de precio promedio ponderado
                old_total_cost = holding.average_cost_price * holding.quantity
                new_total_cost = unit_price * quantity
                new_quantity = holding.quantity + quantity

                holding.average_cost_price = (old_total_cost + new_total_cost) / new_quantity
                holding.quantity = new_quantity
                holding.save()

                # 3. Guardar Transacción
                transaction = serializer.save(
                    user=user, 
                    status='completed', 
                    unit_price=unit_price, 
                    total_amount=-total_amount # Negativo = egreso
                )

            elif type == 'sell':
                try:
                    # 1. Validar si tiene la acción y cantidad suficiente
                    holding = Holding.objects.get(user=user, stock=stock)
                    if holding.quantity < quantity:
                        raise Holding.DoesNotExist # Forzamos el error
                except Holding.DoesNotExist:
                    serializer.save(user=user, status='failed', unit_price=unit_price, total_amount=total_amount)
                    return Response({"error": "No tienes suficientes acciones para vender."}, status=status.HTTP_400_BAD_REQUEST)

                # 2. Sumar balance
                user.balance += total_amount
                user.save()

                # 3. Actualizar Holding
                holding.quantity -= quantity
                if holding.quantity == 0:
                    holding.delete() # Limpiamos si ya no tiene
                else:
                    holding.save()

                # 4. Guardar Transacción
                transaction = serializer.save(
                    user=user, 
                    status='completed', 
                    unit_price=unit_price, 
                    total_amount=total_amount # Positivo = ingreso
                )
            
            # Devolvemos la transacción creada
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.pk)
    
    @action(detail=True, methods=['get'])
    def portfolio(self, request, pk=None):
        """
        Calcula y devuelve el valor total actual del portafolio del usuario.
        """
        # 1. get_object() obtiene el usuario (protegido por get_queryset)
        user = self.get_object() 
        
        # 2. Usamos la BBDD para hacer el cálculo (¡muy eficiente!)
        # Suma (quantity * stock__current_price) para todas las posiciones del usuario
        result = user.holdings.annotate(
            current_value=F('quantity') * F('stock__current_price')
        ).aggregate(
            total=Sum('current_value', output_field=DecimalField())
        )

        total_value = result['total'] or Decimal('0.00') # Si no tiene posiciones, devuelve 0
        
        # 3. Devolvemos la respuesta
        return Response({
            'username': user.username,
            'total_portfolio_value': total_value,
            'balance': user.balance,
            'total_equity': user.balance + total_value # Valor total (dinero + acciones)
        })