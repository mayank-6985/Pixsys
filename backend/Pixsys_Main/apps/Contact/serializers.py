from rest_framework import serializers
from .models import ContactSubmissionModel
        
class ContactSubmissionSerializer(serializers.ModelSerializer):
    form_id = serializers.BigIntegerField(required=False)
    
    class Meta:
        model = ContactSubmissionModel
        fields = [  
            'form_id',
            'full_name', 
            'phone_number', 
            'email_address', 
            'poul', 
            'industry', 
            'product_of_interest', 
            'description',
        ]
