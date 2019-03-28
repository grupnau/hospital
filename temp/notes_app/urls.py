from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^quotes/initialize$', views.init_quotes),
    url(r'^quotes/initialize2$', views.init_faves),
    url(r'^quotes/initialize3$', views.init_user),
    url(r'^create$', views.create, name="create"),
    url(r'^add_to_list/(?P<quote_id>\d+)$', views.favorite, name="add"),
    url(r'^rm_fm_list/(?P<quote_id>\d+)$', views.remove, name="remove"),
    url(r'^refresh$', views.refresh, name="refresh")
]
