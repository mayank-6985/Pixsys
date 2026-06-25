from ..models import SliderModel
from ..object.homeObj import SliderObject

class HomeRepository:
    def get_slider(self):
        """Fetches the single slider document."""
        return SliderModel.objects.filter(image_id=1).first()

    def update_or_create_slider(self, slider_obj: SliderObject):
        """Overwrites the existing document or creates the very first one."""
        slider, created = SliderModel.objects.update_or_create(
            image_id=1,
            defaults={'slideImages': slider_obj.slider_images}
        )
        return slider, created