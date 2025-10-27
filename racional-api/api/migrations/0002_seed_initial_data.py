# api/migrations/0002_seed_initial_data.py
from django.db import migrations

def create_initial_data(apps, schema_editor):
    """
    Creamos los datos iniciales, principalmente
    el superusuario y las acciones (Stocks).
    """
    # Obtenemos los modelos históricos en lugar de importarlos directamente
    User = apps.get_model('api', 'User')
    Stock = apps.get_model('api', 'Stock')
    
    # 1. Crear un Superusuario
    # (El supervisor usará esto para loguearse en /admin/ y en la API)
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@racional.com',
            password='admin', # ¡Recuerda documentar esta clave!
            first_name='Admin',
            last_name='Racional',
            rut='1-9',
            balance=1000000.00 # Le damos un millón de saldo
        )

    # 2. Crear Stocks de prueba
    # Usamos bulk_create para crearlos todos en una sola consulta
    if not Stock.objects.exists():
        Stock.objects.bulk_create([
            Stock(ticker='AAPL', company_name='Apple Inc.', exchange='NASDAQ', currency='USD', current_price=175.00),
            Stock(ticker='MSFT', company_name='Microsoft Corp.', exchange='NASDAQ', currency='USD', current_price=300.00),
            Stock(ticker='GOOGL', company_name='Alphabet Inc.', exchange='NASDAQ', currency='USD', current_price=140.00),
            Stock(ticker='AMZN', company_name='Amazon.com, Inc.', exchange='NASDAQ', currency='USD', current_price=135.00),
            # Agreguemos una chilena para variar
            Stock(ticker='FALABELLA', company_name='S.A.C.I. Falabella', exchange='SSE', currency='CLP', current_price=2150.00),
        ])


class Migration(migrations.Migration):

    # Esta migración DEBE ejecutarse DESPUÉS de la inicial (0001)
    dependencies = [
        ('api', '0001_initial'), 
    ]

    operations = [
        # Aquí le decimos que ejecute nuestra función
        migrations.RunPython(create_initial_data),
    ]