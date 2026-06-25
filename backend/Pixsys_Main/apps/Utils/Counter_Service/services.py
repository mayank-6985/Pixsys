from .repository import CounterRepository as CountereRepo

class CounterServices:
    @staticmethod
    def get_next_sequence(counter_name: str) -> int:
        counter, created = CountereRepo.get_or_create(name=counter_name)
        counter.value += 1
        CountereRepo.save(counter=counter)
        return counter.value
    
    @staticmethod
    def get_previous_sequence(counter_name: str) -> int:
        counter = CountereRepo.get(name=counter_name)
        counter.value -= 1
        CountereRepo.save(counter=counter)
        return counter.value