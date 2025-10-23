from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Modelo de usuario
# AbstractUser ya viene con campos como username, password, email, first_name, last_name.
class User(AbstractUser):
    rut = models.CharField(max_length=12, unique=True, null=False, blank=False)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    def __str__(self):
        return self.username
    
# Modelo de acciones
class Stock(models.Model):
    ticker = models.CharField(max_length=10, unique=True, null=False, blank=False)
    company_name = models.CharField(max_length=100, null=False, blank=False)
    exchange = models.CharField(max_length=50, null=False, blank=False)
    currency = models.CharField(max_length=10, null=False, blank=False)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)

    def __str__(self):
        return f"{self.ticker} ({self.company_name})"
    
# Modelo de posesiones
class Holding(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='holdings')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='holdings')
    quantity = models.PositiveIntegerField()
    average_cost_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('user', 'stock')

    def __str__(self):
        return f"{self.user.username} - {self.quantity} de {self.stock.ticker}"
    
# Modelo de transacciones
class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('deposit', 'Depósito'),
        ('withdrawal', 'Retiro'),
        ('buy', 'Compra'),
        ('sell', 'Venta'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('completed', 'Completada'),
        ('failed', 'Fallida'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    stock = models.ForeignKey(Stock, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.total_amount} ({self.status})"