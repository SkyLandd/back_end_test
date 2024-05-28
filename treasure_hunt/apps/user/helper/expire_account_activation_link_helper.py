from django_celery_beat.models import PeriodicTask, CrontabSchedule
from datetime import datetime


def expire_account_activation_link(secret_key):
    """Create task for expire account activation link"""
    task_name = 'account_activation-'+datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    schedule, created = CrontabSchedule.objects.get_or_create(
        minute='*/30', hour="*", day_of_week='*', day_of_month="*", month_of_year="*", timezone="UTC")
    task = PeriodicTask.objects.create(
        crontab=schedule,
        name=task_name,
        task='expire_account_activation_link',
        args=[secret_key],
        kwargs={},
        one_off=True,

    )
