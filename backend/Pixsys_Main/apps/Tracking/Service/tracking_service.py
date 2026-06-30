import logging
from django.contrib.gis.geoip2 import GeoIP2
from geoip2.errors import AddressNotFoundError
from ..Repository.tracking_repository import TrackingRepository

logger = logging.getLogger(__name__)

INDIAN_STATES = {
    'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam',
    'BR': 'Bihar', 'CT': 'Chhattisgarh', 'GA': 'Goa', 'GJ': 'Gujarat',
    'HR': 'Haryana', 'HP': 'Himachal Pradesh', 'JH': 'Jharkhand',
    'KA': 'Karnataka', 'KL': 'Kerala', 'MP': 'Madhya Pradesh',
    'MH': 'Maharashtra', 'MN': 'Manipur', 'ML': 'Meghalaya',
    'MZ': 'Mizoram', 'NL': 'Nagaland', 'OR': 'Odisha', 'PB': 'Punjab',
    'RJ': 'Rajasthan', 'SK': 'Sikkim', 'TN': 'Tamil Nadu',
    'TG': 'Telangana', 'TR': 'Tripura', 'UP': 'Uttar Pradesh',
    'UT': 'Uttarakhand', 'WB': 'West Bengal', 'AN': 'Andaman and Nicobar Islands',
    'CH': 'Chandigarh', 'DN': 'Dadra and Nagar Haveli and Daman and Diu',
    'DL': 'Delhi', 'JK': 'Jammu and Kashmir', 'LA': 'Ladakh',
    'LD': 'Lakshadweep', 'PY': 'Puducherry'
}

class TrackingService:
    def __init__(self , repo:TrackingRepository=None):
        self.repo = repo or TrackingRepository()

    def process_and_track_visitor(self, ip: str) -> dict:
        """
        Handles the GeoIP lookup business logic and delegates saving to the repository.
        """
        # Handle localhost testing
        if ip == '127.0.0.1' or ip.startswith('192.168.') or ip.startswith('10.'):
            ip = '103.241.12.1' 

        country_code, country_name = "Unknown", "Unknown"
        state_code, state_name = None, None

        try:
            g = GeoIP2()
            location = g.city(ip)
            
            country_code = location.get('country_code', 'Unknown')
            country_name = location.get('country_name', 'Unknown')
            
            raw_region_code = location.get('region')
            
            if country_code == 'IN' and raw_region_code:
                state_code = f"IN-{raw_region_code}"
                state_name = INDIAN_STATES.get(raw_region_code, raw_region_code)
                       
                
        except AddressNotFoundError:
            pass # IP not in database, keep as Unknown
        except Exception as geo_error:
            logger.warning(f"GeoIP Lookup Error for IP {ip}: {str(geo_error)}")

        if self.repo.is_ip_unique(ip=ip):
            return {"status": "ignored", "message": "Visitor already logged previously"}
        # Prepare data for repository
        visitor_data = {
            "ip_address": ip,
            "country_code": country_code,
            "country_name": country_name,
            "state_code": state_code,
            "state_name": state_name
        }

        # Delegate database insertion
        self.repo.save_visitor(visitor_data)
        
        return {"status": "success", "message": "Visitor logged"}

    def get_world_analytics_data(self) -> list:
        """Fetches world map data via repository."""
        return self.repo.get_world_analytics()

    def get_india_analytics_data(self) -> list:
        """Fetches India map data via repository."""
        return self.repo.get_india_analytics()