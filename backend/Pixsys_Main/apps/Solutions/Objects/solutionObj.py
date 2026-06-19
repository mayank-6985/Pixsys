from ...Utils.Utils_Service.utils_service import UtilsService

class SolutionCategory:
    def __init__(self , category_name , thumbnail=None, category_id=None):
        self.category_name = category_name
        self.thumbnail = thumbnail
        self.category_id = category_id
        self.validate()
    
    def validate_category_name(self):
          # Assuming 'category_name' is passed into the method
        if isinstance(self.category_name, str):
            # Strip whitespace and uppercase it in one clean step
            cleaned_name = self.category_name.strip().upper()
            
            if not cleaned_name:
                raise ValueError("Category name cannot be empty")
                
            self.category_name = cleaned_name
        else:
            raise TypeError("Category name must be a string") 
    
    def validate_thumbnail(self):
        if self.thumbnail is not None:
            UtilsService.is_valid_url_string(self.thumbnail)
        
    def validate(self):
        """
        Handle the validation of the data.
        """
        self.validate_category_name()
        self.validate_thumbnail()
        


class Solution:
    def __init__(self , category: SolutionCategory , title:str , thumbnail:str , videoUrl:str):
        self.category = category
        self.title = title
        self.thumbnail = thumbnail
        self.videoUrl = videoUrl
        self.validate()
        
    def validate_thumbnail(self):
        if self.thumbnail is not None:
            UtilsService.is_valid_url_string(self.thumbnail)
    
    def validate_category(self):
        if not isinstance(self.category , SolutionCategory):
            raise AttributeError("Not a valid category instance")
        
    def validate_title(self):
        if not self.title.strip():
            raise ValueError(" Solution title can not be empty")
    
    def validate(self):
        self.validate_thumbnail()
        self.validate_category()
        self.validate_title()
        
        