from rest_framework import status, permissions
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema, inline_serializer ,OpenApiParameter
from django.core.exceptions import ValidationError
import traceback
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from .Service.product_service import ProductService
from apps.Auth.decorators import public_endpoint

from .serializers import *
logger = logging.getLogger(__name__)


service = ProductService()
# navigation bar view
"""No need for the authentication"""
class NavTreeView(APIView):
    @public_endpoint
    def get(self, request):
        try:
            data = service.get_navigation_product_list()
            return Response(data , status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in NavTreeView GET: {str(e)}\n\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred while fetching Product."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
# category view:
"""
Need the Authentication.
POST: Adds new Category
GET :Gets List of Category
PUT : Updated the details for the Specific Category
DELETE : Delete the Category.
"""
class CategoryListView(APIView):    
       
    """
    Endpoint: POST /categories/
    Updates the CAtegory List records without their deep content block.
    """    
            
    @extend_schema(
        summary="Create fresh Category",
        description="Adds a new Category entry. Expects the object data fields directly at the root of the JSON body.",
        request=ProductCategoryCreateSerializer,
        responses={
            201: inline_serializer(
                name="ProductCategoryCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductCategoryError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        """
        Handles: Adding new Category.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        serializer = ProductCategoryCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.create_category(data=serializer.validated_data)
            return Response({"message": "Category created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Unexpected error in CategoryListView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the news entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @public_endpoint       
    def get(self, request):
        try:
            data = service.get_category_list()
            return Response(data , status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in CategoryListCreateView GET: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred while fetching Categories."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Update existing Category",
        description="Updates an existing Category record. Expects 'category_id' and the updated 'data' payload block inside the JSON body.",
        request=ProductCategoryUpdateSerializer,
        responses={
            200: inline_serializer(
                name="ProductCategoryUpdateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductCategoryUpdateValidationError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="ProductCategoryUpdateNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request):
        """
        Handles: Updating old Category.
        """             
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = ProductCategoryUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            result = service.update_category(data=serializer.validated_data)
            return Response({"message": "Category updated successfully"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in CategoryListView PUT for ID {news_id}: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while updating the news entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Delete a news record",
        description="Removes a news record by ID. Expects 'category_id' inside the Query Parameter",
        parameters=[
            OpenApiParameter(
                name="category_id",
                type=int,
                required=True
            )
        ],
        responses={
            200: inline_serializer(
                name="ProductCategoryDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductCategoryDeleteError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="ProductCategoryDeleteNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request):
        """
        Handles: deleteing old Category.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
           
        category_id = request.query_params.get("category_id")
        if not category_id:
            return Response({"error": "Missing required field: 'category_id'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            success = service.delete_category(category_id=category_id)
            if success:
                return Response({"message": "Category deleted successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Deletion failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in CategoryListView DELETE for ID {category_id}: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred during deletion."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

#  subcategory Listing View for Gloabl and admin
#  subcategories/<int:category_id>/page/
"""
-> no Need for the Authentication
GET : returns the complete details fort the category , including sub-category , tags, product.
"""
class SubCategoryPageView(APIView):
    @public_endpoint
    def get(self, request , category_id):
        try:
            data = service.get_list_of_product_for_category(category_id=category_id)
            return Response(data , status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in SubCategoryPageView GET: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred while fetching Product."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Subcategory View
"""
Need the authentication
"""
class SubCategoryListUpdateView(APIView):
    """
    Endpoint: POST /subcategories/
    Updates the CAtegory List records without their deep content block.
    """    
            
    @extend_schema(
        summary="Create fresh SubCategory for Existing Category",
        description="Adds a new Sub Category entry. Expects the object data fields directly at the root of the JSON body.",
        request=ProductCategoryCreateSerializer,
        responses={
            201: inline_serializer(
                name="ProductSubCategoryCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductSubCategoryError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        """
        Handles: Adding new Subcategory.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = ProductSubCategoryCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.create_subcategory(data=serializer.validated_data)
            return Response({"message": "Subcategory created successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in SubCategoryListUpdateView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the subcategory entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        summary="Update SubCategory for Existing Subcategory",
        description="Updates Sub Category entry. Expects the object data fields directly at the root of the JSON body.",
        request=ProductSubCategoryUpdateSerializer,
        responses={
            201: inline_serializer(
                name="ProductSubCategoryCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductSubCategoryError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request):
        """
        Handles: Updating Old Subcategory
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = ProductSubCategoryUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.update_subcategory(data=serializer.validated_data)
            return Response({"message": "Subcategory Updated successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in SubCategoryListUpdateView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the subcategory entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 
            
    @extend_schema(
        summary="Delete a Subcategory",
        description="Removes a news record by ID. Expects 'subcategory_id' inside the Query Parameter",
        parameters=[
            OpenApiParameter(
                name="subcategory_id",
                type=int,
                required=True
            )
        ],
        responses={
            200: inline_serializer(
                name="ProductSubCategoryDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductSubCategoryDeleteError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="ProductSubCategoryDeleteNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request):
        """
        Handles: deleteing old Category.
        """  
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
         
        subcategory_id = request.query_params.get("subcategory_id")
        if not subcategory_id:
            return Response({"error": "Missing required field: 'subcategory_id'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            success = service.delete_subcategory(subcategory_id=subcategory_id)
            if success:
                return Response({"message": "Category deleted successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Deletion failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in CategoryListView DELETE for ID {subcategory_id}: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred during deletion."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        
class TagListUpdateView(APIView):
    """
    Endpoint: POST /tags/
    Updates the Tag List records without their deep content block.
    """    
            
    @extend_schema(
        summary="Create fresh tags for Existing Category",
        description="Adds a new tags for existing Sub Category entry. Expects the object data fields directly at the root of the JSON body.",
        request=ProductTagCreateSerializer,
        responses={
            201: inline_serializer(
                name="ProductTagCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductTagError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        """
        Handles: Adding new news.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = ProductTagCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.create_tag(data=serializer.validated_data)
            return Response({"message": "Tag created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Unexpected error in TagListCreateView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the subcategory entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @extend_schema(
        summary="Update Tag for Existing Tag",
        description="Updates Sub Category entry. Expects the object data fields directly at the root of the JSON body.",
        request=ProductTagUpdateSerializer,
        responses={
            201: inline_serializer(
                name="ProductTagCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductTagError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request):
        """
        Handles: Updating Old Tag
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = ProductTagUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.update_tag(data=serializer.validated_data)
            return Response({"message": "Tag Updated successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in TagListUpdateView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the Tag entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 
            
    @extend_schema(
        summary="Delete a Tag",
        description="Removes a news record by ID. Expects 'tag_id' inside the Query Parameter",
        parameters=[
            OpenApiParameter(
                name="tag_id",
                type=int,
                required=True
            )
        ],
        responses={
            200: inline_serializer(
                name="ProductTagDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductTagDeleteError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="ProductTagDeleteNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request):
        """
        Handles: deleteing old Category.
        """   
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        tag_id = request.query_params.get("tag_id")
        if not tag_id:
            return Response({"error": "Missing required field: 'tag_id'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            success = service.delete_tag(tag_id=tag_id)
            if success:
                return Response({"message": "Category deleted successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Deletion failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in CategoryListView DELETE for ID {tag_id}: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred during deletion."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

class ProductListView(APIView):
    """
    Endpoint: POST /products/
    Updates the CAtegory List records without their deep content block.
    """    
            
    @extend_schema(
        summary="Create fresh product for Existing Category",
        description="Adds a new product for existing Sub Category entry. Expects the object data fields directly at the root of the JSON body.",
        request=ProductCreateSerializer,
        responses={
            201: inline_serializer(
                name="ProductCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductCreateError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        """
        Handles: Adding new news.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = ProductCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.create_product(data=serializer.validated_data)
            return Response({"message": "Product created successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in ProductListCreateView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the Product entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @extend_schema(
        summary="Update Product for Existing Product",
        description="Updates Sub Category entry. Expects the object data fields directly at the root of the JSON body.",
        request=ProductUpdateSerializer,
        responses={
            201: inline_serializer(
                name="ProductCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request):
        """
        Handles: Updating Old Product
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        serializer = ProductUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = service.update_product(data=serializer.validated_data)
            return Response({"message": "Product Updated successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in ProductListUpdateView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the Product entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 
            
    @extend_schema(
        summary="Delete a Product",
        description="Removes a news record by ID. Expects 'product_id' inside the Query Parameter",
        parameters=[
            OpenApiParameter(
                name="product_id",
                type=int,
                required=True
            )
        ],
        responses={
            200: inline_serializer(
                name="ProductDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="ProductDeleteError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="ProductDeleteNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request):
        """
        Handles: deleteing old Category.
        """   
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        product_id = request.query_params.get("product_id")
        if not product_id:
            return Response({"error": "Missing required field: 'product_id'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            success = service.delete_product(product_id=product_id)
            if success:
                return Response({"message": "Category deleted successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Deletion failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in CategoryListView DELETE for ID {product_id}: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred during deletion."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProductView(APIView):
    @public_endpoint
    def get(self, request , product_id):
        try:
            data = service.get_product(product_id = product_id)
            return Response(data , status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in ProductView GET: {str(e)}\n\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred while fetching Product."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )