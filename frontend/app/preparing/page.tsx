"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChefHat, Clock3, CheckCircle2, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function PreparingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("Guest");
  const [tableNo, setTableNo] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [status, setStatus] = useState("pending");
  const [progress, setProgress] = useState(25);
  const [minutesLeft, setMinutesLeft] = useState(15);
  const [loading, setLoading] = useState(true);

  // 1. URL search params ya localStorage se real order details load karo
  useEffect(() => {
    const idFromUrl = searchParams.get("order_id");
    const idFromLocal = localStorage.getItem("latestOrderId");
    const finalOrderId = idFromUrl || idFromLocal;

    if (finalOrderId) {
      setOrderId(finalOrderId);
    }

    setCustomerName(localStorage.getItem("customerName") || "Guest");
    setTableNo(localStorage.getItem("tableNo") || "1");
    setPaymentMethod(localStorage.getItem("paymentMethod") || "UPI");
  }, [searchParams]);

  // 2. Real Backend Polling: Check live order status every 3 seconds
  const fetchOrderStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        const currentStatus = (data.status || "pending").toLowerCase();
        setStatus(currentStatus);

        // Status ke mutabiq Progress Bar update karo
        if (currentStatus === "pending") {
          setProgress(25);
          setMinutesLeft(15);
        } else if (currentStatus === "preparing") {
          setProgress(65);
          setMinutesLeft(8);
        } else if (
          currentStatus === "ready" ||
          currentStatus === "served" ||
          currentStatus === "completed"
        ) {
          setProgress(100);
          setMinutesLeft(0);
          localStorage.setItem("latestOrderId", data.order_id);      
          }
      }
    } catch (error) {
      console.error("Error fetching live order status:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (!orderId) return;

    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 3000); // Every 3 sec status sync

    return () => clearInterval(interval);
  }, [orderId, fetchOrderStatus]);

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl p-10">
        {/* Chef Icon */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full bg-[#3F6B63] flex items-center justify-center animate-pulse">
            <ChefHat className="w-14 h-14 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl font-bold text-[#3F6B63] mt-8">
          {status === "preparing" ? "Chefs are Cooking!" : "Order Received"}
        </h1>

        <p className="text-center text-gray-500 mt-3 text-lg">
          Sit back and relax while our chefs prepare your delicious meal.
        </p>

        {/* Progress */}
        <div className="mt-10">
          <div className="flex justify-between text-sm font-semibold mb-3">
            <span>Cooking Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
            <div
              className="h-5 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: "#F97316",
              }}
            />
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          <div className="bg-[#FDF8F2] rounded-2xl p-6">
            <Clock3 className="text-[#F97316] w-8 h-8 mb-3" />
            <p className="text-gray-500">Estimated Time</p>
            <h2 className="text-3xl font-bold text-[#3F6B63]">
              {minutesLeft > 0 ? `${minutesLeft} min` : "Almost Ready!"}
            </h2>
          </div>

          <div className="bg-[#FDF8F2] rounded-2xl p-6">
            <CheckCircle2 className="text-[#3F6B63] w-8 h-8 mb-3" />
            <p className="text-gray-500">Order Number</p>
            <h2 className="text-3xl font-bold text-[#F97316]">
              #{orderId || "...."}
            </h2>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-gray-500 text-sm">Customer</p>
            <h3 className="text-xl font-bold text-[#3F6B63] mt-2 capitalize">
              {customerName}
            </h3>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-gray-500 text-sm">Table Number</p>
            <h3 className="text-xl font-bold text-[#F97316] mt-2">
              Table {tableNo}
            </h3>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-gray-500 text-sm">Payment</p>
            <h3 className="text-xl font-bold text-[#3F6B63] mt-2">
              {paymentMethod}
            </h3>
          </div>
        </div>

        {/* Live Status Banner */}
        <div className="mt-10 rounded-2xl bg-[#3F6B63] p-6 text-center text-white">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            👨‍🍳{" "}
            {status === "preparing"
              ? "Your meal is actively cooking"
              : "Order queued in kitchen"}
          </h2>

          <p className="mt-3 text-white/80">
            {status === "preparing"
              ? "Our chefs are currently assembling your dish with fresh ingredients."
              : "Kitchen has received your order and will start cooking shortly."}
          </p>
        </div>

        {/* Tips */}
        <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-200 p-5">
          <h3 className="font-bold text-[#F97316] mb-3">While You Wait...</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>🍽 Your order is prepared fresh after confirmation.</li>
            <li>🧑‍🍳 Average preparation time is 10–15 minutes.</li>
            <li>
              🔔 You'll be redirected automatically when your order is ready.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">Thank you for choosing</p>
          <h2 className="text-3xl font-bold text-[#F97316] mt-2">
            VibeBite ❤️
          </h2>
          <p className="text-gray-500 mt-3 text-xs">
            Auto-syncing live status with kitchen...
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PreparingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2]">
          <Loader2 className="w-10 h-10 animate-spin text-[#F97316]" />
        </div>
      }
    >
      <PreparingContent />
    </Suspense>
  );
}