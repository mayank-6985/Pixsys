from django.urls import path
from .views import TokenObtainPairJSONView, TokenRefreshJSONView
from .views import LogoutView

urlpatterns = [
    path('token/', TokenObtainPairJSONView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshJSONView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
]
