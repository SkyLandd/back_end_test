from django.contrib import admin
from apps.user.models import User, UserActivation


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'is_staff', 'is_active')
    list_display_links = ('id', 'email', 'username')
    search_fields = ('email', 'username')
    list_filter = ('is_staff', 'is_active')
    list_per_page = 25


@admin.register(UserActivation)
class UserActivationAdmin(admin.ModelAdmin):
    pass
