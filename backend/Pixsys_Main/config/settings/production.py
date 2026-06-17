from .base import *
from decouple import config , Csv
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = config('PRODUCTION_ALLOWED_HOSTS' , cast=Csv())

DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_backend',
        'HOST': 'mongodb://localhost:27017/',
        'NAME': 'config',
    },
}

# cors configuration
CORS_ALLOW_CREDENTIALS=True

CORS_ALLOWED_ORIGINS = [
    'pixsysglobal.com',    
]

CSRF_ALLOWED_ORIGINS = [
    'pixsysglobal.com',
]
0