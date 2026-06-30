from ..Objects.solutionObj import Solution ,SolutionCategory
from ..models import SolutionsModel , SolutionsCategoryModel
from django.db import transaction 
from django.forms.models import model_to_dict
from django.db import connection


class SolutionsRepo:
    @transaction.atomic
    def create_category(self , category: SolutionCategory):
        category = SolutionsCategoryModel.objects.create(category_name=category.category_name , thumbnail=category.thumbnail)
        return True
    
    def category_exist(self , category: SolutionCategory):
        category_list = list(SolutionsCategoryModel.objects.all().values_list('category_name',flat=True))
        print(category_list)
        if category.category_name in category_list:
            return True
        return False

    def category_valid_for_update(self, category:SolutionCategory):
        if self.get_category_qs is None:
            return False
        return True
        
    def get_category_qs(self ,category: SolutionCategory)->SolutionsCategoryModel:
        try:            
            category = SolutionsCategoryModel.objects.get(category_id=category.category_id)
            return category
        except SolutionsCategoryModel.DoesNotExist:
            return None
        
    @transaction.atomic
    def create_solution(self, solution:Solution):
        # get Category
        category = self.get_category_qs(category=solution.category)
        
        solution = SolutionsModel.objects.create(
            category=category, 
            thumbnail= solution.thumbnail, 
            title=solution.title, 
            videoUrl= solution.videoUrl
            )
        return bool
    
    @transaction.atomic
    def update_solution(self , solution:Solution)->bool:
        # get Category
        category = self.get_category_qs(category=solution.category)
        
        try:
            solution_qs = SolutionsModel.objects.get(solutions_id=solution.solutions_id)
            solution_qs.category = category
            solution_qs.thumbnail = solution.thumbnail
            solution_qs.title = solution.title
            solution_qs.videoUrl = solution.videoUrl
            
            solution_qs.save()
        except SolutionsModel.DoesNotExist:
            raise ValueError(" Solution Does not exist to update")

    @transaction.atomic
    def update_category(self , category: SolutionCategory)->bool:
        try:
            category_qs = SolutionsCategoryModel.objects.get(category_id=category.category_id)
            category_qs.category_name = category.category_name
            category_qs.thumbnail = category.thumbnail
            
            category_qs.save()
        except SolutionsCategoryModel.DoesNotExist:
            raise ValueError(" Category Does not exist to update")
        
    
    def delete_category(self , category: SolutionCategory):
        delete_count , deleted_obj = SolutionsCategoryModel.objects.filter(category_id=category.category_id).delete()
        if delete_count == 0:
            raise ValueError("Category does not exists")
        return True
    
    def delete_solution(self , solution: Solution):
        delete_count , deleted_obj = SolutionsModel.objects.filter(solutions_id=solution.solutions_id).delete()
        if delete_count == 0:
            raise ValueError("Solution does not exists")
        return True
    
    
    def get_all_solutions_category(self) -> list[dict]:
        # 1. Force Django to initialize the lazy database connection
        if connection.connection is None:
            connection.ensure_connection()
            
        # 2. This is the MongoClient (the server connection)
        client = connection.connection 
        
        # 3. Get your actual database name from Django's settings
        db_name = connection.settings_dict['NAME']
        db = client[db_name]
        
        # 4. NOW target the specific collection
        collection = db['Solutions_Category_Table']
        
        # 5. Define the Aggregation Pipeline
        pipeline = [
            {
                "$lookup": {
                    "from": "Solutions_Table",      
                    "localField": "_id",            
                    "foreignField": "category_id",  
                    "as": "solutions"               
                }
            },
            {
                "$project": {
                    "_id": 0,                     
                    "category_id": 1,        
                    "category_name": 1,           
                    "thumbnail": 1,
                    "solutions.solutions_id": 1, 
                    "solutions.title": 1,
                    "solutions.thumbnail": 1,
                    "solutions.videoUrl": 1
                }
            }
        ]
        
        # 6. Execute the pipeline
        result = list(collection.aggregate(pipeline))
        
        return result
    
    def get_category(self , category:SolutionCategory)->dict | None:
        try:
            category = SolutionsCategoryModel.objects.get(category_id=category.category_id)            
            category_dict = model_to_dict(category)            
            category_dict.pop('id' ,None)
            category_dict.pop('_id', None)    
            return category_dict
        except SolutionsCategoryModel.DoesNotExist:
            return None
    
    def get_solution(self , solution:Solution)-> dict | None:
        try:
            solution = SolutionsModel.objects.get(solutions_id=solution.solutions_id)
            solution_dict = model_to_dict(solution)
            solution_dict.pop('id' ,None)
            solution_dict.pop('_id', None)    
            return solution_dict
        except SolutionsModel.DoesNotExist:
            return None
            