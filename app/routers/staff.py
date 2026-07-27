from fastapi import APIRouter, HTTPException
from typing import List
from app.core.database import supabase
from app.schemas.staff import StaffResponse, StaffShiftUpdate

router = APIRouter(prefix="/staff", tags=["Staff Roster"])

@router.get("/", response_model=List[StaffResponse])
def get_staff_list():
    response = supabase.table("staff").select("*").execute()
    return response.data

@router.patch("/{staff_id}/shift")
def update_shift_status(staff_id: int, payload: StaffShiftUpdate):
    response = supabase.table("staff").update({"shift_status": payload.shift_status}).eq("id", staff_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return {"message": "Shift status updated", "staff": response.data[0]}
