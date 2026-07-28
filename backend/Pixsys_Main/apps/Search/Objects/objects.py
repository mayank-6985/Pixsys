import re
from django.db import connection
from ...Products.models import ProductModel
from ...News.models import NewsModel
from ...Solutions.models import SolutionsModel
from ...Download.models import DownloadModel
from ...Resources.models import ResourceModel
from .interface import ISearchService

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

class ProductSearchService(ISearchService):
    def __init__(self, connection:MongoConnection=None):
        self.connection = connection or MongoConnection()
        self.db = self.connection.db
       
    def search(self , keyword:str):
        
        """
        Searches for products by keyword in the name using a MongoDB aggregation pipeline.
        Returns a dictionary with a 'products' list, excluding IDs and tag data.
        """
        # 1. Escape the keyword to safely handle regex special characters
        safe_keyword = re.escape(keyword)
        
        # 2. Construct the Aggregation Pipeline
        pipeline = [
            {
                # Step A: Filter by keyword (case-insensitive partial match)
                "$match": {
                    "name": {"$regex": safe_keyword, "$options": "i"}
                }
            },
            {
                # Step B: Shape the data by excluding unwanted fields
                "$project": {
                    "_id": 0,       # Strip MongoDB's internal ObjectId
                    "id": 0,        # Strip Django's default AutoField ID (if present)
                    "tag_id": 0,    # Strip the ForeignKey (Django stores this as field_id)
                    "tag": 0        # Strip the tag object itself (if embedded)
                }
            },
            {
                # Step C: Optional sorting (e.g., alphabetically or by newest)
                "$sort": {"name": 1}
            }
            # Note: You can add {"$limit": 50} here if you want to cap the result size
        ]
        
        # 3. Access the PyMongo database instance via Django's connection
        # 'Product_Table' is explicitly targeted based on your model's db_table Meta class        
        collection = self.db[ProductModel._meta.db_table]
        
        # 4. Execute the pipeline
        cursor = collection.aggregate(pipeline)
        
        # 5. Format and return
        return {
            "products": list(cursor)
        }

class SolutionSearchService(ISearchService):
    def __init__(self, connection:MongoConnection=None):
        self.connection = connection or MongoConnection()
        self.db = self.connection.db
    
    
    def search(self ,keyword: str) -> dict:
        """
        Searches for solutions by keyword in the title using a MongoDB aggregation pipeline.
        Returns a dictionary with a 'solutions' list, excluding internal IDs and the category.
        """
        # 1. Escape the keyword to safely handle regex special characters
        safe_keyword = re.escape(keyword)
        
        # 2. Construct the Aggregation Pipeline
        pipeline = [
            {
                # Step A: Filter by keyword (case-insensitive partial match on 'title')
                "$match": {
                    "title": {"$regex": safe_keyword, "$options": "i"}
                }
            },
            {
                # Step B: Shape the data by excluding unwanted fields
                "$project": {
                    "_id": 0,           # Strip MongoDB's internal ObjectId
                    "id": 0,            # Strip Django's default AutoField ID (if present)
                    "category_id": 0,   # Strip the ForeignKey (Django DB column name)
                    "category": 0       # Strip the category object (if embedded)
                }
            },
            {
                # Step C: Optional sorting (alphabetically by title)
                "$sort": {"title": 1}
            }
        ]
        
        # 3. Access the PyMongo database instance via Django's connection
        # 'Solutions_Table' is explicitly targeted based on your model's db_table Meta class       
        collection = self.db[SolutionsModel._meta.db_table]
        
        # 4. Execute the pipeline
        cursor = collection.aggregate(pipeline)
        
        # 5. Format and return
        return {
            "solutions": list(cursor)
        }

class NewsSearchServices(ISearchService):
    def __init__(self, connection:MongoConnection=None):
        self.connection = connection or MongoConnection()
        self.db = self.connection.db
        
    def search(self ,keyword: str) -> dict:
        """
        Searches for news entries by keyword in the heading using a MongoDB aggregation pipeline.
        Returns a dictionary with a 'news' list, excluding internal IDs.
        """
        # 1. Escape the keyword to prevent regex injection
        safe_keyword = re.escape(keyword)
        
        # 2. Construct the Aggregation Pipeline
        pipeline = [
            {
                # Step A: Filter by keyword (case-insensitive partial match on 'heading')
                "$match": {
                    "heading": {"$regex": safe_keyword, "$options": "i"}
                }
            },
            {
                # Step B: Shape the data by excluding unwanted database IDs
                # (Note: NewsModel doesn't have a 'description' field to exclude, 
                # but if it did, you would add "description": 0 here)
                "$project": {
                    "_id": 0,  # Strip MongoDB's internal ObjectId
                    "id": 0    # Strip Django's default AutoField ID (if present)
                }
            },
            {
                # Step C: Sort by date descending (newest news first)
                "$sort": {"date": -1}
            }
        ]
        
        # 3. Access the PyMongo database instance via Django's connection
        # 'News_Table' is explicitly targeted based on your model's db_table Meta class         
        collection = self.db[NewsModel._meta.db_table]
        
        # 4. Execute the pipeline
        cursor = collection.aggregate(pipeline)
        
        # 5. Format and return
        return {
            "news": list(cursor)
        }

class ResourceSearchServices(ISearchService):
    def __init__(self, connection:MongoConnection=None):
        self.connection = connection or MongoConnection()
        self.db = self.connection.db
        
    def search(self ,keyword: str) -> dict:
        """
        Searches for resource entries by keyword in the heading using a MongoDB aggregation pipeline.
        Returns a dictionary with a 'resource' list, excluding internal IDs.
        """
        # 1. Escape the keyword to prevent regex injection
        safe_keyword = re.escape(keyword)
        
        # 2. Construct the Aggregation Pipeline
        pipeline = [
            {
                # Step A: Filter by keyword (case-insensitive partial match on 'heading')
                "$match": {
                    "name": {"$regex": safe_keyword, "$options": "i"},                
                }
            },
            {
                # Step B: Shape the data by excluding unwanted database IDs
                # (Note: NewsModel doesn't have a 'description' field to exclude, 
                # but if it did, you would add "description": 0 here)
                "$project": {
                    "_id": 0,  # Strip MongoDB's internal ObjectId
                    "id": 0    # Strip Django's default AutoField ID (if present)
                }
            },            
        ]
        
        # 3. Access the PyMongo database instance via Django's connection
        # 'News_Table' is explicitly targeted based on your model's db_table Meta class         
        collection = self.db[ResourceModel._meta.db_table]
        
        # 4. Execute the pipeline
        cursor = collection.aggregate(pipeline)
        
        # 5. Format and return
        if cursor:
            return {
            "RESOURCES": list(cursor)
            }
        else :
            return {}
class DownloadSearchServices(ISearchService):
    def __init__(self, connection:MongoConnection=None):
        self.connection = connection or MongoConnection()
        self.db = self.connection.db
        
    
    def search(self ,keyword: str) -> dict:
        """
        Searches for downloads by keyword in the name using a MongoDB aggregation pipeline.
        Groups the results by resource_type.
        """
        # 1. Escape the keyword to safely handle regex special characters
        safe_keyword = re.escape(keyword)
        
        # 2. Construct the Aggregation Pipeline
        pipeline = [
            {
                # Step A: Filter by keyword (case-insensitive partial match on 'name')
                "$match": {
                    "name": {"$regex": safe_keyword, "$options": "i"}
                }
            },
            {
                # Step B: Shape the data by excluding unwanted fields
                "$project": {
                    "_id": 0,  # Strip MongoDB's internal ObjectId
                    "id": 0    # Strip Django's default AutoField ID (if present)
                }
            },
            {
                # Step C: Group the results by 'resource_type'
                "$group": {
                    "_id": "$resource_type",
                    "downloads": {"$push": "$$ROOT"}
                }
            }
        ]
        
        # 3. Access the PyMongo database instance via Django's connection    
        collection = self.db[DownloadModel._meta.db_table]
        
        # 4. Execute the pipeline
        cursor = collection.aggregate(pipeline)
        
        # 5. Format the response to guarantee all expected keys exist
        # We initialize the dictionary with empty lists for the requested format.
        response_data = {
            "SOFTWARE": [],
            "SOFTWARE_MANUAL": [],
            "CATALOG": [],
            "DIMENTION": [] 
        }
        
        # 6. Populate the dictionary with the aggregated MongoDB results
        for doc in cursor:
            resource_type = doc.get("_id")
            downloads = doc.get("downloads", [])
            
            # If the resource_type exists in our template, populate it.
            # If a new/unexpected resource_type exists in the DB, this safely adds it.
            if resource_type:
                response_data[resource_type] = downloads

        resources = ResourceSearchServices().search(keyword=keyword)
        
        if resources :
            response_data['RESOURCES'] = resources['RESOURCES']
        
        return {
            "downloads":[response_data]
        }

