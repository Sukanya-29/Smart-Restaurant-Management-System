"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, CheckCircle2, UtensilsCrossed, AlertCircle, ShoppingBag } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type OrderType = {
  id: number;
  table_id: number;
  customer_name?: string;
  total_amount: number;
  status: "pending" | "preparing" | "ready" | "served" | "completed";
  payment_status: string;
  order_items?: any[];
};

export default function TrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Fetch order_id from URL query params (e.g. /tracking?order_id=12) or fallback to local storage
  const orderId = searchParams.get("order_id") || (typeof window !== "undefined" ? localStorage.getItem("latest_order_id") : null);

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Poll order status every 5 seconds to provide live updates
  const fetchOrderStatus = async () => {
    if (!orderId) {
      setLoading(false);
      setError("No active order found.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`);
      if (!res.ok) {
        throw new Error("Order not found");
      }
      const data = await res.json();
      setOrder(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching order status:", err);
      setError(err.message || "Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 5000); // Live tracking poll
    return () => clearInterval(interval);
  }, [orderId]);

  // Determine active step index based on backend status
  const getStatusStep = (status?: string) => {
    switch (status) {
      case "pending":
        return 1;
      case "preparing":
        return 2;
      case "ready":
      case "served":
        return 3;
      case "completed":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(order?.status);

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center max-w-lg w-full">
        {loading ? (
          <div className="py-12 space-y-4">
            <Clock className="w-12 h-12 text-[#3F6B63] animate-spin mx-auto" />
            <p className="text-gray-500 font-medium">Fetching order status...</p>
          </div>
        ) : error || !order ? (
          <div className="py-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
            <p className="text-gray-500 mt-2">{error || "No recent order was detected."}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 bg-[#3F6B63] hover:bg-[#355b54] text-white font-semibold py-3 px-6 rounded-xl transition"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-6xl">🎉</h1>

            <h2 className="text-3xl font-bold mt-5 text-[#3F6B63]">
              Order #{order.id} Confirmed
            </h2>

            <p className="mt-2 text-gray-600">
              {order.customer_name ? `Thank you, ${order.customer_name}!` : "Your order has been received successfully."}
            </p>

            {/* Live Progress Timeline */}
            <div className="mt-8 space-y-3 text-left">
              <div
                className={`flex items-center gap-3 p-4 rounded-xl font-medium transition ${
                  currentStep >= 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-400"
                }`}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Order Received</span>
              </div>

              <div
                className={`flex items-center gap-3 p-4 rounded-xl font-medium transition ${
                  currentStep >= 2
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <UtensilsCrossed className="w-5 h-5 flex-shrink-0" />
                <span>
                  {order.status === "preparing"
                    ? "🍳 Order is being prepared in the kitchen..."
                    : "Kitchen Preparation"}
                </span>
              </div>

              <div
                className={`flex items-center gap-3 p-4 rounded-xl font-medium transition ${
                  currentStep >= 3
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                <span>
                  {order.status === "ready"
                    ? "🔔 Food is Ready to Serve!"
                    : order.status === "served"
                    ? "🍽️ Order Served to Table"
                    : "Ready to Serve"}
                </span>
              </div>
            </div>

            {/* Order Summary Details */}
            <div className="mt-6 bg-gray-50 p-4 rounded-xl text-left text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Table Number:</span>
                <span className="font-semibold text-gray-800">Table {order.table_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold text-gray-800">₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-semibold text-gray-800 capitalize">{order.payment_status}</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => router.push(`/preparing?order_id=${order.id}`)}
              className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition shadow-md hover:shadow-lg"
            >
              Continue to Kitchen View
            </button>
          </>
        )}
      </div>
    </main>
  );
}