from rest_framework import serializers
from .models import ContentItemModel


class ContentItemSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=[ContentItemModel.DESCRIPTION, ContentItemModel.IMAGE])
    payload = serializers.DictField()


class NewsCreateSerializer(serializers.Serializer):
    date = serializers.DateField()
    heading = serializers.CharField(max_length=255)
    thumbnail = serializers.ImageField(required=False, allow_null=True)
    contents = ContentItemSerializer(many=True)

    def validate_contents(self, value):
        if not value:
            raise serializers.ValidationError("contents must be a non-empty list")
        for i, item in enumerate(value):
            if item["type"] == ContentItemModel.DESCRIPTION and "text" not in item["payload"]:
                raise serializers.ValidationError(f"content[{i}]: description payload requires 'text'")
            if item["type"] == ContentItemModel.IMAGE and "url" not in item["payload"] and "file" not in item["payload"]:
                raise serializers.ValidationError(f"content[{i}]: image payload requires 'url' or 'file'")
        return value
