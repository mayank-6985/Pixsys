from typing import Literal, Optional
from apps.Utils.Utils_Service.utils_service import UtilsService

class ResourceObject:
    def __init__(
        self,
        name: Optional[str] = None,
        description: Optional[str] = "",
        thumbnail: Optional[str] = None,
        file: Optional[str] = None,
        resource_id: Optional[int] = None,
        product_id: Optional[int] = None,
        tag_id: Optional[int] = None,
        subcategory_id: Optional[int] = None,
        category_id: Optional[int] = None,
        operation: Literal['create', 'update', 'delete', None] = 'create'
    ):
        # download section
        self.resource_id = resource_id
        self.product_id = product_id
        self.tag_id = tag_id
        self.subcategory_id = subcategory_id
        self.category_id = category_id
        
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.file = file
        self.operation = operation

    def validate(self) -> None:
        if self.operation is not None:
            if not self.name:
                raise ValueError("Resource name cannot be empty.")
            try:
                UtilsService.is_valid_url_string(self.thumbnail)
                UtilsService.is_valid_url_string(self.file)
            except ValueError:
                raise ValueError("Valid URLs are required for both thumbnail and file.")
        
        if self.operation == 'create':
            missing_fields = []
            if self.category_id is None: missing_fields.append("category_id")
            if self.tag_id is None: missing_fields.append("tag_id")
            if self.product_id is None: missing_fields.append("product_id")
            
            if missing_fields:
                raise ValueError(f"Missing required fields for creation: {', '.join(missing_fields)}.")
        
        elif self.operation in ['update', 'delete', None]:
            if self.resource_id is None:
                raise ValueError("resource_id is strictly required for update, delete, or fetch operations.")