from .models import NewsModel, ContentItemModel
from .Objects.newsObj import News, DescriptionContent, ImageContent


def news_from_model(n: NewsModel) -> News:
    contents = []
    for item in n.content_items.all().order_by("order"):
        if item.type == ContentItemModel.DESCRIPTION:
            text = item.payload.get("text", "")
            contents.append(DescriptionContent(text=text))
        elif item.type == ContentItemModel.IMAGE:
            url = item.payload.get("url")
            caption = item.payload.get("caption")
            contents.append(ImageContent(url=url, caption=caption))
    thumbnail = None
    if n.thumbnail:
        try:
            thumbnail = n.thumbnail.url
        except Exception:
            thumbnail = None

    return News(date=n.date, heading=n.heading, thumbnail_url=thumbnail, contents=contents)
