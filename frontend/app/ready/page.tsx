"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Home,
  ShoppingBag,
  Star,
  Loader2,
} from "lucide-react";

function ReadyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customerName, setCustomerName] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderNo, setOrderNo] = useState("");

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setCustomerName(localStorage.getItem("customerName") || "Guest");
    setTableNo(localStorage.getItem("tableNo") || "1");
    setPaymentMethod(localStorage.getItem("paymentMethod") || "UPI");

    // Real Order ID from URL or LocalStorage
    const idFromUrl = searchParams.get("order_id");
    const idFromLocal = localStorage.getItem("latestOrderId");
    setOrderNo(idFromUrl || idFromLocal || "1001");
  }, [searchParams]);

  const orderAgain = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("latestOrderId");
    router.push("/menu");
  };

  const backHome = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("latestOrderId");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-6 py-10">
      <div className="bg-white shadow-2xl rounded-[32px] w-full max-w-3xl p-10">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-5xl font-bold text-[#3F6B63] mt-8">
          Your Order is Ready!
        </h1>

        <p className="text-center text-gray-500 text-lg mt-4">
          Thank you for dining with VibeBite. Your delicious meal has been
          prepared successfully.
        </p>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#FDF8F2] rounded-2xl p-6">
            <p className="text-gray-500">Customer</p>
            <h2 className="text-2xl font-bold text-[#3F6B63] mt-2 capitalize">
              {customerName}
            </h2>
          </div>

          <div className="bg-[#FDF8F2] rounded-2xl p-6">
            <p className="text-gray-500">Table Number</p>
            <h2 className="text-2xl font-bold text-[#F97316] mt-2">
              Table {tableNo}
            </h2>
          </div>

          <div className="bg-[#FDF8F2] rounded-2xl p-6">
            <p className="text-gray-500">Order Number</p>
            <h2 className="text-2xl font-bold text-[#3F6B63] mt-2">
              #{orderNo}
            </h2>
          </div>

          <div className="bg-[#FDF8F2] rounded-2xl p-6">
            <p className="text-gray-500">Payment Method</p>
            <h2 className="text-2xl font-bold text-[#F97316] mt-2">
              {paymentMethod}
            </h2>
          </div>
        </div>

        {/* Rate Your Experience */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-[#3F6B63]">
            Rate Your Experience
          </h2>

          <p className="text-center text-gray-500 mt-2">
            We'd love to hear your feedback!
          </p>

          <div className="flex justify-center gap-3 mt-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform duration-200 hover:scale-125"
              >
                <Star
                  className={`w-10 h-10 ${
                    rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-10">
          <label className="block text-lg font-semibold text-[#3F6B63] mb-3">
            Tell us about your experience
          </label>

          <textarea
            rows={5}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your feedback here..."
            className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>

        {/* Thank You Message */}
        <div className="mt-10 rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
          <h3 className="text-2xl font-bold text-green-700">🎉 Thank You!</h3>

          <p className="text-gray-600 mt-3">
            We hope you enjoyed your meal. Your feedback helps us improve and
            serve you even better next time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <button
            onClick={backHome}
            className="flex-1 flex items-center justify-center gap-2 bg-[#3F6B63] hover:bg-[#355b54] text-white py-4 rounded-2xl text-lg font-semibold transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

          <button
            onClick={orderAgain}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white py-4 rounded-2xl text-lg font-semibold transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Order Again
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-gray-500 text-sm">❤️ Thank you for choosing</p>

          <h2 className="text-3xl font-bold text-[#F97316] mt-2">VibeBite</h2>

          <p className="text-gray-500 mt-3">
            We look forward to serving you again. Have a wonderful day!
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ReadyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2]">
          <Loader2 className="w-10 h-10 animate-spin text-[#F97316]" />
        </div>
      }
    >
      <ReadyContent />
    </Suspense>
  );
}