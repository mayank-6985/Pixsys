from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .Utils_Service.utils_service import AWSUtilService
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers

logger = logging.getLogger(__name__)

class GenerateUploadURLView(APIView):
    """
    Endpoint: POST /api/generate-upload-url/
    Generates a secure S3 presigned URL for direct frontend file uploads.
    """
    @extend_schema(
        summary="Generate AWS Presigned URL",
        description=(
            "Generates a secure, temporary AWS S3 presigned URL for file uploads. "
            "Expects file metadata at the root of the JSON body. The client can use "
            "the returned URL to PUT the file directly to S3."
        ),
        request=inline_serializer(
            name="PresignedUrlRequest",
            fields={
                "file_name": serializers.CharField(help_text="The name of the file to upload (e.g., 'invoice.pdf')"),
                "file_type": serializers.CharField(help_text="The MIME type of the file (e.g., 'application/pdf')")
            }
        ),
        responses={
            200: inline_serializer(
                name="PresignedUrlResponse",
                fields={
                    "upload_url": serializers.URLField(help_text="The secure HTTP PUT URL to upload the file to S3."),
                    "file_url": serializers.URLField(help_text="The final public or protected URL where the file will be hosted."),
                    "fields": serializers.DictField(
                        child=serializers.CharField(), 
                        required=False, 
                        help_text="Any additional form fields required if using a POST policy instead of a PUT URL."
                    )
                }
            ),
            400: inline_serializer(
                name="PresignedUrlError",
                fields={"error": serializers.CharField(help_text="Error message detailing why the URL generation failed.")}
            )
        }
    )    
    def post(self, request):
        try:
            # DRF's request.data automatically handles JSON parsing
            file_name = request.data.get('file_name')
            file_type = request.data.get('file_type') 
            
            if not file_name or not file_type:
                return Response(
                    {'error': 'file_name and file_type are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Call the AWS helper function
            url_data = AWSUtilService().generate_s3_upload_url(file_name, file_type)
            
            if url_data:
                return Response(url_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Could not generate upload URL'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            logger.error(f"Error in GenerateUploadURLView POST: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )