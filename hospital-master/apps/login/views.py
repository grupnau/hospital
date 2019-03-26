# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect, HttpResponseRedirect, reverse
from .models import User
# from ..notes_app.models import Note
from django.contrib import messages

def index(request):
    return render(request, 'login/index.html')

def register(request):
    print request.POST
    result = User.objects.validate_registration(request.POST)
    print result
    if type(result) == list:
        for err in result:
            messages.error(request, err)
        return redirect('/')
    request.session['user_id'] = result.id
    messages.success(request, "Successfully registered!")
    return HttpResponseRedirect(reverse("notes_app:index"))

def login(request):
    result = User.objects.validate_login(request.POST)
    if type(result) == list:
        for err in result:
            messages.error(request, err)
        return redirect('/')
    request.session['user_id'] = result.id
    messages.success(request, "Successfully logged in!")
    return HttpResponseRedirect(reverse("notes_app:index"))

def logout(request):
    for key in request.session.keys():
        del request.session[key]
    return redirect('/')

def success(request):
    try:
        request.session['user_id']
    except KeyError:
        return redirect('/')
    context = {
            'user': User.objects.get(id=request.session['user_id'])
    }
    return render(request, 'login/success.html', context)

# def show(request, user_id):
#     this_user = User.objects.get(id=user_id)
#     print this_user
#     notes = Note.objects.filter(posted_by = this_user)
#     print notes
#     note_list = []
#     for note in notes:
#         note_list.append(Note.objects.get(id=note.id))
#     context = {
#         'user':this_user,
#         'note_list': note_list,
#         'count': len(note_list)
#     }

#     return render(request, 'login/show.html', context)
