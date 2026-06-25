# from django.contrib import admin
# from .models import NewsModel, ContentItemModel


# class ContentItemInline(admin.TabularInline):
#     model = ContentItemModel
#     fields = ("order", "type", "payload")
#     extra = 1


# @admin.register(NewsModel)
# class NewsAdmin(admin.ModelAdmin):
#     list_display = ("date", "heading")
#     inlines = (ContentItemInline,)


# @admin.register(ContentItemModel)
# class ContentItemAdmin(admin.ModelAdmin):
#     list_display = ("news", "order", "type")
#     list_filter = ("type",)
# from django.contrib import admin

# # Register your models here.
