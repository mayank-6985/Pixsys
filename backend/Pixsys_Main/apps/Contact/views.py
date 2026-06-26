import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from apps.Auth.decorators import public_endpoint
from apps.Auth.permissions import IsWebSiteAdmin
from rest_framework.permissions import AllowAny

from .serializers import ContactSubmissionSerializer
from .Services.inquiry_services import InquiryService

logger = logging.getLogger(__name__)
inquiry_service = InquiryService()

class ContactSubmissionView(APIView):
    """
    Endpoint: 
    Handles all data mutations using correct HTTP methods:
    - GET  : Fetches all contact form submissions (for admin/dashboard use).
    - POST : Creates a new contact form submission.
    """
    # Route permissions natively through DRF's lifecycle
    def get_permissions(self):
        if self.request.method == 'GET':
            # Only WebSiteAdmins can create/update the slider
            return [IsWebSiteAdmin()]
                
        # Define who can view the slider (GET). 
        # Example: Allow anyone to view it.
        return [AllowAny()]

    @extend_schema(
        summary="Fetch Contact Submissions",
        description="Retrieves a list of all contact form submissions.",
        responses={
            200: inline_serializer(
                name="ContactGetSuccess",
                fields={"submissions": ContactSubmissionSerializer(many=True)}
            ),
            404: inline_serializer(
                name="ContactGetError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def get(self, request):
        # Depending on your setup, you may want to restrict GET to admins:
        # from rest_framework.permissions import IsAdminUser
        # self.permission_classes = [IsAdminUser]
        # self.check_permissions(request)
        
        try:
            data = inquiry_service.get_all_submissions()
            return Response({"submissions": data}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in ContactSubmissionView GET: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while fetching submissions."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Create Contact Submission",
        description="Validates and saves a new contact form submission.",
        request=ContactSubmissionSerializer,
        responses={
            201: inline_serializer(
                name="ContactPostSuccess",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ContactPostError",
                fields={"error": serializers.CharField()} # or a dict of field errors
            )
        }
    )
    @public_endpoint
    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Service handles the creation logic
            result_message = inquiry_service.create_submission(validated_data=serializer.validated_data)
            
            return Response({"message": result_message}, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            # Caught domain validation errors
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in ContactSubmissionView POST: {str(e)}")
            return Response(
                {"error": "An error occurred while submitting your form. Please try again later."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )