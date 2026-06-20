from django.db import models
from ..Utils.Counter_Service.services import CounterServices



class SolutionsCategoryModel(models.Model):
    category_id = models.BigIntegerField()
    category_name = models.CharField(max_length=50)
    thumbnail = models.URLField()
    
    class Meta:
        db_table = "Solutions_Category_Table"
        # Explicit indexes (Optional here since primary_key handles it)
        indexes = [
            models.Index(fields=['category_name'], name='category_name_idx'),
            models.Index(fields=['category_id'], name='category_id_idx'),
        ]
    def __str__(self):
        return f"{self.category_id}"
    
    def save(self, *args, **kwargs):
        if not self.category_id:
            category_id = CounterServices.get_next_sequence("solutions_category")
            self.category_id = category_id
        return super().save(*args, **kwargs)
    
class SolutionsModel(models.Model):
    # Use ForeignKey to allow one category to have many solutions (1:N)
    category = models.ForeignKey(SolutionsCategoryModel , on_delete=models.CASCADE , related_name="solutions")
    solutions_id = models.BigIntegerField()
    title = models.CharField(max_length=100)
    thumbnail = models.URLField()
    videoUrl = models.URLField()
    
    class Meta:
        db_table = "Solutions_Table"
        indexes = [
            models.Index(fields=['solutions_id'], name='solutions_id_idx'),
        ]
        
    def __str__(self):
        return f"{self.solutions_id}"
    
    def save(self, *args, **kwargs):
        if not self.solutions_id:
            solutions_id = CounterServices.get_next_sequence("solutions")
            self.solutions_id = solutions_id
        return super().save(*args, **kwargs)