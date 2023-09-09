from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer


# using JsonWebsocketConsumer instead of WebsocketConsumer
# so we dont have to manually serialize/deserialize json
class WebChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # should be dyanmic name but using static for now
        self.channel_id = None
        self.user = None

    def connect(self):
        self.accept()
        self.channel_id = self.scope["url_route"]["kwargs"]["channelId"]
        async_to_sync(self.channel_layer.group_add)(
            self.channel_id,
            self.channel_name,
        )

    def disconnect(self, close_code):
        pass

    # when client sends json to the server
    def receive_json(self, content):
        try:
            print("Received JSON data:", content)
            new_message = content.get("message", "")  # Get the "message" field from the JSON
            async_to_sync(self.channel_layer.group_send)(
                self.channel_id,
                {
                    "type": "chat_message",
                    "new_message": new_message,
                },
            )
        except Exception as e:
            print("Error processing JSON data:", str(e))

    # same name as type in receive
    # send_json is a method of JsonWebsocketConsumer class that sends json to the client side
    def chat_message(self, event):
        self.send_json(event)
