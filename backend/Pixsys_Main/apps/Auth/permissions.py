from rest_framework.permissions import BasePermission
from .models import PixsysAdminModel, PixsysCustomerModel

class IsWebSiteAdmin(BasePermission):
    """
    Allows access only to authenticated WebSiteAdmins.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            isinstance(request.user, PixsysAdminModel)
        )

