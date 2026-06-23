from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.permissions import AllowAny, IsAuthenticated


class TokenObtainPairJSONView(TokenObtainPairView):
    """Return access and refresh tokens in JSON response body (Authorization header usage recommended)."""
    authentication_classes = []
    permission_classes = [AllowAny]


class TokenRefreshJSONView(TokenRefreshView):
    """Return refreshed access token in JSON response body."""
    authentication_classes = []
    permission_classes = [AllowAny]


from rest_framework.views import APIView


class LogoutView(APIView):
    """Logout endpoint — clients should discard tokens. Blacklist can be implemented if needed."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({'detail': 'Logged out'}, status=status.HTTP_200_OK)

