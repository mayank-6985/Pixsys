# data models test
from django.test import TestCase
from unittest.mock import patch
from datetime import date
from .models import NewsModel, NewsContent

# =============================== DATABASE TEST =================================
class NewsWithContentTests(TestCase):

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_create_news_with_content_workflow(self, mock_get_next_sequence):
        """Test creating a News instance and immediately attaching structured content."""
        mock_get_next_sequence.return_value = 3001
        
        # 1. Create the News entry
        news_entry = NewsModel.objects.create(
            date=date.today(),
            heading="AI Breakthrough in 2026",
            thumbnail="https://example.com/thumb.jpg"
        )
        
        # 2. Define data matching your specific schema
        valid_schema_data = [
            {"type": "text", "description": "Researchers have announced a massive leap in quantum computing."},
            {"type": "image", "url": "https://example.com/quantum.jpg", "caption": "The new quantum chip prototype."}
        ]
        
        # 3. Create the content linked to that news entry
        news_content_entry = NewsContent.objects.create(
            news=news_entry,
            news_content=valid_schema_data
        )
        
        # 4. Assertions to verify they are perfectly linked and data is intact
        self.assertEqual(NewsContent.objects.count(), 1)
        self.assertEqual(news_content_entry.news.news_id, 3001)
        
        # Verify JSON array structure
        self.assertEqual(len(news_content_entry.news_content), 2)
        self.assertEqual(news_content_entry.news_content[0]['type'], 'text')
        self.assertEqual(news_content_entry.news_content[1]['type'], 'image')
        self.assertEqual(news_content_entry.news_content[1]['caption'], 'The new quantum chip prototype.')

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_json_content_supports_mixed_order(self, mock_get_next_sequence):
        """Edge Case: Ensure the schema supports multiple blocks in a different sequence."""
        mock_get_next_sequence.return_value = 3002
        news_entry = NewsModel.objects.create(
            date=date.today(),
            heading="Flexible Content Test",
            thumbnail="https://example.com/thumb.jpg"
        )
        
        # Schema with an alternative ordering (Image first, then multiple text blocks)
        mixed_schema_data = [
            {"type": "image", "url": "https://example.com/1.jpg", "caption": "Intro Image"},
            {"type": "text", "description": "First paragraph."},
            {"type": "text", "description": "Second paragraph."}
        ]
        
        content = NewsContent.objects.create(news=news_entry, news_content=mixed_schema_data)
        self.assertEqual(len(content.news_content), 3)
        self.assertEqual(content.news_content[0]['type'], 'image')

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_news_content_preserves_insertion_order(self, mock_get_next_sequence):
        """Verify that the array order of news_content is strictly preserved upon database retrieval."""
        mock_get_next_sequence.return_value = 3003
        
        news_entry = NewsModel.objects.create(
            date=date.today(),
            heading="Order Retention Test",
            thumbnail="https://example.com/thumb.jpg"
        )
        
        # 1. Define an explicit, multi-element layout sequence
        inserted_sequence = [
            {"type": "text", "description": "1. Introduction paragraph."},
            {"type": "image", "url": "https://example.com/img1.jpg", "caption": "2. Mid-article infographic."},
            {"type": "text", "description": "3. Explanatory structural content breakdown."},
            {"type": "video", "url": "https://example.com/vid1.mp4", "caption": "4. Explainer video clip."}
        ]
        
        # 2. Insert into the database
        content_entry = NewsContent.objects.create(
            news=news_entry,
            news_content=inserted_sequence
        )
        
        # 3. Force a database re-fetch to clear Python cache and test real serialization
        content_entry.refresh_from_db()
        retrieved_sequence = content_entry.news_content
        
        # 4. Assert structural lengths match perfectly
        self.assertEqual(len(retrieved_sequence), len(inserted_sequence))
        
        # 5. Loop through and assert that every element accurately retains its original relative position
        for index, original_block in enumerate(inserted_sequence):
            retrieved_block = retrieved_sequence[index]
            
            # Assert keys and type sequences match strictly by exact position index
            self.assertEqual(retrieved_block['type'], original_block['type'])
            
            if original_block['type'] == 'text':
                self.assertEqual(retrieved_block['description'], original_block['description'])
            else:
                self.assertEqual(retrieved_block['url'], original_block['url'])



# ============================== NEWS SERVICE TEST =============================
from django.test import TestCase
from unittest.mock import patch, MagicMock
from datetime import date
from apps.News.services.news_service import NewsService
from apps.News.Objects.newsObj import News, NewsContent
from apps.News.repositories.news_repo import NewsRepository
from apps.News.models import NewsModel, NewsContent

class NewsIntegrationTests(TestCase):
    def setUp(self):
        # A complex payload containing multiple different content block types
        self.complex_payload = {
            'date': '2026-06-18',
            'heading': 'Complete End-to-End Test Sequence',
            'thumbnail': 'https://example.com/integration_thumb.jpg',
            'content': [
                {'type': 'text', 'description': '1. This is the introductory text block.'},
                {'type': 'image', 'url': 'https://example.com/photo1.jpg', 'caption': '2. Supporting image.'},
                {'type': 'text', 'description': '3. Some more descriptive text.'},
                {'type': 'video', 'url': 'https://example.com/video.mp4', 'caption': '4. Closing video block.'}
            ]
        }

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_full_news_creation_lifecycle(self, mock_get_next_sequence):
        """
        Test the complete sequence:
        Raw Dict -> Service Validation -> Domain Objects -> Real Repository -> Real Database
        """
        # 1. Setup DB counter mock
        mock_get_next_sequence.return_value = 5005

        # 2. Instantiate the Service with the REAL Repository (No MagicMock here!)
        real_repo = NewsRepository()
        service = NewsService(repo=real_repo)

        # 3. Execute the service method (This triggers validation + saving)
        result = service.create_news(self.complex_payload)

        # 4. Assertions on the actual Database Models
        self.assertEqual(NewsModel.objects.count(), 1, "NewsModel was not saved to the DB.")
        self.assertEqual(NewsContent.objects.count(), 1, "NewsContent was not saved to the DB.")

        # 5. Fetch the saved records directly from the database
        saved_news = NewsModel.objects.first()
        saved_content_record = NewsContent.objects.first()

        # 6. Verify Base News Data
        self.assertEqual(saved_news.news_id, 5005)
        self.assertEqual(saved_news.heading, self.complex_payload['heading'])
        self.assertEqual(saved_news.thumbnail, self.complex_payload['thumbnail'])
        
        # Verify the date was correctly parsed and saved as a date object
        self.assertEqual(saved_news.date, date(2026, 6, 18))

        # 7. Verify the Content Array structure, order, and multiple types
        saved_blocks = saved_content_record.news_content
        
        self.assertEqual(len(saved_blocks), 4, "Incorrect number of content blocks saved.")
        
        # Block 0: Text
        self.assertEqual(saved_blocks[0]['type'], 'text')
        self.assertEqual(saved_blocks[0]['description'], '1. This is the introductory text block.')
        
        # Block 1: Image
        self.assertEqual(saved_blocks[1]['type'], 'image')
        self.assertEqual(saved_blocks[1]['url'], 'https://example.com/photo1.jpg')
        self.assertEqual(saved_blocks[1]['caption'], '2. Supporting image.')
        
        # Block 2: Text
        self.assertEqual(saved_blocks[2]['type'], 'text')
        self.assertEqual(saved_blocks[2]['description'], '3. Some more descriptive text.')
        
        # Block 3: Video
        self.assertEqual(saved_blocks[3]['type'], 'video')
        self.assertEqual(saved_blocks[3]['url'], 'https://example.com/video.mp4')
        self.assertEqual(saved_blocks[3]['caption'], '4. Closing video block.')

        # Verify the relational mapping matches
        self.assertEqual(saved_content_record.news, saved_news, "Foreign key relation is broken.")
        

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_delete_news_successful_lifecycle(self, mock_get_next_sequence):
        """Verify that deleting an existing news item completely removes it and its cascade dependents."""
        mock_get_next_sequence.return_value = 5005
        
        # 1. Setup service and seed database with a real news item
        service = NewsService(repo=NewsRepository())
        service.create_news(self.complex_payload)
        
        # Confirm creation was successful before running the deletion test
        self.assertEqual(NewsModel.objects.filter(news_id=5005).count(), 1)
        self.assertEqual(NewsContent.objects.count(), 1)

        # 2. Execute deletion sequence via service layer
        # (Note: If your service method passes through the return value, you can assign it here)
        service.delete_news(news_id=5005)

        # 3. Assertions to ensure records are entirely absent from the DB
        self.assertEqual(
            NewsModel.objects.filter(news_id=5005).count(), 
            0, 
            "NewsModel instance was not removed from the database."
        )
        self.assertEqual(
            NewsContent.objects.count(), 
            0, 
            "Cascaded NewsContent was left orphaned in the database."
        )

    def test_delete_news_not_found_raises_value_error(self):
        """Verify trying to delete a non-existent news_id raises a ValueError exception."""
        service = NewsService(repo=NewsRepository())
        
        # Ensure database is empty of this ID
        non_existent_id = 9999
        self.assertEqual(NewsModel.objects.filter(news_id=non_existent_id).count(), 0)

        # Assert that the repository logic successfully surfaces a ValueError
        with self.assertRaises(ValueError) as context:
            service.delete_news(news_id=non_existent_id)
            
        # Verify the exact exception message string matches your repo implementation
        self.assertEqual(str(context.exception), "News does not exists")

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_update_news_successful_lifecycle(self, mock_get_next_sequence):
        """Create a news item, update it via service, and verify DB reflects changes."""
        mock_get_next_sequence.return_value = 6001

        service = NewsService(repo=NewsRepository())

        # Create initial record
        service.create_news({
            'date': '2026-06-18',
            'heading': 'Original Heading',
            'thumbnail': 'https://example.com/orig.jpg',
            'content': [
                {'type': 'text', 'description': 'Original text.'}
            ]
        })

        saved = NewsModel.objects.get(news_id=6001)
        self.assertEqual(saved.heading, 'Original Heading')

        # Prepare update payload: change heading, thumbnail, content and date
        update_payload = {
            'date': '18-06-2026',  # different format to ensure parsing
            'heading': 'Updated Heading',
            'thumbnail': 'https://example.com/updated.jpg',
            'content': [
                {'type': 'image', 'url': 'https://example.com/new.jpg', 'caption': 'New image'}
            ]
        }

        result = service.update_news(news_id=6001, data=update_payload)

        # Refresh from DB and assert changes
        saved.refresh_from_db()
        content_record = NewsContent.objects.get(news__news_id=6001)

        self.assertEqual(saved.heading, 'Updated Heading')
        self.assertEqual(saved.thumbnail, 'https://example.com/updated.jpg')
        self.assertEqual(saved.date, date(2026, 6, 18))
        self.assertEqual(len(content_record.news_content), 1)
        self.assertEqual(content_record.news_content[0]['type'], 'image')

    def test_update_news_not_found_raises_value_error(self):
        """Attempting to update a non-existent news_id should raise ValueError."""
        service = NewsService(repo=NewsRepository())
        non_existent_id = 8888
        self.assertEqual(NewsModel.objects.filter(news_id=non_existent_id).count(), 0)

        with self.assertRaises(ValueError):
            service.update_news(news_id=non_existent_id, data={
                'date': '2026-01-01', 'heading': 'X', 'thumbnail': 'https://x', 'content': []
            })


class NewsServiceUnitTests(TestCase):
    """Integration-like unit tests for `get_all_news` using the real repo and DB seeds."""

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_get_all_news_returns_seeded_news(self, mock_get_next_sequence):
        mock_get_next_sequence.side_effect = [7001, 7002]

        # create two news entries using the real service/repo so DB is seeded
        service = NewsService(repo=NewsRepository())

        service.create_news({
            'date': '2026-01-01',
            'heading': 'Seed A',
            'thumbnail': 'https://example.com/a.jpg',
            'content': [
                {'type': 'text', 'description': 'Original text.'}
            ]
        })

        service.create_news({
            'date': '2026-02-02',
            'heading': 'Seed B',
            'thumbnail': 'https://example.com/b.jpg',
            'content': [
                {'type': 'text', 'description': 'Original text.'}
            ]
        })

        # Now call get_all_news and verify it returns a list with two items
        result = service.get_all_news()

        self.assertIsInstance(result, list)
        self.assertGreaterEqual(len(result), 2)

        # Verify at least the seeded headings appear in the returned list of dicts
        headings = {item.get('heading') for item in result}
        self.assertIn('Seed A', headings)
        self.assertIn('Seed B', headings)

    def test_get_all_news_empty_when_no_data(self):
        # Ensure DB empty and repository returns empty list
        service = NewsService(repo=NewsRepository())
        # Clean DB just in case
        from apps.News.models import NewsModel
        NewsModel.objects.all().delete()

        result = service.get_all_news()
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 0)

    @patch('apps.Utils.Counter_Service.services.CounterServices.get_next_sequence')
    def test_get_news_with_content_returns_full_record(self, mock_get_next_sequence):
        mock_get_next_sequence.return_value = 8001

        service = NewsService(repo=NewsRepository())
        payload = {
            'date': '2026-08-01',
            'heading': 'Full Content News',
            'thumbnail': 'https://example.com/full.jpg',
            'content': [
                {'type': 'text', 'description': 'Full content text.'},
                {'type': 'image', 'url': 'https://example.com/pic.jpg', 'caption': 'Pic'}
            ]
        }

        service.create_news(payload)

        result = service.get_news_with_content(news_id=8001)

        self.assertIsInstance(result, dict)
        self.assertEqual(result['news_id'], 8001)
        self.assertEqual(result['heading'], 'Full Content News')
        self.assertIn('news_content', result)
        self.assertEqual(len(result['news_content']), 2)

    def test_get_news_with_content_returns_none_for_missing(self):
        service = NewsService(repo=NewsRepository())
        # Ensure DB empty for this id
        self.assertIsNone(service.get_news_with_content(news_id=99999))