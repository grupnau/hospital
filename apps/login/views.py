# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Doctor, Patient
from ..notes.models import Note


def home(request):
    return render(request, 'login/home.html')


def index(request, user_type):
    if user_type == 'doctor':
        context = {
            'patients': Patient.objects.all()
        }
        return render(request, 'login/doc.html', context)

    context = {
        'doctors': Doctor.objects.all()
    }
    return render(request, 'login/pat.html', context)


def register(request, user_type):
    if user_type == 'doctor':
        id_type = 'doctor_id'
        result = Doctor.objects.validate_registration(request.POST, user_type)
    else:
        id_type = 'patient_id'
        result = Patient.objects.validate_registration(request.POST, user_type)

    if isinstance(result, list):
        for err in result:
            messages.error(request, err)
        return HttpResponseRedirect('/redirect/' + user_type)

    request.session[id_type] = result.id
    messages.success(request, "Successfully registered!")
    return redirect("/" + user_type + "/notes")


def login(request, user_type):
    if user_type == 'doctor':
        id_type = 'doctor_id'
        result = Doctor.objects.validate_login(request.POST)
    else:
        id_type = 'patient_id'
        result = Patient.objects.validate_login(request.POST)

    if isinstance(result, list):
        for err in result:
            messages.error(request, err)
        return HttpResponseRedirect("/redirect/" + user_type)

    request.session[id_type] = result.id
    messages.success(request, "Successfully logged in!")
    return redirect("/" + user_type + "/notes")


def logout(request):
    for key in list(request.session.keys()):
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
