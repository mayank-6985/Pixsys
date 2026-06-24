from functools import wraps
from rest_framework.permissions import AllowAny


def public_endpoint(view_func):
    """Decorator to mark a view method as public (AllowAny permission)."""
    @wraps(view_func)
    def wrapped(self, request, *args, **kwargs):
        # Temporarily set permission classes to AllowAny for this request
        previous = getattr(self, 'permission_classes', None)
        self.permission_classes = [AllowAny]
        try:
            return view_func(self, request, *args, **kwargs)
        finally:
            if previous is not None:
                self.permission_classes = previous
            else:
                delattr(self, 'permission_classes')

    return wrapped
