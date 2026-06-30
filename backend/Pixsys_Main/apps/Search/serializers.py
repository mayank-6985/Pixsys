from rest_framework import serializers

class SearchSerializer(serializers.Serializer):
    keyword = serializers.CharField(
        max_length=255,
        required=True,
        help_text="The keyword to search for in the product name."
    )