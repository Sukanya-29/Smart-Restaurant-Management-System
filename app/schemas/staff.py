from pydantic import BaseModel

class StaffShiftUpdate(BaseModel):
    shift_status: str  # 'On Duty', 'Off Duty'

class StaffResponse(BaseModel):
    id: int
    name: str
    role: str  # 'Manager', 'Head Chef', 'Waiter'
    shift_status: str