from django.urls import path
from .views import NewManagerView

urlpatterns = [
    path("/" , NewManagerView.as_view() , name="News Manager View")
]
