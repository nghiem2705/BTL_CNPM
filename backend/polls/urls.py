from django.urls import path
from . import views
from .view.SchedulerView import SchedulerView
from .view.InformationView import InformationView
from .view.StatisticsView import StatisticsView

scheduler = SchedulerView()
info = InformationView()
statistics = StatisticsView()

urlpatterns = [
    # init
    path('', views.index, name='index'),
    path('load-data/', views.load_data, name='load_data'),
    # scheduler service API
    path('sessions/', scheduler.as_view(), name='sessions_list'),
    path("sessions/<str:session_id>/", scheduler.as_view(), name="session-interaction"),

    # Information endpoints for tutor 
    path('tutor/information/', info.as_view(), name='tutor_information'),           # GET ?uID=<tutor_id>
    path('tutor/information/<str:uID>/', info.as_view(), name='tutor_update'),      # PUT profile
    path('tutor/<str:tutor_id>/students/', info.as_view(), name='tutor_students'),  # GET students following tutor
    
    # User statistics endpoint
    path('user/statistics/', statistics.as_view(), name='user_statistics'),          # GET ?uID=<user_id>
]
