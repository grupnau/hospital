from django.conf.urls import url
from . import views

app_name = 'login'
urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^redirect/(?P<user_type>\w+)$', views.index),
    url(r'^register/(?P<user_type>\w+)$', views.register),
    url(r'^login/(?P<user_type>\w+)$', views.login),
    url(r'^logout$', views.logout, name='logout'),
    url(r'^success$', views.success),
    url(r'^patient/(?P<patient_id>\d+)$', views.show)
]
