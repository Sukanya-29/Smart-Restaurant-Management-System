# /app/schemas/orders.py

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(gt=0, description="Quantity must be greater than 0")

class OrderItemResponse(OrderItemCreate):
    id: int
    order_id: int

class OrderCreate(BaseModel):
    table_id: int
    customer_name: Optional[str] = "Guest"
    customer_phone: Optional[str] = None
    payment_method: Optional[str] = "UPI"  # 'UPI', 'Cash', 'Card'
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: Literal["pending", "preparing", "ready", "served", "completed"]

class PaymentStatusUpdate(BaseModel):
    payment_status: Literal['unpaid', 'paid']
    payment_method: Optional[str] = "UPI"

class OrderResponse(BaseModel):
    id: int
    table_id: int
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    total_amount: float
    status: str
    payment_status: str
    payment_method: Optional[str] = None
    created_at: Optional[str] = None
    order_items: Optional[List[OrderItemResponse]] = []
    