"""
URL configuration for dukaan project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.urls import path
# from myapp.views import signup, login
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/signup/', signup, name='signup'),
#     path('api/login/', login, name='login'),
# ]
from django.urls import path
from cartcrafter.views import RegisterAPI, LoginAPI, StudentApi,dipesh, add_to_cart, get_cart_items,remove_cart_item,RegisterOwnerAPI,LoginOwnerAPI,all_shops,create_shop,  update_shop, delete_shop, all_shops,  create_shop, my_shops, ProductCreateAPI, ShopListAPI, products_by_shop, update_product, delete_product, ProductDetailView, update_product11,get_shop_details
from django.contrib import admin
from django.urls import path
from django.http import HttpResponse


def home(request):
    return HttpResponse("Welcome to the homepage!")
    
urlpatterns = [
    path('', home, name='home'),
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login/', LoginAPI.as_view(), name='login'),
    path('api/ownerregister/', RegisterOwnerAPI.as_view(), name='owner-register'),
    path('api/ownerlogin/', LoginOwnerAPI.as_view(), name='ownerlogin'),
    
    path('student/',StudentApi, name='student'),
    path('dipesh/',dipesh, name='dipesh'),
    # path('allshops/',all_shops, name='allshops'),
    path('allshops/',all_shops, name='all_shops'), 
    path('createshop/', create_shop, name='create_shop'),
    path('user_shops/', my_shops, name='user_shops'),
    path('api/products/', ProductCreateAPI.as_view(), name='product-create'),
    path('api/shop/<int:shop_id>/products/', products_by_shop, name='products_by_shop'),
    path('api/shopowner/<int:shop_id>/products/', products_by_shop, name='products_by_shop'),
    path('api/products/<int:product_id>/update/', update_product, name='update_product'),
    path('api/products/<int:product_id>/delete/', delete_product, name='delete_product'),
    # path('api/products/<int:product_id>/', get_product, name='get_product'),
    path('api/shopowner/<int:shop_id>/products/<int:product_id>/', ProductDetailView.as_view(), name='product_detail'),
    path('api/shops/<int:shop_id>/', get_shop_details, name='get_shop_details'),
    # Endpoint to update product quantity for a specific product in a shop
    path('api/shopowner/<int:shop_id>/products/<int:product_id>/update/', update_product11, name='product_update'),
    path('api/shops/', ShopListAPI.as_view(), name='shop-list'),
    path('api/cart/add/', add_to_cart, name='add_to_cart'),
    path('api/cart/', get_cart_items, name='get_cart_items'),
    path('api/cart/<int:item_id>/', remove_cart_item, name='remove_cart_item'),
    path('admin/', admin.site.urls),
    
    
     path('shop/create/',create_shop, name='create_shop'),
    
    # Get shops for the logged-in owner
    # path('shop/my/',get_my_shops, name='get_my_shops'),
    
    # Update a specific shop (restricted to owner)
    path('shop/update/<int:shop_id>/', update_shop, name='update_shop'),
    
    # Delete a specific shop (restricted to owner)
    path('shop/delete/<int:shop_id>/', delete_shop, name='delete_shop'),
    
]

