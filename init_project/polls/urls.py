from django.urls import path
from . import views
from polls.services.views.InformationView import InformationView
from polls.services.views.GradingView import GradingView
from polls.services.views.SchedulerView import SchedulerView

scheduler = SchedulerView()

urlpatterns = [
    # init
    path('', views.index, name='index'),
    path('load-data/', views.load_data, name='load_data'),

    # scheduler service API
    path('sessions/', scheduler.as_view(), name='sessions_list'),
    path("sessions/<str:session_id>/", scheduler.as_view(), name="session-interaction"),

    # Information endpoints for tutor 
    path('tutor/information/', InformationView.as_view(), name='tutor_information'),           # GET ?uID=<tutor_id> or POST create/update
    path('tutor/information/<str:uID>/', InformationView.as_view(), name='tutor_update'),    # PUT profile, DELETE
    path('tutor/<str:tutor_id>/students/', InformationView.as_view(), name='tutor_students'),  # GET students following tutor

    # Grading endpoints for tutor
    path('tutor/grading/grade/', GradingView.as_view(), name='tutor_grade'),
    path('tutor/grading/component/', GradingView.as_view(), name='tutor_component'),
]