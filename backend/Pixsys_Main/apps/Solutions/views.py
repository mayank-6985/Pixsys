from rest_framework import status, permissions
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema, inline_serializer ,OpenApiParameter
import logging
import traceback

from .serializers import *
from .Services.solutions_service import SolutionsService
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from apps.Auth.decorators import public_endpoint

solution_service = SolutionsService()

logger = logging.getLogger(__name__)


class SolutionListView(APIView):
    # return every solution
    @public_endpoint
    def get(self, request):
        try:
            solution_list = solution_service.get_category_with_solutions()
            return Response(solution_list, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in SolutionListView GET: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An unexpected error occurred while fetching Soltions"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SolutonDetailView(APIView):
    """
    Endpoint: GET /solutions/<int:solutions_id>/
    Fetches a single solution record complete with its content.
    """
    @public_endpoint
    def get(self, request, solutions_id):
        try:
            data = {
                "solutions_id":int(solutions_id)
            }
            solution = solution_service.get_solution(data=data)
            return Response(solution, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in SolutonDetailView GET for ID {solutions_id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

class SolutionUpdateView(APIView):
    @extend_schema(
        summary="Create fresh Solution",
        description="Adds a new solution entry. Expects the object data fields directly at the root of the JSON body.",
        request=SolutionsCreateSerializer,
        responses={
            201: inline_serializer(
                name="SolutionCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="SolutionCreateError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        """
        Handles: Adding new Solution.
        """
        # Require authentication for POST requests only
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        serializer = SolutionsCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = solution_service.create_solution(data=serializer.validated_data)
            return Response({"message": "Solution created successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            logger.error(f"error in SolutionUpdateView POST: {str(e)}")
            return Response(
                {"error":  f"{str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error in SolutionUpdateView POST: {str(e)}")
            return Response(
                {"error": "An error occurred while creating the solution entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @extend_schema(
        summary="Update old Solution",
        description="Adds updated solution entry. Expects the object data fields directly at the root of the JSON body.",
        request=SolutionsUpdateSerializer,
        responses={
            201: inline_serializer(
                name="SolutionUpdateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="SolutionUpdateError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request):
        """
        Handles: Adding new Solution.
        """
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = SolutionsUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = solution_service.update_solution(data=serializer.validated_data)
            return Response({"message": "Solution updated successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            logger.error(f"error in SolutionUpdateView POST: {str(e)}")
            return Response(
                {"error":  f"{str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error in SolutionUpdateView POST: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while creating the solution entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @extend_schema(
        summary="Delete a Solutions record",
        description="Removes a Solutions record by ID. Expects 'solution_id' at the query parameters.",
        parameters=[
            OpenApiParameter(
                name="solutions_id",
                type=int,
                required=True
            )
        ],
        responses={
            200: inline_serializer(
                name="SolutionDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="SolutionDeleteError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="SolutionDeleteNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request):
        """
        Handles: Deleting the Solution.
        """
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        solutions_id = request.query_params.get("solutions_id")
        if not solutions_id:
            return Response({"error": "Missing required field: 'solutions_id'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data={
             "solutions_id":solutions_id   
            }
            success = solution_service.delete_solution(data=data)
            if success:
                return Response({"message": "solution deleted successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Deletion failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in SolutionUpdateView DELETE for ID {solutions_id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred during deletion."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class SolutionCategoryUpdateView(APIView):
    @extend_schema(
        summary="Create fresh Solution Category",
        description="Adds a new solution category. Expects the object data fields directly at the root of the JSON body.",
        request=SolutiosCategoryCreateSerializer,
        responses={
            201: inline_serializer(
                name="SolutionCategoryCreateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="SolutionCategoryCreateError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def post(self, request):
        """
        Handles: Adding new Solution.
        """
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = SolutiosCategoryCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = solution_service.create_category(data=serializer.validated_data)
            return Response({"message": "Category created successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            logger.error(f"error in SolutionCategoryUpdateView POST: {str(e)}")
            return Response(
                {"error":  f"{str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error in SolutionCategoryUpdateView POST: {str(e)} , {traceback.format_exc(e)}")
            return Response(
                {"error": "An error occurred while creating the solution entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    
    @extend_schema(
        summary="Create fresh Solution Category",
        description="Adds a new solution category. Expects the object data fields directly at the root of the JSON body.",
        request=SolutionCategoryUpdateSerializer,
        responses={
            201: inline_serializer(
                name="SolutionCategoryUpdateResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="SolutionCategoryUpdateError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def put(self, request):
        """
        Handles: Adding Updating Solution Category.
        """
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        serializer = SolutionCategoryUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = solution_service.update_category(data=serializer.validated_data)
            return Response({"message": "Category updated successfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            logger.error(f"error in SolutionCategoryUpdateView PUT: {str(e)}")
            return Response(
                {"error":  f"{str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error in SolutionCategoryUpdateView PUT: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"error": "An error occurred while updating the category entry."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    
    @extend_schema(
        summary="Delete a Category and its solutions",
        description="Removes a Category and its solutions record by ID. Expects 'category_id' at the query parameters.",
        parameters=[
            OpenApiParameter(
                name="category_id",
                type=int,
                required=True
            )
        ],
        responses={
            200: inline_serializer(
                name="SolutionDeleteResponse",
                fields={"message": serializers.CharField()}
            ),
            400: inline_serializer(
                name="SolutionDeleteError",
                fields={"error": serializers.CharField()}
            ),
            404: inline_serializer(
                name="SolutionDeleteNotFoundError",
                fields={"error": serializers.CharField()}
            )
        }
    )
    def delete(self, request):
        """
        Handles: Deleting the Solution.
        """
        from rest_framework.permissions import IsAuthenticated
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)
        
        category_id = request.query_params.get("category_id")
        if not category_id:
            return Response({"error": "Missing required field: 'category_id'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data={
             "category_id":category_id   
            }
            success = solution_service.delete_category(data=data)
            if success:
                return Response({"message": "Category deleted successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Deletion failed"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in SolutionCategoryUpdateView DELETE for ID {category_id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred during deletion."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

