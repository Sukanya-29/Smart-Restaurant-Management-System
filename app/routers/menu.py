# app/routers/menu.py

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.core.database import supabase
from app.schemas.menu import MenuItemCreate, MenuItemResponse, MenuItemAvailabilityUpdate

router = APIRouter(prefix="/menu", tags=["Digital Menu"])

@router.get("/", response_model=List[MenuItemResponse])
def get_menu(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    dietary_type: Optional[str] = Query(None),
    available_only: bool = False
):
    try:
        query = supabase.table("menu_items").select("*")
        
        # 1. Filter by availability
        if available_only:
            query = query.eq("is_available", True)
            
        # 2. Filter by category (ignoring empty or default 'string' inputs)
        if category and category.strip() and category.strip().lower() != "string":
            query = query.eq("category", category.strip())
            
        # 3. Filter by dietary type (Veg, Non-Veg, Jain)
        if dietary_type and dietary_type.strip() and dietary_type.strip().lower() != "string":
            query = query.eq("dietary_type", dietary_type.strip())
            
        # 4. Search filter using '*' wildcard for PostgREST
        if search and search.strip() and search.strip().lower() != "string":
            query = query.ilike("name", f"%{search.strip()}%")            
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

@router.post("/", response_model=MenuItemResponse)
def add_menu_item(item: MenuItemCreate):
    response = supabase.table("menu_items").insert(item.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create menu item")
    return response.data[0]

@router.patch("/{item_id}/availability")
def update_item_availability(item_id: int, payload: MenuItemAvailabilityUpdate):
    response = supabase.table("menu_items").update({"is_available": payload.is_available}).eq("id", item_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Availability updated", "item": response.data[0]}