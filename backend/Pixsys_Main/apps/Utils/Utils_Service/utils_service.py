from urllib.parse import urlparse
import boto3
from django.conf import settings
from botocore.exceptions import ClientError
import uuid
class UtilsService:
    @staticmethod
    def is_valid_url_string(url_string):
        if not url_string or url_string is None:
            raise ValueError("Url can't be empty")
        
        # Enforce that it must be a string first
        if not isinstance(url_string, str):
            raise TypeError("Url must be a string URL")
        
        try:
            parsed_url = urlparse(url_string.strip())
            # A valid URL requires at least a scheme (http/https) and a netloc (domain)
            if not parsed_url.scheme or not parsed_url.netloc:
                raise ValueError("Url must be a valid URL (e.g., https://example.com/image.jpg)")
                
            # Optional: Restrict to web URLs only
            if parsed_url.scheme not in ['http', 'https']:
                raise ValueError("Url URL must use HTTP or HTTPS")
                     
        except Exception:
            raise ValueError("Url is not a well-formed URL")  


class AWSUtilService:
 
    def generate_s3_upload_url(self,file_name, file_type):
        """
        Generates a presigned URL that a frontend client can use to upload a file directly to S3.
        """
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
            config=boto3.session.Config(signature_version=settings.AWS_S3_SIGNATURE_VERSION)
        )

        # Clean the file name to prevent accidental overwrites (e.g., using a UUID prefix)
        unique_id = uuid.uuid4().hex
        s3_file_key = f"uploads/{unique_id}_{file_name}"

        try:
            # Generate the presigned URL for a PUT request
            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                    'Key': s3_file_key,
                    'ContentType': file_type
                },
                ExpiresIn=300 # URL valid for 5 minutes
            )
            
            # Calculate the ultimate direct link where the file will be publicly/securely viewable
            # after upload finishes
            final_file_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_file_key}"
            
            return {
                "upload_url": presigned_url,
                "file_url": final_file_url
            }
        except ClientError as e:
            print(f"Error generating presigned URL: {e}")
            return None
        
    def upload_file_stream_to_s3(self, file_stream, file_name: str, file_type: str = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") -> str:
        """
        Accepts an in-memory file stream and uploads it directly to S3.
        Returns the public/protected URL of the uploaded file.
        """
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
            config=boto3.session.Config(signature_version=settings.AWS_S3_SIGNATURE_VERSION)
        )

        unique_id = uuid.uuid4().hex
        s3_file_key = f"reports/{unique_id}_{file_name}"

        try:
            # Upload the in-memory file object
            s3_client.upload_fileobj(
                file_stream,
                settings.AWS_STORAGE_BUCKET_NAME,
                s3_file_key,
                ExtraArgs={'ContentType': file_type}
            )
            
            final_file_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_file_key}"
            return final_file_url
            
        except ClientError as e:
            print(f"Error uploading file to S3: {e}")
            return None