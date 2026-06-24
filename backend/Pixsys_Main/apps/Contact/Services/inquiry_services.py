from ..models import ContactSubmissionModel
from ..serializers import ContactSubmissionSerializer

class InquiryService:
    def get_all_submissions(self) -> list:
        """Fetches all form submissions."""
        submissions = ContactSubmissionModel.objects.all()
        # Returning serialized data to match the view pattern you provided
        serializer = ContactSubmissionSerializer(submissions, many=True)
        return serializer.data

    def create_submission(self, validated_data: dict) -> str:
        """Creates a new contact form submission."""
        ContactSubmissionModel.objects.create(**validated_data)
        return "Your inquiry has been submitted successfully."