from ..Objects.interface import ISearchService
from ..Objects.objects import ( 
                               ProductSearchService , 
                               SolutionSearchService , 
                               NewsSearchServices , 
                               DownloadSearchServices,
                               )
class _SearchManager:
    def __init__(self, services:list[ISearchService]):
        self.services = services
    
    def search(self , keyword:str):
        aggregated_results = {}
        
        # Loop through each service and trigger its uniform .search() method
        for service in self.services:
            # We use .update() to merge all the returned dicts into one master dict
            aggregated_results.update(service.search(keyword))
            
        return aggregated_results
    


class SearchService:
    def __init__(self):
        self.product_service = ProductSearchService()
        self.news_service = NewsSearchServices()
        self.solution_service = SolutionSearchService()
        self.download_service = DownloadSearchServices()
                
    def search_product(self , keyword:str):
        search_manager = _SearchManager(services = [
            self.product_service
        ])
        
        search_result = search_manager.search(keyword=keyword)
        
        return search_result

    def search_globally(self , keyword:str):
        search_manager = _SearchManager(services = [
            self.product_service,
            self.news_service,
            self.download_service,
            self.solution_service
        ])
        
        search_result = search_manager.search(keyword=keyword)
        
        return search_result

        