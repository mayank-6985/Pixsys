from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import PixsysAdminModel, PixsysCustomerModel

# ==========================================
# SIGNUP SERIALIZERS
# ==========================================

class CustomerSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = PixsysCustomerModel
        fields = ['id', 'email', 'password', 'phone_number']

    def validate_email(self, value):
        if PixsysCustomerModel.objects.filter(email=value).exists():
            raise serializers.ValidationError("A PixsysCustomerModel account with this email already exists.")
        return value

    def create(self, validated_data):
        # Explicitly hash the password before saving it to the custom model
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


# ==========================================
# LOGIN (TOKEN OBTAIN) SERIALIZERS
# ==========================================

class BaseEmailTokenObtainSerializer(serializers.Serializer):
    """
    A base serializer to keep the login logic DRY. 
    Both admin and customer logins require an email and password.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class AdminLoginSerializer(BaseEmailTokenObtainSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')        
        
        # Query the custom PixsysAdminModel model directly
        user = PixsysAdminModel.objects.filter(email=email).first()
        
        # Use the check_password helper method we added to the model
        if user is None :
            raise serializers.ValidationError('No active admin account found with the given credentials.')
        if not user.check_password(password):
            raise serializers.ValidationError('Password is incorrrect! Please try again')
        attrs['user'] = user
        return attrs


class CustomerLoginSerializer(BaseEmailTokenObtainSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')        
        
        # Query the custom PixsysCustomerModel model directly
        user = PixsysCustomerModel.objects.filter(email=email).first()
        
        # Use the check_password helper method we added to the model
        if user is None:
            raise serializers.ValidationError('No active customer account found with the given credentials.')
        if not user.check_password(password):
            raise serializers.ValidationError('password is incorrect ! please try again.')            
        attrs['user'] = user
        return attrs
    

# Add to your existing serializers.py
from django.utils import timezone
from .models import CustomerOTPModel

class CustomerVerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        otp_code = attrs.get('otp_code')
        
        customer = PixsysCustomerModel.objects.filter(email=email).first()
        if not customer:
            raise serializers.ValidationError("Customer not found.")
            
        try:
            otp_record = customer.otp_data
        except CustomerOTPModel.DoesNotExist:
            raise serializers.ValidationError("No OTP requested or OTP expired.")

        if not otp_record.is_valid():
            otp_record.delete()
            raise serializers.ValidationError("OTP has expired. Please request a new one.")
            
        if otp_record.otp_code != otp_code:
            raise serializers.ValidationError("Invalid OTP.")

        attrs['customer'] = customer
        attrs['otp_record'] = otp_record
        return attrs
    
# Add to serializers.py
class CustomerResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get('email')
        
        customer = PixsysCustomerModel.objects.filter(email=email).first()
        if not customer:
            # We return a generic error or specific one based on your security posture.
            # Returning "Customer not found" is fine for most non-banking apps.
            raise serializers.ValidationError("No customer account found with this email.")
            
        attrs['customer'] = customer
        return attrs
    

from .models import SystemSMTPConfig, CompanySettings

class SystemSMTPConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSMTPConfig
        fields = ['email_host_user', 'email_host_password']
        # Note: If you want to hide the password on fetch, uncomment below:
        # extra_kwargs = {'email_host_password': {'write_only': True}}

class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySettings
        fields = [
            'company_details', 'contact_email', 
            'instagram_link', 'facebook_link', 
            'linkedin_link', 'youtube_link'
        ]