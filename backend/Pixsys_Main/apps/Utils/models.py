from django.db import models

# Create your models here.
# Create your models here.
class Counter(models.Model):
    name = models.CharField(max_length=255)
    value = models.IntegerField(blank=True , default=0)

    class Meta:
        db_table = "Counter_table"