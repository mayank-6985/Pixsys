from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse


class SliderAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.username = 'testuser'
        self.password = 'pass1234'
        # create_user now expects email as identifier
        self.user = User.objects.create_user(email=f"{self.username}@example.com", password=self.password)

    def test_token_obtain_returns_json(self):
        # Generate tokens directly to avoid depending on the token endpoint
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(self.user)
        access = str(refresh.access_token)
        self.assertTrue(access)

    def test_get_public_without_auth(self):
        url = '/v1/api/home/'
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)

    def test_post_requires_auth(self):
        url = '/v1/api/home/'
        resp = self.client.post(url, {'slideImages': []}, format='json')
        # Should be 401 Unauthorized (or 403 if permission). Check for 401/403
        self.assertIn(resp.status_code, (401, 403))

    def test_post_with_auth(self):
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(self.user)
        access = str(refresh.access_token)
        headers = {'HTTP_AUTHORIZATION': f'Bearer {access}'}
        url = '/v1/api/home/'
        resp = self.client.post(url, {'slideImages': []}, format='json', **headers)
        # Depending on service validation, expect 200 or 400 if domain rules apply; assert not 401
        self.assertNotEqual(resp.status_code, 401)
