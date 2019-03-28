# # -*- coding: utf-8 -*-
# from __future__ import unicode_literals
# from .models import Quote, User
# from django.core import serializers
# from django.shortcuts import render, redirect, HttpResponse
# from django.contrib import messages
# import json

# # Create your views here.


# def index(request):
#     context = {
#         'user': User.objects.get(id=request.session['user_id'])
#     }
#     return render(request, 'notes_app/index.html', context)


# def init_quotes(request):
#     return all_quotes_json(request)


# def init_faves(request):
#     return all_faves(request)


# def init_user(request):
#     return user_tag(request)


# def create(request):
#     # validate requests
#     print("views print")
#     print(request.POST)
#     errs = Quote.objects.validate_quote(request.POST)
#     if errs:
#         for e in errs:
#             messages.error(request, e)
#     else:
#         quote_id = Quote.objects.create_quote(
#             request.POST, request.session['user_id']).id
#     return all_quotes_json(request)


# def favorite(request, quote_id):
#     this_user = User.objects.get(id=request.session['user_id'])
#     this_quote = Quote.objects.get(id=quote_id)
#     this_quote.users.add(this_user)
#     # print this_user
#     # print this_quote
#     # print this_quote.users.all()
#     return fav_quotes_json(request, quote_id)


# def refresh(request):
#     return all_quotes_json(request)


# def remove(request, quote_id):
#     user_removing = User.objects.get(id=request.session['user_id'])
#     quote_to_remove = Quote.objects.get(id=quote_id)
#     quote_to_remove.users.remove(user_removing)
#     return fav_quotes_json(request, quote_id)


# def all_quotes_json(request):
#     this_user = User.objects.get(id=request.session['user_id'])
#     # print this_user.faves.all()
#     all_faves = []
#     for fav in this_user.faves.all():
#         all_faves.append(fav.content)
#     # print all_faves
#     all_quotes = Quote.objects.exclude(content__in=all_faves)

#     return HttpResponse(serializers.serialize("json", all_quotes),
#                         content_type="application/json")


# def fav_quotes_json(request, quote_id):
#     # this_quote = Quote.objects.get(id=quote_id)
#     this_user = User.objects.get(id=request.session['user_id'])
#     # print this_user.first_name
#     favorite_quotes = this_user.faves.all()
#     # print favorite_quotes

#     return HttpResponse(serializers.serialize("json", favorite_quotes),
#                         content_type="application/json")


# def all_faves(request):
#     this_user = User.objects.get(id=request.session['user_id'])
#     # print this_user.first_name
#     favorite_quotes = this_user.faves.all()
#     # print favorite_quotes

#     return HttpResponse(serializers.serialize("json", favorite_quotes),
#                         content_type="application/json")


# def user_tag(request):
#     this_user = User.objects.get(id=request.session['user_id'])
#     user_info = []
#     user_info.append(this_user.id)
#     user_info.append(this_user.first_name)
#     # print user_info
#     return HttpResponse(user_info)
