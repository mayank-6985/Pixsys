from django.db import transaction
from ..models import NewsModel, ContentItemModel


class NewsRepository:
    def create_news(self, date, heading, thumbnail=None):
        news = NewsModel.objects.create(date=date, heading=heading)
        if thumbnail:
            news.thumbnail = thumbnail
            news.save()
        return news

    def add_content_items(self, news, contents):
        objs = []
        for idx, item in enumerate(contents):
            obj = ContentItemModel.objects.create(
                news=news,
                order=idx,
                type=item["type"],
                payload=item["payload"],
            )
            objs.append(obj)
        return objs

    @transaction.atomic
    def create_news_with_contents(self, date, heading, contents, thumbnail=None):
        news = self.create_news(date=date, heading=heading, thumbnail=thumbnail)
        self.add_content_items(news, contents)
        return news
