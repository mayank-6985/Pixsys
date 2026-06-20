from rest_framework import serializers


class SolutiosCategoryCreateSerializer(serializers.Serializer):
    category_name = serializers.CharField(allow_blank=False , required=True, max_length=None)
    thumbnail = serializers.URLField(required=True)
    
    
class SolutionCategoryUpdateSerializer(serializers.Serializer):
    category_id = serializers.IntegerField(required=True , allow_null=False)
    category_name = serializers.CharField(allow_blank=False , required=True, max_length=None)
    thumbnail = serializers.URLField(required=True)
    
class SolutionsCreateSerializer(serializers.Serializer):
    category_id = serializers.IntegerField(required=True , allow_null=False)
    title = serializers.CharField(required=True , max_length=100 , allow_blank=False)
    thumbnail = serializers.URLField(required=True)
    videoUrl = serializers.URLField(required=True)
    
    
class SolutionsUpdateSerializer(serializers.Serializer):
    solutions_id = serializers.IntegerField(required=True , allow_null=False)
    category_id = serializers.IntegerField(required=True , allow_null=False)
    title = serializers.CharField(required=True , max_length=100 , allow_blank=False)
    thumbnail = serializers.URLField(required=True)
    videoUrl = serializers.URLField(required=True)
