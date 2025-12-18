from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from chat.models import ChatRoom, Message
from chat.api.v1.serializers import ChatRoomSerializer, MessageSerializer, UserSerializer, UserRegistrationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework import generics


User = get_user_model()

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ChatRoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Use 'users' (plural) - ManyToManyField
        rooms = ChatRoom.objects.filter(users=request.user)
        serializers = ChatRoomSerializer(rooms, many=True, context={'request': request})
        return Response(serializers.data)


class CreateOrGetRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        other_user_id = request.data.get("user_id")
        room_name = request.data.get("name", None)

        if not other_user_id:
            return Response({"error": "user_id is required"}, status=400)

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        try:
            # Check for existing room with both users
            room = ChatRoom.objects.filter(users=request.user).filter(users=other_user).first()

            if not room:
                room = ChatRoom.objects.create(name=room_name if room_name else None)
                room.users.add(request.user, other_user)
            return Response({"room_id": room.id})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# ViewSet approach with router:
class ChatRoomViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatRoomSerializer

    def get_queryset(self):
        # Use 'users' (plural) - ManyToManyField
        return ChatRoom.objects.filter(users=self.request.user)

    def create(self, request):
        """Create a new chat room"""
        room = ChatRoom.objects.create()
        room.users.add(request.user)
        serializer = self.get_serializer(room)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get messages for a specific room"""
        room = self.get_object()
        messages = Message.objects.filter(room=room)
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_name(self, request, pk=None):
        """Update the name of a chat room"""
        room = self.get_object()
        
        # Verify user is a member of the room
        if request.user not in room.users.all():
            return Response({"error": "You are not a member of this room"}, status=403)
        
        name = request.data.get('name', '').strip()
        room.name = name if name else None
        room.save()
        
        serializer = self.get_serializer(room)
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        # Only show messages from rooms the user is part of
        user_rooms = ChatRoom.objects.filter(users=self.request.user)
        return Message.objects.filter(room__in=user_rooms)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username
        })