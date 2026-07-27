from fastapi import APIRouter, HTTPException
from typing import List
from app.core.database import supabase
from app.schemas.tables import TableResponse, TableStatusUpdate

router = APIRouter(prefix="/tables", tags=["Tables & Floor"])

@router.get("/", response_model=List[TableResponse])
def get_all_tables():
    response = supabase.table("tables").select("*").order("table_number").execute()
    return response.data

@router.patch("/{table_id}/status")
def update_table_status(table_id: int, payload: TableStatusUpdate):
    response = supabase.table("tables").update({"status": payload.status}).eq("id", table_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Table not found")
    return {"message": "Table status updated", "table": response.data[0]}
