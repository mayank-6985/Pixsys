import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiExample

from .serializers import (
    AdminLoginSerializer, 
    CustomerLoginSerializer,    
    CustomerSignupSerializer,
    CustomerVerifyOTPSerializer,
    CustomerResendOTPSerializer,
    CustomerPasswordResetRequestSerializer,
    CustomerPasswordResetVerifySerializer,
    CustomerPasswordResetConfirmSerializer,
    SystemSMTPConfigSerializer,
    CompanySettingsSerializer
)

from .permissions import IsWebSiteAdmin
from .models import SystemSMTPConfig, CompanySettings

from .services import (
    OTPManager,
    GoogleSMTPEmailSender,
    CustomerOTPEmailBuilder,
    NumericOTPGenerator
)

# Initialize module logger
logger = logging.getLogger(__name__)

# Initialize OTP Manager
otp_manager = OTPManager(
    sender=GoogleSMTPEmailSender(), 
    builder=CustomerOTPEmailBuilder(), 
    generator=NumericOTPGenerator()
)

# ==========================================
# SIGNUP VIEWS
# ==========================================

class CustomerSignupView(APIView):
    """API endpoint to register new Customers."""
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        request=CustomerSignupSerializer,
        examples=[
            OpenApiExample(
                "Successful Signup",
                value={
                    "email": "customer@example.com",
                    "password": "SecurePassword123!",
                    "phone_number": "+1234567890"
                }
            )
        ]
    )
    def post(self, request):
        try:
            serializer = CustomerSignupSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            customer = serializer.save()
            
            # Identity confirmed (unique email check passed), trigger OTP
            otp_manager.process_otp_for_customer(customer)
            
            return Response(
                {"detail": "Customer created successfully. OTP sent to email for verification."}, 
                status=status.HTTP_201_CREATED
            )
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CustomerSignupView: {e}", exc_info=True)
            return Response(
                {"detail": "An unexpected error occurred during signup. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==========================================
# LOGIN (TOKEN OBTAINER) VIEWS
# ==========================================

class WebSiteAdminLoginView(TokenObtainPairView):
    """
    Validates WebSiteAdmin credentials and returns JWTs 
    stamped with the 'admin' user_type claim.
    """
    permission_classes = [AllowAny]
    serializer_class = AdminLoginSerializer

    @extend_schema(
        request=AdminLoginSerializer,
        examples=[
            OpenApiExample(
                "Admin Login",
                value={
                    "email": "admin@pixsys.com",
                    "password": "AdminPassword123!"
                }
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            admin_user = serializer.validated_data['user']

            refresh = RefreshToken.for_user(admin_user)
            refresh['user_type'] = 'admin'

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in WebSiteAdminLoginView: {e}", exc_info=True)
            return Response(
                {"detail": "An unexpected error occurred during admin login."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerLoginInitiateView(APIView):
    """Validates credentials and dispatches OTP for 2-step login."""
    permission_classes = [AllowAny]

    @extend_schema(
        request=CustomerLoginSerializer,
        examples=[
            OpenApiExample(
                "Initiate Customer Login",
                value={
                    "email": "customer@example.com",
                    "password": "SecurePassword123!"
                }
            )
        ]
    )
    def post(self, request):
        try:
            serializer = CustomerLoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            customer = serializer.validated_data['user']
            
            # Identity confirmed (password matched), trigger OTP
            otp_manager.process_otp_for_customer(customer)

            return Response(
                {"detail": "Credentials verified. OTP has been sent to your email."}, 
                status=status.HTTP_200_OK
            )
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CustomerLoginInitiateView: {e}", exc_info=True)
            return Response(
                {"detail": "An unexpected error occurred while initiating login."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerVerifyOTPView(APIView):
    """Validates the OTP and returns the final JWT access tokens."""
    permission_classes = [AllowAny]
    
    @extend_schema(
        request=CustomerVerifyOTPSerializer,
        examples=[
            OpenApiExample(
                "Verify OTP Code",
                value={
                    "email": "customer@example.com",
                    "otp_code": "123456"
                }
            )
        ]
    )
    def post(self, request):
        try:
            serializer = CustomerVerifyOTPSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            customer = serializer.validated_data['customer']
            otp_record = serializer.validated_data['otp_record']
            
            if not customer.is_verified:
                customer.is_verified = True
                customer.save()
                
            otp_record.delete()

            refresh = RefreshToken.for_user(customer)
            refresh['user_type'] = 'customer'

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CustomerVerifyOTPView: {e}", exc_info=True)
            return Response(
                {"detail": "An unexpected error occurred during OTP verification."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerResendOTPView(APIView):
    """Generates a new OTP and resends it to the customer's email."""
    permission_classes = [AllowAny]
    authentication_classes = []
    
    @extend_schema(
        request=CustomerResendOTPSerializer,
        examples=[
            OpenApiExample(
                "Resend OTP Request",
                value={
                    "email": "customer@example.com"
                }
            )
        ]
    )
    def post(self, request):
        import traceback
        try:
            
            serializer = CustomerResendOTPSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            customer = serializer.validated_data['customer']
            
            email_sent = otp_manager.process_otp_for_customer(customer)
            
            if email_sent:
                return Response(
                    {"detail": "A new OTP has been sent to your email."}, 
                    status=status.HTTP_200_OK
                )
            
            logger.warning(f"Failed to dispatch resend OTP email for customer: {customer.email}")
            
            return Response(
                {"detail": "Failed to send the email. Please try again later."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CustomerResendOTPView: {e}{traceback.format_exc()}")
            return Response(
                {"detail": "An unexpected error occurred while resending OTP."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerPasswordResetRequestView(APIView):
    """Sends a password reset OTP to the customer's registered email."""
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        request=CustomerPasswordResetRequestSerializer,
        examples=[
            OpenApiExample(
                "Password Reset Request",
                value={
                    "email": "customer@example.com"
                }
            )
        ]
    )
    def post(self, request):
        try:
            serializer = CustomerPasswordResetRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            customer = serializer.validated_data['customer']

            otp_sent = otp_manager.process_otp_for_customer(customer)
            if otp_sent:
                return Response(
                    {"detail": "Password reset OTP sent to registered email."},
                    status=status.HTTP_200_OK
                )

            logger.warning(f"Failed to send password reset OTP to customer: {customer.email}")
            return Response(
                {"detail": "Failed to send password reset OTP. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CustomerPasswordResetRequestView: {e}", exc_info=True)
            return Response(
                {"detail": "An unexpected error occurred while requesting password reset OTP."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerPasswordResetVerifyView(APIView):
    """Verifies the password reset OTP and marks it as ready for password update."""
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        request=CustomerPasswordResetVerifySerializer,
        examples=[
            OpenApiExample(
                "Password Reset OTP Verification",
                value={
                    "email": "customer@example.com",
                    "otp_code": "123456"
                }
            )
        ]
    )
    def post(self, request):
        try:
            serializer = CustomerPasswordResetVerifySerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            otp_record = serializer.validated_data['otp_record']
            otp_record.verified = True
            otp_record.save()

            return Response(
                {"detail": "OTP verified successfully. You may now submit your new password."},
                status=status.HTTP_200_OK
            )
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CustomerPasswordResetVerifyView: {e}", exc_info=True)
            return Response(
                {"detail": "An unexpected error occurred during OTP verification."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerPasswordResetConfirmView(APIView):
    """Accepts a new password and finalizes the password reset after OTP verification."""
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        request=CustomerPasswordResetConfirmSerializer,
        examples=[
            OpenApiExample(
                "Password Reset Confirmation",
                value={
                    "email": "customer@example.com",
                    "new_password": "NewSecurePassword123!"
                }
            )
        ]
    )
    def post(self, request):
        try:
            serializer = CustomerPasswordResetConfirmSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            customer = serializer.validated_data['customer']
            otp_record = serializer.validated_data['otp_record']
            new_password = serializer.validated_data['new_password']

            customer.password = new_password
            customer.save()
            otp_record.delete()

            return Response(
                {"detail": "Password reset successfully.", "email": customer.email},
                status=status.HTTP_200_OK
            )
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CustomerPasswordResetConfirmView: {e}", exc_info=True)
            return Response(
                {"detail": "An unexpected error occurred while resetting password."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==========================================
# TOKEN REFRESH & LOGOUT (SHARED VIEWS)
# ==========================================
        
class CustomTokenRefreshView(TokenRefreshView):
    """
    Standard SimpleJWT refresh view preserving custom claims (like user_type).
    """
    permission_classes = [AllowAny]
    authentication_classes = []


class LogoutView(APIView):
    """
    Logout endpoint. Clients should discard tokens upon receiving a 200 OK.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OpenApiExample("Success", value={"detail": "Logged out successfully."})})
    def post(self, request):
        try:
            return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Unexpected error during logout: {e}", exc_info=True)
            return Response(
                {"detail": "An error occurred during logout."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =================================================
# COMPANY SETTINGS 
# =================================================

class SystemSMTPConfigView(APIView):
    """Admin-only view to fetch and update SMTP credentials."""
    permission_classes = [IsWebSiteAdmin]

    @extend_schema(responses=SystemSMTPConfigSerializer)
    def get(self, request):
        try:
            config = SystemSMTPConfig.load()
            serializer = SystemSMTPConfigSerializer(config)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in SystemSMTPConfigView (GET): {e}", exc_info=True)
            return Response(
                {"detail": "Failed to retrieve SMTP configuration."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        request=SystemSMTPConfigSerializer,
        responses=SystemSMTPConfigSerializer,
        examples=[
            OpenApiExample(
                "Update SMTP Config",
                value={
                    "email_host_user": "noreply@pixsys.com",
                    "email_host_password": "yourapppasswordhere"
                }
            )
        ]
    )
    def patch(self, request):
        try:
            config = SystemSMTPConfig.load()
            serializer = SystemSMTPConfigSerializer(config, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in SystemSMTPConfigView (PATCH): {e}", exc_info=True)
            return Response(
                {"detail": "Failed to update SMTP configuration."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CompanySettingsView(APIView):
    """
    Public GET for frontend rendering. 
    Admin-only PATCH for updating details.
    """
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsWebSiteAdmin()]

    @extend_schema(responses=CompanySettingsSerializer)  
    def get(self, request):
        try:
            settings_data = CompanySettings.load()
            serializer = CompanySettingsSerializer(settings_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CompanySettingsView (GET): {e}", exc_info=True)
            return Response(
                {"detail": "Failed to retrieve company settings."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        request=CompanySettingsSerializer,
        responses=CompanySettingsSerializer,
        examples=[
            OpenApiExample(
                name="Update Company Settings",
                value={
                    "company_details": "Pixsys provides industry-leading software solutions.",
                    "contact_email": "contact@pixsys.com",
                    "instagram_link": "https://instagram.com/pixsys",
                    "facebook_link": "https://facebook.com/pixsys",
                    "linkedin_link": "https://linkedin.com/company/pixsys",
                    "youtube_link": "https://youtube.com/pixsys"
                }
            )
        ]
    )    
    def patch(self, request):
        try:
            settings_data = CompanySettings.load()
            serializer = CompanySettingsSerializer(settings_data, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except APIException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in CompanySettingsView (PATCH): {e}", exc_info=True)
            return Response(
                {"detail": "Failed to update company settings."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )