from dataclasses import dataclass
from typing import Protocol, List, Dict, Any, Optional
import datetime


class ContentItem(Protocol):
    def to_dict(self) -> Dict[str, Any]:
        ...


@dataclass
class DescriptionContent:
    text: str

    def to_dict(self) -> Dict[str, Any]:
        return {"type": "description", "text": self.text}


@dataclass
class ImageContent:
    url: str
    caption: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {"type": "image", "url": self.url, "caption": self.caption}


@dataclass
class News:
    date: datetime.date
    heading: str
    thumbnail_url: Optional[str]
    contents: List[ContentItem]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "date": self.date.isoformat(),
            "heading": self.heading,
            "thumbnail": self.thumbnail_url,
            "contents": [c.to_dict() for c in self.contents],
        }