from .base import *
from decouple import config , Csv
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = config('LOCAL_ALLOWED_HOSTS' , cast=Csv())

# database
LOCAL_MONGODB_URI=config('TEST_MONGODB_URI')
DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_backend',
        'HOST': LOCAL_MONGODB_URI,
        'NAME': 'PIXSYS_TEST',
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






