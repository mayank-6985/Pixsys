from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status, serializers
from django.conf import settings
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()
class EmailTokenObtainSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')        
        user = User.objects.filter(email=email).first()
        if user is None or not user.check_password(password):
        # if user is None:
            raise serializers.ValidationError('No active account found with the given credentials')
        attrs['user'] = user
        return attrs


class TokenObtainPairJSONView(TokenObtainPairView):
    """Return access and refresh tokens in JSON response body using email+password."""
    authentication_classes = []
    permission_classes = [AllowAny]

    class InputSerializer(EmailTokenObtainSerializer):
        pass

    def post(self, request, *args, **kwargs):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        return Response({'access': str(refresh.access_token), 'refresh': str(refresh)}, status=status.HTTP_200_OK)


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

