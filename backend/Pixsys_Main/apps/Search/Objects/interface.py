from abc import ABC, abstractmethod

class ISearchService(ABC):
    @abstractmethod
    def search(self, keyword: str) -> dict:
        """
        Must return a dictionary containing the search results.
        Example: {'products': [...]}
        """
        pass