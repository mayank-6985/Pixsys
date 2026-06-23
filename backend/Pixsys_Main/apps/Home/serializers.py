from rest_framework import serializers

class SliderSerializer(serializers.Serializer):
    slideImages = serializers.ListField(
        child=serializers.URLField(),
        allow_empty=True # The domain Object layer will enforce the empty restrictions
    )