from ..Objects.solutionObj import Solution ,SolutionCategory
from ..models import SolutionsModel , SolutionsCategoryModel
from django.db import transaction

class SolutionsRepo:
    @transaction.atomic
    def create_category(self , category: SolutionCategory):
        category = SolutionsCategoryModel.objects.create(category_name=category.category_name , thumbnail=category.thumbnail)
        return True
    
    def category_exist(self , category: SolutionCategory):
        category_list = list(SolutionsCategoryModel.objects.all().values_list('category_name'))
        
        if category.category_name in category_list:
            return True
        return False

    def get_category(self ,category: SolutionCategory=None,category_id:int=None)->SolutionsCategoryModel:
        try:
            if category is not None:
                category = SolutionsCategoryModel.objects.get(category_name=category.category_name)
                return category
            elif category_id is not None:
                category = SolutionsCategoryModel.objects.get(category_id=category_id)
                return category
        except SolutionsCategoryModel.DoesNotExist:
            return None
        
    @transaction.atomic
    def create_solution(self, solution:Solution):
        # get Category
        category = self.get_category(category_id=solution.category.category_id)
        
        solution = SolutionsModel.objects.create(
            category=category, 
            thumbnail= solution.thumbnail, 
            title=solution.title, 
            videoUrl= solution.videoUrl
            )
        return bool
    