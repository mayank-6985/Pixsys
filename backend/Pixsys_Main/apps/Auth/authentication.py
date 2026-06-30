from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from bson import ObjectId
# Lazy imports to prevent circular dependency errors on startup
# We will import the models inside the get_user methods.
import logging
import traceback

logger = logging.getLogger(__name__)


class AdminJWTAuthentication(JWTAuthentication):
    """
    Validates JWTs stamped with 'admin' and 
    attaches the PixsysAdminModel model to request.user.
    """
    def get_user(self, validated_token):
        logger.debug(f"Attempting to authenticate token: {validated_token}" )
        if validated_token.get('user_type') != 'admin':
            return None 
            
        from .models import PixsysAdminModel
            
        user_id = validated_token.get('user_id')
        try:
           # Cast the string user_id to an ObjectId
            user = PixsysAdminModel.objects.get(id=ObjectId(user_id))
            return user
        except PixsysAdminModel.DoesNotExist:        
            raise AuthenticationFailed("Admin account not found or deactivated.", code="user_not_found")
        except Exception as e:
            logger.error(f"Authentication Error: {e}\n{traceback.format_exc()}")
            raise AuthenticationFailed(str(e))


class CustomerJWTAuthentication(JWTAuthentication):
    """
    Validates JWTs stamped with 'customer' and 
    attaches the Customer model to request.user.
    """
    def get_user(self, validated_token):
        if validated_token.get('user_type') != 'customer':
            return None 
            
        from .models import PixsysCustomerModel
            
        user_id = validated_token.get('user_id')
        try:
            # Cast the string user_id to an ObjectId
            user = PixsysCustomerModel.objects.get(id=ObjectId(user_id))
            return user
        except PixsysCustomerModel.DoesNotExist:
            raise AuthenticationFailed("Customer account not found or deactivated.", code="user_not_found")