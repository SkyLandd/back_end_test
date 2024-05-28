
from django.urls import path, include
from django.urls import re_path
from .views import UserProfileViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('userprofile', UserProfileViewSet, basename='userprofile')

urlpatterns = router.urls
urlpatterns = [
    path('', include(router.urls)),

]
