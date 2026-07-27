# app/schemas/menu.py

from pydantic import BaseModel
from typing import Optional

class MenuItemBase(BaseModel):
    id: int
    name: str
    category: str
    price: float
    is_available: bool = True
    prep_time: Optional[int] = None
    dietary_type: Optional[str] = "Veg"
    image_url: Optional[str] = None
    model_3d_url: Optional[str] = None

class MenuItemResponse(MenuItemBase):
    id: int

class MenuItemAvailabilityUpdate(BaseModel):
    is_available: bool

class MenuItemCreate(MenuItemBase):
    pass