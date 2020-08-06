from django.urls import path
from . import views

urlpatterns = [
    path('saves', views.get_saves, name="saves"),
    path('empires', views.get_empires, name='empires')
]
