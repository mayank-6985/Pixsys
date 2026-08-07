from .repository import CounterRepository as CountereRepo
from django.db import transaction


class CounterServices:
    @staticmethod
    def get_next_sequence(counter_name: str) -> int:
        with transaction.atomic():
            return CountereRepo.increment(counter_name)

    @staticmethod
    def get_previous_sequence(counter_name: str) -> int:
        with transaction.atomic():
            counter = CountereRepo.get(name=counter_name)
            counter.value -= 1
            CountereRepo.save(counter=counter)
            return counter.value