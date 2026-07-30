from pydantic import BaseModel

class InventoryStockUpdate(BaseModel):
    current_stock: float

class InventoryResponse(BaseModel):
    id: int
    item_name: str
    current_stock: float
    unit: str
    reorder_level: float
    cost_per_unit: float