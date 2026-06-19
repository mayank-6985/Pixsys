from django.test import TestCase
from unittest.mock import patch

from .models import SolutionsCategory, Solutions


class SolutionsModelTests(TestCase):

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_category_and_solution_save_assigns_ids_and_relates(self, mock_get_next_sequence):
        """Ensure category_id and solutions_id are assigned and relation is preserved."""
        # First call for category_id, second for solutions_id
        mock_get_next_sequence.side_effect = [9001, 9002]

        cat = SolutionsCategory.objects.create(
            category_name='Test Category',
            thumbnail='https://example.com/cat.jpg'
        )

        self.assertEqual(cat.category_id, 9001)
        self.assertEqual(cat.category_name, 'Test Category')

        sol = Solutions.objects.create(
            category=cat,
            title='Test Solution',
            thumbnail='https://example.com/sol.jpg'
        )

        self.assertEqual(sol.solutions_id, 9002)
        self.assertEqual(sol.title, 'Test Solution')
        self.assertEqual(sol.category, cat)

    def test_string_representations(self):
        # Create without counter by setting ids manually for string checks
        cat = SolutionsCategory(category_id=1234, category_name='C1', thumbnail='https://t')
        sol = Solutions(solutions_id=4321, category=cat, title='S1', thumbnail='https://t')

        self.assertEqual(str(cat), '1234')
        self.assertEqual(str(sol), '4321')
