from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class ForgetPassword(models.Model):
    """
    Here you can reset your password in case you lost your password
    """
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='forget_password', unique=True, primary_key=True)
    reset_email_token = models.CharField(max_length=255)
    activated = models.BooleanField(default=False)
    is_expired = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'ForgetPassword'
