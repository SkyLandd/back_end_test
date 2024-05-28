from django.db import models

class Treasure(models.Model):
    name = models.CharField(max_length=100)
    rarity = models.CharField(max_length=50)
    value = models.IntegerField()