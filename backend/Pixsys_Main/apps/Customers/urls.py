from django.urls import path
from .views import CustomerListView, CustomerReportView

urlpatterns = [
    path('list/', CustomerListView.as_view(), name='customer-list'),
    path('report/', CustomerReportView.as_view(), name='customer-report'),
]