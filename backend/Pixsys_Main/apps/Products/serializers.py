from rest_framework import serializers

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

class ProductCreateSerializer(serializers.Serializer):
    tag_id = serializers.BigIntegerField(required=True)    
    name = serializers.CharField(required=True)
    tagline = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    product_img = serializers.URLField(required=True)
    
class ProductUpdateSerializer(serializers.Serializer):
    tag_id = serializers.BigIntegerField(required=True)
    product_id = serializers.BigIntegerField(required=True)
    name = serializers.CharField(required=True)
    tagline = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    product_img = serializers.URLField(required=True)

class ProductSerializer(serializers.ModelSerializer):
    
    # This automatically crosses the relationship and grabs the custom tag_id
    tag_id = serializers.IntegerField(source='tag.tag_id', read_only=True)

    class Meta:
        from .models import ProductModel
        model = ProductModel
        fields = ['tag_id', 'product_id', 'name', 'tagline', 'description', 'product_img']