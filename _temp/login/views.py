# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect, HttpResponseRedirect, reverse
from .models import Patient
from management.models import Note
from django.contrib import messages


def index(request):
    return render(request, 'login/index.html')


def register(request):
    print(request.POST)
    result = Patient.objects.validate_registration(request.POST)
    print(result)
    if type(result) == list:
        for err in result:
            messages.error(request, err)
        return redirect('/')
    request.session['patient_id'] = result.id
    messages.success(request, "Successfully registered!")
    return HttpResponseRedirect(reverse("notes_app:index"))


def login(request):
    result = Patient.objects.validate_login(request.POST)
    if type(result) == list:
        for err in result:
            messages.error(request, err)
        return redirect('/')
    request.session['patient_id'] = result.id
    messages.success(request, "Successfully logged in!")
    return HttpResponseRedirect(reverse("notes_app:index"))


def logout(request):
    for key in request.session.keys():
        del request.session[key]
    return redirect('/')


def success(request):
    try:
        request.session['patient_id']
    except KeyError:
        return redirect('/')
    context = {
        'patient': Patient.objects.get(id=request.session['patient_id'])
    }
    return render(request, 'login/success.html', context)


def show(request, patient_id):
    this_patient = Patient.objects.get(id=patient_id)
    print(this_patient)
    notes = Note.objects.filter(posted_by=this_patient)
    print(notes)
    note_list = []
    for note in notes:
        note_list.append(Note.objects.get(id=note.id))
    context = {
        'patient': this_patient,
        'note_list': note_list,
        'count': len(note_list)
    }

    return render(request, 'login/show.html', context)
