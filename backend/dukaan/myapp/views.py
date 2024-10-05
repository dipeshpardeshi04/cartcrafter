from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import login
from dukaan.serializers import UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from dukaan.serializers import ProductsSerializer,UserSerializer,CartSerializer,ShopsSerializer,ShopsCreateSerializer
from myapp.models import Products,Cart,CartItemm,Shops #card
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
# from rest_framework import serializers
# Signup API
from django.views.generic import CreateView, UpdateView, DetailView
from rest_framework.generics import CreateAPIView
from rest_framework.authtoken.models import Token
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseForbidden
# import ValidationError
from django.core.exceptions import ValidationError
from .models import Shops

class ShopOwnerMixin:
    def dispatch(self, request, *args, **kwargs):
        shop = self.get_object()
        if not shop.is_owner(request.user):  # Check if the current user is the owner
            return HttpResponseForbidden("You are not allowed to access this shop.")
        return super().dispatch(request, *args, **kwargs)

# Example view for shop creation
class ShopCreateView(LoginRequiredMixin, CreateView):
    model = Shops
    fields = ['shopname', 'category', 'description', 'address']

    def form_valid(self, form):
        form.instance.owner = self.request.user  # Set the owner to the current user
        return super().form_valid(form)

# Example view for shop update, restricted to the owner
class ShopUpdateView(LoginRequiredMixin, ShopOwnerMixin, UpdateView):
    model = Shops
    fields = ['shopname', 'category', 'description', 'address']

# Example view for shop details, restricted to the owner
class ShopDetailView(LoginRequiredMixin, ShopOwnerMixin, DetailView):
    model = Shops

@permission_classes([AllowAny])
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # Allow anyone to access this view

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()  # Save the user
        token = Token.objects.create(user=user)  # Create an authentication token for the new user
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        })

# Login API
@permission_classes([AllowAny])
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key,
            
        })


# class RegisterOwnerAPI(generics.GenericAPIView):
#     serializer_class = RegisterSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#         return Response({
#             "user": UserSerializer(user).data,
#             "token": Token.objects.create(user=user).key
#         })

@permission_classes([AllowAny])
class RegisterOwnerAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        return Response({
            "user": UserSerializer(user).data,
            "token": Token.objects.create(user=user).key
        })
# Login API
@permission_classes([AllowAny])
class LoginOwnerAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key,
            
        })

# # @csrf_exempt
# @api_view(['GET'])  # Specify allowed methods
# def all_shops(request):
#     if request.method == 'GET':
#         shops = alls.objects.all()  # Fetch all shops
#         serializer =  ShopsSerializer(shops, many=True)  # Serialize the shop data
#         return JsonResponse(serializer.data, safe=False) 



# View for all users (customers) to see all shops
@api_view(['GET'])
@permission_classes([AllowAny])
def all_shops(request):
    shops = Shops.objects.all()
    serializer = ShopsSerializer(shops, many=True)
    return JsonResponse(serializer.data, safe=False)

# View for authenticated users to see only their shops
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_shops(request):
    shops = Shops.objects.filter(owner=request.user)
    serializer = ShopsSerializer(shops, many=True)
    return JsonResponse(serializer.data, safe=False)

# View for authenticated users to create a new shop
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_shop(request):
    serializer = ShopsCreateSerializer(data=request.data)
    if serializer.is_valid():
        # Save shop with the current logged-in user as the owner
        shop = serializer.save(owner=request.user)
        return Response({"message": "Shop created successfully", "data": ShopsSerializer(shop).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# @csrf_exempt
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_shop(request):
#     serializer = ShopsSerializer(data=request.data, context={'request': request})
#     # serializer_2 = ShopsallSerializer(data=request.data, context={'request': request})
#     user = request.user
#     product_id = request.data.get('shop_id')
#     # quantity = request.data.get('quantity', 1)
    
#     if user.is_authenticated:
#         cart, created = alls.objects.get_or_create(user=user)
#         product = Shops.objects.get(id=id)
#         cart_item, created = ShopItem.objects.get_or_create(cart=cart, product=product)
#         # cart_item.quantity = quantity
#         cart_item.save()
#     if serializer.is_valid() :
#         serializer.save()
#         # serializer_2.save()
#         return Response({
#             "message": "Shop created successfully",
#             "data": serializer.data
#         }, status=status.HTTP_201_CREATED)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @csrf_exempt
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_user_shops(request):
#     user = request.user  # Get the authenticated user
#     shops = Shops.objects.filter(owner=user)  # Fetch shops belonging to the user
#     serializer = ShopsSerializer(shops, many=True)  # Serialize the shop data
#     return Response(serializer.data, status=status.HTTP_200_OK)


# @csrf_exempt
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_my_shops(request):
#     shops = Shops.objects.filter(owner=request.user)  # Get only shops owned by the user
#     serializer = ShopsSerializer(shops, many=True)
#     return JsonResponse(serializer.data, safe=False)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_shop(request, shop_id):
    try:
        shop = Shops.objects.get(id=shop_id, owner=request.user)  # Ensure the user is the owner
    except Shops.DoesNotExist:
        return Response({"error": "Shop not found or you are not the owner."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ShopsSerializer(shop, data=request.data, partial=True)  # Allow partial updates
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_shop(request, shop_id):
    try:
        shop = Shops.objects.get(id=shop_id, owner=request.user)  # Ensure the user is the owner
    except Shops.DoesNotExist:
        return Response({"error": "Shop not found or you are not the owner."}, status=status.HTTP_404_NOT_FOUND)
    
    shop.delete()
    return Response({"message": "Shop deleted successfully"}, status=status.HTTP_200_OK)
           
        
@csrf_exempt   
# class dipesh(APIView): 
def dipesh(request):
    if request.method=='GET':
        student = Products.objects.all()
        student_serializer=ProductsSerializer(student,many=True)
        return JsonResponse(student_serializer.data,safe=False)
    
    
# @csrf_exempt
# @api_view(['POST'])
class ProductCreateAPI(CreateAPIView):
    serializer_class = ProductsSerializer

    def perform_create(self, serializer):
        shop_id = self.request.data.get('shopId')
        try:
            shop = Shops.objects.get(id=shop_id, owner=self.request.user)
        except Shops.DoesNotExist:
            raise ValidationError("Shop not found or you do not own this shop.")
        
        # If the shop is valid and belongs to the user, save the product
        serializer.save(shop=shop)
    # def perform_create(self, serializer):
    #     try:
    #         # Get the shop owned by the logged-in user
    #         shop = Shops.objects.get(owner=self.request.user)
    #         # Save the product with the associated shop
    #         serializer.save(shop=shop)
    #     except Shops.DoesNotExist:
    #         return Response({"error": "Shop not found for this user."}, status=status.HTTP_400_BAD_REQUEST)


class ShopListAPI(generics.ListAPIView):
    queryset = Shops.objects.all()
    serializer_class = ShopsSerializer
    # Adjust permissions if necessary


# View to get all products for a specific shop
@api_view(['GET'])
@permission_classes([AllowAny])  # Set permission as needed (e.g., only authenticated users)
def products_by_shop(request, shop_id):
    try:
        shop = Shops.objects.get(id=shop_id)  # Fetch the shop by ID
        products = Products.objects.filter(shop=shop)  # Filter products by shop
        serializer = ProductsSerializer(products, many=True)  # Serialize the products
        return Response(serializer.data)
    except Shops.DoesNotExist:
        return Response({"error": "Shop not found"}, status=404)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, product_id):
    try:
        product = Products.objects.get(id=product_id, shop__owner=request.user)  # Ensure the user is the owner
        print(product)
    except Products.DoesNotExist:
        return Response({"error": "Product not found or you are not the owner."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductsSerializer(product, data=request.data, partial=True)  # Allow partial updates
    # print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    try:
        product = Products.objects.get(id=product_id, shop__owner=request.user)  # Ensure the user is the owner
    except Products.DoesNotExist:
        return Response({"error": "Product not found or you are not the owner."}, status=status.HTTP_404_NOT_FOUND)

    product.delete()
    return Response({"message": "Product deleted successfully"}, status=status.HTTP_200_OK)

class ProductDetailView(APIView):
    def get(self, request, shop_id, product_id, *args, **kwargs):
        try:
            print("hello")
            # Get the product from a specific shop
            shop = Shops.objects.get(id=shop_id)
            product = Products.objects.get(id=product_id, shop=shop)
            
            # Serialize the product details
            serializer = ProductsSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Shops.DoesNotExist:
            return Response({"error": "Shop not found"}, status=status.HTTP_404_NOT_FOUND)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

# from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Shops, Products

@csrf_exempt
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_product11(request, shop_id, product_id):
    print("Received request data:", request.data)  # Debugging
    try:
        product = Products.objects.get(id=product_id, shop__owner=request.user)
    except Products.DoesNotExist:
        return Response({"error": "Product not found or you are not the owner."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductsSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([AllowAny])  # Allow any user to access this view
def get_shop_details(request, shop_id):
    try:
        shop = Shops.objects.get(pk=shop_id)
    except Shops.DoesNotExist:
        return Response({'error': 'Shop not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ShopsSerializer(shop)
    return Response(serializer.data, status=status.HTTP_200_OK)



     
@csrf_exempt
# class StudentApi(APIView):
def StudentApi(request):
    if request.method=='GET':
        student = User.objects.all()
        student_serializer=UserSerializer(student,many=True)
        return JsonResponse(student_serializer.data,safe=False)
    elif request.method=='POST':
        student_data=JSONParser().parse(request)
        print(student_data)
        student_serializer=UserSerializer(data=student_data)
        if student_serializer.is_valid():
            student_serializer.save()
            return JsonResponse("Added Successfully",safe=False)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='PUT':
        student_data=JSONParser().parse(request)
        student=User.objects.get(id=id)
        student_serializer=UserSerializer(student,data=student_data)
        if student_serializer.is_valid():
            student_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        return JsonResponse("Failed to Update")
    elif request.method=='DELETE':
        student=User.objects.get(id=id)
        student.delete()
        return JsonResponse("Deleted Successfully",safe=False)
    
@csrf_exempt    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    if user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=user)
        product = Products.objects.get(id=product_id)
        cart_item, created = CartItemm.objects.get_or_create(cart=cart, product=product)
        cart_item.quantity = quantity
        cart_item.save()

        return Response({'message': 'Product added to cart!'}, status=status.HTTP_200_OK)
    return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart_items(request):
    user = request.user
    if user.is_authenticated:
        cart = Cart.objects.get(user=user)
        serializer = CartSerializer(cart)
        print(serializer.data)
        return Response(serializer.data)
    return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    try:
        cart = Cart.objects.get(user=request.user)
        print(f"User's cart: {cart}")
        cart_item = CartItemm.objects.get(id=item_id, cart=cart)
        print(f"Item to delete: {cart_item}")
        cart_item.delete()
        return Response({"message": "Item removed"}, status=status.HTTP_200_OK)
    except CartItemm.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
