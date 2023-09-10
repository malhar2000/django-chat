from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema

from .serializers import MessageSerializer

list_messages_docs = extend_schema(
    responses=MessageSerializer(many=True),
    parameters=[
        OpenApiParameter(
            name="channel_id",
            description="Filter messages by channel ID",
            required=True,
            type=OpenApiTypes.STR,
        )
    ],
)
