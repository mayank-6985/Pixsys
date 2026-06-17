from .base import *
from decouple import config , Csv
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = config('LOCAL_ALLOWED_HOSTS' , cast=Csv())

# database
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
    "https://unsettled-manual-dynasty.ngrok-free.dev",
    "https://tragicomical-epileptically-davin.ngrok-free.dev",
]

# csrf setup
CSRF_ALLOWED_ORIGINS = [
    "https://unsettled-manual-dynasty.ngrok-free.dev",
    "https://tragicomical-epileptically-davin.ngrok-free.dev"
]






