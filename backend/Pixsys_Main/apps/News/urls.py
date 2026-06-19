from django.urls import path
from .views import NewsListAPIView , NewsDetailAPIView , NewsUpdateAPIView

urlpatterns = [
    path('', NewsListAPIView.as_view(), name='news-list'),
    path('<int:news_id>', NewsDetailAPIView.as_view(), name='news-detail'),
    path('update/' , NewsUpdateAPIView.as_view() , name="news-update"),
]
