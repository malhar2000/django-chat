from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import get_user_model

from .models import Conversation, Message

User = get_user_model()


# using JsonWebsocketConsumer instead of WebsocketConsumer
# so we dont have to manually serialize/deserialize json
class WebChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # should be dyanmic name but using static for now
        self.channel_id = None
        self.user = None
        self.conversation = None

    def connect(self):
        self.accept()
        self.channel_id = self.scope["url_route"]["kwargs"]["channelId"]
        # user
        self.user = User.objects.get(id=1)
        # return a tuple of (conversation, created)
        # if conversation exists, return it, if not, create it
        # can also put in the receive_json method
        self.conversation, created = Conversation.objects.get_or_create(channel_id=self.channel_id)

        async_to_sync(self.channel_layer.group_add)(
            self.channel_id,
            self.channel_name,
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.channel_id,
            self.channel_name,
        )
        super().disconnect(close_code)

    # when client sends json to the server
    def receive_json(self, content):
        try:
            print("Received JSON data:", content)
            new_message = content.get("message", "")  # Get the "message" field from the JSON
            # create a new message object
            message = Message.objects.create(conversation=self.conversation, sender=self.user, content=new_message)

            async_to_sync(self.channel_layer.group_send)(
                self.channel_id,
                {
                    "type": "chat_message",
                    "new_message": {
                        "id": message.id,
                        "sender": message.sender.username,
                        "content": message.content,
                        "timestamp": message.timestamp.isoformat(),
                    },
                },
            )

        except Exception as e:
            print("Error processing JSON data:", str(e))

    # same name as type in receive
    # send_json is a method of JsonWebsocketConsumer class that sends json to the client side
    def chat_message(self, event):
        self.send_json(event)
