# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-01-04 06:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='users',
            field=models.ManyToManyField(
                related_name='faves', to='login.User'),
        ),
    ]
