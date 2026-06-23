from django.db import transaction
from django.db.models import Prefetch
from django.core.exceptions import ObjectDoesNotExist
from django.db import connection
from ..models import (
    ProductCategoryModel,
    ProductSubCategoryModel,
    TagModel,
    ProductModel,
)
from ..objects.product_objects import ProductCategory, ProductSubcategory, Tag, Product
from bson import ObjectId
from django.forms.models import model_to_dict
class ProductRepository:

    # ---------------------------------------------------------------
    # CREATE
    # ---------------------------------------------------------------

    def create_category(self, category: ProductCategory) -> bool:
        ProductCategoryModel.objects.create(
            category_name=category.category_name,
            tagline=category.tagline,
            category_img=category.category_img,
            thumbnail_mobile=category.thumbnail_mobile,
            thumbnail_desktop=category.thumbnail_desktop,
        )
        return True

    def create_subcategory(self, subcategory: ProductSubcategory) -> bool:
        parent = self._get_category_model(subcategory.category_id)
        ProductSubCategoryModel.objects.create(
            category=parent,
            name=subcategory.name,
            description=subcategory.description,
            category_img=subcategory.category_img,
        )
        return True

    def create_tag(self, tag: Tag) -> bool:
        parent = self._get_subcategory_model(tag.subcategory_id)
        TagModel.objects.create(
            subcategory=parent,
            name=tag.name,
            thumbnail_mobile=tag.thumbnail_mobile,
            thumbnail_desktop=tag.thumbnail_desktop,
        )
        return True

    def create_product(self, product: Product) -> bool:
        parent = self._get_tag_model(product.tag_id)
        ProductModel.objects.create(
            tag=parent,
            name=product.name,
            tagline=product.tagline or "",
            description=product.description or "",
            product_img=product.product_img,
        )
        return True

    # ---------------------------------------------------------------
    # INTERNAL LOOKUPS (object -> model instance, by business id)
    # ---------------------------------------------------------------
    # NOTE: these key off the *business* id fields (category_id,
    # subcategory_id, tag_id, product_id) not the Django pk, since
    # that's the id your domain objects and API actually carry.

    def _get_category_model(self, category_id: int) -> ProductCategoryModel:
        try:
            return ProductCategoryModel.objects.get(category_id=category_id)
        except ObjectDoesNotExist:
            raise ValueError(f"ProductCategory with id={category_id} does not exist")

    def _get_subcategory_model(self, subcategory_id: int) -> ProductSubCategoryModel:
        try:
            return ProductSubCategoryModel.objects.get(subcategory_id=subcategory_id)
        except ObjectDoesNotExist:
            raise ValueError(f"ProductSubCategory with id={subcategory_id} does not exist")

    def _get_tag_model(self, tag_id: int) -> TagModel:
        try:
            return TagModel.objects.get(tag_id=tag_id)
        except ObjectDoesNotExist:
            raise ValueError(f"Tag with id={tag_id} does not exist")

    def _get_product_model(self, product_id: int) -> ProductModel:
        try:
            return ProductModel.objects.select_related('tag').get(product_id=product_id)
        except ObjectDoesNotExist:
            raise ValueError(f"Product with id={product_id} does not exist")

    # Public-facing variants matching your original signature
    # (take the domain object, pull its id, delegate to the lookup above)

    def _get_category(self, category: ProductCategory) -> ProductCategoryModel:
        return self._get_category_model(category.category_id)

    def _get_subcategory(self, subcategory: ProductSubcategory) -> ProductSubCategoryModel:
        return self._get_subcategory_model(subcategory.subcategory_id)

    def _get_tag(self, tag: Tag) -> TagModel:
        return self._get_tag_model(tag.tag_id)

    def _get_product(self, product: Product) -> ProductModel:
        return self._get_product_model(product.product_id)

    # ---------------------------------------------------------------
    # UPDATE
    # ---------------------------------------------------------------

    def update_category(self, category: ProductCategory) -> bool:
        instance = self._get_category(category)
        instance.category_name = category.category_name
        instance.tagline = category.tagline
        instance.category_img = category.category_img
        instance.thumbnail_mobile = category.thumbnail_mobile
        instance.thumbnail_desktop = category.thumbnail_desktop
        instance.save()
        return True

    def update_subcategory(self, subcategory: ProductSubcategory) -> bool:
        instance = self._get_subcategory(subcategory)
        # category_id on the domain object is the parent FK - if it's
        # allowed to change on update, re-resolve it; otherwise drop this line.
        if subcategory.category_id is not None:
            instance.category = self._get_category_model(subcategory.category_id)
        instance.name = subcategory.name
        instance.description = subcategory.description
        instance.category_img = subcategory.category_img
        instance.save()
        return True

    def update_tag(self, tag: Tag) -> bool:
        instance = self._get_tag(tag)
        if tag.subcategory_id is not None:
            instance.subcategory = self._get_subcategory_model(tag.subcategory_id)
        instance.name = tag.name
        instance.thumbnail_mobile = tag.thumbnail_mobile
        instance.thumbnail_desktop = tag.thumbnail_desktop
        instance.save()
        return True

    def update_product(self, product: Product) -> bool:
        instance = self._get_product(product)
        if product.tag_id is not None:
            instance.tag = self._get_tag_model(product.tag_id)
        instance.name = product.name
        instance.tagline = product.tagline or ""
        instance.description = product.description or ""
        instance.product_img = product.product_img
        instance.save()
        return True

    # ---------------------------------------------------------------
    # DELETE
    # ---------------------------------------------------------------

    def delete_category(self, category: ProductCategory) -> bool:
        instance = self._get_category(category)
        instance.delete()
        return True

    def delete_subcategory(self, subcategory: ProductSubcategory) -> bool:
        instance = self._get_subcategory(subcategory)
        instance.delete()
        return True

    def delete_tag(self, tag: Tag) -> bool:
        instance = self._get_tag(tag)
        instance.delete()
        return True

    def delete_product(self, product: Product) -> bool:
        instance = self._get_product(product)
        instance.delete()
        return True
    
    def get_category_tag_list(self)->dict:
        # 1. Define targeted querysets that ONLY fetch the columns we need
        # This prevents Django from loading large text and URL fields into RAM
        tags_qs = TagModel.objects.only('tag_id', 'name', 'subcategory_id')
        
        subcategories_qs = ProductSubCategoryModel.objects.only(
            'subcategory_id', 'name', 'category_id'
        ).prefetch_related(
            Prefetch('tags', queryset=tags_qs)
        )

        # 2. Apply the targeted prefetching to the main category query
        categories = ProductCategoryModel.objects.only(
            'category_id', 'category_name'
        ).prefetch_related(
            Prefetch('subcategories', queryset=subcategories_qs)
        )
        
        # 3. Construct the dictionary structure (Same logic as before)
        result = []
        
        for category in categories:
            subcategories_list = []
            
            for subcategory in category.subcategories.all():
                tags_list = [
                    {"tag_id": tag.tag_id, "name": tag.name} 
                    for tag in subcategory.tags.all()
                ]
                
                subcategories_list.append({
                    "subcategory_id": subcategory.subcategory_id,
                    "name": subcategory.name,
                    "tags": tags_list
                })
                
            result.append({
                "category_id": category.category_id,
                "category_name": category.category_name,
                "subcategories": subcategories_list
            })
            
        return result

    

    def _convert_objectids(self,obj):
        """Recursively convert any ObjectId in a nested dict/list structure to str."""
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, dict):
            return {k: self._convert_objectids(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [self._convert_objectids(item) for item in obj]
        return obj
    
    def get_product_lists_for_category(self, category):
        if connection.connection is None:
            connection.ensure_connection()
            
        client = connection.connection 
        db_name = connection.settings_dict['NAME']
        db = client[db_name]
        
        subcat_collection = ProductSubCategoryModel._meta.db_table
        tag_collection = TagModel._meta.db_table
        product_collection = ProductModel._meta.db_table
        
        category_fk_col = ProductSubCategoryModel._meta.get_field('category').column
        tag_fk_col = TagModel._meta.get_field('subcategory').column
        product_fk_col = ProductModel._meta.get_field('tag').column

        collection = db[subcat_collection]
        
        category_model = self._get_category(category)
        target_pk = category_model.pk

        pipeline = [
            { "$match": { category_fk_col: target_pk } },
            {
                "$lookup": {
                    "from": tag_collection, 
                    "localField": "_id",
                    "foreignField": tag_fk_col,
                    "as": "tags",
                    "pipeline": [
                        {
                            "$lookup": {
                                "from": product_collection,
                                "localField": "_id",
                                "foreignField": product_fk_col,
                                "as": "products"
                            }
                        },
                    ]
                }
            },
            {
                "$unset": [
                    "_id",
                    category_fk_col, # subcategory -> category FK
                    "tags._id",
                    "tags." + tag_fk_col,   # tag -> subcategory FK, nested under "tags"
                    "tags.products._id",                                                
                    "tags.products." + product_fk_col
                ]
            }        
        ]
        
        results = list(collection.aggregate(pipeline))
        return self._convert_objectids(results)
    

    def get_category_list(self):
        category_list = [
            {k: v for k, v in cat.items() if k != 'id'} 
            for cat in ProductCategoryModel.objects.values()
        ]
        return category_list
        
    def get_subcategory_for_category(self , category:ProductCategory):
        """ returns the details of the Subcategories of the ProductCategory"""
        try:
            category_obj = ProductCategoryModel.objects.prefetch_related('subcategories').get(
                            category_id=category.category_id
                        )
                                    
            subcategories_list = []
            for sub in category_obj.subcategories.all():
                sub_dict = {
                    field.name: getattr(sub, field.name)
                    for field in ProductSubCategoryModel._meta.fields
                    # We also exclude 'category' here so we don't duplicate the parent data
                    if field.name not in ['id', '_id', 'category'] 
                }
                subcategories_list.append(sub_dict)
            
            return subcategories_list
        except ProductCategoryModel.DoesNotExist:
            return None
            
    def get_product(self ,product:Product):
        from ..serializers import ProductSerializer
        product = self._get_product(product=product)              
        product_data = ProductSerializer(product).data
        return product_data