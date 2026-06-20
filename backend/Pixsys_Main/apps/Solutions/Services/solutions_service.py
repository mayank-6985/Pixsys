from ..Objects.solutionObj import SolutionCategory , Solution
from ..repositories.solutions_repo import SolutionsRepo

class SolutionsService:
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
        category = SolutionCategory(category_id=data['category_id'] , operation='update')
        if self.repo.category_exist(category=category):
            raise ValueError("Category dont exist! try different category") 
        # create Solution object
        solution = Solution(category=category , title=data['title'] ,thumbnail=data['thumbnail'] ,videoUrl=data['videoUrl'])
        # insert solution in database
        result = self.repo.create_solution(solution=solution)
        return result    

    def update_solution(self, data):
         # creates the Category object
        category = SolutionCategory(category_id=data['category_id'] , operation='update')
        if not self.repo.category_valid_for_update(category=category):
            raise ValueError(f"Category does not exist for {category.category_id}")
        # create Solution object
        solution = Solution(solutions_id=data['solutions_id'],category=category , title=data['title'] ,thumbnail=data['thumbnail'] ,videoUrl=data['videoUrl'])
        # insert solution in database
        result = self.repo.update_solution(solution=solution)
        return result    

    def update_category(self, data):
        category = SolutionCategory(category_name=data['category_name'] , thumbnail=data['thumbnail'] ,category_id=data['category_id'])
        if not self.repo.category_valid_for_update(category=category):
            raise ValueError(f"Category does not already exist for {category.category_id}")
        # pass the created instance to the repository (not the class)
        success = self.repo.update_category(category=category)
        return success
    
    def delete_category(self , data):
        category = SolutionCategory(category_id=data['category_id'] ,operation='update')
        success = self.repo.delete_category(category=category)
        return success
    
    def delete_solution(self , data):
        solution = Solution(solutions_id=data['solutions_id'] , operation='update')
        success = self.repo.delete_solution(solution=solution)
        return success
    
    def get_solution(self , data):
        solution = Solution(solutions_id=data['solutions_id'] , operation='update')
        solution_dict = self.repo.get_solution(solution=solution)
        if solution_dict is None:
            raise ValueError(f"No Solution Found for id {data['solutions_id']}")
        return solution_dict        
    
    def get_category(self , data):
        category = SolutionCategory(category_id=data['category_id'] ,operation='update')        
        category_dict = self.repo.get_category(category=category)
        if category is None:
            raise ValueError(f"No category Found for id {data['category_id']}")
        return category_dict
    
    def get_category_with_solutions(self):
        category_solution = self.repo.get_all_solutions_category()
        return category_solution

    
    