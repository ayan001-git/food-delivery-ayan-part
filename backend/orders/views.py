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


class CartAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = get_demo_user()
        return Order.objects.filter(user=user, status='pending').order_by('-created_at')


class OrderHistoryAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = get_demo_user()
        return Order.objects.filter(user=user, status='completed').order_by('-created_at')


class AddToCartAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()
        food_id = request.data.get('food_id')
        quantity = int(request.data.get('quantity', 1))

        food = get_object_or_404(FoodItem, id=food_id)

        order = Order.objects.filter(user=user, status='pending').order_by('-created_at').first()
        if not order:
            order = Order.objects.create(user=user, status='pending')

        item = OrderItem.objects.filter(order=order, food_item=food).first()
        if item:
            item.quantity += quantity
            item.save()
        else:
            OrderItem.objects.create(order=order, food_item=food, quantity=quantity)

        return Response({'message': 'Added to cart'})


class UpdateCartItemQuantityAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()
        item_id = request.data.get('item_id')
        action = request.data.get('action')

        order = Order.objects.filter(user=user, status='pending').order_by('-created_at').first()
        if not order:
            return Response({'error': 'No pending order found'}, status=404)

        item = get_object_or_404(OrderItem, id=item_id, order=order)

        if action == 'increase':
            item.quantity += 1
            item.save()
        elif action == 'decrease':
            item.quantity -= 1
            if item.quantity <= 0:
                item.delete()
                return Response({'message': 'Item removed'})
            item.save()
        else:
            return Response({'error': 'Invalid action'}, status=400)

        return Response({'message': 'Quantity updated'})


class RemoveFromCartAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()
        item_id = request.data.get('item_id')

        order = Order.objects.filter(user=user, status='pending').order_by('-created_at').first()
        if not order:
            return Response({'error': 'No pending order found'}, status=404)

        item = get_object_or_404(OrderItem, id=item_id, order=order)
        item.delete()

        return Response({'message': 'Item removed'})


class DeleteSelectedCartItemsAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()
        item_ids = request.data.get('item_ids', [])

        order = Order.objects.filter(user=user, status='pending').order_by('-created_at').first()
        if not order:
            return Response({'error': 'No pending order found'}, status=404)

        OrderItem.objects.filter(order=order, id__in=item_ids).delete()

        return Response({'message': 'Selected items deleted'})


class ClearCartAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()

        order = Order.objects.filter(user=user, status='pending').order_by('-created_at').first()
        if not order:
            return Response({'error': 'No pending order found'}, status=404)

        order.items.all().delete()

        return Response({'message': 'Cart cleared'})


class CheckoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_demo_user()
        order = Order.objects.filter(user=user, status='pending').order_by('-created_at').first()

        if not order:
            return Response({'error': 'No pending order found'}, status=404)

        if order.items.count() == 0:
            return Response({'error': 'Cart is empty'}, status=400)

        order.status = 'completed'
        order.save()

        return Response({'message': 'Order completed'})