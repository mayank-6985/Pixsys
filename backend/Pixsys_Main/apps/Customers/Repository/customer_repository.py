from ..models import PixsysCustomerModel

class CustomerRepository:
    def get_customer_list(self) -> list[dict]:
        """
        Returns a list of dictionaries containing the email and phone_number 
        of all customers.
        """
        # Using .values() to directly get a list of dicts with specific fields
        customers = PixsysCustomerModel.objects.values('email', 'phone_number')
        return list(customers)