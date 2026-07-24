from django.shortcuts import render
from .serializers import IndividualResourceUpdateSerializer, IndividualResourceCreateSerializer , IndividualResourceDeleteSerializer
from .Service.resource_service import ResourceService
from rest_framework import status, permissions
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema, inline_serializer ,OpenApiParameter
from django.core.exceptions import ValidationError
import traceback
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from apps.Auth.decorators import public_endpoint
from apps.Auth.permissions import IsWebSiteAdmin
from rest_framework.permissions import AllowAny
# Create your views here.
resource_service = ResourceService()
logger = logging.getLogger(__name__)

class ResourcesListAPIView(APIView):
    
    """
    Endpoint: GET /resources/
    Fetches a single news record complete with its content.
    """
    @public_endpoint
    def get(self, request):
        try:
            news = resource_service.get_resources()
            return Response(news, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in ResourcesDetailAPIView GET {e}")
            return Response(
                {"error": "An unexpected error occurred."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResourceUpdateAPIView(APIView):
    """
    Endpoint: /news/update/
    Handles all data mutations using correct HTTP methods:
    - POST:   Create fresh news
    - PUT:    Update an existing news record
    - DELETE: Remove a news record
    """
    # Route permissions natively through DRF's lifecycle
    def get_permissions(self):
        if self.request.method == 'POST' or self.request.method == 'PUT' or self.request.method == 'DELETE':
            # Only WebSiteAdmins can create/update the slider
            return [IsWebSiteAdmin()]
                
        # Define who can view the slider (GET). 
        # Example: Allow anyone to view it.
        return [AllowAny()]

    
    @extend_schema(
        summary="Create fresh Resource for the Product",
        description="Adds a new resource entry. Expects the object data fields directly at the root of the JSON body.",
        request=IndividualResourceCreateSerializer,
        responses={
            201: inline_serializer(
                name="ResourceCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ResourseCreateError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        """
        Handles: Adding new news.
        """
        # Require authentication for POST requests only
        # from rest_framework.permissions import IsAuthenticated
        # self.permission_classes = [IsAuthenticated]
        # self.check_permissions(request)

        serializer = IndividualResourceCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        try:
            result = resource_service.create_resource(resource_data=serializer.validated_data)
            return Response({"message": "Resource created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Unexpected error in ResourceUpdateAPIView POST: {str(e)}")
            return Response(
                {"error": "An error occurred while creating the news entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Update existing Resource",
        description="Updates an existing resource record. Expects 'resource_id' and the updated 'data' payload block inside the JSON body.",
        request=IndividualResourceUpdateSerializer,
        responses={
            200: inline_serializer(
                name="ResourceUpdateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ResourceUpdateValidationError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="ResourceUpdateNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request):
        """
        Handles: Updating old news.
        """
        # Require authentication for POST requests only
        # from rest_framework.permissions import IsAuthenticated
        # self.permission_classes = [IsAuthenticated]
        # self.check_permissions(request)

        resource_id = request.data.get('resource_id')
        if not resource_id:
            return Response("resource_id required!", status=status.HTTP_400_BAD_REQUEST)
        serializer = IndividualResourceUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            result = resource_service.update_resource(resource_data=serializer.validated_data)
            return Response({"message": "Resource updated successfully"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in ResourceUpdateAPIView PUT for ID {resource_id}: {str(e)}")
            return Response(
                {"error": "An error occurred while updating the resource entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Delete a resource record",
        description="Removes a resource record by ID. Expects 'resource_id' inside the JSON body.",
        parameters=[
            OpenApiParameter(
                name="resource_id",
                type=int,
                required=True
            )
        ],
        responses={
            200: inline_serializer(
                name="ResourceDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ResourceDeleteError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="ResourceDeleteNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request):
        """
        Handles: Deleting the news.
        """
        # Require authentication for POST requests only
        # from rest_framework.permissions import IsAuthenticated
        # self.permission_classes = [IsAuthenticated]
        # self.check_permissions(request)
        
        resource_id = request.query_params.get("resource_id")
        if not resource_id:
            return Response({"error": "Missing required field: 'resource_id'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            success = resource_service.delete_resource(resource_data = {"resource_id":int(resource_id)})
            if success:
                return Response({"message": "Resource deleted successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Deletion failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in ResourceUpdateAPIView DELETE for ID {resource_id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred during deletion."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )