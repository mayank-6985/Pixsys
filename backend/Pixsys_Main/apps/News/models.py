from django.db import models
from ..Utils.Counter_Service.services import CounterServices

class NewsModel(models.Model):
    news_id = models.BigIntegerField()
    date = models.DateField()
    heading = models.CharField(max_length=500)
    thumbnail = models.URLField()

    class Meta:
        db_table='News_Table'
    
    def __str__(self):
        return f"{self.date} - {self.heading}"
    
    def save(self ,*args, **kwargs):
        if not self.news_id:
            news_id = CounterServices.get_next_sequence('news')
            self.news_id = news_id
        return super().save(*args, **kwargs)


class NewsContent(models.Model):
    DESCRIPTION = 'description'
    IMAGE = 'image'
    news = models.OneToOneField(NewsModel  ,  on_delete=models.CASCADE , related_name='content')
    
    # this field holds the news content order
    news_content = models.JSONField(default=list)
    class Meta:
        db_table="News_Content_Table"

    def __str__(self):
        return f"for the news {self.news.news_id}"

