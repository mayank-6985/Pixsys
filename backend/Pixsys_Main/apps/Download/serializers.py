from rest_framework import serializers
from .Objects.download_factory import DownloadType

class BaseDownloadSerializer(serializers.Serializer):
    """Contains all common fields shared between creation and updating."""
    product_id = serializers.IntegerField(required=False, allow_null=True)
    tag_id = serializers.IntegerField(required=False, allow_null=True)
    subcategory_id = serializers.IntegerField(required=False, allow_null=True)
    category_id = serializers.IntegerField(required=False, allow_null=True)
    name = serializers.CharField(required=False, allow_null=True, max_length=255)
    
    # URLField automatically validates that the string is a properly formatted URL
    resource_url = serializers.URLField(required=False, allow_null=True)


class DownloadCreateSerializer(BaseDownloadSerializer):
    """Serializer for handling POST/Create requests."""
    
    # Maps the Enum values into DRF choices
    resource_type = serializers.ChoiceField(
        choices=[(type.name, type.value) for type in DownloadType],
        required=True,
        error_messages={
            'invalid_choice': 'Invalid resource type. Must be one of: SOFTWARE, SOFTWARE_MANUAL, CATALOG, DIMENTION.'
        }
    )

    # Optional: If you want to enforce your previous business logic directly at the API boundary,
    # you can override these fields to make them strictly required for creation.
    # category_id = serializers.IntegerField(required=True)
    # tag_id = serializers.IntegerField(required=True)
    # product_id = serializers.IntegerField(required=True)


class DownloadUpdateSerializer(BaseDownloadSerializer):
    """Serializer for handling PUT/PATCH/Update requests."""
    
    # Required for updates to identify the record  
    resource_type = serializers.ChoiceField(
        choices=[(type.name, type.value) for type in DownloadType],
        required=True,
        error_messages={
            'invalid_choice': 'Invalid resource type. Must be one of: SOFTWARE, SOFTWARE_MANUAL, CATALOG, DIMENTION.'
        }
    )