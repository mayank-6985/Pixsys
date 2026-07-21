from django.db import connection
from django.db import transaction
from ..models import ResourceModel
from ..Objects.resource_object import ResourceObject

class MongoConnection:
    def __init__(self):
        if connection.connection is None:
            connection.ensure_connection()
            
        client = connection.connection 
        db_name = connection.settings_dict['NAME']
        self.db = client[db_name]
        
    @property
    def database(self):
        return self.db
    
class ResourceRepository:
    def __init__(self):
        self.connection = MongoConnection()
        self.db = self.connection.db
        
    @transaction.atomic
    def bulk_add_resources(self, resources: list[ResourceObject]) -> bool:
        resource_models = [
            ResourceModel(
                product_id=res.product_id,
                tag_id=res.tag_id,
                subcategory_id=res.subcategory_id,
                category_id=res.category_id,
                name=res.name,
                description=res.description,
                thumbnail=res.thumbnail,
                resource_url=res.resource_url
            )
            for res in resources if res.operation == 'create'
        ]
        
        # Iterating `save()` to trigger `CounterServices` ID generator util in the model logic
        for model in resource_models:
            model.save()
            
        return True

    @transaction.atomic
    def update_resources(self, resources: list[ResourceObject]) -> bool:
        for res in resources:
            if res.operation == 'update':
                ResourceModel.objects.filter(resource_id=res.resource_id).update(
                    name=res.name,
                    description=res.description,
                    thumbnail=res.thumbnail,
                    resource_url=res.resource_url
                )
            elif res.operation == 'delete':
                ResourceModel.objects.filter(resource_id=res.resource_id).delete()
        return True
    
    def create_resource(self , resource:ResourceObject):
        
        resource = ResourceModel(
            product_id=resource.product_id,
            tag_id=resource.tag_id,
            subcategory_id=resource.subcategory_id,
            category_id=resource.category_id,
            name=resource.name,
            description=resource.description,
            thumbnail=resource.thumbnail,
            resource_url=resource.resource_url,
        )        
        resource.save()
        
        return True
        
    def get_resources(self):
        pipeline = [
            {
                "$match":{}
            },
            {
                "$project":{
                    "_id":0,
                    "product_id":1,
                    "tag_id":1,
                    "subcategory_id":1,
                    "resource_id":1,
                    "category_id":1,
                    "resource_type":"RESOURCES",                    
                    "name":1,
                    "description":1,
                    "thumbnail":1,
                    "resource_url":1,
                }
            }
        ]
        
        resource_table = self.db[ResourceModel._meta.db_table]
        
        cursor = resource_table.aggregate(pipeline)
        
        if cursor:
            return list(cursor)
        else:
            []
        
    def get_resources_for_product(self, product_id):
        pipeline = [
            {
                "$match":{
                    "product_id":product_id,
                }
            },
            {
                "$project":{
                    "_id":0,
                    "product_id":1,
                    "tag_id":1,
                    "subcategory_id":1,
                    "category_id":1,
                    "resource_id":1,
                    "name":1,                    
                    "description":1,
                    "resource_type":"RESOURCES",
                    "thumbnail":1,
                    "resource_url":1,
                }
            }
        ]
        
        resource_table = self.db[ResourceModel._meta.db_table]
        
        cursor = resource_table.aggregate(pipeline)
        
        if cursor:             
            return list(cursor)
        else:
            []