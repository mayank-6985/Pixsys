"""Authentication helpers for the Auth app.

Use `rest_framework_simplejwt.authentication.JWTAuthentication` (Authorization
header: Bearer <token>) as the project's default authentication mechanism.
"""

from rest_framework_simplejwt.authentication import JWTAuthentication  # re-export for convenience

__all__ = ["JWTAuthentication"]
