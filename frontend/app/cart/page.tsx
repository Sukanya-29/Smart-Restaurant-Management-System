"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Loader2,
} from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
  image_url?: string;
  category?: string;
};

const DELIVERY_FEE = 49;
const GST_RATE = 0.05;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [couponApplied, setCouponApplied] = useState("");

  // Recommended dishes dynamically loaded from Backend App
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState<boolean>(true);

  // Load Cart from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    const merged: CartItem[] = [];

    stored.forEach((item: CartItem) => {
      const existing = merged.find((i) => i.id === item.id);
      if (existing) {
        existing.qty += item.qty;
      } else {
        merged.push({
          image: item.image || item.image_url || "/food-placeholder.png",
          category: item.category || "Food",
          ...item,
        });
      }
    });

    setCart(merged);
    setLoaded(true);
  }, []);

  // Sync Cart changes back to localStorage
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, loaded]);

  // Fetch Live Recommendations from FastAPI Backend
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecs(true);
        const res = await fetch(`${API_BASE_URL}/menu/?available_only=true`);
        if (res.ok) {
          const data = await res.json();
          // Pick up to 3 items for recommendation section
          setRecommended(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, []);

  const increase = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decrease = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const gst = Math.round(subtotal * GST_RATE);
  const delivery = cart.length === 0 ? 0 : DELIVERY_FEE;
  const finalTotal = subtotal + gst + delivery - discount;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "WELCOME10") {
      setDiscount(Math.round(subtotal * 0.1));
      setCouponApplied("WELCOME10");
    } else if (code === "VIBEBITE20") {
      setDiscount(Math.round(subtotal * 0.2));
      setCouponApplied("VIBEBITE20");
    } else if (code === "FREEDEL") {
      setDiscount(DELIVERY_FEE);
      setCouponApplied("FREEDEL");
    } else {
      alert("Invalid Coupon");
      setDiscount(0);
      setCouponApplied("");
    }
  };

  const addRecommendation = (item: any) => {
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      increase(item.id);
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        id: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
        image: item.image_url || "/food-placeholder.png",
        category: item.category || "Food",
      },
    ]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push("/menu")}
          className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 mb-8"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>

        <h1 className="text-5xl font-bold text-gray-800 mb-10">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-14 text-center">
            <ShoppingBag size={80} className="mx-auto text-orange-400 mb-6" />
            <h2 className="text-3xl font-bold mb-3">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any delicious food yet.
            </p>
            <button
              onClick={() => router.push("/menu")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-6 flex gap-5 items-center"
                >
                  <img
                    src={item.image || item.image_url || "/food-placeholder.png"}
                    alt={item.name}
                    className="h-28 w-28 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm text-orange-500 font-medium">
                      {item.category}
                    </p>
                    <h2 className="text-2xl font-bold">{item.name}</h2>
                    <p className="text-orange-500 font-semibold text-xl mt-2">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={22} />
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrease(item.id)}
                        className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="font-bold text-lg w-6 text-center">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => increase(item.id)}
                        className="bg-orange-500 text-white h-10 w-10 rounded-full flex items-center justify-center"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div>
              <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="flex gap-2 mb-6">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon Code"
                    className="flex-1 border rounded-xl px-4 py-3 outline-none"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-green-600 text-white rounded-xl px-5"
                  >
                    <Tag size={20} />
                  </button>
                </div>

                {couponApplied && (
                  <div className="bg-green-100 text-green-700 rounded-xl p-3 mb-6">
                    Coupon Applied:{" "}
                    <span className="font-bold">{couponApplied}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{delivery}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-3xl font-bold">
                    <span>Total</span>
                    <span className="text-orange-500">
                      ₹{Math.max(0, finalTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl text-lg font-semibold"
                >
                  Proceed To Checkout →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC RECOMMENDATIONS */}
        {cart.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  🍽️ You May Also Like
                </h2>
                <p className="text-gray-500 mt-2">
                  Popular dishes loved by our customers.
                </p>
              </div>

              <button
                onClick={() => router.push("/menu")}
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                View Full Menu →
              </button>
            </div>

            {loadingRecs ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommended.map((food) => (
                  <div
                    key={food.id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <img
                      src={food.image_url || "/food-placeholder.png"}
                      alt={food.name}
                      className="w-full h-56 object-cover"
                    />

                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{food.name}</h3>
                        <span className="text-orange-500 font-bold">
                          ₹{food.price}
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                        {food.description ||
                          "Freshly prepared with premium ingredients."}
                      </p>

                      <button
                        onClick={() => addRecommendation(food)}
                        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-semibold transition"
                      >
                        ➕ Add To Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}