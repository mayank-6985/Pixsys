from django.test import TestCase

from apps.Products.repositories.products_repository import ProductRepository
from apps.Products.objects.product_objects import (
    ProductCategory,
    ProductSubcategory,
    Tag,
    Product,
)
from apps.Products.models import (
    ProductCategoryModel,
    ProductSubCategoryModel,
    TagModel,
    ProductModel,
)


# ---------------------------------------------------------------------------
# NOTE on DB backend (django_mongodb_backend):
# Standard TestCase relies on wrapping each test in a transaction and rolling
# it back. django_mongodb_backend supports this via MongoDB session
# transactions, but it depends on your MongoDB deployment running as a
# replica set (even a single-node one) and your backend version actually
# wiring TestCase's atomic rollback through to Mongo sessions.
#
# As a safety net against silent rollback failures (which would leak rows
# between tests and cause flaky failures unrelated to the code under test),
# every test class below also explicitly deletes its own created rows in
# tearDown(). This is redundant if rollback works correctly, and a real
# safeguard if it doesn't. If you confirm rollback is reliable in your setup,
# the tearDown methods can be deleted.
# ---------------------------------------------------------------------------


class ProductCategoryRepositoryTests(TestCase):
    """Covers create_category, _get_category, update_category, delete_category."""

    def setUp(self):
        self.repo = ProductRepository()

    def tearDown(self):
        ProductCategoryModel.objects.all().delete()

    def _valid_category(self, **overrides):
        defaults = dict(
            category_name="PLC Systems",
            tagline="Reliable industrial control",
            category_img="https://example.com/category.jpg",
            thumbnail_mobile="https://example.com/category-m.jpg",
            thumbnail_desktop="https://example.com/category-d.jpg",
            operation="create",
        )
        defaults.update(overrides)
        return ProductCategory(**defaults)

    def test_create_category_persists_row(self):
        category = self._valid_category()
        result = self.repo.create_category(category)

        self.assertTrue(result)
        self.assertEqual(ProductCategoryModel.objects.count(), 1)

        row = ProductCategoryModel.objects.get()
        self.assertEqual(row.category_name, "PLC Systems")
        self.assertEqual(row.tagline, "Reliable industrial control")
        self.assertEqual(row.category_img, "https://example.com/category.jpg")
        self.assertIsNotNone(row.category_id)
        self.assertGreater(row.category_id, 0)

    def test_create_category_assigns_sequential_ids(self):
        first = self.repo.create_category(self._valid_category(category_name="First"))
        second = self.repo.create_category(self._valid_category(category_name="Second"))

        self.assertTrue(first)
        self.assertTrue(second)
        ids = list(
            ProductCategoryModel.objects.order_by("id").values_list("category_id", flat=True)
        )
        self.assertEqual(len(ids), 2)
        self.assertLess(ids[0], ids[1])

    def test_get_category_returns_model_instance(self):
        self.repo.create_category(self._valid_category())
        row = ProductCategoryModel.objects.get()

        lookup_obj = ProductCategory(category_id=row.category_id, operation=None)
        fetched = self.repo._get_category(lookup_obj)

        self.assertIsInstance(fetched, ProductCategoryModel)
        self.assertEqual(fetched.category_id, row.category_id)

    def test_get_category_raises_for_missing_id(self):
        lookup_obj = ProductCategory(category_id=999999, operation=None)
        with self.assertRaises(ValueError):
            self.repo._get_category(lookup_obj)

    def test_update_category_modifies_existing_row(self):
        self.repo.create_category(self._valid_category(category_name="Old Name"))
        row = ProductCategoryModel.objects.get()

        update_obj = ProductCategory(
            category_id=row.category_id,
            category_name="New Name",
            tagline="Updated tagline",
            category_img="https://example.com/new.jpg",
            thumbnail_mobile="https://example.com/new-m.jpg",
            thumbnail_desktop="https://example.com/new-d.jpg",
            operation="update",
        )
        result = self.repo.update_category(update_obj)

        self.assertTrue(result)
        row.refresh_from_db()
        self.assertEqual(row.category_name, "New Name")
        self.assertEqual(row.tagline, "Updated tagline")
        self.assertEqual(row.category_img, "https://example.com/new.jpg")

    def test_update_category_raises_for_missing_id(self):
        update_obj = ProductCategory(
            category_id=999999,
            category_name="Doesn't matter",
            tagline="Doesn't matter",
            category_img="https://example.com/x.jpg",
            thumbnail_mobile="https://example.com/x-m.jpg",
            thumbnail_desktop="https://example.com/x-d.jpg",
            operation="update",
        )
        with self.assertRaises(ValueError):
            self.repo.update_category(update_obj)

    def test_delete_category_removes_row(self):
        self.repo.create_category(self._valid_category())
        row = ProductCategoryModel.objects.get()

        delete_obj = ProductCategory(category_id=row.category_id, operation=None)
        result = self.repo.delete_category(delete_obj)

        self.assertTrue(result)
        self.assertEqual(ProductCategoryModel.objects.count(), 0)

    def test_delete_category_raises_for_missing_id(self):
        delete_obj = ProductCategory(category_id=999999, operation=None)
        with self.assertRaises(ValueError):
            self.repo.delete_category(delete_obj)


class ProductSubCategoryRepositoryTests(TestCase):
    """Covers create_subcategory, _get_subcategory, update_subcategory, delete_subcategory."""

    def setUp(self):
        self.repo = ProductRepository()
        parent = ProductCategory(
            category_name="PLC Systems",
            tagline="Reliable industrial control",
            category_img="https://example.com/category.jpg",
            thumbnail_mobile="https://example.com/category-m.jpg",
            thumbnail_desktop="https://example.com/category-d.jpg",
            operation="create",
        )
        self.repo.create_category(parent)
        self.category_row = ProductCategoryModel.objects.get()

    def tearDown(self):
        ProductSubCategoryModel.objects.all().delete()
        ProductCategoryModel.objects.all().delete()

    def _valid_subcategory(self, **overrides):
        defaults = dict(
            category_id=self.category_row.category_id,
            name="PAC/IPC",
            description="Programmable automation controllers",
            category_img="https://example.com/subcat.jpg",
            operation="create",
        )
        defaults.update(overrides)
        return ProductSubcategory(**defaults)

    def test_create_subcategory_persists_row_linked_to_parent(self):
        subcat = self._valid_subcategory()
        result = self.repo.create_subcategory(subcat)

        self.assertTrue(result)
        self.assertEqual(ProductSubCategoryModel.objects.count(), 1)

        row = ProductSubCategoryModel.objects.get()
        self.assertEqual(row.name, "PAC/IPC")
        # FK resolved and compared via the parent's business id, not Django pk
        self.assertEqual(row.category.category_id, self.category_row.category_id)
        self.assertIsNotNone(row.subcategory_id)

    def test_create_subcategory_raises_for_missing_parent(self):
        subcat = self._valid_subcategory(category_id=999999)
        with self.assertRaises(ValueError):
            self.repo.create_subcategory(subcat)

    def test_get_subcategory_returns_model_instance(self):
        self.repo.create_subcategory(self._valid_subcategory())
        row = ProductSubCategoryModel.objects.get()

        lookup_obj = ProductSubcategory(subcategory_id=row.subcategory_id, operation=None)
        fetched = self.repo._get_subcategory(lookup_obj)

        self.assertIsInstance(fetched, ProductSubCategoryModel)
        self.assertEqual(fetched.subcategory_id, row.subcategory_id)

    def test_get_subcategory_raises_for_missing_id(self):
        lookup_obj = ProductSubcategory(subcategory_id=999999, operation=None)
        with self.assertRaises(ValueError):
            self.repo._get_subcategory(lookup_obj)

    def test_update_subcategory_modifies_existing_row(self):
        self.repo.create_subcategory(self._valid_subcategory(name="Old Name"))
        row = ProductSubCategoryModel.objects.get()

        update_obj = ProductSubcategory(
            subcategory_id=row.subcategory_id,
            category_id=self.category_row.category_id,
            name="New Name",
            description="Updated description",
            category_img="https://example.com/updated.jpg",
            operation="update",
        )
        result = self.repo.update_subcategory(update_obj)

        self.assertTrue(result)
        row.refresh_from_db()
        self.assertEqual(row.name, "New Name")
        self.assertEqual(row.description, "Updated description")

    def test_update_subcategory_can_reparent(self):
        self.repo.create_subcategory(self._valid_subcategory())
        row = ProductSubCategoryModel.objects.get()

        other_parent = ProductCategory(
            category_name="Sensors",
            tagline="Detection and measurement",
            category_img="https://example.com/sensors.jpg",
            thumbnail_mobile="https://example.com/sensors-m.jpg",
            thumbnail_desktop="https://example.com/sensors-d.jpg",
            operation="create",
        )
        self.repo.create_category(other_parent)
        other_row = ProductCategoryModel.objects.exclude(
            category_id=self.category_row.category_id
        ).get()

        update_obj = ProductSubcategory(
            subcategory_id=row.subcategory_id,
            category_id=other_row.category_id,
            name=row.name,
            description=row.description,
            category_img=row.category_img,
            operation="update",
        )
        self.repo.update_subcategory(update_obj)

        row.refresh_from_db()
        # compare via business id, not Django pk
        self.assertEqual(row.category.category_id, other_row.category_id)

    def test_update_subcategory_raises_for_missing_id(self):
        update_obj = ProductSubcategory(
            subcategory_id=999999,
            category_id=self.category_row.category_id,
            name="X",
            description="X",
            category_img="https://example.com/x.jpg",
            operation="update",
        )
        with self.assertRaises(ValueError):
            self.repo.update_subcategory(update_obj)

    def test_delete_subcategory_removes_row(self):
        self.repo.create_subcategory(self._valid_subcategory())
        row = ProductSubCategoryModel.objects.get()

        delete_obj = ProductSubcategory(subcategory_id=row.subcategory_id, operation=None)
        result = self.repo.delete_subcategory(delete_obj)

        self.assertTrue(result)
        self.assertEqual(ProductSubCategoryModel.objects.count(), 0)

    def test_delete_subcategory_raises_for_missing_id(self):
        delete_obj = ProductSubcategory(subcategory_id=999999, operation=None)
        with self.assertRaises(ValueError):
            self.repo.delete_subcategory(delete_obj)


class TagRepositoryTests(TestCase):
    """Covers create_tag, _get_tag, update_tag, delete_tag."""

    def setUp(self):
        self.repo = ProductRepository()

        category = ProductCategory(
            category_name="PLC Systems",
            tagline="Reliable industrial control",
            category_img="https://example.com/category.jpg",
            thumbnail_mobile="https://example.com/category-m.jpg",
            thumbnail_desktop="https://example.com/category-d.jpg",
            operation="create",
        )
        self.repo.create_category(category)
        self.category_row = ProductCategoryModel.objects.get()

        subcategory = ProductSubcategory(
            category_id=self.category_row.category_id,
            name="PAC/IPC",
            description="Programmable automation controllers",
            category_img="https://example.com/subcat.jpg",
            operation="create",
        )
        self.repo.create_subcategory(subcategory)
        self.subcategory_row = ProductSubCategoryModel.objects.get()

    def tearDown(self):
        TagModel.objects.all().delete()
        ProductSubCategoryModel.objects.all().delete()
        ProductCategoryModel.objects.all().delete()

    def _valid_tag(self, **overrides):
        defaults = dict(
            subcategory_id=self.subcategory_row.subcategory_id,
            name="Q Series",
            thumbnail_mobile="https://example.com/tag-m.jpg",
            thumbnail_desktop="https://example.com/tag-d.jpg",
            operation="create",
        )
        defaults.update(overrides)
        return Tag(**defaults)

    def test_create_tag_persists_row_linked_to_parent(self):
        tag = self._valid_tag()
        result = self.repo.create_tag(tag)

        self.assertTrue(result)
        self.assertEqual(TagModel.objects.count(), 1)

        row = TagModel.objects.get()
        self.assertEqual(row.name, "Q Series")
        self.assertEqual(row.subcategory.subcategory_id, self.subcategory_row.subcategory_id)
        self.assertIsNotNone(row.tag_id)

    def test_create_tag_raises_for_missing_parent(self):
        tag = self._valid_tag(subcategory_id=999999)
        with self.assertRaises(ValueError):
            self.repo.create_tag(tag)

    def test_get_tag_returns_model_instance(self):
        self.repo.create_tag(self._valid_tag())
        row = TagModel.objects.get()

        lookup_obj = Tag(tag_id=row.tag_id, operation=None)
        fetched = self.repo._get_tag(lookup_obj)

        self.assertIsInstance(fetched, TagModel)
        self.assertEqual(fetched.tag_id, row.tag_id)

    def test_get_tag_raises_for_missing_id(self):
        lookup_obj = Tag(tag_id=999999, operation=None)
        with self.assertRaises(ValueError):
            self.repo._get_tag(lookup_obj)

    def test_update_tag_modifies_existing_row(self):
        self.repo.create_tag(self._valid_tag(name="Old Name"))
        row = TagModel.objects.get()

        update_obj = Tag(
            tag_id=row.tag_id,
            subcategory_id=self.subcategory_row.subcategory_id,
            name="New Name",
            thumbnail_mobile="https://example.com/updated-m.jpg",
            thumbnail_desktop="https://example.com/updated-d.jpg",
            operation="update",
        )
        result = self.repo.update_tag(update_obj)

        self.assertTrue(result)
        row.refresh_from_db()
        self.assertEqual(row.name, "New Name")
        self.assertEqual(row.thumbnail_mobile, "https://example.com/updated-m.jpg")

    def test_update_tag_can_reparent(self):
        self.repo.create_tag(self._valid_tag())
        row = TagModel.objects.get()

        other_subcategory = ProductSubcategory(
            category_id=self.category_row.category_id,
            name="PLC",
            description="Programmable logic controllers",
            category_img="https://example.com/plc.jpg",
            operation="create",
        )
        self.repo.create_subcategory(other_subcategory)
        other_row = ProductSubCategoryModel.objects.exclude(
            subcategory_id=self.subcategory_row.subcategory_id
        ).get()

        update_obj = Tag(
            tag_id=row.tag_id,
            subcategory_id=other_row.subcategory_id,
            name=row.name,
            thumbnail_mobile=row.thumbnail_mobile,
            thumbnail_desktop=row.thumbnail_desktop,
            operation="update",
        )
        self.repo.update_tag(update_obj)

        row.refresh_from_db()
        self.assertEqual(row.subcategory.subcategory_id, other_row.subcategory_id)

    def test_update_tag_raises_for_missing_id(self):
        update_obj = Tag(
            tag_id=999999,
            subcategory_id=self.subcategory_row.subcategory_id,
            name="X",
            thumbnail_mobile="https://example.com/x-m.jpg",
            thumbnail_desktop="https://example.com/x-d.jpg",
            operation="update",
        )
        with self.assertRaises(ValueError):
            self.repo.update_tag(update_obj)

    def test_delete_tag_removes_row(self):
        self.repo.create_tag(self._valid_tag())
        row = TagModel.objects.get()

        delete_obj = Tag(tag_id=row.tag_id, operation=None)
        result = self.repo.delete_tag(delete_obj)

        self.assertTrue(result)
        self.assertEqual(TagModel.objects.count(), 0)

    def test_delete_tag_raises_for_missing_id(self):
        delete_obj = Tag(tag_id=999999, operation=None)
        with self.assertRaises(ValueError):
            self.repo.delete_tag(delete_obj)


class ProductRepositoryTests(TestCase):
    """Covers create_product, _get_product, update_product, delete_product."""

    def setUp(self):
        self.repo = ProductRepository()

        category = ProductCategory(
            category_name="PLC Systems",
            tagline="Reliable industrial control",
            category_img="https://example.com/category.jpg",
            thumbnail_mobile="https://example.com/category-m.jpg",
            thumbnail_desktop="https://example.com/category-d.jpg",
            operation="create",
        )
        self.repo.create_category(category)
        self.category_row = ProductCategoryModel.objects.get()

        subcategory = ProductSubcategory(
            category_id=self.category_row.category_id,
            name="PAC/IPC",
            description="Programmable automation controllers",
            category_img="https://example.com/subcat.jpg",
            operation="create",
        )
        self.repo.create_subcategory(subcategory)
        self.subcategory_row = ProductSubCategoryModel.objects.get()

        tag = Tag(
            subcategory_id=self.subcategory_row.subcategory_id,
            name="Q Series",
            thumbnail_mobile="https://example.com/tag-m.jpg",
            thumbnail_desktop="https://example.com/tag-d.jpg",
            operation="create",
        )
        self.repo.create_tag(tag)
        self.tag_row = TagModel.objects.get()

    def tearDown(self):
        ProductModel.objects.all().delete()
        TagModel.objects.all().delete()
        ProductSubCategoryModel.objects.all().delete()
        ProductCategoryModel.objects.all().delete()

    def _valid_product(self, **overrides):
        defaults = dict(
            tag_id=self.tag_row.tag_id,
            name="Q Plus Series",
            tagline="Powerful performance, flexible expansion",
            description="Full description of the Q Plus Series controller.",
            product_img="https://example.com/product.jpg",
            operation="create",
        )
        defaults.update(overrides)
        return Product(**defaults)

    def test_create_product_persists_row_linked_to_parent(self):
        product = self._valid_product()
        result = self.repo.create_product(product)

        self.assertTrue(result)
        self.assertEqual(ProductModel.objects.count(), 1)

        row = ProductModel.objects.get()
        self.assertEqual(row.name, "Q Plus Series")
        self.assertEqual(row.tag.tag_id, self.tag_row.tag_id)
        self.assertIsNotNone(row.product_id)

    def test_create_product_raises_for_missing_parent(self):
        product = self._valid_product(tag_id=999999)
        with self.assertRaises(ValueError):
            self.repo.create_product(product)

    def test_get_product_returns_model_instance(self):
        self.repo.create_product(self._valid_product())
        row = ProductModel.objects.get()

        lookup_obj = Product(product_id=row.product_id, operation=None)
        fetched = self.repo._get_product(lookup_obj)

        self.assertIsInstance(fetched, ProductModel)
        self.assertEqual(fetched.product_id, row.product_id)

    def test_get_product_raises_for_missing_id(self):
        lookup_obj = Product(product_id=999999, operation=None)
        with self.assertRaises(ValueError):
            self.repo._get_product(lookup_obj)

    def test_update_product_modifies_existing_row(self):
        self.repo.create_product(self._valid_product(name="Old Name"))
        row = ProductModel.objects.get()

        update_obj = Product(
            product_id=row.product_id,
            tag_id=self.tag_row.tag_id,
            name="New Name",
            tagline="Updated tagline",
            description="Updated description",
            product_img="https://example.com/updated.jpg",
            operation="update",
        )
        result = self.repo.update_product(update_obj)

        self.assertTrue(result)
        row.refresh_from_db()
        self.assertEqual(row.name, "New Name")
        self.assertEqual(row.product_img, "https://example.com/updated.jpg")

    def test_update_product_can_reparent(self):
        self.repo.create_product(self._valid_product())
        row = ProductModel.objects.get()

        other_tag = Tag(
            subcategory_id=self.subcategory_row.subcategory_id,
            name="V100 Series",
            thumbnail_mobile="https://example.com/v100-m.jpg",
            thumbnail_desktop="https://example.com/v100-d.jpg",
            operation="create",
        )
        self.repo.create_tag(other_tag)
        other_row = TagModel.objects.exclude(tag_id=self.tag_row.tag_id).get()

        update_obj = Product(
            product_id=row.product_id,
            tag_id=other_row.tag_id,
            name=row.name,
            tagline=row.tagline,
            description=row.description,
            product_img=row.product_img,
            operation="update",
        )
        self.repo.update_product(update_obj)

        row.refresh_from_db()
        self.assertEqual(row.tag.tag_id, other_row.tag_id)

    def test_update_product_raises_for_missing_id(self):
        update_obj = Product(
            product_id=999999,
            tag_id=self.tag_row.tag_id,
            name="X",
            tagline="",
            description="",
            product_img="https://example.com/x.jpg",
            operation="update",
        )
        with self.assertRaises(ValueError):
            self.repo.update_product(update_obj)

    def test_delete_product_removes_row(self):
        self.repo.create_product(self._valid_product())
        row = ProductModel.objects.get()

        delete_obj = Product(product_id=row.product_id, operation=None)
        result = self.repo.delete_product(delete_obj)

        self.assertTrue(result)
        self.assertEqual(ProductModel.objects.count(), 0)

    def test_delete_product_raises_for_missing_id(self):
        delete_obj = Product(product_id=999999, operation=None)
        with self.assertRaises(ValueError):
            self.repo.delete_product(delete_obj)