from django.db import models
from apps.Utils.Counter_Service.services import CounterServices

class ResourceModel(models.Model):
    resource_id = models.BigIntegerField(unique=True)
    product_id = models.BigIntegerField()
    tag_id = models.BigIntegerField()
    subcategory_id = models.BigIntegerField()
    category_id = models.BigIntegerField()
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    thumbnail = models.URLField(help_text="Thumbnail URL for the resource")
    file = models.URLField(help_text="File/Document URL")

    class Meta:
        db_table = "Product_Resource_Table"
        indexes = [
            models.Index(fields=["resource_id"]),
            models.Index(fields=["product_id"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.resource_id:
            # Assumes you have added "product_resource" to your CounterService sequence list
            self.resource_id = CounterServices.get_next_sequence("product_resource") 
        return super().save(*args, **kwargs)