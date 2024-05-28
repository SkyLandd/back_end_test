from decimal import Decimal
from celery import shared_task
from django.contrib.auth import get_user_model
from user.models import ForgetPassword
from django.shortcuts import get_object_or_404


User = get_user_model()


@shared_task(name="expire_forget_password_token")
def expire_forget_password_token(id):
    """Automatically expire forget password token after 30 minutes """

    try:
        forget_password = get_object_or_404(ForgetPassword, id=id)
        if forget_password:
            forget_password.is_expired = True
            forget_password.activated = False
            forget_password.save()
            return True
        return False
    except Exception as e:
        return False
