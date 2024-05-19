from django.urls import path,include
from controls.api import views
urlpatterns = [
    path('fandetails/',views.FanDetailView.as_view(),name='fandetails'),
    path('fanspeedadjust/',views.UpdateSpeed.as_view(),name='fanspeedadjust'),
    path('powerdetails/',views.GetPowerdetails.as_view(),name='powerdetails'),
    path('logs/', views.GetLogs.as_view(), name='get_logs'),
]