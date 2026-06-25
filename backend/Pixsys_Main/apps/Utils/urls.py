from django.urls import path
from .views import GenerateUploadURLView

urlpatterns = [
    # ... your other urls ...
    path('generate-upload-url/', GenerateUploadURLView.as_view(), name='generate-upload-url'),
]