from django.db import models

class VisitorAnalytics(models.Model):
    ip_address = models.GenericIPAddressField(unique=True)
    country_code = models.CharField(max_length=2, blank=True, null=True)    # e.g., 'IN', 'US'
    country_name = models.CharField(max_length=100, blank=True, null=True)  # e.g., 'India'
    state_code = models.CharField(max_length=10, blank=True, null=True)     # e.g., 'IN-GJ'
    state_name = models.CharField(max_length=100, blank=True, null=True)    # e.g., 'Gujarat'
    visited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ip_address} - {self.country_code} - {self.visited_at.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        verbose_name_plural = "Visitor Analytics"