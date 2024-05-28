from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from apps.user.models import ForgetPassword

User = get_user_model()


class ResetPasswordAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        try:
            """
            Parameters:
                email
                password
                otp
            """
            email = request.data.get('email', '')
            password = request.data.get('password', '')
            otp = request.data.get('otp', '')
            if email and password and otp:
                user = User.objects.get(email=email)
                token = ForgetPassword.objects.get(user=user)
                if token.reset_email_token == otp and token.activated and not token.is_expired:
                    user.set_password(password)
                    user.save()
                    token.delete()
                    return Response({"message": "Password reset successfully", "status": "200"}, status=status.HTTP_200_OK)
                return Response({"message": "Invalid OTP Regenerate OTP", "status": "400"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Email, Password and OTP are required", "status": "400"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e), "status": "500"}, status.HTTP_500_INTERNAL_SERVER_ERROR)
