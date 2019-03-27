# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from .models import Note, Patient
from django.shortcuts import render, redirect
from django.contrib import messages

# Create your views here.


def index(request):
    this_patient = Patient.objects.get(id=request.session['patient_id'])
    # print this_patient.faves.all()
    all_faves = []
    for fav in this_patient.faves.all():
        all_faves.append(fav.content)
    # print all_faves
    all_notes = Note.objects.exclude(content__in=all_faves)
    print(all_notes)
    context = {
        'patient': Patient.objects.get(id=request.session['patient_id']),
        'notes': all_notes.order_by('-created_at'),
        'faves': Note.objects.order_by('-created_at')
    }
    return render(request, 'notes_app/index.html', context)


def create(request):
    # validate requests
    #   print "views print"
    #   print request.POST
    errs = Note.objects.validate_note(request.POST)
    if errs:
        for e in errs:
            messages.error(request, e)
    else:
        note_id = Note.objects.create_note(
            request.POST, request.session['patient_id']).id
    return redirect('/notes/')


def favorite(request, note_id):
    this_patient = Patient.objects.get(id=request.session['patient_id'])
    this_note = Note.objects.get(id=note_id)
    this_note.patients.add(this_patient)
    # print this_patient
    # print this_note
    # print this_note.patients.all()
    return redirect('/notes/')


def remove(request, note_id):
    patient_removing = Patient.objects.get(id=request.session['patient_id'])
    note_to_remove = Note.objects.get(id=note_id)
    note_to_remove.patients.remove(patient_removing)
    print note_to_remove.patients.all()

    return redirect('/notes/')
