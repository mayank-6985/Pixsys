from dataclasses import dataclass
from typing import Protocol, List, Dict, Any, Optional
import datetime

class NewsContent:
    def __init__(self, content:list[dict]):
        self.content = content
        self.validate()

    def validate(self):
        if not self.content:
            raise ValueError("Content cant be empty, Try again")
class News:
    def __init__(self, date:str , heading:str , thumbnail:str , news_content:NewsContent):
        self.date = date
        self.heading = heading
        self.thumbnail = thumbnail
        self.news_content = news_content
        self.validate()
    
    def validate_date(self):
        # Accepts date strings in various common formats and converts to datetime.date
        # If already a date/datetime object, convert to date
        if isinstance(self.date, datetime.date):
            # leave as-is if it's already a date (but not datetime)
            if isinstance(self.date, datetime.datetime):
                self.date = self.date.date()
            return

        if not isinstance(self.date, str):
            raise ValueError(f"Unsupported date type: {type(self.date)}")

        date_str = self.date.strip()
        # Common formats to try (year-first and day-first, with - or / or . separators)
        formats = [
            "%Y-%m-%d",
            "%d-%m-%Y",
            "%Y/%m/%d",
            "%d/%m/%Y",
            "%Y.%m.%d",
            "%d.%m.%Y",
            "%Y %m %d",
            "%d %m %Y",
        ]

        parsed = None
        for fmt in formats:
            try:
                parsed_dt = datetime.datetime.strptime(date_str, fmt)
                parsed = parsed_dt.date()
                break
            except ValueError:
                continue

        # Try ISO parse fallback
        if parsed is None:
            try:
                parsed_dt = datetime.date.fromisoformat(date_str)
                parsed = parsed_dt
            except Exception:
                pass

        if parsed is None:
            raise ValueError(f"Unrecognized date format: '{self.date}'")

        self.date = parsed
        
    def validate_heading(self):
        if not self.heading or self.heading is None:
            raise ValueError("Heading Cant be empty! Try again")
    
    def validate_thumbnail(self):
        if not self.thumbnail or self.thumbnail is None:
            raise ValueError("Thumbnail not found! Try again")
    
    def validate(self):
        self.validate_date()
        self.validate_heading()
        self.validate_thumbnail()
    