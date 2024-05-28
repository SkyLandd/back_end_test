# Generated by Django 4.2.4 on 2024-05-27 20:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('user_type', models.CharField(choices=[('user', 'User'), ('admin', 'Admin'), ('super_admin', 'Super Admin')], default='user', max_length=255)),
                ('username', models.CharField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ForgetPassword',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='forget_password', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('reset_email_token', models.CharField(max_length=255)),
                ('activated', models.BooleanField(default=False)),
                ('is_expired', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'ForgetPassword',
            },
        ),
        migrations.CreateModel(
            name='UserActivation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activation_token', models.CharField(editable=False, max_length=5000, unique=True)),
                ('activated', models.BooleanField(default=False)),
                ('is_expired', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_activation', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'UserActivation',
            },
        ),
    ]
