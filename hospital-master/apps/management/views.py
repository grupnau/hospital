# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from .models import Quote, User
from django.shortcuts import render, redirect
from django.contrib import messages

# Create your views here.
def index(request):
    this_user = User.objects.get(id=request.session['user_id']);
    # print this_user.faves.all()
    all_faves = []
    for fav in this_user.faves.all():
        all_faves.append(fav.content)
    # print all_faves
    all_quotes = Quote.objects.exclude(content__in=all_faves)
    print all_quotes
    context = {
        'user': User.objects.get(id=request.session['user_id']),
        'quotes': all_quotes.order_by('-created_at'),
        'faves': Quote.objects.order_by('-created_at')
    }
    return render(request, 'notes_app/index.html', context)

def create(request):
    # validate requests
    #   print "views print"
    #   print request.POST
    errs = Quote.objects.validate_quote(request.POST)
    if errs:
        for e in errs:
            messages.error(request, e)
    else:
        quote_id = Quote.objects.create_quote(request.POST, request.session['user_id']).id
    return redirect('/quotes/')

def favorite(request, quote_id):
    this_user = User.objects.get(id=request.session['user_id'])
    this_quote = Quote.objects.get(id=quote_id)
    this_quote.users.add(this_user)
    # print this_user
    # print this_quote
    # print this_quote.users.all()
    return redirect('/quotes/')

def remove(request, quote_id):
    user_removing = User.objects.get(id=request.session['user_id'])
    quote_to_remove = Quote.objects.get(id=quote_id)
    quote_to_remove.users.remove(user_removing)
    print quote_to_remove.users.all()

    return redirect('/quotes/')
