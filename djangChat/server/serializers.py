from rest_framework import serializers

from .models import Category, Channel, Server


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"

# when returning data we want to return any channel that is related to the server
class ServerSerializer(serializers.ModelSerializer):
    # num_members is a field that we are going to create and it is going to be a serializer method field
    num_members = serializers.SerializerMethodField()
    # "channel_service" related_name is the name of the field in the model that we want to return
    # these will get all the channels that are related to the server
    channel_server = ChannelSerializer(many=True, read_only=True)

    class Meta:
        model = Server
        exclude = ("member",)
    
    def get_num_members(self, obj):
        if hasattr(obj, "num_members"):
            return obj.num_members
        return None
    
    # modify the data that is returned by serializer
    def to_representation(self, instance):
        data = super().to_representation(instance)
        with_num_members = self.context.get("num_members")
        if not with_num_members:
            data.pop("num_members")
        return data