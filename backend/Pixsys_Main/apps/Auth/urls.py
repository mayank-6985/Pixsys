# from django.urls import path
# from .views import TokenObtainPairJSONView, TokenRefreshJSONView
# from .views import LogoutView

# urlpatterns = [
#     path('token/', TokenObtainPairJSONView.as_view(), name='token_obtain_pair'),
#     path('token/refresh/', TokenRefreshJSONView.as_view(), name='token_refresh'),
#     path('logout/', LogoutView.as_view(), name='auth_logout'),
# ]

# from django.urls import path
# from .views import (
#     CustomerSignupView,
#     WebSiteAdminLoginView, CustomerLoginView,
#     CustomTokenRefreshView, LogoutView
# )

# urlpatterns = [
#     # Signup    
#     path('customer/signup/', CustomerSignupView.as_view(), name='customer_signup'),
    
#     # Login
#     path('admin/login/', WebSiteAdminLoginView.as_view(), name='admin_login'),
#     path('customer/login/', CustomerLoginView.as_view(), name='customer_login'),
    
#     # Refresh & Logout
#     path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
#     path('logout/', LogoutView.as_view(), name='logout'),
# ]

# Update urls.py
from django.urls import path
from .views import (
    CustomerSignupView, WebSiteAdminLoginView, 
    CustomerLoginInitiateView, CustomerVerifyOTPView, CustomerResendOTPView,
    CustomTokenRefreshView, LogoutView
)

urlpatterns = [
    path('customer/signup/', CustomerSignupView.as_view(), name='customer_signup'),
    
    # 2-Step Login & OTP Management
    path('customer/login/initiate/', CustomerLoginInitiateView.as_view(), name='customer_login_initiate'),
    path('customer/login/verify/', CustomerVerifyOTPView.as_view(), name='customer_login_verify'),
    path('customer/otp/resend/', CustomerResendOTPView.as_view(), name='customer_otp_resend'), # <--- New Endpoint
    
    # Admin
    path('admin/login/', WebSiteAdminLoginView.as_view(), name='admin_login'),
    
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]