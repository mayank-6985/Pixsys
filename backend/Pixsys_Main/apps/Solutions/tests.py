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
    """Tests for SolutionsService.create_category including full DB insertion."""

    @patch('apps.Solutions.Services.solutions_service.SolutionsRepo')
    def test_create_category_calls_repo_and_returns_success(self, mock_repo_class):
        mock_repo = mock_repo_class.return_value
        mock_repo.category_exist.return_value = False
        mock_repo.create_category.return_value = True

        from apps.Solutions.Services.solutions_service import SolutionsService

        service = SolutionsService(repo=mock_repo)

        data = {'category_name': 'NewCat', 'thumbnail': 'https://example.com/new.jpg'}
        result = service.create_category(data=data)

        mock_repo.category_exist.assert_called_once()
        # create_category should be called with an instance, not the class
        called_arg = mock_repo.create_category.call_args[1].get('category') or mock_repo.create_category.call_args[0][0]
        from apps.Solutions.Objects.solutionObj import SolutionCategory
        self.assertIsInstance(called_arg, SolutionCategory)
        self.assertTrue(result)


class SolutionsIntegrationTests(TestCase):
    """Integration tests covering service + repo + DB for Solutions features."""

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_full_category_solution_lifecycle(self, mock_get_next_sequence):
        # sequence: category id then solution id
        mock_get_next_sequence.side_effect = [12001, 12002]

        from apps.Solutions.Services.solutions_service import SolutionsService
        service = SolutionsService(repo=None)

        # create category
        res_cat = service.create_category({'category_name': 'LifeCycleCat', 'thumbnail': 'https://cat'})
        self.assertTrue(res_cat)

        # verify category persisted
        from apps.Solutions.models import SolutionsCategoryModel, SolutionsModel
        cat_qs = SolutionsCategoryModel.objects.get(category_id=12001)
        self.assertEqual(cat_qs.category_name, 'LIFECYCLECAT')

        # create solution under category
        payload = {'category_id': 12001, 'title': 'LC Solution', 'thumbnail': 'https://s', 'videoUrl': 'https://v'}
        res_sol = service.create_solution(payload)
        self.assertTrue(res_sol)

        # verify solution persisted and linked
        sol_qs = SolutionsModel.objects.get(solutions_id=12002)
        self.assertEqual(sol_qs.title, 'LC Solution')
        self.assertEqual(sol_qs.category.category_id, 12001)

        # update solution
        upd_payload = {'category_id': 12001, 'title': 'LC Solution Updated', 'thumbnail': 'https://s2', 'videoUrl': 'https://v2'}
        res_upd = service.update_solution(upd_payload)
        self.assertTrue(res_upd)

        sol_qs.refresh_from_db()
        self.assertEqual(sol_qs.title, 'LC Solution Updated')

        # get solution via service
        got = service.get_solution({'solutions_id': sol_qs.solutions_id})
        self.assertEqual(got['title'], 'LC Solution Updated')

        # delete solution
        res_del = service.delete_solution({'solutions_id': sol_qs.solutions_id})
        self.assertTrue(res_del)
        self.assertEqual(SolutionsModel.objects.filter(solutions_id=sol_qs.solutions_id).count(), 0)

        # delete category
        res_del_cat = service.delete_category({'category_id': cat_qs.category_id})
        self.assertTrue(res_del_cat)
        self.assertEqual(SolutionsCategoryModel.objects.filter(category_id=cat_qs.category_id).count(), 0)

    def test_repo_getters_and_listings(self):
        # seed category and solution directly then exercise repo getters
        from apps.Solutions.models import SolutionsCategoryModel, SolutionsModel
        c = SolutionsCategoryModel.objects.create(category_name='RepoTestCat', thumbnail='x')
        s = SolutionsModel.objects.create(category=c, title='RepoSol', thumbnail='x')

        from apps.Solutions.repositories.solutions_repo import SolutionsRepo
        repo = SolutionsRepo()

        cat = repo.get_category(category=type('T', (), {'category_id': c.category_id}))
        self.assertIsInstance(cat, dict)
        sol = repo.get_solution(solution=type('T', (), {'solutions_id': s.solutions_id}))
        self.assertIsInstance(sol, dict)

        all_cats = repo.get_all_solutions_category()
        self.assertIsInstance(all_cats, list)
        self.assertGreaterEqual(len(all_cats), 1)

    def test_create_solution_raises_if_category_missing(self):
        from apps.Solutions.Services.solutions_service import SolutionsService
        # mock repo so get_category_qs returns None
        class DummyRepo:
            def get_category_qs(self, category):
                return None

        service = SolutionsService(repo=DummyRepo())
        with self.assertRaises(ValueError):
            service.create_solution({
                'category_name': 'NoCat', 'title': 'T', 'thumbnail': 'https://t', 'videoUrl': 'https://v'
            })

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_create_solution_full_cycle_inserts_db(self, mock_get_next_sequence):
        # seed category id
        mock_get_next_sequence.return_value = 11001

        from apps.Solutions.Services.solutions_service import SolutionsService
        service = SolutionsService(repo=None)

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

        from apps.Solutions.Services.solutions_service import SolutionsService
        service = SolutionsService(repo=None)

        data = {'category_name': 'InsertedCat', 'thumbnail': 'https://example.com/ins.jpg'}
        result = service.create_category(data=data)

        # Verify DB has the category
        from apps.Solutions.models import SolutionsCategoryModel
        saved = SolutionsCategoryModel.objects.get(category_id=10001)
        self.assertEqual(saved.category_name, 'INSERTEDCAT')
        self.assertTrue(result)
