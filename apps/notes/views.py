# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.views.decorators.csrf import requires_csrf_token
from django.core import serializers
from django.shortcuts import render, HttpResponse
from django.contrib import messages
from .view_helpers import all_notes_json, fav_notes_json, all_faves, patient_tag
from .models import Note
from ..login.models import Doctor, Patient


def index(request):
    user_type = request.path.split('/')[1]

    if user_type == 'doctor':
        doc = Doctor.objects.get(id=request.session['doctor_id'])
        patients = Doctor.objects.get_patients(doc)
        path = "notes/doctor.html"
        context = {
            'patients': patients,
            'doctor': doc
        }
    else:
        patient = Patient.objects.get(id=request.session['patient_id'])
        related_doctor = Doctor.objects.get(id=patient.doctor.id)
        path = "notes/patient.html"
        context = {
            'doctor': related_doctor,
            'patient': patient
        }

    return render(request, path, context)


def show_patient(request):
    this_patient = Patient.objects.filter(
        id=request.POST['patient_id']).first()
    this_doctor = Doctor.objects.filter(
        id=request.POST['doctor_id']).first()

    return JsonResponse(serializers.serialize("json", [this_patient, this_doctor]), safe=False)


def show_patient_notes(request):
    this_patient = Patient.objects.filter(
        id=request.POST['patient_id']).first()
    notes = Note.objects.show_all(this_patient)

    return JsonResponse(serializers.serialize("json", notes), safe=False)


def init_notes(request):
    return all_notes_json(request)


def init_faves(request):
    return all_faves(request)


def init_patient(request):
    return patient_tag(request)


@requires_csrf_token
def create(request):
    errors = Note.objects.validate_note(request.POST)
    if errors:
        for err in errors:
            messages.error(request, err)
    else:
        Note.objects.create_note(request.POST)
    return show_patient_notes(request)


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
