# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet

# El Router genera automáticamente las URLs para el ViewSet (GET, POST, PUT, etc.)
router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')

# Las URLs de la API son determinadas por el router
urlpatterns = [
    path('', include(router.urls)),
]