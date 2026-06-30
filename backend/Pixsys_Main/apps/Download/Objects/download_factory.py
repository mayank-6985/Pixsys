from enum import Enum
from typing import Literal, Optional
from abc import ABC, abstractmethod
from ...Utils.Utils_Service.utils_service import UtilsService

class DownloadType(Enum):
    SOFTWARE = "SOFTWARE"
    SOFTWARE_MANUAL = "SOFTWARE_MANUAL"
    CATALOG = "CATALOG"
    DIMENTION = "DIMENTION"

# 1. Create the Interface (Abstract Base Class)
class BaseDownload(ABC):
    def __init__(
        self, 
        download_id: Optional[int] = None, 
        product_id: Optional[int] = None, 
        tag_id: Optional[int] = None, 
        subcategory_id: Optional[int] = None, 
        category_id: Optional[int] = None, 
        name: Optional[str] = None, 
        resource_url: Optional[str] = None, 
        operation: Literal['create', 'update', None] = 'create'
    ):
        self.download_id = download_id
        self.product_id = product_id
        self.tag_id = tag_id
        self.subcategory_id = subcategory_id
        self.category_id = category_id
        self.name = name
        self.resource_url = resource_url
        self.operation = operation
        self.validate()            
        # Automatically assign the resource type based on the subclass
        self.resource_type = self.get_resource_type().value
        # for None operation 
        enum_type = self.get_resource_type()
        self.resource_type = enum_type.value if enum_type else None

    def validate(self) -> None:
        """Routes to the correct validation logic based on the operation type."""
        if self.operation is not None:
            try:
                UtilsService.is_valid_url_string(self.resource_url)
            except ValueError:
                raise ValueError("resource url can't be empty !")
            if not self.name :            
                raise ValueError("name can't be empty !")
        if self.operation == 'create':
            self._validate_create()
        elif self.operation == 'update':
            self._validate_update()
        elif self.operation is None:
            self._validate_none()
        
        
            
    def _validate_create(self) -> None:
        missing_fields = []
        if self.category_id is None: missing_fields.append("category_id")
        if self.tag_id is None: missing_fields.append("tag_id")
        if self.product_id is None: missing_fields.append("product_id")
            
        if missing_fields:
            raise ValueError(f"Missing required fields for creation: {', '.join(missing_fields)}.")

    def _validate_update(self) -> None:
        if self.download_id is None:
            raise ValueError("download_id is strictly required for an 'update' operation.")

    def _validate_none(self) -> None:
        if self.download_id is None:
            raise ValueError("download_id is strictly required when operation is None.")
              
    @abstractmethod
    def get_resource_type(self) -> DownloadType:
        """Subclasses must implement this to define their specific enum type."""
        pass

# 2. Create the Separate Objects
class SoftwareDownload(BaseDownload):
    def get_resource_type(self) -> DownloadType:
        return DownloadType.SOFTWARE

class SoftwareManualDownload(BaseDownload):
    def get_resource_type(self) -> DownloadType:
        return DownloadType.SOFTWARE_MANUAL

class CatalogDownload(BaseDownload):
    def get_resource_type(self) -> DownloadType:
        return DownloadType.CATALOG

class DimensionDownload(BaseDownload):
    def get_resource_type(self) -> DownloadType:
        return DownloadType.DIMENTION

class GenericDownload(BaseDownload):
    """Used for generic operations (like GET or DELETE) where the category doesn't matter."""
    def get_resource_type(self) -> Optional[DownloadType]:
        return None
# 3. Map the Enums to the Objects using a Factory
class DownloadFactory:
    """Attaches the Enums to their respective classes for easy creation."""
    
    _mapping = {
        DownloadType.SOFTWARE: SoftwareDownload,
        DownloadType.SOFTWARE_MANUAL: SoftwareManualDownload,
        DownloadType.CATALOG: CatalogDownload,
        DownloadType.DIMENTION: DimensionDownload,
    }

    @classmethod
    def create(cls, download_type: DownloadType, **kwargs) -> BaseDownload:
        # None type forwards to the Generic Download types
        if download_type is None:
            return GenericDownload(**kwargs)
        
        target_class = cls._mapping.get(download_type)
        if not target_class:
            raise ValueError(f"Unsupported download type: {download_type}")
        
        return target_class(**kwargs)