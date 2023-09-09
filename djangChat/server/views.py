import drf_spectacular.utils as extend_schema
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed, ValidationError

# from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Server
from .scheme import server_list_docs
from .serializers import CategorySerializer, ServerSerializer


class CategoryViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()

    # @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)


class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    # permission_classes = [IsAuthenticated]

    @server_list_docs
    def list(self, request):
        """
        List method for retrieving a filtered and optionally annotated queryset of items.

        Args:
            request (rest_framework.request.Request): The HTTP request object.

        Returns:
            rest_framework.response.Response: A response containing serialized data.

        Raises:
            rest_framework.exceptions.AuthenticationFailed: If authentication is required but user is not logged in.
            rest_framework.exceptions.ValidationError: If server ID is not valid or server does not exist.

        """
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")
        with_num_members = request.query_params.get("with_num_members") == "true"

        # TODO: uncomment this when authentication is implemented
        # if by_user or by_serverid and not request.user.is_authenticated:
        #     raise AuthenticationFailed(detail="You must be logged in to use this feature")

        if category is not None:
            self.queryset = self.queryset.filter(category__name=category.lower())

        if by_user:
            user_id = request.user.id
            self.queryset = self.queryset.filter(member=user_id)

        if with_num_members:
            # create a new field called num_members and annotate it with the count of members
            self.queryset = self.queryset.annotate(num_members=Count("member"))

        if by_serverid is not None:
            try:
                self.queryset = self.queryset.filter(id=int(by_serverid))
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server does not exist with id {by_serverid}")
            except ValueError:
                raise ValidationError(detail=f"Server id must be an integer, not {by_serverid}")

        if qty is not None:
            self.queryset = self.queryset[: int(qty)]

        serializer = self.serializer_class(self.queryset, many=True, context={"num_members": with_num_members})
        return Response(serializer.data)
