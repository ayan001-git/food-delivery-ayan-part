from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order, OrderItem
from .serializers import OrderSerializer
from food.models import FoodItem


def get_demo_user():
    return User.objects.get(username='admin')


class OrderListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = get_demo_user()
        return Order.objects.filter(user=user, status='pending')

    def perform_create(self, serializer):
        user = get_demo_user()
        serializer.save(user=user)


class AddToCartAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()
        food_id = request.data.get('food_id')
        quantity = int(request.data.get('quantity', 1))

        food = get_object_or_404(FoodItem, id=food_id)

        orders = Order.objects.filter(user=user, status='pending')
        if orders.exists():
            order = orders.first()
        else:
            order = Order.objects.create(user=user, status='pending')

        item, created = OrderItem.objects.get_or_create(
            order=order,
            food_item=food,
            defaults={'quantity': quantity}
        )

        if not created:
            item.quantity += quantity
            item.save()

        return Response({"message": "Added to cart"})


class RemoveFromCartAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()
        item_id = request.data.get('item_id')

        order = Order.objects.filter(user=user, status='pending').first()
        if not order:
            return Response({"error": "No pending order found"}, status=404)

        item = get_object_or_404(OrderItem, id=item_id, order=order)
        item.delete()

        return Response({"message": "Item removed"})


class CheckoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()

        order = Order.objects.filter(
            user=user,
            status='pending',
            items__isnull=False
        ).distinct().first()

        if not order:
            return Response({"error": "Cart is empty"}, status=400)

        order.status = 'completed'
        order.save()

        return Response({"message": "Order completed"})
class OrderHistoryAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = get_demo_user()
        return Order.objects.filter(user=user, status='completed').order_by('-created_at')