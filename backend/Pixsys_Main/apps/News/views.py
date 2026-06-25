from rest_framework import status, permissions
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema, inline_serializer ,OpenApiParameter
import logging

from .serializers import NewsSerializer
from .services.news_service import NewsService
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from apps.Auth.decorators import public_endpoint

news_service = NewsService()

logger = logging.getLogger(__name__)
class NewsListAPIView(APIView):
    """
    Endpoint: GET /news/
    Fetches all news records without their deep content block.
    """
    @public_endpoint
    def get(self, request):
        try:
            news_list = news_service.get_all_news()
            return Response(news_list, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in NewsListAPIView GET: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while fetching news summaries."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NewsDetailAPIView(APIView):
    """
    Endpoint: GET /news/<int:news_id>/
    Fetches a single news record complete with its content.
    """
    @public_endpoint
    def get(self, request, news_id):
        try:
            news = news_service.get_news_with_content(news_id=news_id)
            return Response(news, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in NewsDetailAPIView GET for ID {news_id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class NewsUpdateAPIView(APIView):
    """
    Endpoint: /news/update/
    Handles all data mutations using correct HTTP methods:
    - POST:   Create fresh news
    - PUT:    Update an existing news record
    - DELETE: Remove a news record
    """

    @extend_schema(
        summary="Create fresh news",
        description="Adds a new news entry. Expects the object data fields directly at the root of the JSON body.",
        request=NewsSerializer,
        responses={
            201: inline_serializer(
                name="NewsCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="NewsCreateError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        """
        Handles: Adding new news.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        serializer = NewsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = news_service.create_news(data=serializer.validated_data)
            return Response({"message": "News created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Unexpected error in NewsUpdateAPIView POST: {str(e)}")
            return Response(
                {"error": "An error occurred while creating the news entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Update existing news",
        description="Updates an existing news record. Expects 'news_id' and the updated 'data' payload block inside the JSON body.",
        request=NewsSerializer,
        responses={
            200: inline_serializer(
                name="NewsUpdateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="NewsUpdateValidationError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="NewsUpdateNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request):
        """
        Handles: Updating old news.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        news_id = request.data.get('news_id')
        if not news_id:
            return Response("news_id required!", status=status.HTTP_400_BAD_REQUEST)
        serializer = NewsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            result = news_service.update_news(news_id=int(news_id), data=serializer.validated_data)
            return Response({"message": "News updated successfully"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in NewsUpdateAPIView PUT for ID {news_id}: {str(e)}")
            return Response(
                {"error": "An error occurred while updating the news entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Delete a news record",
        description="Removes a news record by ID. Expects 'news_id' inside the JSON body.",
        parameters=[
            OpenApiParameter(
                name="news_id",
                type=int,
                required=True
            )
        ],
        responses={
            200: inline_serializer(
                name="NewsDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="NewsDeleteError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="NewsDeleteNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request):
        """
        Handles: Deleting the news.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        news_id = request.query_params.get("news_id")
        if not news_id:
            return Response({"error": "Missing required field: 'news_id'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            success = news_service.delete_news(news_id=int(news_id))
            if success:
                return Response({"message": "News deleted successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Deletion failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in NewsUpdateAPIView DELETE for ID {news_id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred during deletion."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )