from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response

from .models import Server
from .serializers import ServerSerializer


class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer

    def list(self, request):
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")

        if by_user or by_serverid and not request.user.is_authenticated:
            raise AuthenticationFailed(detail="You must be logged in to use this feature")

        if category is not None:
            self.queryset = self.queryset.filter(category__name=category)

        if by_user:
            user_id = request.user.id
            self.queryset = self.queryset.filter(member=user_id)

        if by_serverid is not None:
            try:
                self.queryset = self.queryset.filter(id=int(by_serverid))
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server does not exist with id {by_serverid}")
            except ValueError:
                raise ValidationError(detail=f"Server id must be an integer, not {by_serverid}")

        if qty is not None:
            self.queryset = self.queryset[: int(qty)]

        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)
