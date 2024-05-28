from rest_framework import serializers
from apps.game.models import Treasure, PlayerTreasure

class TreasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treasure
        fields = ['id', 'name', 'rarity', 'value']

class PlayerTreasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerTreasure
        fields = ['id', 'player', 'treasure', 'acquired_date']
