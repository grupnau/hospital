from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^create', views.create, name="create"),
    # url(r'^initialize$', views.init),
    url(r'^add_to_list/(?P<quote_id>\d+)$', views.favorite, name="add"),
    url(r'^rm_fm_list/(?P<quote_id>\d+)$', views.remove, name="remove")
]