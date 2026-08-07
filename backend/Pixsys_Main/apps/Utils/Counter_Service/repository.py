from django.conf import settings
from django.db import transaction
from pymongo import MongoClient, ReturnDocument

from ..models import Counter


class CounterRepository:
    @staticmethod
    def get_or_create(name: str) -> tuple[Counter, bool]:
        with transaction.atomic():
            return Counter.objects.get_or_create(name=name)

    @staticmethod
    def get(name: str) -> Counter:
        with transaction.atomic():
            return Counter.objects.get(name=name)

    @staticmethod
    def save(counter: Counter) -> None:
        with transaction.atomic():
            counter.save()

    @staticmethod
    def increment(name: str) -> int:
        db_settings = settings.DATABASES["default"]
        uri = db_settings.get("HOST")
        db_name = db_settings.get("NAME")

        if not uri or not db_name:
            raise ValueError("MongoDB settings are not configured")

        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        try:
            collection = client[db_name]["Counter_table"]
            result = collection.find_one_and_update(
                {"name": name},
                {
                    "$setOnInsert": {"name": name},
                    "$inc": {"value": 1},
                },
                upsert=True,
                return_document=ReturnDocument.AFTER,
            )
            return int(result["value"])
        finally:
            client.close()