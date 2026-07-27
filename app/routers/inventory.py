from fastapi import APIRouter, HTTPException
from typing import List
from app.core.database import supabase
from app.schemas.inventory import InventoryResponse, InventoryStockUpdate

router = APIRouter(prefix="/inventory", tags=["Kitchen Inventory"])

@router.get("/", response_model=List[InventoryResponse])
def get_inventory():
    response = supabase.table("inventory").select("*").execute()
    return response.data

@router.get("/alerts")
def get_low_stock_alerts():
    # Returns raw materials where stock is <= reorder level
    response = supabase.table("inventory").select("*").execute()
    low_stock_items = [item for item in response.data if item["current_stock"] <= item["reorder_level"]]
    return {"low_stock_count": len(low_stock_items), "items": low_stock_items}

@router.patch("/{item_id}/stock")
def update_stock_level(item_id: int, payload: InventoryStockUpdate):
    response = supabase.table("inventory").update({"current_stock": payload.current_stock}).eq("id", item_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return {"message": "Stock level updated", "item": response.data[0]}
