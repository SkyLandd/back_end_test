from django_celery_beat.models import PeriodicTask, CrontabSchedule
from datetime import datetime


def expire_forget_password_token(id):
    """Create task for transfer payment in escrow after 7 days of job completion"""
    task_name = 'forget-password-'+datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    schedule, created = CrontabSchedule.objects.get_or_create(
        minute='*/30', hour="*", day_of_week='*', day_of_month="*", month_of_year="*", timezone="UTC")
    task = PeriodicTask.objects.create(
        crontab=schedule,
        name=task_name,
        task='expire_forget_password_token',
        args=[id],
        kwargs={},
        one_off=True,

    )
