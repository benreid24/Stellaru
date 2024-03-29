from django.urls import path
from . import views

urlpatterns = [
    path('translations', views.get_translations, name='translations'),
    path('saves', views.get_saves, name="saves"),
    path('wait_save', views.wait_save, name='wait_save'),
    path('empires', views.get_empires, name='empires'),
    path('data', views.get_data, name='data'),
    path('latest_snap', views.get_latest_snap, name='latest_snap'),
    path('conn_info', views.get_connection_info, name='connection_info'),
    path('connected_sessions', views.connected_sessions, name='connected_sessions')
]
