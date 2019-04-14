# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from .models import Note
from ..login.models import Patient
from django.core import serializers
from django.shortcuts import render, redirect, HttpResponse
from django.contrib import messages
import json

# Create your views here.


def index(request):
    context = {
        'patient': Patient.objects.get(id=request.session['patient_id'])
    }
    return render(request, 'notes/index.html', context)


def init_notes(request):
    return all_notes_json(request)


def init_faves(request):
    return all_faves(request)


def init_patient(request):
    return patient_tag(request)


def create(request):
    # validate requests
    print("views print")
    print(request.POST)
    errs = Note.objects.validate_note(request.POST)
    if errs:
        for e in errs:
            messages.error(request, e)
    else:
        note_id = Note.objects.create_note(
            request.POST, request.session['patient_id']).id
    return all_notes_json(request)


def favorite(request, note_id):
    this_patient = Patient.objects.get(id=request.session['patient_id'])
    this_note = Note.objects.get(id=note_id)
    this_note.patients.add(this_patient)
    # print this_patient
    # print this_note
    # print this_note.patients.all()
    return fav_notes_json(request, note_id)


def refresh(request):
    return all_notes_json(request)


def remove(request, note_id):
    patient_removing = Patient.objects.get(id=request.session['patient_id'])
    note_to_remove = Note.objects.get(id=note_id)
    note_to_remove.patients.remove(patient_removing)
    return fav_notes_json(request, note_id)


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
