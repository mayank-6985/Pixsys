from rest_framework import serializers

class NewsContentSerializer(serializers.Serializer):
    # Match the lowercase exact keys inside your JSON array
    type = serializers.ChoiceField(choices=['text', 'image'])
    description = serializers.CharField(required=False, allow_blank=True)
    url = serializers.URLField(required=False)
    caption = serializers.CharField(required=False, max_length=100)

    def validate(self, attrs):
        content_type = attrs.get('type')

        if content_type == 'text':
            if not attrs.get('description'):
                raise serializers.ValidationError(
                    {"description": "This field is required when type is 'text'."}
                )
            # Optional: Strip out image fields if they accidentally got passed
            attrs.pop('url', None)
            attrs.pop('caption', None)

        elif content_type == 'image':
            errors = {}
            if not attrs.get('url'):
                errors['url'] = "This field is required when type is 'image'."
            if not attrs.get('caption'):
                errors['caption'] = "This field is required when type is 'image'."
            
            if errors:
                raise serializers.ValidationError(errors)
            
            # Optional: Strip out text fields if they accidentally got passed
            attrs.pop('description', None)

        return attrs


class NewsSerializer(serializers.Serializer):
    # Field names match the exact PascalCase keys from your JSON payload
    news_id = serializers.IntegerField(required=False)
    date = serializers.DateField(input_formats=['%d-%m-%Y' , '%Y-%m-%d'])
    heading = serializers.CharField(max_length=255)
    thumbnail = serializers.URLField(required=False, allow_null=True)
    content = NewsContentSerializer(many=True)

    def validate_content(self, value):
        if not value:
            raise serializers.ValidationError("Content list cannot be empty.")
        return value