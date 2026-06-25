from ...Utils.Utils_Service.utils_service import UtilsService
from typing import Literal ,Optional

class ProductCategory:
    def __init__(self, category_name: str = None, category_id: int = None,
                 tagline: str = None, category_img: str = None,
                #  thumbnail_mobile: str = None, thumbnail_desktop: str = None,
                 operation: Literal['create', 'update', None] = 'create'):
        self.category_name = category_name
        self.category_id = category_id
        self.tagline = tagline
        self.category_img = category_img
        # self.thumbnail_mobile = thumbnail_mobile
        # self.thumbnail_desktop = thumbnail_desktop
        self.operation = operation
        self.validate()

    def validate_category_name(self):
        if self.category_name is None:
            raise ValueError("Category name cant be empty!")

    def validate_tagline(self):
        if self.tagline is None:
            raise ValueError("Category tagline cant be empty!")

    def validate_category_image(self):
        if self.category_img is None:
            raise ValueError("Category image cant be empty!")
        UtilsService.is_valid_url_string(self.category_img)

    # def validate_thumbnail(self, thumbnail_mobile, thumbnail_desktop):
    #     if thumbnail_mobile is None or thumbnail_desktop is None:
    #         raise ValueError("Category thumbnails cant be empty!")
    #     UtilsService.is_valid_url_string(thumbnail_mobile)
    #     UtilsService.is_valid_url_string(thumbnail_desktop)

    def validate_category_id(self):
        if self.operation == 'update' or self.operation is None:
            if self.category_id is None:
                raise ValueError("Subcategory id cant be empty!")

    def validate(self):
        if self.operation == 'create':
            self.validate_category_name()
            self.validate_tagline()
            self.validate_category_image()
            # self.validate_thumbnail(self.thumbnail_mobile, self.thumbnail_desktop)
        elif self.operation == 'update':
            self.validate_category_name()
            self.validate_tagline()
            self.validate_category_image()
            # self.validate_thumbnail(self.thumbnail_mobile, self.thumbnail_desktop)
            self.validate_category_id()
        elif self.operation is None:
            self.validate_category_id()


class ProductSubcategory:
    def __init__(self, category_id: int = None, subcategory_id: int = None,
                 name: str = None, description: str = None,
                 category_img: str = None, operation: Literal['create', 'update', None] = 'create'):
        self.category_id = category_id
        self.subcategory_id = subcategory_id
        self.name = name
        self.description = description
        self.category_img = category_img
        self.operation = operation
        self.validate()

    def validate_category_id(self):
        if self.category_id is None:
            raise ValueError("Parent category id cant be empty!")

    def validate_name(self):
        if self.name is None:
            raise ValueError("Subcategory name cant be empty!")

    def validate_description(self):
        if self.description is None:
            raise ValueError("Subcategory description cant be empty!")

    def validate_category_image(self):
        if self.category_img is None:
            raise ValueError("Subcategory image cant be empty!")
        UtilsService.is_valid_url_string(self.category_img)

    def validate_subcategory_id(self):
        if self.operation == 'update':
            if self.subcategory_id is None:
                raise ValueError("Subcategory id cant be empty!")

    def validate(self):
        if self.operation == 'create':
            self.validate_category_id()
            self.validate_name()
            self.validate_description()
            self.validate_category_image()
        elif self.operation == 'update':
            self.validate_category_id()
            self.validate_name()
            self.validate_description()
            self.validate_category_image()
            self.validate_subcategory_id()
        elif self.operation is None:
            self.validate_subcategory_id()

class Tag:
    def __init__(self, subcategory_id: int = None, tag_id: int = None,
                 name: str = None,
                #  thumbnail_mobile: str = None,
                #  thumbnail_desktop: str = None, 
                 operation: Literal['create', 'update', None] = 'create'):
        self.subcategory_id = subcategory_id
        self.tag_id = tag_id
        self.name = name
        # self.thumbnail_mobile = thumbnail_mobile
        # self.thumbnail_desktop = thumbnail_desktop
        self.operation = operation
        self.validate()

    def validate_subcategory_id(self):
        if self.subcategory_id is None:
            raise ValueError("Parent subcategory id cant be empty!")

    def validate_name(self):
        if self.name is None:
            raise ValueError("Tag name cant be empty!")

    # def validate_thumbnail(self, thumbnail_mobile, thumbnail_desktop):
    #     if thumbnail_mobile is None or thumbnail_desktop is None:
    #         raise ValueError("Tag thumbnails cant be empty!")
    #     UtilsService.is_valid_url_string(thumbnail_mobile)
    #     UtilsService.is_valid_url_string(thumbnail_desktop)

    def validate_tag_id(self):
        if self.operation == 'update':
            if self.tag_id is None:
                raise ValueError("Tag id cant be empty!")

    def validate(self):
        if self.operation == 'create':
            self.validate_subcategory_id()
            self.validate_name()
            # self.validate_thumbnail(self.thumbnail_mobile, self.thumbnail_desktop)
        elif self.operation == 'update':
            self.validate_subcategory_id()
            self.validate_name()
            # self.validate_thumbnail(self.thumbnail_mobile, self.thumbnail_desktop)
            self.validate_tag_id()
        elif self.operation is None:
            self.validate_tag_id()

from typing import List
from ...Download.Objects.download_factory import DownloadFactory
class Product:
    def __init__(self, tag_id: int = None, product_id: int = None,
                 name: str = None, tagline: str = None,
                 description: str = None, product_img: str = None,
                 specifications:list=None,list_of_downloads:List[DownloadFactory]=None ,
                 operation: Literal['create', 'update', None] = 'create'):
        self.tag_id = tag_id
        self.product_id = product_id
        self.name = name
        self.tagline = tagline
        self.description = description
        self.product_img = product_img
        self.operation = operation
        self.specifications = specifications
        self.list_of_downloads = list_of_downloads
        self.validate()

    def validate_tag_id(self):
        if self.tag_id is None:
            raise ValueError("Parent tag id cant be empty!")

    def validate_name(self):
        if self.name is None:
            raise ValueError("Product name cant be empty!")

    def validate_product_image(self):
        if self.product_img is None:
            raise ValueError("Product image cant be empty!")
        UtilsService.is_valid_url_string(self.product_img)

    def validate_product_id(self):
        if self.operation == 'update':
            if self.product_id is None:
                raise ValueError("Product id cant be empty!")
    
    def validate_specifications(self):
        try:
            if not self.specifications:
                raise ValueError
            for url in self.specifications:
                UtilsService.is_valid_url_string(url)
        except ValueError:
            raise ValueError("Specification should have valid urls")    
    
    def handle_list_of_download(self ,product_id , tag_id , category_id , subcategory_id):        
            for download in self.list_of_downloads:                
                download.product_id = product_id
                download.tag_id = tag_id
                download.category_id = category_id
                download.subcategory_id = subcategory_id
                                        
    def validate(self):
        if self.operation == 'create':
            self.validate_tag_id()
            self.validate_name()
            self.validate_product_image()
            self.validate_specifications()            
            # tagline and description are blank=True on the , so not required here
        elif self.operation == 'update':
            self.validate_tag_id()
            self.validate_name()
            self.validate_product_image()
            self.validate_product_id()
            self.validate_specifications()
        elif self.operation is None:            
            self.validate_product_id()