from django.db import models
from .treasure_model import Treasure
from django.conf import settings

class Trade(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_trades', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_trades', on_delete=models.CASCADE)
    treasure = models.ForeignKey(Treasure, on_delete=models.CASCADE)
    trade_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')  # e.g., pending, completed, cancelled