from ..repositories.news_repo import NewsRepository
from ..Objects.newsObj import News ,NewsContent

class NewsService:
    def __init__(self, repo: NewsRepository = None):
        self.repo = repo or NewsRepository()
    
    def create_new_obj(self , data:dict)->News:
        """ Creates the News Object , using News"""
        news_content_obj = NewsContent(content=data['content'])
        news_obj  = News(date=data['date'] , heading=data['heading'] , thumbnail=data['thumbnail'] ,news_content=news_content_obj)
        return news_obj
    
    def create_news(self, data:dict):
        """ Handles the fresh news creation Process"""
        
        news_obj = self.create_new_obj(data=data)
        result = self.repo.create_news(news_obj=news_obj)
        return result
    
    def delete_news(self , news_id:int):
        """ Handles the news Deletion process"""
        success = self.repo.delete_news(news_id=news_id)
        return success
    
 
    def update_news(self , news_id:int, data:dict):
        """ Handles the news  Updation Process """
        
        news_obj = self.create_new_obj(data=data)
        result = self.repo.update_news_with_content(news_id=news_id, news_obj=news_obj)
        return result

    def get_all_news(self) -> list[dict]:
        news_list = self.repo.get_all_news_without_content()
        return news_list
    
    def get_news_with_content(self , news_id):
        """ Handles getting complete information for the specific news_id """
        news = self.repo.get_news_with_content(news_id=news_id)
        if news is None:
            raise ValueError("News does not exist")
        return news