# data models test
from django.test import TestCase
from unittest.mock import patch
from datetime import date
from .models import NewsModel, NewsContent

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