from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.core.database import supabase
router = APIRouter(prefix="/waiter-requests", tags=["Waiter Service Requests"])

class ServiceRequestResponse(BaseModel):
    id: str
    table_no: str
    customer_name: str
    service: str
    status: str
    created_at: Optional[str] = None
    accepted_at: Optional[str] = None
    completed_at: Optional[str] = None

class StatusUpdateRequest(BaseModel):
    status: str


class ServiceRequestCreate(BaseModel):
    table_no: str
    customer_name: str
    service: str

@router.post("/", response_model=ServiceRequestResponse)
def create_service_request(payload: ServiceRequestCreate):
    try:
        data = {
            "table_no": payload.table_no,
            "customer_name": payload.customer_name,
            "service": payload.service,
            "status": "Pending"
        }
        response = supabase.table("service_requests").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create service request")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database insert error: {str(e)}")

    
@router.get("/", response_model=List[ServiceRequestResponse])
def get_service_requests():
    try:
        response = supabase.table("service_requests")\
            .select("*")\
            .neq("status", "Completed")\
            .order("created_at", desc= True)\
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.patch("/{request_id}/status")
def update_request_status(request_id: str, payload: StatusUpdateRequest):
    try:
        update_data = {"status": payload.status}
        if payload.status == "Accepted":
            update_data["accepted_at"] = datetime.utcnow().isoformat()
        elif payload.status == "Completed":
            update_data["completed_at"] = datetime.utcnow().isoformat()

        response = supabase.table("service_requests")\
            .update(update_data)\
            .eq("id", request_id)\
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Request not found")
        
        return {"message": "Status updated successfully", "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database update error: {str(e)}")