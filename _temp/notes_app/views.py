# # -*- coding: utf-8 -*-
# from __future__ import unicode_literals
# from .models import Note
# from ..
# from django.core import serializers
# from django.shortcuts import render, redirect, HttpResponse
# from django.contrib import messages
# import json

# # Create your views here.


# def index(request):
#     context = {
#         'user': User.objects.get(id=request.session['user_id'])
#     }
#     return render(request, 'notes/index.html', context)


# def init_notes(request):
#     return all_notes_json(request)


# def init_faves(request):
#     return all_faves(request)


# def init_user(request):
#     return user_tag(request)


# def create(request):
#     # validate requests
#     print("views print")
#     print(request.POST)
#     errs = Note.objects.validate_note(request.POST)
#     if errs:
#         for e in errs:
#             messages.error(request, e)
#     else:
#         note_id = Note.objects.create_note(
#             request.POST, request.session['user_id']).id
#     return all_notes_json(request)


# def favorite(request, note_id):
#     this_user = User.objects.get(id=request.session['user_id'])
#     this_note = Note.objects.get(id=note_id)
#     this_note.users.add(this_user)
#     # print this_user
#     # print this_note
#     # print this_note.users.all()
#     return fav_notes_json(request, note_id)


# def refresh(request):
#     return all_notes_json(request)


# def remove(request, note_id):
#     user_removing = User.objects.get(id=request.session['user_id'])
#     note_to_remove = Note.objects.get(id=note_id)
#     note_to_remove.users.remove(user_removing)
#     return fav_notes_json(request, note_id)


# def all_notes_json(request):
#     this_user = User.objects.get(id=request.session['user_id'])
#     # print this_user.faves.all()
#     all_faves = []
#     for fav in this_user.faves.all():
#         all_faves.append(fav.content)
#     # print all_faves
#     all_notes = Note.objects.exclude(content__in=all_faves)

#     return HttpResponse(serializers.serialize("json", all_notes),
#                         content_type="application/json")


# def fav_notes_json(request, note_id):
#     # this_note = Note.objects.get(id=note_id)
#     this_user = User.objects.get(id=request.session['user_id'])
#     # print this_user.first_name
#     favorite_notes = this_user.faves.all()
#     # print favorite_notes

#     return HttpResponse(serializers.serialize("json", favorite_notes),
#                         content_type="application/json")


# def all_faves(request):
#     this_user = User.objects.get(id=request.session['user_id'])
#     # print this_user.first_name
#     favorite_notes = this_user.faves.all()
#     # print favorite_notes

#     return HttpResponse(serializers.serialize("json", favorite_notes),
#                         content_type="application/json")


# def user_tag(request):
#     this_user = User.objects.get(id=request.session['user_id'])
#     user_info = []
#     user_info.append(this_user.id)
#     user_info.append(this_user.first_name)
#     # print user_info
#     return HttpResponse(user_info)
