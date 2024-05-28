DJANGO_APPLICATIONS = [
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.contenttypes',

]

CUSTOM_APPLICATIONS = [
    'apps.user',
    'apps.userprofile',
    'apps.game',
]

THIRD_PARTY_APPLICATIONS = [
    'corsheaders',
    'rest_framework',
    'django_celery_beat',
    'django_celery_results',
    'rest_framework_simplejwt',
]
SOCIAL_LOGIN_APPLICATIONS = [
    'oauth2_provider',
    'social_django',
    'drf_social_oauth2',
]
