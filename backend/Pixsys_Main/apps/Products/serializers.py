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


class downloadSerializer(serializers.Serializer):
    # Maps the Enum values into DRF choices
    resource_type = serializers.ChoiceField(
        choices=[(type.name, type.value) for type in DownloadType],
        required=True,
        error_messages={
            'invalid_choice': 'Invalid resource type. Must be one of: SOFTWARE, SOFTWARE_MANUAL, CATALOG, DIMENTION.'
        }
    )
    name = serializers.CharField(max_length=None)
    resourse_url = serializers.URLField()
    
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
    # downloads = downloadSerializer(many=True)
    
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
    # downloads = downloadSerializer(many=True)

class ProductSerializer(serializers.ModelSerializer):
    
    # This automatically crosses the relationship and grabs the custom tag_id
    tag_id = serializers.IntegerField(source='tag.tag_id', read_only=True)

    class Meta:
        from .models import ProductModel
        model = ProductModel
        fields = ['tag_id', 'product_id', 'name', 'tagline', 'description', 'product_img', "specifications"]