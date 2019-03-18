# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from login.models import User
from django.db import models


class QuoteManager(models.Manager):
    def validate_quote(self, post_data):
        # print "models printing"
        # print post_data

        errors = []

        if len(post_data['quoted_by']) < 3:
            errors.append('Name of quoter must be at least 3 characters long')
        if len(post_data['content']) < 10:
            errors.append('Quote must be at least 10 characters long')
        if Quote.objects.filter(content=post_data['content']):
            errors.append('This quote has already been added')
        return errors

    def create_quote(self, clean_data, user_id):

        return self.create(
            quoted_by=clean_data['quoted_by'],
            content=clean_data['content'],
            posted_by=User.objects.get(id=user_id)
        )


class Quote(models.Model):
    quoted_by = models.CharField(max_length=255)
    content = models.TextField()
    posted_by = models.ForeignKey(User, related_name="quotes")
    users = models.ManyToManyField(User, related_name="faves")
    created_at = models.DateTimeField(auto_now_add=True)
    objects = QuoteManager()

    def __str__(self):
        return self.content
