from apps.user.serializers import CreateUserSerializer
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from utils.generate_random_secret_util import create_secret_key
from utils.threads.email_thread import send_mail
from django.conf import settings
from datetime import date
from apps.user.models import UserActivation
from django.db import transaction
from django.utils.timezone import now

User = get_user_model()
email = settings.EMAIL_HOST_USER
react_domain = settings.REACT_DOMAIN

class RegistrationView(APIView):
    """Register and login API endpoint."""
    permission_classes = (permissions.AllowAny,)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            serializer = CreateUserSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.save()

                # Generate the secret key
                secret_key = create_secret_key(100, user)

                # Update or create the UserActivation
                user_activation, created = UserActivation.objects.update_or_create(
                    user=user,
                    defaults={
                        'activation_token': secret_key,
                        'activated': False,
                        'is_expired': False,
                        'updated_at': now()  # Ensure updated_at is set to now
                    }
                )

                # Prepare email contents
                key = {
                    'username': user.username,
                    'button': react_domain + 'api/user/account-activation/' + secret_key,
                    'year': date.today().year
                }
                subject = "Verify Your Account"
                template_name = "auth/new_userRegister.html"
                recipient = [user.email]

                send_mail(subject=subject, html_content=template_name, recipient_list=recipient, key=key)

                return Response({"message": "User created successfully. Check your email for verification"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Invalid data, could not create user"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
