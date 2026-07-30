from pydantic import BaseModel

class TableStatusUpdate(BaseModel):
    status: str
class TableResponse(BaseModel):
    id: int
    table_number: int
    capacity: int
    status: str  # available, occupied, reserved