from django.db import models
from ..Utils.Counter_Service.services import CounterServices

class ContactSubmissionModel(models.Model):
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email_address = models.EmailField()
    poul = models.CharField(max_length=255, blank=True, null=True, help_text="Poul details")
    industry = models.CharField(max_length=255, blank=True, null=True)
    product_of_interest = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    form_id = models.BigIntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Submission"
        verbose_name_plural = "Contact Submissions"
        db_table = "Contact_Submission_Table"

    def __str__(self):
        return f"{self.full_name} - {self.email_address}"
    
    def save(self ,*args, **kwargs):
        if not self.form_id:
            form_id = CounterServices.get_next_sequence('form')
            self.form_id = form_id
        return super().save(*args, **kwargs)
