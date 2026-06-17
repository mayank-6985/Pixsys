from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.http import HttpResponse

from .serializers import NewsCreateSerializer
from .services.news_service import NewsService


class NewManagerView(APIView):
    def get(self, request):
        return HttpResponse("Return News")


class NewsCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):
        serializer = NewsCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = NewsService()
        domain_news = service.create_news(serializer.validated_data)
        return Response(domain_news.to_dict(), status=status.HTTP_201_CREATED)
        