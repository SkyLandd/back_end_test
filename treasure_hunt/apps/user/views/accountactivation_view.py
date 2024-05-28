from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from apps.user.models import UserActivation
from django.conf import settings
import logging

class AccountActivationAPIView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, secret_key):
        logging.info(f"Received token for activation: {secret_key}")
        try:
            user_activation = UserActivation.objects.filter(activation_token=secret_key, user__is_active=False).first()
            if user_activation is None:
                # logging.error(f"No matching UserActivation found for token: {secret_key}")
                return HttpResponse("Activation failed. No matching record found.")
            
            if not user_activation.activated:
                user_activation.activated = True
                user_activation.user.is_active = True
                user_activation.is_expired = True
                user_activation.user.save()
                user_activation.save()
                # logging.info(f"User activated successfully with token: {secret_key}")
                try:
                    return render(request, 'auth/activation_success.html', {
                        'username': user_activation.user.username,
                        'company_name': settings.COMPANY_NAME
                    })
                except Exception as e:
                    logging.error(f"Error rendering success template: {e}")
                    return HttpResponse("Activation succeeded but failed to load success page.")
            else:
                logging.warning(f"Attempt to activate an already activated user with token: {secret_key}")
                return HttpResponse("Account already activated.")
        except Exception as e:
            logging.error(f"Activation failed. Error: {str(e)}")
            return HttpResponse(f"Activation failed. Error: {str(e)}")
