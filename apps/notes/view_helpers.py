# -*- coding: utf-8 -*-
from __future__ import unicode_literals
# import json
from django.core import serializers
from django.shortcuts import HttpResponse
from .models import Note
from ..login.models import Patient


def all_notes_json(request):
    this_patient = Patient.objects.get(id=request.session['patient_id'])
    # print this_patient.faves.all()
    all_faves = []
    for fav in this_patient.faves.all():
        all_faves.append(fav.content)
    # print all_faves
    all_notes = Note.objects.exclude(content__in=all_faves)

    return HttpResponse(serializers.serialize("json", all_notes),
                        content_type="application/json")


def fav_notes_json(request, note_id):
    # this_note = Note.objects.get(id=note_id)
    this_patient = Patient.objects.get(id=request.session['patient_id'])
    # print this_patient.first_name
    favorite_notes = this_patient.faves.all()
    # print favorite_notes

    return HttpResponse(serializers.serialize("json", favorite_notes),
                        content_type="application/json")


def all_faves(request):
    this_patient = Patient.objects.get(id=request.session['patient_id'])
    # print this_patient.first_name
    favorite_notes = this_patient.faves.all()
    # print favorite_notes

    return HttpResponse(serializers.serialize("json", favorite_notes),
                        content_type="application/json")


def patient_tag(request):
    this_patient = Patient.objects.get(id=request.session['patient_id'])
    patient_info = []
    patient_info.append(this_patient.id)
    patient_info.append(this_patient.first_name)
    # print patient_info
    return HttpResponse(patient_info)
