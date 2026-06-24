from ..Objects.download_factory import DownloadFactory ,DownloadType
from ..Repository.download_repository import DownloadRepository
from typing import Dict, Any

class DownloadService:
    
    def __init__(self, repo:DownloadRepository=None):
        self.repo = repo or DownloadRepository()
    
    def get_all_downloads(self):
        download_data = self.repo.get_all_downloads()
        return download_data
    
    def create_download(self, data: Dict[str, Any]) -> int:
        """
        Creates a new download record by validating through the factory
        and saving it via the Django ORM.
        """
        # 1. Extract and convert the string resource_type to the Enum
        resource_type_str = data.pop('resource_type', None)
        if not resource_type_str:
            raise ValueError("resource_type is strictly required for creation.")
        
        try:
            download_enum = DownloadType(resource_type_str)
        except ValueError:
            raise ValueError(f"Invalid resource type: {resource_type_str}")

        # 2. Pass data to the Factory to instantiate the business object.
        # This step automatically triggers all your `BaseDownload` validation rules.
        download_obj = DownloadFactory.create(
            download_type=download_enum,
            operation='create',
            **data
        )

        success = self.repo.create_download(download_obj=download_obj)
        return success

    def get_download_by_id(self, download_id: int) -> Dict[str, Any]:
        """Retrieve a single download by its download_id."""
        return self.repo.get_download_by_id(download_id=download_id)

    def update_download(self, download_id: int, data: Dict[str, Any]) -> bool:
        """Update an existing download using the Factory for validation/creation."""
        # Ensure resource_type is present for factory
        resource_type_str = data.get('resource_type')
        if not resource_type_str:
            raise ValueError("resource_type is required for update.")

        try:
            download_enum = DownloadType(resource_type_str)
            data.pop('resource_type')
        except ValueError:
            raise ValueError(f"Invalid resource type: {resource_type_str}")

        download_obj = DownloadFactory.create(
            download_type=download_enum,
            operation='update',
            download_id=download_id,
            **data
        )

        return self.repo.update_download(download_obj=download_obj)

    def delete_download(self, download_id: int) -> bool:
        """Delete a download by its download_id."""
        return self.repo.delete_download(download_id=download_id)
        
    # service.create_download(data=serializer.validated_data)
    # service.get_download_by_id(download_id=download_id)
    # service.update_download(data=serializer.validated_data)
    # service.delete_download(download_id=download_id)