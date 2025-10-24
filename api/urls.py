# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, UserViewSet

# El Router genera automáticamente las URLs para el ViewSet (GET, POST, PUT, etc.)
router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'users', UserViewSet, basename='user')

# Las URLs de la API son determinadas por el router
urlpatterns = [
    path('', include(router.urls)),
]