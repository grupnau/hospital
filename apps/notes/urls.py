from django.conf.urls import url
from . import views

app_name = 'notes'
urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^show_patient$', views.show_patient),
    url(r'^show_patient_notes$', views.show_patient_notes),
    url(r'^create$', views.create, name="create"),
]
