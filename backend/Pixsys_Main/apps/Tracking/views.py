import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers

# Adjust the import paths according to your actual project structure
from apps.Auth.permissions import IsWebSiteAdmin 
from .Utils.utils import get_client_ip
from .Service.tracking_service import TrackingService

logger = logging.getLogger(__name__)
service = TrackingService()

class TrackVisitorView(APIView):
    """
    Endpoint: POST /api/analytics/track/
    Records the visitor's IP and maps it to a geographic location.
    """
    def get_permissions(self):
        return [AllowAny()]

    @extend_schema(
        summary="Track Visitor Location",
        description="Extracts the client IP and logs the visit to the database via TrackingService.",
        responses={
            200: inline_serializer(
                name="TrackVisitorSuccess",
                fields={
                    "status": serializers.CharField(default="success"),
                    "message": serializers.CharField(default="Visitor logged")
                }
            ),
            500: inline_serializer(
                name="TrackVisitorError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        try:
            ip = get_client_ip(request)
            
            result = service.process_and_track_visitor(ip)
            
            return Response(result, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in TrackVisitorView POST: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while tracking the visitor."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WorldAnalyticsView(APIView):
    """
    Endpoint: GET /api/analytics/world/
    Returns aggregated visitor counts grouped by country.
    """
    def get_permissions(self):
        return [IsWebSiteAdmin()]

    @extend_schema(
        summary="Get World Analytics",
        description="Returns total visitors aggregated by country code.",
        responses={
            200: inline_serializer(
                name="WorldAnalyticsResponse",
                many=True,
                fields={
                    "country_code": serializers.CharField(),
                    "country_name": serializers.CharField(),
                    "count": serializers.IntegerField()
                }
            )
        }
    )
    def get(self, request):
        try:
            
            data = service.get_world_analytics_data()
            return Response(data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in WorldAnalyticsView GET: {str(e)}")
            return Response(
                {"error": "Failed to retrieve world analytics."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class IndiaAnalyticsView(APIView):
    """
    Endpoint: GET /api/analytics/india/
    Returns aggregated visitor counts grouped by Indian states.
    """
    def get_permissions(self):
        return [IsWebSiteAdmin()]

    @extend_schema(
        summary="Get India Analytics",
        description="Returns total visitors aggregated by Indian states.",
        responses={
            200: inline_serializer(
                name="IndiaAnalyticsResponse",
                many=True,
                fields={
                    "country": serializers.CharField(),
                    "state_name": serializers.CharField(),
                    "count": serializers.IntegerField()
                }
            )
        }
    )
    def get(self, request):
        try:
            
            data = service.get_india_analytics_data()
            return Response(data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in IndiaAnalyticsView GET: {str(e)}")
            return Response(
                {"error": "Failed to retrieve India analytics."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )