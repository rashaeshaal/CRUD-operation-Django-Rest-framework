# Generated by Django 4.2.5 on 2023-12-16 06:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_alter_account_email_alter_account_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='is_blocked',
            field=models.BooleanField(default=False),
        ),
    ]
