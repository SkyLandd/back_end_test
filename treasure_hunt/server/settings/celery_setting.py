from .environment_setting import env


CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['application/json']
# CELERY_BROKER_URL = env('CELERY_BROKER_URL')
# CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND')
# CELERY_BEAT_SCHEDULER = env('CELERY_BEAT_SCHEDULER')

CELERY_BROKER_URL = "redis://localhost:6379"
CELERY_RESULT_BACKEND = "redis://localhost:6379"
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"
