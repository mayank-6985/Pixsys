from ..repositories.products_repository import ProductRepository
from ..objects.product_objects import (
    Product,
    ProductCategory,
    ProductSubcategory,
    Tag
)
class ProductService:
    def __init__(self , repo:ProductRepository=None):
        self.repo = repo or ProductRepository()
    
    def create_category(self,data):
        category = ProductCategory(
            category_name=data['category_name'],
            tagline = data['tagline'],
            category_img= data['category_img'],
            thumbnail_mobile=data['thumbnail_mobile'],
            thumbnail_desktop=data['thumbnail_desktop']
        )
        success = self.repo.create_category(category=category)
        return success
    
    def create_subcategory(self,data):
        subcategory = ProductSubcategory(
            category_id=data['category_id'],
            name=data['name'],
            description=data['description'],
            category_img=data['category_img'],        
        )
        
        success = self.repo.create_subcategory(subcategory=subcategory)
        return success
    
    def create_tag(self,data):
        tag = Tag(
            subcategory_id= data['subcategory_id'],
            name=data['name'],
            thumbnail_desktop=data['thumbnail_desktop'],
            thumbnail_mobile=data['thumbnail_mobile']
            )
        success = self.repo.create_tag(tag=tag)
        return success
        
    def create_product(self , data):
        product = Product(
            tag_id=data['tag_id'],
            name=data['name'],
            tagline=data['tagline'],
            description=data['description'],  
            product_img=data['product_img'],
        )
        success = self.repo.create_product(product=product)
        return success
    
    def update_category(self, data):    
        category = ProductCategory(
            category_id=data['category_id'],
            category_img=data['category_img'],
            category_name=data['category_name'],
            tagline=data['tagline'],
            thumbnail_desktop=data['thumbnail_desktop'],
            thumbnail_mobile=data['thumbnail_mobile'],
            operation='update'            
            )
        success = self.repo.update_category(category=category)
        return success
        
    def update_subcategory(self, data):
        subcategory = ProductSubcategory(
            category_id=data['category_id'],
            subcategory_id=data['subcategory_id'],
            name=data['name'],
            description=data['description'],
            category_img=data['category_img'],
            operation='update'
        )
        success = self.repo.update_subcategory(subcategory=subcategory)
        return success
    
    def update_tag(self, data):
        tag = Tag(
            subcategory_id=data['subcategory_id'],
            tag_id=data['tag_id'],
            name=data['name'],
            thumbnail_desktop=data['thumbnail_desktop'],
            thumbnail_mobile=data['thumbnail_mobile'],
        )
        success = self.repo.update_tag(tag=tag)
        return success
    
    def update_product(self, data):
        product = Product(
            tag_id = data['tag_id'],
            product_id = data["product_id"],
            name = data["name"],
            tagline = data["tagline"],    
            description = data["description"] ,
            product_img = data['product_img'],
            operation = 'update',
        )
        
        success = self.repo.update_product(product=product)
        return success
    
    def delete_category(self , category_id):
        category = ProductCategory(category_id=category_id, operation=None)
        success = self.repo.delete_category(category=category)
        return success
    
    def delete_subcategory(self, subcategory_id):
        subcategory = ProductSubcategory(
            subcategory_id = subcategory_id,
            operation = None
        )
        success = self.repo.delete_subcategory(subcategory= subcategory)
        return success
    
    def delete_tag(self, tag_id):
        tag = Tag(
            tag_id=tag_id,
            operation = None
        )
        success = self.repo.delete_tag(tag=tag)
        return success
    
    def delete_product(self , data):
        product = Product(
            product_id=product_id,
            operation = None
        )
        success = self.repo.delete_product(product=product)
        return success
    
    def get_category_detail(self, category_detail):
        category = ProductCategory(category_id=category_detail['category_id'] , operation=None)
        category = self.repo._get_category(category=category)
        return category
                
    def get_navigation_product_list(self):
        product_data = self.repo.get_category_tag_list()
        return product_data
    
    def get_list_of_product_for_category(self , category_id):
        category = ProductCategory(category_id=category_id , operation=None)
        return self.repo.get_product_lists_for_category(category=category)
    
    def get_category_list(self):
        category_list = self.repo.get_category_list()
        return category_list
    
    def get_product(self , product_id)->dict:
        product = Product(
            product_id= product_id,
            operation=None
        )
        product_data = self.repo.get_product(product)
        return product_data
