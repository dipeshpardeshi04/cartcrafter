from django.db import models
# from django.contrib.auth import get_user_model
# from django.contrib.auth.hashers import make_password
# from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User
# Getting the Owner model using get_user_model
# Owner = get_user_model()

class Shops(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    shopname = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    address = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Change to DateTimeField if it needs time

    def __str__(self):
        return self.shopname

class Products(models.Model):
    shop = models.ForeignKey(Shops, on_delete=models.CASCADE, related_name='products' , default=1)
    
    prod_name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50)
    quantaty = models.PositiveIntegerField(default=1)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prod_name
    
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}'s Cart"

class CartItemm(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items' ,null=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.prod_name} (x{self.quantity})"

# class ProductsItemm(models.Model):
#     # cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items' ,null=True)
#     product = models.ForeignKey(Products, on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField(default=1)

#     def __str__(self):
#         return f"{self.product.prod_name} (x{self.quantity})"
