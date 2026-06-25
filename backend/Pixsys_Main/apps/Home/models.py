from django.db import models

class SliderModel(models.Model):
    slideImages = models.JSONField()
    image_id = models.BigIntegerField(default=1)
        

    class Meta:
        db_table='Slider_Table'
        # Explicit indexes (Optional here since primary_key handles it)
        indexes = [
            models.Index(fields=['image_id'], name='image_id_idx'),
        ]
    
    def __str__(self):
        return f"Home Page Slider"
    
