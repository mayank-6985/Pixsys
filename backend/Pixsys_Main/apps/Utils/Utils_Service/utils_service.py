from urllib.parse import urlparse
class UtilsService:
    @staticmethod
    def is_valid_url_string(url_string):
        if not url_string:
            raise ValueError("Thumbnail can't be empty")
        
        # Enforce that it must be a string first
        if not isinstance(url_string, str):
            raise TypeError("Thumbnail must be a string URL")
        
        try:
            parsed_url = urlparse(url_string.strip())
            # A valid URL requires at least a scheme (http/https) and a netloc (domain)
            if not parsed_url.scheme or not parsed_url.netloc:
                raise ValueError("Thumbnail must be a valid URL (e.g., https://example.com/image.jpg)")
                
            # Optional: Restrict to web URLs only
            if parsed_url.scheme not in ['http', 'https']:
                raise ValueError("Thumbnail URL must use HTTP or HTTPS")
                     
        except Exception:
            raise ValueError("Thumbnail is not a well-formed URL")  
        