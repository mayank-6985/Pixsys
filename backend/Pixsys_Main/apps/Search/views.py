import logging
import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from drf_spectacular.utils import extend_schema, inline_serializer, OpenApiExample

# Assuming you have your service and serializers imported
from .serializers import SearchSerializer
from .Services.search_service import SearchService

logger = logging.getLogger(__name__)

search_service = SearchService()

class ProductSearchView(APIView):
    @extend_schema(
        summary="Search Products by Keyword",
        description="Searches for products using a partial match on the product name. Returns a list of matched products excluding internal IDs.",
        parameters=[SearchSerializer],  # Maps the serializer to URL query parameters
        responses={
            200: inline_serializer(
                name="ProductSearchResponse",
                fields={
                    "products": serializers.ListField(
                        child=serializers.DictField(),
                        help_text="A list of product objects matching the search criteria."
                    )
                }
            ),
            400: inline_serializer(
                name="ProductSearchError",
                fields={"error": serializers.CharField()}
            )
        },
        examples=[
            OpenApiExample(
                name="Successful Search Response",
                value={
                    "products": [
                        {
                            "product_id": 105,
                            "name": "Q Plus Series",
                            "tagline": "Powerful performance...",
                            "description": "Main body text...",
                            "product_img": "https://example.com/img.png",
                            "specifications": [],
                            "created_at": "2023-10-25T10:00:00Z"
                        }
                    ]
                },
                response_only=True,
                status_codes=["200"]
            )
        ]
    )
    def get(self, request):
        # Validate query parameters instead of request body for GET requests
        serializer = SearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Extract the validated keyword and pass it to the service
            keyword = serializer.validated_data['keyword']
            result = search_service.search_product(keyword=keyword)
            
            return Response(result, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Handles business logic validation errors from the service
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in ProductSearchView GET: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while searching for products."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 

class GlobalSearchView(APIView):
    @extend_schema(
        summary="Global Search Across Products, Solution , News ,Downloads",
        description="Searches for a keyword across Products, News, Solutions, and Downloads simultaneously.",
        parameters=[SearchSerializer],  # Maps the serializer to URL query parameters
        responses={
            200: inline_serializer(
                name="GlobalSearchResponse",
                fields={
                    "products": serializers.ListField(
                        child=serializers.DictField(),
                        help_text="List of matched products."
                    ),
                    "news": serializers.ListField(
                        child=serializers.DictField(),
                        help_text="List of matched news articles."
                    ),
                    "solutions": serializers.ListField(
                        child=serializers.DictField(),
                        help_text="List of matched solutions."
                    ),
                    "downloads": serializers.DictField(
                        child=serializers.ListField(child=serializers.DictField()),
                        help_text="Matched downloads grouped by resource_type (e.g., SOFTWARE, CATALOG)."
                    )
                }
            ),
            400: inline_serializer(
                name="GlobalSearchError",
                fields={"error": serializers.CharField()}
            )
        },
        examples=[
            OpenApiExample(
                name="Successful Global Search Response",
                value={
                    "products": [
                        {
                            "product_id": 105,
                            "name": "Q Plus Series",
                            "tagline": "Powerful performance...",
                            "description": "Main body text...",
                            "product_img": "https://example.com/img.png",
                            "specifications": [],
                            "created_at": "2023-10-25T10:00:00Z"
                        }
                    ],
                    "news": [
                        {
                            "news_id": 42,
                            "date": "2023-10-25",
                            "heading": "New Q Plus Series Announced",
                            "thumbnail": "https://example.com/news.png"
                        }
                    ],
                    "solutions": [
                        {
                            "solutions_id": 7,
                            "title": "Integrating Q Plus in Enterprise",
                            "thumbnail": "https://example.com/sol.png",
                            "videoUrl": "https://youtube.com/..."
                        }
                    ],
                    "downloads": {
                        "SOFTWARE": [
                            {
                                "download_id": 1,
                                "name": "Q Plus Setup Application",
                                "resource_url": "https://example.com/setup.exe",
                                "resource_type": "SOFTWARE",
                                "product_id": 105,
                                "tag_id": 4,
                                "subcategory_id": 2,
                                "category_id": 12
                            }
                        ],
                        "SOFTWARE_MANUAL": [],
                        "CATALOG": [],
                        "DIMENTION": []
                    }
                },
                response_only=True,
                status_codes=["200"]
            )
        ]
    )
    def get(self, request):
        # Validate query parameters for GET requests
        serializer = SearchSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Extract the validated keyword
            keyword = serializer.validated_data['keyword']
            
            # Call the global search service (which should aggregate results from the 4 previous services)
            result = search_service.search_globally(keyword=keyword)
            
            return Response(result, status=status.HTTP_200_OK)
            
        except ValueError as e:
            # Handles business logic validation errors from the service
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in GlobalSearchView GET: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while performing the global search."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )