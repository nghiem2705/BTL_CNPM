from django.urls import path
from . import views
from .view.SchedulerView import SchedulerView

scheduler = SchedulerView()

urlpatterns = [
    # init
    path('', views.index, name='index'),
    path('load-data/', views.load_data, name='load_data'),
    # scheduler service API
    path('sessions/', scheduler.as_view(), name='sessions_list'),
    path("sessions/<str:session_id>/", scheduler.as_view(), name="session-interaction"),
]