from rest_framework import serializers
from ..Download.Objects.download_factory import DownloadType


class ProductCategoryCreateSerializer(serializers.Serializer):
    category_name = serializers.CharField(required=True,max_length=None)
    tagline = serializers.CharField(required=True)
    category_img = serializers.URLField(required=True)    
    # thumbnail_mobile = serializers.URLField(required=True)
    # thumbnail_desktop = serializers.URLField(required=True)
    
class ProductCategoryUpdateSerializer(serializers.Serializer):
    category_name = serializers.CharField(required=True,max_length=None)
    tagline = serializers.CharField(required=True)
    category_img = serializers.URLField(required=True)
    # thumbnail_mobile = serializers.URLField(required=True)
    # thumbnail_desktop = serializers.URLField(required=True)
    category_id  = serializers.BigIntegerField(required=True)
    
class ProductSubCategoryCreateSerializer(serializers.Serializer):
    category_id = serializers.BigIntegerField(required=True)
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    category_img = serializers.URLField(required=True)
    
class ProductSubCategoryUpdateSerializer(serializers.Serializer):
    category_id = serializers.BigIntegerField(required=True)
    subcategory_id = serializers.BigIntegerField(required=True)
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    category_img = serializers.URLField(required=True)

class ProductTagCreateSerializer(serializers.Serializer):
    subcategory_id = serializers.BigIntegerField(required=True)    
    name = serializers.CharField(required=True)
    # thumbnail_mobile = serializers.URLField(required=True)
    # thumbnail_desktop = serializers.URLField(required=True)

class ProductTagUpdateSerializer(serializers.Serializer):
    subcategory_id = serializers.BigIntegerField(required=True)
    tag_id = serializers.BigIntegerField(required=True)
    name = serializers.CharField(required=True)
    # thumbnail_mobile = serializers.URLField(required=True)
    # thumbnail_desktop = serializers.URLField(required=True)


class downloadCreateSerializer(serializers.Serializer):
    # Maps the Enum values into DRF choices
    resource_type = serializers.ChoiceField(
        choices=[(type.name, type.value) for type in DownloadType],
        required=True,
        error_messages={
            'invalid_choice': 'Invalid resource type. Must be one of: SOFTWARE, SOFTWARE_MANUAL, CATALOG, DIMENTION.'
        }
    )
    name = serializers.CharField(max_length=None)
    resource_url = serializers.URLField()
class downloadUpdateSerializer(serializers.Serializer):
    # Maps the Enum values into DRF choices
    download_id = serializers.BigIntegerField(required=True)
    resource_type = serializers.ChoiceField(
        choices=[(type.name, type.value) for type in DownloadType],
        required=True,
        error_messages={
            'invalid_choice': 'Invalid resource type. Must be one of: SOFTWARE, SOFTWARE_MANUAL, CATALOG, DIMENTION.'
        }
    )
    name = serializers.CharField(max_length=None)
    resource_url = serializers.URLField()
    

class ResourceCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, required=False)
    thumbnail = serializers.URLField()
    resource_url = serializers.URLField()

class ResourceUpdateSerializer(serializers.Serializer):
    resource_id = serializers.BigIntegerField(required=True)
    name = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(allow_blank=True, required=False)
    thumbnail = serializers.URLField(required=False)
    resource_url = serializers.URLField(required=False)
    
    
class ProductCreateSerializer(serializers.Serializer):
    tag_id = serializers.BigIntegerField(required=True)    
    name = serializers.CharField(required=True)
    tagline = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    product_img = serializers.URLField(required=True)
    specifications = serializers.ListField(
        child=serializers.URLField(),
        required=True  
    )
    downloads = downloadCreateSerializer(many=True)
    # new resource field
    resources = ResourceCreateSerializer(many=True, required=False)
    
class ProductUpdateSerializer(serializers.Serializer):
    tag_id = serializers.BigIntegerField(required=True)
    product_id = serializers.BigIntegerField(required=True)
    name = serializers.CharField(required=True)
    tagline = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    product_img = serializers.URLField(required=True)
    specifications = serializers.ListField(
        child=serializers.URLField(),
        required=True  
    )
    downloads = downloadUpdateSerializer(many=True)
    resources = ResourceUpdateSerializer(many=True, required=False)
class ProductSerializer(serializers.ModelSerializer):
    
    # This automatically crosses the relationship and grabs the custom tag_id
    tag_id = serializers.IntegerField(source='tag.tag_id', read_only=True)

    class Meta:
        from .models import ProductModel
        model = ProductModel
        fields = ['tag_id', 'product_id', 'name', 'tagline', 'description', 'product_img', "specifications"]