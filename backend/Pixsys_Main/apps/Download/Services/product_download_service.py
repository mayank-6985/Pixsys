from ..Objects.download_factory import DownloadFactory ,DownloadType
from ..Repository.download_repository import DownloadRepository
from typing import Dict, Any
from .download_services import DownloadService

class ProductDownloadService(DownloadService):
    def __init__(self, repo:DownloadRepository=None):
        self.repo = repo or DownloadRepository()
                
    def add_downloads_for_product(self , list_of_downloads):
        
        for download in list_of_downloads:
            print(f"{download.product_id}---{download.tag_id}---{download.subcategory_id}---{download.category_id}")
            self.repo.create_download(download_obj=download)
            
    def update_downloads_for_product(self , list_of_downloads):
        for download in list_of_downloads:
            self.repo.update_download(download_obj=download)
    
    def handle_list_of_downloads(self ,list_of_download:list[dict])->list['DownloadFactory']:
        """Convert a list of download dicts into DownloadFactory objects.

        Each dict must include `resource_type` and other fields accepted by
        `DownloadFactory.create`. Invalid or missing resource_type raises
        ValueError.
        """
        download_objs: list[DownloadFactory] = []
        for item in list_of_download or []:
            resource_type_str = item.get('resource_type')
            if not resource_type_str:
                raise ValueError("resource_type is required for each download item")
            try:
                download_enum = DownloadType(resource_type_str)
                item.pop('resource_type')
            except ValueError:
                raise ValueError(f"Invalid resource type: {resource_type_str}")

            # Use factory to create a validated download object for creation
            download_obj = DownloadFactory.create(
                download_type=download_enum,
                operation='product',
                **item
            )
            download_objs.append(download_obj)

        return download_objs
    def get_product_download_data(self ,product_id)->list:
        return self.repo.get_download_for_product(product_id=product_id)