
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.game.views import TreasureViewSet, PlayerTreasureViewSet, LeaderboardViewSet

router = DefaultRouter()
router.register(r'treasures', TreasureViewSet)
router.register(r'player_treasures', PlayerTreasureViewSet)
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')


urlpatterns = [
    path('', include(router.urls)),
]
