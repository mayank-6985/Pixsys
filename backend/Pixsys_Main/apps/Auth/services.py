import random
from abc import ABC, abstractmethod
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from apps.Auth.models import PixsysCustomerModel, CustomerOTPModel

from django.core.mail.backends.smtp import EmailBackend
from apps.Auth.models import SystemSMTPConfig

# --- Interfaces ---
class IEmailSender(ABC):
    @abstractmethod
    def send(self, to_email: str, subject: str, text_body: str, html_body: str = None) -> bool:
        """Sends an email, optionally with an HTML alternative."""
        pass

class IEmailBuilder(ABC):
    @abstractmethod
    def build_otp_email(self, otp_code: str) -> dict:
        """Returns a dictionary containing 'subject', 'text_body', and 'html_body'."""
        pass

class IOTPGenerator(ABC):
    @abstractmethod
    def generate(self, length: int = 6) -> str:
        pass

# --- Concrete Implementations ---

class GoogleSMTPEmailSender(IEmailSender):
    """Handles sending multi-part emails via dynamic database SMTP configs cleanly."""
    def send(self, to_email: str, subject: str, text_body: str, html_body: str = None) -> bool:
        backend = None
        try:
            # 1. Fetch live DB configuration
            smtp_config = SystemSMTPConfig.load()
            
            # 2. Determine credentials
            if smtp_config.email_host_user and smtp_config.email_host_password:
                backend = EmailBackend(
                    host='smtp.gmail.com',
                    port=587,
                    use_tls=True,
                    username=smtp_config.email_host_user,
                    password=smtp_config.email_host_password,
                    fail_silently=False,
                )
                from_email = smtp_config.email_host_user
            else:
                backend = EmailBackend(
                    host=settings.EMAIL_HOST,
                    port=settings.EMAIL_PORT,
                    use_tls=settings.EMAIL_USE_TLS,
                    username=settings.EMAIL_HOST_USER,
                    password=settings.EMAIL_HOST_PASSWORD,
                    fail_silently=False,
                )
                from_email = settings.EMAIL_HOST_USER

            # 3. Explicitly open connection
            backend.open()

            # 4. Build and send the message
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_body,
                from_email=from_email,
                to=[to_email],
                connection=backend
            )
            
            if html_body:
                msg.attach_alternative(html_body, "text/html")
                
            msg.send(fail_silently=False)
            return True
            
        except Exception as e:
            # Optionally print/log error: print(f"SMTP Error: {e}")
            return False
        finally:
            # CRITICAL: Always close backend connection to free socket and RAM immediately
            if backend:
                backend.close()
                                         
class CustomerOTPEmailBuilder(IEmailBuilder):
    """Constructs an industry-standard responsive HTML template and text fallback."""
    
    def build_otp_email(self, otp_code: str) -> dict:
        subject = "Your Pixsys Verification Code"
        
        # The plain text fallback (crucial for spam avoidance)
        text_body = (
            f"Hello,\n\n"
            f"Your verification code is: {otp_code}\n\n"
            f"This code is valid for 10 minutes. If you did not request this, please ignore this email.\n\n"
            f"© {timezone.now().year} Pixsys. All rights reserved."
        )

        # Industry-standard HTML template with inline CSS
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=0.8">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                <tr>
                    <td style="padding: 40px 30px; text-align: center; background-color: #2563eb;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Pixsys Authentication</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <p style="color: #374151; font-size: 16px; margin-top: 0;">Hello,</p>
                        <p style="color: #374151; font-size: 16px;">Please use the verification code below to securely sign in to your account.</p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                            <span style="display: inline-block; font-size: 32px; font-weight: 700; color: #1e40af; letter-spacing: 6px; padding: 15px 30px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px;">
                                {otp_code}
                            </span>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
                            This code will expire in <strong>10 minutes</strong>.<br>
                            If you did not request this code, please safely ignore this email.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 30px; background-color: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                            © {timezone.now().year} Pixsys. All rights reserved.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """

        return {
            "subject": subject,
            "text_body": text_body,
            "html_body": html_body
        }

class NumericOTPGenerator(IOTPGenerator):
    """Generates a secure, numeric N-digit OTP."""
    def generate(self, length: int = 6) -> str:
        return ''.join([str(random.randint(0, 9)) for _ in range(length)])

# --- Orchestrator ---

class OTPManager:
    """Coordinates the generation, storage, and dispatch of OTPs."""
    def __init__(self, sender: IEmailSender, builder: IEmailBuilder, generator: IOTPGenerator):
        self.sender = sender
        self.builder = builder
        self.generator = generator

    def process_otp_for_customer(self, customer: PixsysCustomerModel) -> bool:
        otp_code = self.generator.generate()
        
        # Save or update the OTP in the database
        CustomerOTPModel.objects.update_or_create(
            customer=customer,
            defaults={
                'otp_code': otp_code,
                'expires_at': timezone.now() + timedelta(minutes=10)
            }
        )
        
        email_content = self.builder.build_otp_email(otp_code)
        
        # Pass both text and html bodies to the sender
        return self.sender.send(
            to_email=customer.email,
            subject=email_content['subject'],
            text_body=email_content['text_body'],
            html_body=email_content.get('html_body')
        )