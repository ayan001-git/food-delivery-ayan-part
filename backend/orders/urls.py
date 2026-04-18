from django.urls import path
from .views import (
    CartAPIView,
    OrderHistoryAPIView,
    AddToCartAPIView,
    UpdateCartItemQuantityAPIView,
    RemoveFromCartAPIView,
    DeleteSelectedCartItemsAPIView,
    ClearCartAPIView,
    CheckoutAPIView
)

urlpatterns = [
    path('orders/', CartAPIView.as_view()),
    path('orders/history/', OrderHistoryAPIView.as_view()),
    path('cart/add/', AddToCartAPIView.as_view()),
    path('cart/update-quantity/', UpdateCartItemQuantityAPIView.as_view()),
    path('cart/remove/', RemoveFromCartAPIView.as_view()),
    path('cart/delete-selected/', DeleteSelectedCartItemsAPIView.as_view()),
    path('cart/clear/', ClearCartAPIView.as_view()),
    path('cart/checkout/', CheckoutAPIView.as_view()),
]