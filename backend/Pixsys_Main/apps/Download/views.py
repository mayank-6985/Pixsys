import logging
import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from drf_spectacular.utils import extend_schema, inline_serializer ,OpenApiExample

# Assuming you have your service and serializers imported
from .serializers import DownloadCreateSerializer, DownloadUpdateSerializer
from .Services.download_services import DownloadService

logger = logging.getLogger(__name__)
service = DownloadService()
class DownloadListCreateView(APIView):
    """
    Endpoint: /downloads/
    Handles fetching a list of downloads and creating new ones.
    """

    @extend_schema(
        summary="Get List of Downloads",
        description="Fetches a list of all available downloads.",
        responses={200: inline_serializer(
            name="DownloadListResponse",
            fields={"RESOURCE_TYPE": serializers.ListField(child=serializers.DictField())} # Adjust based on actual return format
        )}
    )
    def get(self, request):
        try:
            # You can pass query params here if needed (e.g., filtering by product_id)
            data = service.get_all_downloads() 
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in DownloadListCreateView GET: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred while fetching downloads."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Create a New Download Entry",
        description="Adds a new download entry. Requires a valid resource_type (SOFTWARE, CATALOG, etc.).",
        request=DownloadCreateSerializer,
        responses={
            201: inline_serializer(
                name="DownloadCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="DownloadCreateError",
                fields={"error": serializers.CharField()}
            )
        },
        examples=[
            OpenApiExample(
                name="Valid Request body",
                value={
                    "resource_type": "SOFTWARE",
                    "category_id": 12,
                    "tag_id": 4,
                    "product_id": 105,
                    "subcategory_id": 2,
                    "name": "Windows Setup Application",
                    "resource_url": "https://example.com/downloads/setup.exe"
                }
            )
        ]
    )
    def post(self, request):
        serializer = DownloadCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.create_download(data=serializer.validated_data)
            return Response({"message": "Download created successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            # Handles business logic validation errors from your DownloadFactory/BaseDownload
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in DownloadListCreateView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the download entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DownloadDetailView(APIView):
    """
    Endpoint: /downloads/<int:download_id>/
    Handles retrieving, updating, and deleting a specific download entry.
    """

    @extend_schema(
        summary="Get Single Download",
        description="Fetches the details of a specific download by ID.",
        responses={200: inline_serializer(
            name="DownloadDetailResponse",
            fields={"data": serializers.DictField()} # Adjust based on actual return format
        )}
    )
    def get(self, request, download_id):
        try:
            data = service.get_download_by_id(download_id=download_id)
            return Response(data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in DownloadDetailView GET: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred while fetching the download."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Update Existing Download",
        description="Updates an existing download. The download_id from the URL is injected into the serializer.",
        request=DownloadUpdateSerializer,
        responses={
            200: inline_serializer(
                name="DownloadUpdateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="DownloadUpdateError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request, download_id):
        # Inject the URL parameter into the payload so the serializer can validate it
        payload = request.data.copy()        
        serializer = DownloadUpdateSerializer(data=payload)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.update_download(download_id =download_id, data=serializer.validated_data)
            return Response({"message": "Download updated successfully"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in DownloadDetailView PUT: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while updating the download entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Delete a Download",
        description="Removes a specific download entry from the system.",
        responses={
            200: inline_serializer(
                name="DownloadDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            404: inline_serializer(
                name="DownloadNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request, download_id):
        try:
            service.delete_download(download_id=download_id)
            return Response({"message": "Download deleted successfully"}, status=status.HTTP_200_OK)
        except ValueError as e:
            # Assuming your service raises ValueError if the ID doesn't exist
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in DownloadDetailView DELETE: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while deleting the download entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
