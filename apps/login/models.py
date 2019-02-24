# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import re
import bcrypt

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9\.\+_-]+@[a-zA-Z0-9\._-]+\.[a-zA-Z]*$')
NAME_REGEX = re.compile(r'^[A-Za-z]\w+$')

class UserManager(models.Manager):
    def validate_registration(self, postData):
        errors = []
        if len(postData['first_name']) < 2 or len(postData['last_name']) < 2:
            errors.append("First and Last name must be at least 2 characters long!")
        elif not str(postData['first_name']).isalpha() and not str(postData['last_name']).isalph():
            errors.append("First and Last name must only contain letters!")
        if not re.match(NAME_REGEX, postData['first_name']) or not re.match(NAME_REGEX, postData['last_name']):
            errors.append("name fields must be letter characters only")
        if len(postData['email']) < 1 or not re.match(EMAIL_REGEX, postData['email']):
            errors.append("email is not valid")
        if len(postData['password']) < 8:
            errors.append("Password must be at least 8 characters.")
        elif postData['password'] != postData['confirm_password']:
            errors.append("passwords don't match")

        if not errors:
            first_name = postData['first_name']
            last_name = postData['last_name']
            email = postData['email']
            dob = postData['date_of_birth']
            password = bcrypt.hashpw(postData['password'].encode(), bcrypt.gensalt(5))
            new_user = self.create(first_name=first_name, last_name=last_name, email=email, password=password, dob=dob)

            return new_user

        return errors

    def validate_login(self, postData):
        errors = []
        if len(self.filter(email=postData['email'])) > 0:
            user = self.filter(email=postData['email'])[0]
            if not bcrypt.checkpw(postData['password'].encode(), user.password.encode()):
                errors.append("username or password is incorrect")
        else:
            errors.append("username or password is incorrect")

        if errors:
            return errors
        return user

class User(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    dob = models.DateField()
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    objects = UserManager()
    def __str__(self):
        return self.email
