import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers

from apps.Auth.permissions import IsWebSiteAdmin
from .Services.customer_service import CustomerService

logger = logging.getLogger(__name__)

class CustomerListView(APIView):
    def get_permissions(self):
        # Only allow WebSiteAdmin to view the customer list
        if self.request.method == 'GET':
            return [IsWebSiteAdmin()]
        return [AllowAny()]

    @extend_schema(
        summary="Get Customer List",
        description="Retrieves a list of all customers containing their email and phone numbers.",
        responses={
            200: inline_serializer(
                name="CustomerListResponse",
                fields={
                    "customers": serializers.ListField(
                        child=serializers.DictField()
                    )
                }
            ),
            500: inline_serializer(
                name="CustomerListError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def get(self, request):
        self.check_permissions(request)
        try:
            service = CustomerService()
            data = service.get_customer_list()
            return Response({"customers": data}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in CustomerListView GET: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while fetching customers."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerReportView(APIView):
    def get_permissions(self):
        # Only allow WebSiteAdmin to generate and download the report
        if self.request.method == 'GET':
            return [IsWebSiteAdmin()]
        return [AllowAny()]

    @extend_schema(
        summary="Generate Customer Excel Report",
        description="Generates an Excel file containing all customer data and returns the secure S3 download URL.",
        responses={
            200: inline_serializer(
                name="CustomerReportResponse",
                fields={
                    "report_url": serializers.URLField(help_text="The URL to download the generated Excel report.")
                }
            ),
            400: inline_serializer(
                name="CustomerReportBadRequest",
                fields={"error": serializers.CharField()}
            ),
            500: inline_serializer(
                name="CustomerReportError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def get(self, request):
        self.check_permissions(request)
        try:
            service = CustomerService()
            report_url = service.create_report()
            
            return Response({"report_url": report_url}, status=status.HTTP_200_OK)
            
        except ValueError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in CustomerReportView GET: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while generating the report."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )