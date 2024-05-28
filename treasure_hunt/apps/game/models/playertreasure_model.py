from django.db import models
from .treasure_model import Treasure
from django.conf import settings

class PlayerTreasure(models.Model):
    player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    treasure = models.ForeignKey(Treasure, on_delete=models.CASCADE)
    acquired_date = models.DateTimeField(auto_now_add=True)