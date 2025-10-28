# api/tests.py
from django.urls import reverse # Para obtener URLs de API por su nombre
from rest_framework import status # Para códigos de estado HTTP (200 OK, 201 CREATED, 400 BAD REQUEST, etc.)
from rest_framework.test import APITestCase # Clase base para tests de API en DRF
from rest_framework.authtoken.models import Token # Para manejar la autenticación por token
from decimal import Decimal # Para manejar montos de dinero con precisión

# Importamos tus modelos
from .models import User, Stock, Holding, Transaction

class TransactionAPITests(APITestCase):
    """
    Grupo de tests para el endpoint de Transacciones (/api/transactions/).
    """

    def setUp(self):
        """
        Este método se ejecuta ANTES de cada test en esta clase.
        Es ideal para crear datos iniciales comunes, como el usuario de prueba.
        """
        # 1. Crear un usuario de prueba
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword123',
            email='test@example.com',
            rut='12345678-9',
            balance=Decimal('10000.00') # Saldo inicial para las pruebas
        )

        # 2. Obtener (o crear) el token para este usuario
        self.token, created = Token.objects.get_or_create(user=self.user)

        # 3. Autenticar el cliente de prueba de DRF
        # Esto simula enviar el token en el header 'Authorization: Token <tu_token>'
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        # 4. Obtener la URL del endpoint de transacciones
        # 'transaction-list' es el nombre por defecto que DRF le da a la ruta raíz del ViewSet
        self.transactions_url = reverse('transaction-list')

    # --- TEST 1: Depósito Exitoso ---
    def test_create_deposit_success(self):
        """
        Verifica que un usuario autenticado pueda crear un depósito válido.
        """
        # Datos que enviaremos en el POST
        deposit_data = {
            'type': 'deposit',
            'total_amount': '5000.00' # DRF maneja la conversión de string a Decimal
        }

        # Realizamos la petición POST a la URL de transacciones
        response = self.client.post(self.transactions_url, deposit_data, format='json')

        # --- Verificaciones (Assertions) ---

        # 1. Verificar que la respuesta fue exitosa (201 CREATED)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 2. Verificar que se creó UNA transacción en la base de datos
        self.assertEqual(Transaction.objects.count(), 1)
        transaction = Transaction.objects.first() # Obtenemos la transacción creada
        self.assertEqual(transaction.user, self.user)
        self.assertEqual(transaction.type, 'deposit')
        self.assertEqual(transaction.total_amount, Decimal('5000.00'))
        self.assertEqual(transaction.status, 'completed')

        # 3. Verificar que el saldo del usuario se actualizó correctamente
        self.user.refresh_from_db() # Recargamos los datos del usuario desde la BD
        # Saldo inicial (10000) + Depósito (5000) = 15000
        self.assertEqual(self.user.balance, Decimal('15000.00'))
