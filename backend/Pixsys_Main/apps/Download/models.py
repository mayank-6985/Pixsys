from django.db import models

from ..Products.models import ProductModel , ProductCategoryModel , ProductSubCategoryModel, TagModel
from ..Utils.Counter_Service.services import CounterServices
# Create your models here.
class DownloadModel(models.Model):
    download_id = models.BigIntegerField()
    name = models.CharField(max_length=100)
    resource_url = models.URLField()
    resource_type = models.CharField(max_length=50)
    product_id = models.ForeignKey(ProductModel , on_delete=models.CASCADE , related_name="downloads")
    tag_id = models.ForeignKey(TagModel , on_delete=models.CASCADE , related_name="downloads")
    subcategory_id = models.ForeignKey(ProductSubCategoryModel , on_delete=models.CASCADE , related_name="downloads")
    category_id = models.ForeignKey(ProductCategoryModel , on_delete=models.CASCADE , related_name="downloads")
    
    class Meta:
        db_table='Download_Table'
        # Explicit indexes (Optional here since primary_key handles it)
        indexes = [
            models.Index(fields=['download_id'], name='download_id_idx'),
        ]
    
    def __str__(self):
        return f"Downloadable - {self.name}"
    
    def save(self ,*args, **kwargs):
        if not self.download_id:
            download_id = CounterServices.get_next_sequence('download')
            self.download_id = download_id
        return super().save(*args, **kwargs)

    