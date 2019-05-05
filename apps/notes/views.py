# -*- coding: utf-8 -*-
from __future__ import unicode_literals
# from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.views.decorators.csrf import requires_csrf_token
from django.core import serializers
from django.shortcuts import render
from django.contrib import messages
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
        notes = Note.objects.show_all(patient)
        related_doctor = Doctor.objects.get(id=patient.doctor.id)
        path = "notes/patient.html"
        context = {
            'doctor': related_doctor,
            'patient': patient,
            'notes': notes
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


@requires_csrf_token
def create(request):
    errors = Note.objects.validate_note(request.POST)
    if errors:
        for err in errors:
            messages.error(request, err)
    else:
        Note.objects.create_note(request.POST)
    return show_patient(request)
