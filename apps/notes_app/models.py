# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from .models import Patient
from django.db import models


class NoteManager(models.Manager):
    def validate_note(self, post_data):
        # print "models printing"
        # print post_data

        errors = []

        if len(post_data['noted_by']) < 3:
            errors.append('Name of doctor must be at least 3 characters long')
        if len(post_data['content']) < 10:
            errors.append('Note must be at least 10 characters long')
        if Note.objects.filter(content=post_data['content']):
            errors.append('This note has already been added')
        return errors

    def create_note(self, clean_data, user_id):

        return self.create(
            noted_by=clean_data['noted_by'],
            content=clean_data['content'],
            posted_by=Patient.objects.get(id=user_id)
        )


class Note(models.Model):
    noted_by = models.CharField(max_length=255)
    content = models.TextField()
    posted_by = models.ForeignKey(
        Patient, related_name="notes", on_delete='models.PROTECT')
    users = models.ManyToManyField(Patient, related_name="faves")
    created_at = models.DateTimeField(auto_now_add=True)
    objects = NoteManager()

    def __str__(self):
        return self.content
