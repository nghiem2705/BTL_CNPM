from django.urls import path
from . import views
from .view.SchedulerView import SchedulerView
from .view.InformationView import InformationView

from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
openapi.Info(
    title="My Project API",
    default_version='v1',
    description="API documentation for backend",
),
public=True,
permission_classes=(permissions.AllowAny,),
)

scheduler = SchedulerView()
info = InformationView()

urlpatterns = [
    # Admin + Swagger
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # NOTE: Removed self-include of 'polls.urls' under 'api/' to prevent infinite recursion.

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

    # scheduler endpoints
    # tutor view
    path('tutor/<str:tutor_id>/sessions/', scheduler.as_view(), name='tutor_check_sessions_list'), # tutor xem list session đã tạo
    path('tutor/<str:tutor_id>/sessions/<str:session_id>/', scheduler.as_view(), name='tutor_check_session_detail'), # tutor xem chi tiết session đã tạo

    # student view
    path('student/<str:student_id>/sessions/register/', scheduler.as_view(), name='student_check_unregistered_sessions'), # student xem list session chưa đăng ký
    path('student/<str:student_id>/sessions/registered/', scheduler.as_view(), name='student_check_registered_sessions'), # student xem list session đã đăng ký
    path('student/<str:student_id>/sessions/registered/<str:session_id>/', scheduler.as_view(), name='student_check_detail_registered_session'), # student xem chi tiết session đã đăng ký
    path('student/<str:student_id>/sessions/<str:session_id>/unregister/', scheduler.as_view(), name='student_unregister_session'), # student hủy đăng ký session
    path('student/<str:student_id>/sessions/<str:session_id>/register/', scheduler.as_view(), name='student_register_session'), # student đăng ký session
    path('student/<str:student_id>/follow/<str:tutor_id>/', scheduler.as_view(), name='student_follow'), # student follow tutor
    path('student/<str:student_id>/unfollow/<str:tutor_id>/', scheduler.as_view(), name='student_unfollow'), # student unfollow tutor
]