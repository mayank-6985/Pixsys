import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from apps.Auth.decorators import public_endpoint

from .serializers import SliderSerializer
from .Services.services import HomeService

logger = logging.getLogger(__name__)
home_service = HomeService()

class SliderView(APIView):
    """
    Endpoint: 
    Handles all data mutations using correct HTTP methods:
    - GET  : fetches the current slider data.
    - POST : Creates/Update slider data.
    """

    @extend_schema(
        summary="Fetch Slider Images",
        description="Retrieves the current array of slider images from the single database document.",
        responses={
            200: inline_serializer(
                name="SliderGetResponse",
                fields={"slideImages": serializers.ListField(child=serializers.URLField())}
            ),
            404: inline_serializer(
                name="SliderGetError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    # @public_endpoint
    def get(self, request):
        try:
            data = home_service.get_slider_images()
            return Response({"slideImages": data}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in SliderView GET: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Create/Update Slider Images",
        description="Overwrites the existing slider images. Allows empty array on first creation, but requires at least 1 image on subsequent updates.",
        request=SliderSerializer,
        responses={
            200: inline_serializer(
                name="SliderPostSuccess",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="SliderPostError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        # Require authentication for POST requests only
        # from rest_framework.permissions import IsAuthenticated
        # self.permission_classes = [IsAuthenticated]
        # self.check_permissions(request)

        serializer = SliderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Service handles the creation/update logic
            images_list = serializer.validated_data.get('slideImages', [])
            result_message = home_service.save_slider_images(slider_images=images_list)
            
            # Since it can be an update or create, HTTP 200 OK is safe, or you can dynamically return 201 based on `created`
            return Response({"message": result_message}, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Caught domain validation errors (e.g. empty array not allowed)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in SliderView POST: {str(e)}")
            return Response(
                {"error": "An error occurred while saving the slider images."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )