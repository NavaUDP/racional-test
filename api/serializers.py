from rest_framework import serializers
from .models import User, Stock, Holding, Transaction  

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rut', 'balance']
        read_only_fields = ['balance']

class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    stock = serializers.SlugRelatedField(
        slug_field='ticker', 
        queryset=Stock.objects.all(),
        required=False, 
        allow_null=True 
    )

    class Meta:
        model = Transaction
        fields = '__all__'
        
        read_only_fields = ('user', 'status', 'unit_price', 'timestamp')

        extra_kwargs = {
            'total_amount': {'required': False, 'allow_null': True}, 
            'quantity': {'required': False, 'allow_null': True},     
        }

    def validate(self, data):
        """
        Validación de Lógica de Negocio (Ligeramente mejorada para None).
        """
        type = data.get('type')
        
        if type in ['deposit', 'withdrawal']:
            #'get' devuelve None si no existe
            if data.get('total_amount') is None:
                raise serializers.ValidationError("Depósitos y retiros requieren 'total_amount'.")
            if data.get('stock') is not None or data.get('quantity') is not None:
                raise serializers.ValidationError("Depósitos y retiros no deben incluir 'stock' o 'quantity'.")
            
            if data['total_amount'] <= 0:
                    raise serializers.ValidationError("El 'total_amount' debe ser positivo.")

        elif type in ['buy', 'sell']:
            if data.get('stock') is None or data.get('quantity') is None:
                raise serializers.ValidationError("Compras y ventas requieren 'stock' (ticker) y 'quantity'.")
            if data.get('total_amount') is not None:
                raise serializers.ValidationError("En compras/ventas, 'total_amount' se calcula automáticamente.")

            if data['quantity'] <= 0:
                raise serializers.ValidationError("La 'quantity' debe ser positiva.")
        
        else:
            raise serializers.ValidationError(f"Tipo de transacción '{type}' no es válido.")

        return data
    
class SimpleStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['ticker', 'company_name', 'current_price']

class HoldingSerializer(serializers.ModelSerializer):
    stock = SimpleStockSerializer(read_only=True)
    current_value = serializers.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        read_only=True
    )

    class Meta:
        model = Holding
        fields = [
            'stock',
            'quantity',
            'average_cost_price',
            'current_value'
        ]