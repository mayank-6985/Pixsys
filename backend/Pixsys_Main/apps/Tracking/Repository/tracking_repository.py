from django.db.models import Count
from ..models import VisitorAnalytics


class TrackingRepository:
    def save_visitor(self, visitor_data: dict) -> None:
        VisitorAnalytics.objects.create(**visitor_data)

    def get_world_analytics(self) -> list:
        data = (
            VisitorAnalytics.objects
            .exclude(country_code="Unknown")
            .values('country_code', 'country_name')
            # Add distinct=True to only count unique IPs per country
            .annotate(count=Count('ip_address', distinct=True)) 
        )
        return list(data)

    def get_india_analytics(self) -> list:
        data = (
            VisitorAnalytics.objects
            .filter(country_code='IN')
            .exclude(state_name__isnull=True)
            .values('country_name', 'state_name') 
            # Add distinct=True to only count unique IPs per state
            .annotate(count=Count('ip_address', distinct=True)) 
        )
        
        return [
            {
                "country": item['country_name'],
                "state_name": item['state_name'],
                "count": item['count']
            }
            for item in data
        ]
    def is_ip_unique(self ,ip):
        return VisitorAnalytics.objects.filter(ip_address=ip).exists()