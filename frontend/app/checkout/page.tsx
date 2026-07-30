"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  User,
  Phone,
  MapPin,
  FileText,
  Loader2,
} from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
  category?: string;
};

const DELIVERY_FEE = 49;
const GST_RATE = 0.05;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNo, setTableNo] = useState("1");
  const [orderType, setOrderType] = useState("Dine In");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Strips letters and symbols
    if (value.length <= 10) {
      setPhone(value);
      if (value.length > 0 && value.length < 10) {
        setPhoneError("Phone number must be exactly 10 digits.");
      } else {
        setPhoneError("");
      }
    }
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    setCustomerName(localStorage.getItem("customerName") || "Guest");
    setPhone(localStorage.getItem("customerPhone") || "");
    setTableNo(localStorage.getItem("tableNo") || "1");
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const gst = subtotal * GST_RATE;
  const delivery = orderType === "Delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + gst + delivery;

  const MERCHANT_UPI_ID = "vibebite@upi"; // Aapki restaurant ki UPI ID
  const upiLink = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=VibeBite%20Restaurant&am=${total.toFixed(2)}&cu=INR&tn=Order%20Payment`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  // Real API Order Submission to FastAPI Backend
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!phone || phone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Match FastAPI OrderCreate Schema payload
      const orderPayload = {
        table_id: parseInt(tableNo, 10) || 1,
        customer_name: customerName.trim() || "Guest",
        customer_phone: phone.trim() || null,
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.qty,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to place order");
      }

      // Store Order Details locally for the tracking/preparing view
      localStorage.setItem("latestOrderId", data.id);
      localStorage.setItem("customerName", customerName);
      localStorage.setItem("customerPhone", phone);
      localStorage.setItem("tableNo", tableNo);
      localStorage.setItem("chefNotes", notes);

      // Clear Cart after successful placement
      localStorage.removeItem("cart");

      // Redirect to preparing status page
      router.push(`/preparing?order_id=${data.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while placing order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF8F2] py-10 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#3F6B63] font-semibold hover:text-[#F97316]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-4xl font-bold text-[#3F6B63]">Checkout</h1>
          <div />
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 text-center text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#3F6B63] mb-5">
                Customer Details
              </h2>

              <div>
                <label className="font-medium">Phone</label>
                <div className={`flex items-center border rounded-xl mt-2 px-3 py-3 ${phoneError ? "border-red-500" : ""}`}>
                  <Phone className="w-5 h-5 text-gray-400" />
                  <input
                    className="ml-3 w-full outline-none"
                    value={phone}
                    onChange={handlePhoneChange} 
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
                {phoneError && <p className="text-red-500 text-xs mt-1 font-medium">{phoneError}</p>}
              </div>

              <div className="mt-5 bg-[#FDF8F2] rounded-xl p-4">
                <p className="text-sm text-gray-500">Table Number</p>
                <p className="text-3xl font-bold text-[#F97316]">
                  Table {tableNo}
                </p>
              </div>
            </div>
            </div>

            {/* Order Type */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#3F6B63] mb-5">
                Order Type
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {["Dine In", "Takeaway", "Delivery"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`rounded-xl py-4 font-semibold transition ${
                      orderType === type
                        ? "bg-[#F97316] text-white"
                        : "bg-[#FDF8F2]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === "Delivery" && (
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#3F6B63] mb-5">
                  Delivery Address
                </h2>

                <div className="flex items-start border rounded-xl px-3 py-3">
                  <MapPin className="w-5 h-5 mt-1 text-gray-400" />
                  <textarea
                    rows={4}
                    className="ml-3 w-full outline-none resize-none"
                    placeholder="Enter complete delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#3F6B63] mb-5">
                Payment Method
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod("UPI")}
                  className={`rounded-xl p-5 border transition ${
                    paymentMethod === "UPI"
                      ? "border-orange-500 bg-orange-50 font-bold"
                      : ""
                  }`}
                >
                  <Smartphone className="mx-auto mb-2" />
                  UPI
                </button>

                <button
                  onClick={() => setPaymentMethod("Card")}
                  className={`rounded-xl p-5 border transition ${
                    paymentMethod === "Card"
                      ? "border-orange-500 bg-orange-50 font-bold"
                      : ""
                  }`}
                >
                  <CreditCard className="mx-auto mb-2" />
                  Card
                </button>

                <button
                  onClick={() => setPaymentMethod("Cash")}
                  className={`rounded-xl p-5 border transition ${
                    paymentMethod === "Cash"
                      ? "border-orange-500 bg-orange-50 font-bold"
                      : ""
                  }`}
                >
                  <Wallet className="mx-auto mb-2" />
                  Cash
                </button>
              </div>
                  
            {paymentMethod === "UPI" && (
              <div className="mt-6 bg-[#FDF8F2] p-5 rounded-2xl border text-center flex flex-col items-center">
                <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#F97316]" /> Scan & Pay ₹{total.toFixed(2)}
                </p>
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  className="rounded-xl border p-2 bg-white shadow-sm w-48 h-48"
                />
                <p className="text-xs text-gray-500 mt-3">
                  Scan using GPay, PhonePe, or Paytm. Bill amount ₹{total.toFixed(2)} prefilled aayega.
                </p>
              </div>
            )}

            {/* Notes for Chef */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#3F6B63] mb-5">
                Notes for Chef
              </h2>

              <div className="flex items-start border rounded-xl px-3 py-3">
                <FileText className="w-5 h-5 mt-1 text-gray-400" />
                <textarea
                  rows={3}
                  className="ml-3 w-full outline-none resize-none"
                  placeholder="Example: Less spicy, No onions, Extra cheese..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold">₹{item.price * item.qty}</p>
                  </div>
                ))}
              </div>

              <hr className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹{delivery.toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-2xl font-bold text-[#F97316]">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                disabled={loading || cart.length === 0}
                onClick={handlePlaceOrder}
                className="mt-8 w-full flex items-center justify-center gap-2 bg-[#F97316] text-white py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}