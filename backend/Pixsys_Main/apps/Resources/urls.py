from .views import ResourceUpdateAPIView ,  ResourcesListAPIView
from django.urls import path

urlpatterns = [
    path('', ResourcesListAPIView.as_view(), name='download-list-create'),
    path('update/', ResourceUpdateAPIView.as_view(), name='resource update'),
]