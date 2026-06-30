# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from rest_framework.response import Response
# from rest_framework import status, serializers
# from django.conf import settings
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from django.contrib.auth import get_user_model
# from rest_framework_simplejwt.tokens import RefreshToken
# from .serializers import CustomerSignupSerializer

# User = get_user_model()
# class EmailTokenObtainSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, attrs):
#         email = attrs.get('email')
#         password = attrs.get('password')        
#         user = User.objects.filter(email=email).first()
#         if user is None or not user.check_password(password):
#         # if user is None:
#             raise serializers.ValidationError('No active account found with the given credentials')
#         attrs['user'] = user
#         return attrs


# class TokenObtainPairJSONView(TokenObtainPairView):
#     """Return access and refresh tokens in JSON response body using email+password."""
#     authentication_classes = []
#     permission_classes = [AllowAny]

#     class InputSerializer(EmailTokenObtainSerializer):
#         pass

#     def post(self, request, *args, **kwargs):
#         serializer = self.InputSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']

#         refresh = RefreshToken.for_user(user)
#         return Response({'access': str(refresh.access_token), 'refresh': str(refresh)}, status=status.HTTP_200_OK)


# class TokenRefreshJSONView(TokenRefreshView):
#     """Return refreshed access token in JSON response body."""
#     authentication_classes = []
#     permission_classes = [AllowAny]


# from rest_framework.views import APIView


# class LogoutView(APIView):
#     """Logout endpoint — clients should discard tokens. Blacklist can be implemented if needed."""
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         return Response({'detail': 'Logged out'}, status=status.HTTP_200_OK)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, inline_serializer
from .serializers import (
    AdminLoginSerializer, 
    CustomerLoginSerializer,    
    CustomerSignupSerializer
)

# ==========================================
# SIGNUP VIEWS
# ==========================================


class CustomerSignupView(APIView):
    """API endpoint to register new Customers."""
    permission_classes = [AllowAny]
    authentication_classes = []
    @extend_schema(
        request=CustomerSignupSerializer    
    )
    def post(self, request):
        serializer = CustomerSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Customer account created successfully."}, 
            status=status.HTTP_201_CREATED
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

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        admin_user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(admin_user)
        
        # Inject the critical security stamp for permissions routing
        refresh['user_type'] = 'admin'

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)


class CustomerLoginView(TokenObtainPairView):
    """
    Validates Customer credentials and returns JWTs 
    stamped with the 'customer' user_type claim.
    """
    permission_classes = [AllowAny]
    serializer_class = CustomerLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer_user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(customer_user)
        
        # Inject the critical security stamp for permissions routing
        refresh['user_type'] = 'customer'

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)


# ==========================================
# TOKEN REFRESH & LOGOUT (SHARED VIEWS)
# ==========================================

class CustomTokenRefreshView(TokenRefreshView):
    """
    Standard SimpleJWT refresh view. 
    It automatically preserves custom claims (like user_type) 
    from the refresh token into the newly generated access token.
    """
    permission_classes = [AllowAny]
    authentication_classes = []


class LogoutView(APIView):
    """
    Logout endpoint. Clients should discard tokens upon receiving a 200 OK.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)