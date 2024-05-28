from apps.user.serializers import CreateUserSerializer
from rest_framework import permissions
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions


User = get_user_model()


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """User detail api instant """
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
