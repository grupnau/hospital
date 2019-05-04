# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import re
from django.db import models
import bcrypt

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9\.\+_-]+@[a-zA-Z0-9\._-]+\.[a-zA-Z]*$')
NAME_REGEX = re.compile(r'^[A-Za-z]\w+$')


class UserManager(models.Manager):
    @classmethod
    def validate_registration(cls, post_data, user_type):
        errors = []
        if len(post_data['first_name']) < 2 or len(post_data['last_name']) < 2:
            errors.append(
                "First and Last name must be at least 2 characters long!")
        elif not str(post_data['first_name']).isalpha() and not str(post_data['last_name']).isalpha():
            errors.append("First and Last name must only contain letters!")
        if not re.match(NAME_REGEX, post_data['first_name']) or not re.match(NAME_REGEX, post_data['last_name']):
            errors.append("name fields must be letter characters only")
        if not post_data['email'] or not re.match(EMAIL_REGEX, post_data['email']):
            errors.append("email is not valid")
        if len(post_data['password']) < 8:
            errors.append("Password must be at least 8 characters.")
        elif post_data['password'] != post_data['confirm_password']:
            errors.append("passwords don't match")

        if not errors:
            first_name = post_data['first_name']
            last_name = post_data['last_name']
            email = post_data['email']
            dob = post_data['date_of_birth']
            password = bcrypt.hashpw(
                post_data['password'].encode('utf-8'), bcrypt.gensalt())
            password = password.decode('utf-8')
            if user_type == 'doctor':
                new_user = Doctor(first_name=first_name, last_name=last_name, email=email, password=password,
                                  dob=dob, years_experience=post_data['years_experience'], specialty=post_data['specialty'])
                new_user.save()
            elif user_type == 'patient':
                doc_id = post_data['doctor']
                this_doctor = Doctor.objects.get(id=doc_id)
                new_user = Patient(first_name=first_name, last_name=last_name, email=email, password=password,
                                   dob=dob, main_condition=post_data['main_condition'], age=post_data['age'], doctor=Doctor.objects.get(id=doc_id))
                new_user.save()
                this_patient = Patient.objects.get(
                    id=new_user.id)
                this_doctor.patients.add(this_patient)
                this_doctor.save()

            return new_user

        return errors

    def validate_login(self, post_data):
        errors = []
        if self.filter(email=post_data['email']):
            user = self.filter(email=post_data['email'])[0]
            if not bcrypt.checkpw(post_data['password'].encode('utf-8'), user.password.encode('utf-8')):
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Doctor(User):
    years_experience = models.IntegerField(default=0)
    specialty = models.CharField(max_length=255)
    patients = models.ForeignKey

    objects = UserManager()

    def __str__(self):
        return self.email, self.specialty


class Patient(User):
    main_condition = models.CharField(max_length=255)
    age = models.IntegerField(default=18)
    doctor = models.ForeignKey(
        Doctor, related_name='patients', on_delete='models.CASCADE')

    objects = UserManager()

    def __str__(self):
        return self.email, self.first_name
