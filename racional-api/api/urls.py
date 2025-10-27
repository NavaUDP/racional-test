# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, UserViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]