from django.test import TestCase
from unittest.mock import patch

from .models import SolutionsCategoryModel, SolutionsModel


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


class SolutionServiceTests(TestCase):
    """Tests for SolutionCategoryService.create_category including full DB insertion."""

    @patch('apps.Solutions.Services.solutions_service.SolutionsRepo')
    def test_create_category_calls_repo_and_returns_success(self, mock_repo_class):
        mock_repo = mock_repo_class.return_value
        mock_repo.category_exist.return_value = False
        mock_repo.create_category.return_value = True

        from apps.Solutions.Services.solutions_service import SolutionCategoryService

        service = SolutionCategoryService(repo=mock_repo)

        data = {'category_name': 'NewCat', 'thumbnail': 'https://example.com/new.jpg'}
        result = service.create_category(data=data)

        mock_repo.category_exist.assert_called_once()
        # create_category should be called with an instance, not the class
        called_arg = mock_repo.create_category.call_args[1].get('category') or mock_repo.create_category.call_args[0][0]
        from apps.Solutions.Objects.solutionObj import SolutionCategory
        self.assertIsInstance(called_arg, SolutionCategory)
        self.assertTrue(result)

    def test_create_solution_raises_if_category_missing(self):
        from apps.Solutions.Services.solutions_service import SolutionCategoryService
        # mock repo so get_category returns None
        class DummyRepo:
            def get_category(self, category):
                return None

        service = SolutionCategoryService(repo=DummyRepo())
        with self.assertRaises(ValueError):
            service.create_solution({
                'category_name': 'NoCat', 'title': 'T', 'thumbnail': 'https://t', 'videoUrl': 'https://v'
            })

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_create_solution_full_cycle_inserts_db(self, mock_get_next_sequence):
        # seed category id
        mock_get_next_sequence.return_value = 11001

        from apps.Solutions.Services.solutions_service import SolutionCategoryService
        service = SolutionCategoryService(repo=None)

        # first create category
        service.create_category({'category_name': 'CatForSol', 'thumbnail': 'https://cat'})

        # now create solution under that category
        payload = {'category_name': 'CatForSol', 'title': 'SolTitle', 'thumbnail': 'https://sol', 'videoUrl': 'https://vid'}
        # create_solution should insert the solution row
        result = service.create_solution(payload)

        from apps.Solutions.models import SolutionsModel
        saved = SolutionsModel.objects.filter(title='SolTitle').first()
        self.assertIsNotNone(saved)
        self.assertEqual(saved.title, 'SolTitle')
        self.assertTrue(result)

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_create_category_full_cycle_inserts_db(self, mock_get_next_sequence):
        # Counter returns a category id
        mock_get_next_sequence.return_value = 10001

        from apps.Solutions.Services.solutions_service import SolutionCategoryService
        service = SolutionCategoryService(repo=None)

        data = {'category_name': 'InsertedCat', 'thumbnail': 'https://example.com/ins.jpg'}
        result = service.create_category(data=data)

        # Verify DB has the category
        from apps.Solutions.models import SolutionsCategoryModel
        saved = SolutionsCategoryModel.objects.get(category_id=10001)
        self.assertEqual(saved.category_name, 'INSERTEDCAT')
        self.assertTrue(result)
