from ..repository.home_repository import HomeRepository
from ..object.homeObj import SliderObject

class HomeService:
    def __init__(self, repo: HomeRepository = None):
        self.repo = repo or HomeRepository()
    
    def get_slider_images(self):
        slider = self.repo.get_slider()
        if not slider:
            raise ValueError("No slider data found.")
        return slider.slideImages

    def save_slider_images(self, slider_images: list):
        # Check if a document already exists to apply the empty-array rule
        existing_slider = self.repo.get_slider()
        is_first_time = existing_slider is None

        # Instantiate Object (which triggers validation)
        slider_obj = SliderObject(slider_images=slider_images, is_first_time=is_first_time)

        # Proceed to DB modification via Repo
        slider, created = self.repo.update_or_create_slider(slider_obj)
        
        if created:
            return "Slider images created successfully."
        return "Slider images updated successfully."