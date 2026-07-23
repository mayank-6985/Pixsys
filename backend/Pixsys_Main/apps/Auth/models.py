from django.db import models
from django.contrib.auth.hashers import make_password, check_password as django_check_password
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True ,db_index=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = "Shivvilon Solution Admin"



class PixsysAdminModel(models.Model):
    email = models.EmailField(unique=True , db_index=True)
    # 128 chars is the standard length required to store Django's hashed passwords
    password = models.CharField(max_length=128) 
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    class Meta:
        db_table = "Pixsys_Admin_Table"
        verbose_name = "Pixsys Admin"

    def save(self, *args, **kwargs):
        # Prevent double-hashing: Only hash the password if it is plain text.
        # Django hashes always start with the algorithm name (e.g., 'pbkdf2_sha256$')
        if self.password and not self.password.startswith(('pbkdf2_', 'argon2', 'bcrypt')):
            self.password = make_password(self.password)
            
        # Call the original save method to commit to the database
        super().save(*args, **kwargs)
    # Helper method to mimic Django's native password checking
    def check_password(self, raw_password):
        return django_check_password(raw_password, self.password)
    
    # Add this to mimic Django's authenticated state
    @property
    def is_authenticated(self):
        """Always return True. This is a way to tell DRF that if this user object exists, they are authenticated."""
        return True


class PixsysCustomerModel(models.Model):
    email = models.EmailField(unique=True, db_index=True)
    password = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.email
    
    class Meta:
        db_table = "Pixsys_Customer_Table"
        verbose_name = "Pixsys Customer"
    
    def save(self, *args, **kwargs):
        # Prevent double-hashing: Only hash the password if it is plain text.
        # Django hashes always start with the algorithm name (e.g., 'pbkdf2_sha256$')
        if self.password and not self.password.startswith(('pbkdf2_', 'argon2', 'bcrypt')):
            self.password = make_password(self.password)
            
        # Call the original save method to commit to the database
        super().save(*args, **kwargs)
        
    # Helper method to mimic Django's native password checking
    def check_password(self, raw_password):
        return django_check_password(raw_password, self.password)
    
    # Add this to mimic Django's authenticated state
    @property
    def is_authenticated(self):
        """Always return True. This is a way to tell DRF that if this user object exists, they are authenticated."""
        return True
    
class CustomerOTPModel(models.Model):
    customer = models.OneToOneField(PixsysCustomerModel, on_delete=models.CASCADE, related_name='otp_data')
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = "Pixsys_Customer_OTP"
        
    def is_valid(self):
        return timezone.now() <= self.expires_at