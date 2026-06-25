from django.urls import path
from .views import ProductSearchView, GlobalSearchView
urlpatterns = [
    path('products/', ProductSearchView.as_view(), name="Search-Product"),
    path('global/', GlobalSearchView.as_view() , name="Search-Globally"),
]