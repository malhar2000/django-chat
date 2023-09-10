from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Conversation
from .scheme import list_messages_docs
from .serializers import MessageSerializer


class MessageViewSet(viewsets.ViewSet):
    @list_messages_docs
    def list(self, request):
        channel_id = request.query_params.get("channel_id")
        conversation = Conversation.objects.filter(channel_id=channel_id).first()
        if conversation is None:
            raise ValidationError(detail="Conversation does not exist")
        if channel_id is None:
            raise ValidationError(detail="channel_id is required")
        # using the related name from the Message model
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
