import io
import openpyxl
from concurrent.futures import ThreadPoolExecutor
from ..Repository.customer_repository import CustomerRepository
from ...Utils.Utils_Service.utils_service import AWSUtilService

class ExcelService:
    def generate_excel(self, data: list[dict]) -> io.BytesIO:
        """
        Takes a list of dictionaries and creates an Excel file.
        The keys of the dictionary become the headers (columns).
        """
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = "Report"
        
        if not data:
            return io.BytesIO()

        # Extract headers from the keys of the first dictionary
        headers = list(data[0].keys())
        sheet.append(headers)

        # Append rows
        for row_dict in data:
            row_data = [row_dict.get(header, "") for header in headers]
            sheet.append(row_data)

        # Save to an in-memory stream
        file_stream = io.BytesIO()
        workbook.save(file_stream)
        file_stream.seek(0) # Reset stream pointer to the beginning
        
        return file_stream


class CustomerService:
    def __init__(self):
        self.repo = CustomerRepository()
        self.excel_service = ExcelService()
        self.aws_service = AWSUtilService()

    def get_customer_list(self) -> list[dict]:
        return self.repo.get_customer_list()

    def create_report(self) -> str:
        """
        Fetches customer data, generates an Excel report in a thread pool,
        uploads it to AWS, and returns the file URL.
        """
        # 1. Get the data
        data = self.get_customer_list()
        if not data:
            raise ValueError("No customer data available to generate report.")

        # 2. Generate Excel file in a threadpool
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(self.excel_service.generate_excel, data)
            excel_file_stream = future.result()

        # 3. Upload to AWS and return URL
        file_name = "customer_report.xlsx"
        report_url = self.aws_service.upload_file_stream_to_s3(
            file_stream=excel_file_stream, 
            file_name=file_name
        )
        
        if not report_url:
            raise Exception("Failed to upload the report to AWS S3.")
            
        return report_url