# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from ..login.models import Patient, Doctor


class NoteManager(models.Manager):
    @staticmethod
    def validate_note(post_data):
        errors = []
        print(post_data)
        if len(post_data['content']) < 10:
            errors.append('Note must be at least 10 characters long')
        if Note.objects.filter(content=post_data['content']):
            errors.append('This note has already been added')
        return errors

    def create_note(self, clean_data):
        return self.create(
            content=clean_data['content'],
            posted_by=Doctor.objects.get(id=clean_data['doctor_id']),
            patient=Patient.objects.get(id=clean_data['patient_id'])
        )

    @staticmethod
    def show_all(patient):
        '''
        returns a tuple with the zeroeth index containing
        query for 3 most recent reviews, and the first index
        containing the rest
        '''
        return patient.notes.all().order_by('-created_at')


class Note(models.Model):
    content = models.TextField()
    posted_by = models.ForeignKey(
        Doctor, related_name="notes", on_delete='models.CASCADE')
    patient = models.ForeignKey(
        Patient, related_name="notes", on_delete='models.CASCADE')
    created_at = models.DateTimeField(auto_now_add=True)
    objects = NoteManager()

    def __str__(self):
        return self.content
