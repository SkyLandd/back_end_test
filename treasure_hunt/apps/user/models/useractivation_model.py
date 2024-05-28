from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class UserActivation(models.Model):
    """
    Here you can activate your account
    """
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='user_activation', unique=True)
    activation_token = models.CharField(
        max_length=5000, editable=False, unique=True)
    activated = models.BooleanField(default=False)
    is_expired = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'UserActivation'
