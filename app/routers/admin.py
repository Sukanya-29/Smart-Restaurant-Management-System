from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google import genai
from app.core.config import settings
from app.core.database import supabase

router = APIRouter(prefix="/admin", tags=["Admin & AI Assistant"])

ai_client = genai.Client(api_key=settings.GEMINI_API_KEY)

class AIQueryRequest(BaseModel):
    prompt: str

@router.get("/analytics")
def get_dashboard_analytics():
    orders = supabase.table("orders").select("*").execute().data
    
    total_revenue = sum(o["total_amount"] for o in orders if o["payment_status"] == "paid")
    total_orders = len(orders)
    active_kitchen_orders = len([o for o in orders if o["status"] in ["pending", "preparing"]])
    
    tables = supabase.table("tables").select("*").execute().data
    occupied_tables = len([t for t in tables if t["status"] == "occupied"])
    
    return {
        "today_revenue": total_revenue,
        "total_orders": total_orders,
        "active_kitchen_orders": active_kitchen_orders,
        "occupied_tables": occupied_tables,
        "total_tables": len(tables)
    }

@router.post("/ai-assistant")
def ai_restaurant_assistant(request: AIQueryRequest):
    try:
        # Context gathering from DB
        orders_data = supabase.table("orders").select("id, total_amount, status, payment_status, created_at").limit(30).execute().data
        inventory_data = supabase.table("inventory").select("item_name, current_stock, unit, reorder_level").execute().data
        menu_data = supabase.table("menu_items").select("name, category, price, is_available").execute().data
        staff_data = supabase.table("staff").select("name, role, shift_status").execute().data

        system_context = f"""
        You are an intelligent Assistant for a Restaurant Manager.
        Here is the live database snapshot:
        - Menu Items: {menu_data}
        - Kitchen Inventory: {inventory_data}
        - Active/Recent Orders: {orders_data}
        - Staff Roster: {staff_data}

        Answer the manager's query in short, precise bullet points based strictly on this context.
        Query: {request.prompt}
        """

        model = ai_client.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(system_context)
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini AI error: {str(e)}")
    