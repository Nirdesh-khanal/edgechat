from django.contrib.auth.models import User
from django.db import models
from django.conf import settings

class ChatRoom(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    users = models.ManyToManyField(User, related_name='chat_rooms')  # PLURAL 'users'
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.name:
            return f"{self.name} (Room #{self.id})"
        user_names = ", ".join([user.username for user in self.users.all()])
        return f"ChatRoom {self.id} - Users: {user_names}"


class Message(models.Model):
    MESSAGE_TYPES = [
        ("text", "Text"),
        ("image", "Image"),
        ("file", "File"),
    ]
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="chat_images/",blank=True, null=True)
    file = models.FileField(upload_to="chat_files/", blank=True, null=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} in Room {self.room.id}"