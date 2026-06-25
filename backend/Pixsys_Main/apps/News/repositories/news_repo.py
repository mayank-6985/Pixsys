from django.db import transaction
from ..models import NewsModel, NewsContent
from ..Objects.newsObj import News
from datetime import datetime
from django.forms.models import model_to_dict
from typing import Any

class NewsRepository:
    def insert_news(self, date:datetime, heading:str, thumbnail:str):
        # create the news 
        news = NewsModel.objects.create(date=date, heading=heading, thumbnail=thumbnail)
        return news

    def insert_news_content(self, news:NewsModel, contents:list[dict]):
        news_content= NewsContent.objects.create(news=news , news_content=contents )
        return news_content

    @transaction.atomic
    def create_news(self , news_obj:News)->bool:
        news = self.insert_news(date=news_obj.date , heading=news_obj.heading, thumbnail=news_obj.thumbnail)
        content = self.insert_news_content(news=news , contents=news_obj.news_content.content)
        return True
    
    
    def delete_news(self , news_id:int)->bool:
        delete_count , deleted_obj = NewsModel.objects.filter(news_id=news_id).delete()
        if delete_count == 0:
            raise ValueError("News does not exists")
        return True
    
    
    def _update_news(self, news_obj:News , news:NewsModel):
        news.date = news_obj.date
        news.heading = news_obj.heading
        news.thumbnail = news_obj.thumbnail
        news.save()
    
    def _update_news_content(self , news_content_obj:NewsContent , content:NewsContent):
        content.news_content = news_content_obj.content
        content.save()
        
        
    @transaction.atomic()
    def update_news_with_content(self, news_id , news_obj:News):
        news = NewsModel.objects.select_related('content').get(news_id=news_id)
        self._update_news(news_obj=news_obj , news=news)
        self._update_news_content(news_content_obj=news_obj.news_content , content=news.content)
        return True
    
    def get_all_news_without_content(self)->list[dict]:
        news_data = list(NewsModel.objects.all().values())
        # 2. Clean up the dictionaries in Python
        for item in news_data:
            item.pop('id', None)
            item.pop('_id', None)            
        return news_data
        
    def _get_news(self , news_id:int)->NewsModel | None:
        try:
            news = NewsModel.objects.select_related('content').get(news_id=news_id)
            return news
        except NewsModel.DoesNotExist:
            return None

    def get_news_with_content(self, news_id: int) -> dict | None:
        news_instance = self._get_news(news_id=news_id)
        # Safe guard against NoneType crash
        if not news_instance:
            return None
        
        # Convert the core News fields to a dictionary
        news_data = model_to_dict(news_instance)
        
        news_data.pop('id', None)
        # Manually inject the JSON field because model_to_dict skips relations
        try:
            news_data['news_content'] = news_instance.content.news_content
        except NewsContent.DoesNotExist:
            news_data['news_content'] = []  # Fallback just in case content row is missing

        # Return type is a single dict, matching the new type hint
        return news_data
                
            