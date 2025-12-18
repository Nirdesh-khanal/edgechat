from django.urls import path, include
from rest_framework.routers import DefaultRouter
from chat.api.v1.views import ChatRoomViewSet, MessageViewSet, CreateOrGetRoomView, UserViewSet, RegisterView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'rooms', ChatRoomViewSet, basename='chatroom')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('rooms/create/', CreateOrGetRoomView.as_view(), name='room-create'),
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]