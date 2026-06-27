from django.urls import path
from .views import TrackVisitorView, WorldAnalyticsView, IndiaAnalyticsView

urlpatterns = [
    # Public endpoint for the React frontend to record visits
    path('track/', TrackVisitorView.as_view(), name='track_visitor'),

    # Admin endpoints for fetching aggregated map data
    path('map/world/', WorldAnalyticsView.as_view(), name='world_analytics'),
    path('map/india/', IndiaAnalyticsView.as_view(), name='india_analytics'),
]