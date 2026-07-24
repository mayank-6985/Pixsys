from ..Repository.resource_repository import ResourceRepository
from ..Objects.resource_object import ResourceObject

class ResourceService:
    def __init__(self, repo=None):
        self.repo = repo or ResourceRepository()

    def handle_list_of_resources(self, resources_data: list[dict], default_operation='create') -> list[ResourceObject]:
        """Parses list of dicts into Resource Objects."""
        return [
            ResourceObject(
                resource_id=data.get('resource_id'),
                name=data.get('name'),
                description=data.get('description', ""),
                thumbnail=data.get('thumbnail'),
                resource_url=data.get('resource_url'),
                operation=data.get('operation', default_operation)
            )
            for data in resources_data
        ]

    def add_resources_for_product(self, resources: list[ResourceObject]) -> bool:
        if not resources:
            return False
        return self.repo.bulk_add_resources(resources)

    def update_resources_for_product(self, resources: list[ResourceObject]) -> bool:
        if not resources:
            return False
            
        creates = [r for r in resources if r.operation == 'create']
        updates_deletes = [r for r in resources if r.operation in ['update', 'delete']]
        
        if creates:
            self.repo.bulk_add_resources(creates)
        if updates_deletes:
            self.repo.update_resources(updates_deletes)
            
        return True
    
    
    def create_resource(self , resource_data:dict):
        
        resource = ResourceObject(
            name=resource_data.get('name'),
            description=resource_data.get('description'),
            thumbnail=resource_data.get('thumbnail'),
            resource_url=resource_data.get('resource_url'),
            product_id=resource_data.get('product_id'),
            subcategory_id=resource_data.get('subcategory_id'),
            category_id=resource_data.get('category_id'),
            tag_id=resource_data.get('tag_id'),                        
        )
        
        success = self.repo.create_resource(resource=resource)
        
        return success

    def update_resource(self ,resource_data:dict):
        resource = ResourceObject(
            resource_id=resource_data.get('resource_id'),
            name=resource_data.get('name'),
            description=resource_data.get('description'),
            thumbnail=resource_data.get('thumbnail'),
            resource_url=resource_data.get('resource_url'),
            operation='update'
        )
        
        self.repo.update_resources(resources=[resource])
        return True
    
    def delete_resource(self ,resource_data:dict):
        resource = ResourceObject(
            resource_id=resource_data.get('resource_id'),            
            operation='delete'
        )
        
        self.repo.update_resources(resources=[resource])
        return True
    
    def get_resources(self):
        return self.repo.get_resources()
    
    def get_resources_for_product(self , product_id):
        return self.repo.get_resources_for_product(product_id=product_id)