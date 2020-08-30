from django.urls import path
from . import views

urlpatterns = [
    path('saves', views.get_saves, name="saves"),
    path('empires', views.get_empires, name='empires'),
    path('data', views.get_data, name='data'),
    path('latest_snap', views.get_latest_snap, name='latest_snap')
]
