from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from apps.game.models import Treasure, PlayerTreasure
from apps.game.serializers import TreasureSerializer, PlayerTreasureSerializer
from django.utils.timezone import now
from datetime import timedelta
from django.db.models import Count
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
User = get_user_model()


class TreasureViewSet(viewsets.ModelViewSet):
    queryset = Treasure.objects.all()
    serializer_class = TreasureSerializer
    permission_classes = [permissions.IsAuthenticated]

class PlayerTreasureViewSet(viewsets.ModelViewSet):
    queryset = PlayerTreasure.objects.all()
    serializer_class = PlayerTreasureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Check for daily and weekly limits
        today = now().date()
        this_week_start = today - timedelta(days=today.weekday())
        
        daily_count = PlayerTreasure.objects.filter(player=request.user, acquired_date__date=today).count()
        weekly_count = PlayerTreasure.objects.filter(player=request.user, acquired_date__date__gte=this_week_start).count()

        if daily_count >= 10:
            return Response({"error": "Daily limit reached"}, status=status.HTTP_400_BAD_REQUEST)
        if weekly_count >= 50:
            return Response({"error": "Weekly limit reached"}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)




class LeaderboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(cache_page(60 * 15))  # Cache this view for 15 minutes
    @action(detail=False, methods=['get'], url_path='list')
    def leaderboard(self, request):
        # Use the custom user model for the query
        players = User.objects.annotate(total_treasures=Count('playertreasure')).order_by('-total_treasures')[:10]
        return Response({"players": players.values('username', 'total_treasures')})


    @method_decorator(cache_page(60 * 15))  # Cache this view for 15 minutes
    @action(detail=False, methods=['get'], url_path='stats')
    def statistics(self, request):
        # Query the custom user model's related PlayerTreasure objects
        total_treasures = PlayerTreasure.objects.filter(player=request.user).count()
        return HttpResponse({"total_treasures": total_treasures})