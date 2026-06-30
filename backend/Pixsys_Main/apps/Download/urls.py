from django.urls import path
from .views import DownloadListCreateView, DownloadDetailView

urlpatterns = [
    path('', DownloadListCreateView.as_view(), name='download-list-create'),
    path('<int:download_id>/', DownloadDetailView.as_view(), name='download-detail'),
]