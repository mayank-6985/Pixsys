from ...Utils.Utils_Service.utils_service import UtilsService

class SliderObject:
    def __init__(self, slider_images: list, is_first_time: bool = False):
        self.slider_images = slider_images
        self.validate_images(is_first_time)
        
    def validate_images(self, is_first_time: bool):
        # If it's not the first time (a document exists), enforce at least 1 image.
        if not is_first_time and len(self.slider_images) < 1:
            raise ValueError("Not sufficient images for the slider. Minimum 1 image URL is required.")
            
        # Validate URLs
        for img_url in self.slider_images:
            UtilsService.is_valid_url_string(img_url)