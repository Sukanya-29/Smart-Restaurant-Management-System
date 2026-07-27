#  app/routers/orders.py

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.core.database import supabase
from app.schemas.orders import OrderCreate, OrderStatusUpdate, PaymentStatusUpdate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders & KDS"])

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate):

    table_check = supabase.table("tables").select("id").eq("id", order.table_id).execute()
    if not table_check.data:
        raise HTTPException(
            status_code=404, 
            detail=f"Table ID {order.table_id} does not exist in the database"
        )
    #  cal total
    calculated_total = 0.0
    line_items = []

    for item in order.items:
        # DB se single item ka price manga rahe hain
        menu_res = supabase.table("menu_items").select("price").eq("id", item.menu_item_id).execute()
        
        if not menu_res.data:
            raise HTTPException(
                status_code=404, 
                detail=f"Menu item with ID {item.menu_item_id} not found"
            )
        
        price_at_time = menu_res.data[0]["price"]
        calculated_total += price_at_time * item.quantity

        # Item dictionary prepare kar rahe hain
        line_items.append({
            "menu_item_id": item.menu_item_id,
            "quantity": item.quantity,
            "price_at_time": price_at_time
        })

    # 2. Orders table me insert karo (backend-calculated total amount ke sath)
    order_master = {
        "table_id": order.table_id,
        "customer_name": order.customer_name,
        "customer_phone": order.customer_phone,
        "total_amount": calculated_total,  # Frontend ki jagah backend vala total
        "status": "pending",
        "payment_status": "unpaid",
        "payment_method": order.payment_method
    }
    
    order_res = supabase.table("orders").insert(order_master).execute()
    if not order_res.data:
        raise HTTPException(status_code=400, detail="Order creation failed")
    
    created_order = order_res.data[0]
    order_id = created_order["id"]

    # 3. Order ID attach karke order_items table me save karo
    for line_item in line_items:
        line_item["order_id"] = order_id
    
    items_res = supabase.table("order_items").insert(line_items).execute()
    
    # 4. Table status ko 'occupied' mark karo
    supabase.table("tables").update({"status": "occupied"}).eq("id", order.table_id).execute()

    created_order["order_items"] = items_res.data
    return created_order

@router.get("/", response_model=List[OrderResponse])
def get_orders(status: Optional[str] = Query(None, description="pending, preparing, ready, served, completed")):
    query = supabase.table("orders").select("*, order_items(*, menu_items(name))")
    if status:
        query = query.eq("status", status)
        
    response = query.order("created_at", desc=True).execute()
    return response.data

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(order_id: int):
    response = supabase.table("orders").select("*, order_items(*, menu_items(name))").eq("id", order_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return response.data[0]

@router.patch("/{order_id}/status")
def update_order_status(order_id: int, payload: OrderStatusUpdate):
    response = supabase.table("orders").update({"status": payload.status}).eq("id", order_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # If order is completed, automatically release the table back to 'available'
    if payload.status == "completed":
        table_id = response.data[0]["table_id"]
        supabase.table("tables").update({"status": "available"}).eq("id", table_id).execute()

    return {"message": "Status updated successfully", "order": response.data[0]}

@router.patch("/{order_id}/payment")
def update_payment_status(order_id: int, payload: PaymentStatusUpdate):
    response = supabase.table("orders").update({
        "payment_status": payload.payment_status,
        "payment_method": payload.payment_method
    }).eq("id", order_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Payment status updated", "order": response.data[0]}