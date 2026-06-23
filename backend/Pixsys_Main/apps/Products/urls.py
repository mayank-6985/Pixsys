from django.urls import path
from .views import *
urlpatterns = [
    # Nav bar - full Category > SubCategory > Tag tree in one response
    path("", NavTreeView.as_view(), name="nav-tree"),
 
    # # SubCategory landing page - this SubCategory + its Tags + product cards
    path("categories/<int:category_id>", SubCategoryPageView.as_view(), name="subcategory-page"),
 
    # # Category (Level 1 - top of chain, no parent filter)
    path("categories/", CategoryListView.as_view(), name="category-list-update"),
    
 
    # # SubCategory (Level 2 - scoped via ?category=<id>)
    path("subcategories/", SubCategoryListUpdateView.as_view(), name="subcategory-list-update"),
    
 
    # # Tag (Level 3 - scoped via ?subcategory=<id>)
    path("tags/", TagListUpdateView.as_view(), name="tag-list-update"),    
 
    # # Product (Level 4 - scoped via ?tag=<id>)
    path("products/", ProductListView.as_view(), name="product-list-create"),
    
]
 