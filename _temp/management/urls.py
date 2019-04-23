from django.conf.urls import url
from . import views

app_name = 'apps.notes'
urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^create', views.create, name="create"),
    # url(r'^initialize$', views.init),
    url(r'^add_to_list/(?P<note_id>\d+)$', views.favorite, name="add"),
    url(r'^rm_fm_list/(?P<note_id>\d+)$', views.remove, name="remove")
]
