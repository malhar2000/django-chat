from rest_framework import serializers

from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    # return the username of the sender instead of the user object i.e. whatever is returned by __str__ method
    sender = serializers.StringRelatedField()

    class Meta:
        model = Message
        fields = ("id", "sender", "content", "timestamp")
