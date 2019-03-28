from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^register$', views.register),
    url(r'^login$', views.login),
    url(r'^logout$', views.logout, name='logout'),
    url(r'^success$', views.success),
    url(r'^patient/(?P<patient_id>\d+)$', views.show)
]
