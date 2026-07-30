# app/routers/reports.py

from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])

@router.get("/analytics")
def get_analytics(range: str = Query("Today")):
    # Sample analytics payload based on date range selected
    # Future me yahan Supabase ki 'orders' table se aggregate count/sum queries run hongi
    
    multiplier = 1.0
    if range == "This Week":
        multiplier = 1.5
    elif range == "This Month":
        multiplier = 4.2
    elif range == "This Year":
        multiplier = 45.0

    sales_data = [
        {"day": "Mon", "revenue": int(18500 * multiplier), "orders": int(72 * multiplier)},
        {"day": "Tue", "revenue": int(22100 * multiplier), "orders": int(81 * multiplier)},
        {"day": "Wed", "revenue": int(19800 * multiplier), "orders": int(75 * multiplier)},
        {"day": "Thu", "revenue": int(24300 * multiplier), "orders": int(90 * multiplier)},
        {"day": "Fri", "revenue": int(28400 * multiplier), "orders": int(106 * multiplier)},
        {"day": "Sat", "revenue": int(35200 * multiplier), "orders": int(134 * multiplier)},
        {"day": "Sun", "revenue": int(31800 * multiplier), "orders": int(120 * multiplier)},
    ]

    total_revenue = sum(item["revenue"] for item in sales_data)
    total_orders = sum(item["orders"] for item in sales_data)

    return {
        "range": range,
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "customers": int(1285 * (multiplier if multiplier < 5 else 12)),
        "growth": "+18.5%",
        "sales": sales_data,
        "top_items": [
            {"name": "Paneer Tikka", "sold": int(145 * multiplier), "revenue": int(36250 * multiplier)},
            {"name": "Veg Biryani", "sold": int(121 * multiplier), "revenue": int(30250 * multiplier)},
            {"name": "Margherita Pizza", "sold": int(118 * multiplier), "revenue": int(29500 * multiplier)},
            {"name": "Cold Coffee", "sold": int(97 * multiplier), "revenue": int(19400 * multiplier)},
        ],
        "kpis": {
            "avg_order_value": 845,
            "table_occupancy": "78%",
            "repeat_customers": "62%",
            "customer_rating": 4.8
        },
        "financial_summary": {
            "total_revenue": total_revenue,
            "total_expenses": int(total_revenue * 0.57),
            "net_profit": int(total_revenue * 0.43),
            "profit_margin": "43%"
        },
        "top_categories": [
            {"name": "Main Course", "revenue": int(82000 * multiplier)},
            {"name": "Beverages", "revenue": int(41500 * multiplier)},
            {"name": "Desserts", "revenue": int(29400 * multiplier)},
            {"name": "Starters", "revenue": int(27200 * multiplier)},
        ]
    }