# api/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated  # ¡Importante!
from .models import Transaction, User
from .serializers import TransactionSerializer, UserSerializer
from decimal import Decimal # Para manejar el dinero correctamente

# --- ViewSet para Transacciones (Depósitos/Retiros) ---
class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint para ver y crear transacciones.
    Solo se listarán las transacciones del usuario autenticado.
    """
    serializer_class = TransactionSerializer
    
    # Con esto, solo usuarios logueados pueden usar este endpoint
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        """
        Esta vista solo debe devolver las transacciones
        del usuario que está haciendo la petición.
        """
        return Transaction.objects.filter(user=self.request.user).order_by('-timestamp')

    def create(self, request, *args, **kwargs):
        """
        Sobrescribimos el método POST para manejar la lógica 
        de depósitos y retiros.
        """
        # 1. Usamos el serializer para validar el JSON de entrada
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 2. Si es válido, extraemos los datos
        validated_data = serializer.validated_data
        type = validated_data.get('type')
        amount = Decimal(validated_data.get('total_amount')) # Usamos Decimal
        user = request.user

        # 3. ---- INICIO LÓGICA DE NEGOCIO ----
        
        if type == 'deposit':
            # A los depósitos, les sumamos el balance
            user.balance += amount
            user.save()

        elif type == 'withdrawal':
            # A los retiros, validamos fondos y restamos
            if user.balance < amount:
                return Response(
                    {"error": "Fondos insuficientes."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.balance -= amount
            user.save()
        
        # 4. ---- FIN LÓGICA DE NEGOCIO ----

        # 5. Guardamos la transacción en la BBDD, asignando el usuario
        #    y marcándola como 'completada'.
        transaction = serializer.save(
            user=user, 
            status='completed'
        )
        
        # 6. Devolvemos el objeto creado (HTTP 201)
        # Usamos el serializer para convertir el objeto 'transaction' a JSON
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)