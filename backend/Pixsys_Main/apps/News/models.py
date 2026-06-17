from django.db import models


class NewsModel(models.Model):
    date = models.DateField()
    heading = models.CharField(max_length=255)
    thumbnail = models.ImageField(upload_to="news/thumbnails/", null=True, blank=True)

    def __str__(self):
        return f"{self.date} - {self.heading}"


class ContentItemModel(models.Model):
    DESCRIPTION = "description"
    IMAGE = "image"
    NEWS_CONTENT_TYPES = ((DESCRIPTION, "description"), (IMAGE, "image"))

    news = models.ForeignKey(NewsModel, related_name="content_items", on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    type = models.CharField(max_length=32, choices=NEWS_CONTENT_TYPES)
    payload = models.JSONField()

    class Meta:
        ordering = ["order"]
        unique_together = (("news", "order"),)

    def __str__(self):
        return f"{self.news_id} - {self.type} ({self.order})"

