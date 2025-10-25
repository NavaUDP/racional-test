from django.contrib import admin
from .models import User, Stock, Holding, Transaction


admin.site.register(User)
admin.site.register(Stock)
admin.site.register(Holding)
admin.site.register(Transaction)