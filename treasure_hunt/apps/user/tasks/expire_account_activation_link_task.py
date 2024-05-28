from celery import shared_task
from user.models import UserActivation
from django.shortcuts import get_object_or_404


@shared_task(name="expire_account_activation_link")
def expire_account_activation_link(secret_key):
    """Automatically expire account activation link after 30 minutes """

    try:
        account_activation = get_object_or_404(
            UserActivation, id=secret_key)
        if account_activation:
            account_activation.is_expired = True
            account_activation.activated = False
            account_activation.save()
            return True
        return False
    except Exception as e:
        return False
