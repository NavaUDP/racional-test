from rest_framework import serializers
from .models import User, Stock, Holding, Transaction  

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rut', 'balance']
        read_only_fields = ['balance']

class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user', 'status', 'stock', 'quantity', 'unit_price', 'timestamp']

    def validate(self, data):
        #Verifica que el monto sea positivo y el type sea válido para el caso
        type = data.get('type')
        amount = data.get('total_amount')

        if amount <= 0:
            raise serializers.ValidationError("El monto total debe ser positivo.")
        if type not in ['deposit', 'withdrawal']:
            raise serializers.ValidationError("El 'type' debe ser 'deposit' o 'withdrawal'.")
        
        return data