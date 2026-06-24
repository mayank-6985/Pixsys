import logging
import traceback
from django.db import connection
from ..models import *
from typing import Dict,List,Any
from ..Objects.download_factory import DownloadType, DownloadFactory
from ...Products.repositories.products_repository import ProductRepository
from django.db.models import Prefetch
from itertools import groupby
logger = logging.getLogger(__name__)

class DownloadRepository:
    def get_all_downloads(self):
        if connection.connection is None:
            connection.ensure_connection()
            
        client = connection.connection 
        db_name = connection.settings_dict['NAME']
        db = client[db_name]

        collection = db[DownloadModel._meta.db_table]
        pipeline = [
            # Step 1: Group by resource_type, collecting all documents per type
            {
                "$group": {
                    "_id": "$resource_type",
                    "items": {
                        "$push": {
                            "download_id": "$download_id",
                            "name": "$name",
                            "resource_url": "$resource_url",
                            "resource_type": "$resource_type",
                            "product_id": "$product_id",
                            "tag_id": "$tag_id",
                            "subcategory_id": "$subcategory_id",
                            "category_id": "$category_id",
                        }
                    }
                }
            },
            # Step 2: Reshape into a list of {k, v} pairs for arrayToObject
            {
                "$group": {
                    "_id": None,
                    "grouped": {
                        "$push": {
                            "k": "$_id",
                            "v": "$items"
                        }
                    }
                }
            },
            # Step 3: Convert to a single object keyed by resource_type
            {
                "$replaceRoot": {
                    "newRoot": { "$arrayToObject": "$grouped" }
                }
            }
        ]

        result = list(collection.aggregate(pipeline))
        return result[0] if result else {}
    
    def create_download(self , download_obj:DownloadFactory):              
        new_download_record = DownloadModel(
            name=download_obj.name,
            resource_url=download_obj.resource_url,
            resource_type=download_obj.resource_type,
            product_id=download_obj.product_id,
            tag_id=download_obj.tag_id,
            subcategory_id=download_obj.subcategory_id,
            category_id=download_obj.category_id,
        )
        
        # 4. Save to the database (triggers your custom save() method for counter logic)
        new_download_record.save()
        
        return True

    def get_download_by_id(self, download_id: int) -> Dict[str, Any]:
        try:
            obj = DownloadModel.objects.filter(download_id=download_id).values(
                'download_id','name','resource_url','resource_type',
                'product_id','tag_id','subcategory_id','category_id'
            ).first()
            return obj
        except Exception:
            logger.error(traceback.format_exc())
            return {}

    def _get_download_model(self, download_id: int) -> DownloadModel:
        """Internal helper: fetch DownloadModel instance by download_id.

        Raises ValueError if not found to signal callers (update/delete).
        """
        try:
            return DownloadModel.objects.get(download_id=download_id)
        except DownloadModel.DoesNotExist:
            raise ValueError(f"Download with id {download_id} does not exist")
        except Exception:
            logger.error(traceback.format_exc())
            raise

    def update_download(self, download_obj: DownloadFactory) -> bool:
        # Fetch existing model instance (raises ValueError if missing)
        instance = self._get_download_model(download_obj.download_id)
        try:
            # Conditionally update fields only when factory provides non-None values
            if getattr(download_obj, 'name', None) is not None:
                instance.name = download_obj.name
            if getattr(download_obj, 'resource_url', None) is not None:
                instance.resource_url = download_obj.resource_url
            if getattr(download_obj, 'resource_type', None) is not None:
                instance.resource_type = download_obj.resource_type
            # if getattr(download_obj, 'product_id', None) is not None:
            #     instance.product_id = download_obj.product_id
            # if getattr(download_obj, 'tag_id', None) is not None:
            #     instance.tag_id = download_obj.tag_id
            # if getattr(download_obj, 'subcategory_id', None) is not None:
            #     instance.subcategory_id = download_obj.subcategory_id
            # if getattr(download_obj, 'category_id', None) is not None:
            #     instance.category_id = download_obj.category_id

            instance.save()
            return True
        except Exception:
            logger.error(traceback.format_exc())
            return False

    def delete_download(self, download_id: int) -> bool:
        # Ensure object exists (raises ValueError if missing)
        self._get_download_model(download_id)
        try:
            deleted, _ = DownloadModel.objects.filter(download_id=download_id).delete()
            return deleted > 0
        except Exception:
            logger.error(traceback.format_exc())
            return False


    # ==================product section specific
    def get_download_for_product(self , product_id):
        if connection.connection is None:
            connection.ensure_connection()
            
        client = connection.connection 
        db_name = connection.settings_dict['NAME']
        db = client[db_name]

        collection = db[DownloadModel._meta.db_table]
        pipeline = [ 
            {
            "$match": {
                "product_id": product_id
            }
            },
            # Step 1: Group by resource_type, collecting all documents per type
            
            {
                "$group": {
                    "_id": "$resource_type",
                    "items": {
                        "$push": {
                            "download_id": "$download_id",
                            "name": "$name",
                            "resource_url": "$resource_url",
                            "resource_type": "$resource_type",
                            "product_id": "$product_id",
                            "tag_id": "$tag_id",
                            "subcategory_id": "$subcategory_id",
                            "category_id": "$category_id",
                        }
                    }
                }
            },
            # Step 2: Reshape into a list of {k, v} pairs for arrayToObject
            {
                "$group": {
                    "_id": None,
                    "grouped": {
                        "$push": {
                            "k": "$_id",
                            "v": "$items"
                        }
                    }
                }
            },
            # Step 3: Convert to a single object keyed by resource_type
            {
                "$replaceRoot": {
                    "newRoot": { "$arrayToObject": "$grouped" }
                }
            }
        ]

        result = list(collection.aggregate(pipeline))
        return result[0] if result else {}