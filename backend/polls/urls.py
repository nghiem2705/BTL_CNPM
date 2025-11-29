from django.urls import path
from . import views
from .view.SchedulerView import SchedulerView
from .view.InformationView import InformationView

scheduler = SchedulerView()
info = InformationView()

urlpatterns = [
    # init
    path('', views.index, name='index'),
    path('load-data/', views.load_data, name='load_data'),

    # Login SSO
    path('login/', info.as_view(), name='sso'),
    # scheduler service API
    # path('sessions/', scheduler.as_view(), name='sessions_list'),
    # path("sessions/<str:session_id>/", scheduler.as_view(), name="session-interaction"),

    # Information endpoints for tutor 
    path('tutor/information/', info.as_view(), name='tutor_information'),           # GET ?uID=<tutor_id>
    path('tutor/information/<str:uID>/', info.as_view(), name='tutor_update'),      # PUT profile
    path('tutor/<str:tutor_id>/students/', info.as_view(), name='tutor_students'),  # GET students following tutor

    # sheduler endpoints - trung
    path('tutor/<str:tutor_id>/sessions/', SchedulerView.as_view(), name='tutor_sessions'),
    path('tutor/<str:tutor_id>/sessions/<str:session_id>/', SchedulerView.as_view(), name='tutor_sessions_detail'),
    path('student/<str:student_id>/sessions/registered/', scheduler.as_view(), name='student_registered_sessions'),
    path('student/<str:student_id>/sessions/register/', scheduler.as_view(), name='student_register_session'),
    path('student/<str:student_id>/sessions/unregister/', scheduler.as_view(), name='student_unregister_session'),
    path('student/<str:student_id>/follow/<str:tutor_id>/', scheduler.as_view(), name='student_follow'),
    path('student/<str:student_id>/sessions/registered/<str:session_id>/', SchedulerView.as_view(), name='student_sessions_detail'),

]