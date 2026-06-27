
from django.contrib import admin
from .models import VisitorAnalytics

@admin.register(VisitorAnalytics)
class VisitorAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'country_name', 'state_name', 'visited_at')
    list_filter = ('country_name', 'state_name', 'visited_at')
    search_fields = ('ip_address', 'country_name')
    readonly_fields = ('visited_at',)