from rest_framework import serializers

class IndividualResourceCreateSerializer(serializers.Serializer):
    product_id = serializers.BigIntegerField()
    tag_id = serializers.BigIntegerField()
    subcategory_id = serializers.IntegerField()
    category_id = serializers.BigIntegerField()
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, required=False)
    thumbnail = serializers.URLField()
    resource_url = serializers.URLField()


class IndividualResourceUpdateSerializer(serializers.Serializer):
    resource_id = serializers.BigIntegerField(required=True)
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, required=False)
    thumbnail = serializers.URLField()
    resource_url = serializers.URLField()
    

class IndividualResourceDeleteSerializer(serializers.Serializer):
    resource_id = serializers.BigIntegerField(required=True)