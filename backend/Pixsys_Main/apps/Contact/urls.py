from django.urls import path
from .views import ContactSubmissionView

urlpatterns = [
    path('inquiries/', ContactSubmissionView.as_view(), name='contact-submissions'),
]