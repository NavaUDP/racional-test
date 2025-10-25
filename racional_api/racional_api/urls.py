# racional_api/urls.py
from django.contrib import admin
from django.urls import path, include # ¡Asegúrate de importar 'include'!
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),

    # Esta línea conecta todo tu 'api/urls.py' bajo el prefijo 'api/'
    path('api/', include('api.urls')), 

    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),
]