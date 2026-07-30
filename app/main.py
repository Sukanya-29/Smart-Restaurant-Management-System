# app/main.py
# python -m uvicorn app.main:app --reload


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import waiter
from app.routers import menu, orders, tables, inventory, staff, admin, customers, reports

app = FastAPI(
    title="Smart Restaurant Management System API",
    version="1.0.0",
    description="Backend API powering Customer QR ordering, KDS, Inventory, and Admin Gemini AI."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all 6 module routers
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(tables.router)
app.include_router(inventory.router)
app.include_router(staff.router)
app.include_router(admin.router)
app.include_router(customers.router)
app.include_router(reports.router)
app.include_router(waiter.router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "online", "message": "Smart Restaurant API is running smoothly."}
