from django.db import models
from ..Utils.Counter_Service.services import CounterServices

class ProductCategoryModel(models.Model):
    category_id = models.BigIntegerField()
    category_name = models.CharField(max_length=50)
    tagline = models.CharField(max_length=100)
    category_img = models.URLField()
    thumbnail_mobile = models.URLField()
    thumbnail_desktop = models.URLField()

    class Meta:
        db_table = "Product_Category_Table"
        indexes = [
            models.Index(fields=['category_id']),
        ]
    def __str__(self):
        return f"{self.category_id}"
    
    def save(self, *args, **kwargs):
        if not self.category_id:
            category_id = CounterServices.get_next_sequence("product_category")
            self.category_id = category_id
        return super().save(*args, **kwargs)
    
class ProductSubCategoryModel(models.Model):
    category = models.ForeignKey(ProductCategoryModel , on_delete=models.CASCADE , related_name="subcategories")
    subcategory_id = models.BigIntegerField()
    name = models.CharField(
        max_length=255,
        help_text="e.g. 'PAC/IPC', 'PLC', 'IO'.",
    )
    description = models.TextField(
        blank=False,
        help_text="Longer descriptive text shown on the SubCategory listing page.",
    )
    category_img = models.URLField()
    
    class Meta:
        db_table = "Product_SubCategory_Table"        
        indexes = [
            models.Index(fields=["category"]),
            models.Index(fields=["subcategory_id"])
        ]

    def __str__(self):
        return self.name

    def __str__(self):
        return f"{self.category.category_name} > {self.name}"
    
    def save(self, *args, **kwargs):
        if not self.subcategory_id:
            subcategory_id = CounterServices.get_next_sequence("product_subcategory")
            self.subcategory_id = subcategory_id
        return super().save(*args, **kwargs)

class TagModel(models.Model):
    """
    Third-level grouping under a SubCategory, e.g. "Q series" under
    "PAC/IPC". This is the page that finally lists individual products.
    """
 
    subcategory = models.ForeignKey(
        ProductSubCategoryModel,
        on_delete=models.CASCADE,
        related_name="tags",
        help_text="CASCADE: a Tag has no meaning without its parent SubCategory.",
    )
    name = models.CharField(
        max_length=255,
        help_text="e.g. 'Q series', 'V100 series'.",
    )
    tag_id = models.BigIntegerField()
    thumbnail_mobile = models.URLField(    
        help_text="Mobile-cropped thumbnail, same rationale as Category's mobile/desktop split.",
    )
    thumbnail_desktop = models.URLField(        
        help_text="Desktop-cropped thumbnail, same rationale as Category's mobile/desktop split.",
    )
 
    class Meta:
        ordering = ["name"]
        indexes = [
            # Speeds up "list all tags under SubCategory X" - the core
            # query for the SubCategory listing page.
            models.Index(fields=["subcategory"]),
            models.Index(fields=["tag_id"]),
        ]
 
    def __str__(self):
        return f"{self.subcategory.name} > {self.name}"
    
    def save(self, *args, **kwargs):
        if not self.tag_id:
            tag_id = CounterServices.get_next_sequence("product_tag")
            self.tag_id = tag_id
        return super().save(*args, **kwargs)
    
class ProductModel(models.Model):
    """
    An individual product/SKU, e.g. "Q Plus Series", "HC-Q Series",
    the thing a Tag's listing page links out to and the thing the
    product detail page renders.
    """
    
    tag = models.ForeignKey(
        TagModel,
        on_delete=models.PROTECT,
        related_name="products",
        help_text=(
            "PROTECT, not CASCADE: unlike the levels above it, deleting "
            "a Tag that still has live products attached should fail "
            "loudly rather than silently deleting product records. "
            "Products are the actual sellable/documented items - losing "
            "them as a side effect of reorganizing the category chain "
            "is the kind of mistake PROTECT exists to catch."
        ),
    )
    product_id = models.BigIntegerField()
    name = models.CharField(max_length=255)
    tagline = models.CharField(
        max_length=255,
        blank=True,
        help_text='Short line under the product title, e.g. "Powerful performance, flexible expansion..."',
    )
    description = models.TextField(
        blank=True,
        help_text="Main descriptive body text for the product detail page.",
    )
    product_img = models.URLField(      
        help_text="Primary image for the product detail page.",
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-name"]
        indexes = [
            # Speeds up "list all products under Tag X" - the core
            # query for the Tag listing page (the final step before
            # the product detail page).
            models.Index(fields=["tag"]),
            models.Index(fields=["product_id"]),
        ]
 
    def __str__(self):
        return self.name