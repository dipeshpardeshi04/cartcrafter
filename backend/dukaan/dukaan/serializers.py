from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from myapp.models import Productss,Cart,CartItemm,Shops
# from django.contrib.auth import get_user_model

# Owner = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    


# For customer 
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(  required=True)
    password = serializers.CharField(   required=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")
    
#  For owner



class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productss
        fields = ['id', 'prod_name', 'description', 'price', 'created_at', 'shop', 'category', 'quantaty'] 

    def create(self, validated_data):
        return Productss.objects.create(**validated_data)
        
        
        
        
class ShopsSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)  # Custom field to show owner's name
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    class Meta:
        model = Shops
        # fields = ['id', 'shopname', 'category', 'description', 'address', 'created_at', 'owner_name']
        fields = '__all__'

class ShopsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shops
        fields = ['shopname', 'category', 'description', 'address']
        
# class ShopsallSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Shopsall
#         fields = '__all__'

#     def create(self, validated_data):
#         shop = Shops.objects.create(
#             owner=self.context['request'].user,  # Set the owner to the current user
#             **validated_data
#         )
#         return shop
    
    
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductsSerializer()
    class Meta:
        model = CartItemm
        fields = ['id', 'cart', 'product', 'quantity']
        
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only=True, many=True)
    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'items']
        
        
        
