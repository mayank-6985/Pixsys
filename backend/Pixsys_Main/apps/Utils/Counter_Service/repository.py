from ..models import Counter
from django.db import transaction

class CounterRepository:
    @staticmethod
    def get_or_create(name:str)->Counter:
        with transaction.atomic():
            counter , created = Counter.objects.get_or_create(name=name)
            return counter , created
    
    @staticmethod
    def get(name:str)->Counter:
        with transaction.atomic():
            counter = Counter.objects.get(name=counter_name)
            return counter
    
    @staticmethod
    def save(counter:Counter):
        with transaction.atomic():
            counter.save()