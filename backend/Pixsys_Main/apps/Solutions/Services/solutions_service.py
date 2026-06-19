from ..Objects.solutionObj import SolutionCategory , Solution
from ..repositories.solutions_repo import SolutionsRepo

class SolutionCategoryService:
    def __init__(self, repo: SolutionsRepo = None):        
        self.repo = repo or SolutionsRepo()
        
    def create_category(self , data):
        category = SolutionCategory(category_name=data['category_name'] , thumbnail=data['thumbnail'])
        if self.repo.category_exist(category=category):
            raise ValueError("Category already exist! try different name")
        # pass the created instance to the repository (not the class)
        success = self.repo.create_category(category=category)
        return success
    
    def create_solution(self, data):
        # creates the Category object
        category = SolutionCategory(category_name=data['category_name'])
        # returns the model instance
        category_qs = self.repo.get_category(category=category)
        # update the category id
        if category_qs is None:
            raise ValueError(" Category Does not exist to add solution")
        category.category_id = category_qs.category_id
        # create Solution object
        solution = Solution(category=category , title=data['title'] ,thumbnail=data['thumbnail'] ,videoUrl=data['videoUrl'])
        # insert solution in database
        result = self.repo.create_solution(solution=solution)
        return result
        
    