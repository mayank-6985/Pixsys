from ..repositories.news_repo import NewsRepository
from ..Objects.newsObj import News as DomainNews, DescriptionContent, ImageContent
from ..models import ContentItemModel


class NewsService:
    def __init__(self, repo: NewsRepository = None):
        self.repo = repo or NewsRepository()

    def create_news(self, data: dict):
        # data contains date, heading, thumbnail (optional), contents (list of {type,payload})
        # business validations
        contents = data.get("contents", [])
        # ensure allowed types
        for i, c in enumerate(contents):
            if c.get("type") not in (ContentItemModel.DESCRIPTION, ContentItemModel.IMAGE):
                raise ValueError(f"invalid content type at index {i}: {c.get('type')}")

        news = self.repo.create_news_with_contents(
            date=data["date"], heading=data["heading"], contents=contents, thumbnail=data.get("thumbnail")
        )
        # map to domain
        domain_contents = []
        for item in news.content_items.all().order_by("order"):
            if item.type == ContentItemModel.DESCRIPTION:
                domain_contents.append(DescriptionContent(text=item.payload.get("text", "")))
            else:
                domain_contents.append(ImageContent(url=item.payload.get("url"), caption=item.payload.get("caption")))

        thumbnail_url = None
        if news.thumbnail:
            try:
                thumbnail_url = news.thumbnail.url
            except Exception:
                thumbnail_url = None

        return DomainNews(date=news.date, heading=news.heading, thumbnail_url=thumbnail_url, contents=domain_contents)
