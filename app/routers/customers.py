# app/routers/customers.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

# Pydantic Schemas
class CustomerLogin(BaseModel):
    name: str
    phone: str
    table_no: str

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    visits: int
    spent: float

# In-Memory Database (Replace with SQLAlchemy / Supabase DB model if needed)
customers_db = [
    {
        "id": 1,
        "name": "Rahul Sharma",
        "email": "rahul@gmail.com",
        "phone": "9876543210",
        "visits": 12,
        "spent": 8450.0,
    },
    {
        "id": 2,
        "name": "Priya Singh",
        "email": "priya@gmail.com",
        "phone": "9876501234",
        "visits": 8,
        "spent": 5620.0,
    },
    {
        "id": 3,
        "name": "Aman Verma",
        "email": "aman@gmail.com",
        "phone": "9988776655",
        "visits": 15,
        "spent": 12480.0,
    },
]

@router.get("", response_model=List[CustomerResponse])
def get_all_customers():
    """Fetch all registered customers for Admin Dashboard"""
    return customers_db

@router.post("/login")
def customer_login(data: CustomerLogin):
    """
    Called from login/page.tsx when a customer enters name/phone.
    If phone exists -> increment visits count.
    If new phone -> create new customer entry.
    """
    clean_phone = data.phone.strip()
    clean_name = data.name.strip()

    for customer in customers_db:
        if customer["phone"] == clean_phone:
            customer["visits"] += 1
            if clean_name:
                customer["name"] = clean_name
            return {
                "status": "success",
                "message": "Customer visit recorded",
                "customer": customer
            }

    # If new customer
    new_customer = {
        "id": len(customers_db) + 1,
        "name": clean_name,
        "email": f"{clean_name.lower().replace(' ', '')}@gmail.com",
        "phone": clean_phone,
        "visits": 1,
        "spent": 0.0,
    }
    customers_db.append(new_customer)

    return {
        "status": "success",
        "message": "New customer registered successfully",
        "customer": new_customer
    }