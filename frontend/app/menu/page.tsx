"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  Star,
  Clock,
  Flame,
  ShoppingCart,
  Plus,
  Sparkles,
  ChefHat,
  Loader2,
} from "lucide-react";

const COLORS = {
  cream: "#FDF8F2",
  sage: "#3F6B63",
  sageDark: "#2F524C",
  orange: "#F97316",
  white: "#FFFFFF",
};

const CATEGORIES = [
  "All",
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function MenuPage() {
  const router = useRouter();

  // Dynamic menu data state from Backend App
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [customerName, setCustomerName] = useState("Guest");
  const [tableNo] = useState("01");

  // Fetch live menu items from Backend App (FastAPI + Supabase)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/menu/`);
        if (!res.ok) {
          throw new Error("Failed to load menu items from backend API");
        }
        const data = await res.json();
        setMenuItems(data);
      } catch (err: any) {
        setError(err.message || "Failed to connect to backend server");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Sync Cart and Customer details from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("customerName");
    if (storedName) {
      setCustomerName(storedName);
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
    setCartCount(total);
  }, []);

  // Filter items based on selected Category and Search
  const filtered = useMemo(() => {
    return menuItems.filter((dish) => {
      const categoryMatch =
        activeCategory === "All" ||
        dish.category?.toLowerCase() === activeCategory.toLowerCase();

      const searchMatch = dish.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [menuItems, activeCategory, search]);

  // AI Recommended Picks (Top 3 available items from database)
  const aiPicks = useMemo(() => {
    return menuItems.slice(0, 3);
  }, [menuItems]);

  const addToCart = (dish: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === dish.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        qty: 1,
        category: dish.category,
        image: dish.image_url,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.reduce((sum: number, item: any) => sum + item.qty, 0));
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: COLORS.cream,
        color: COLORS.sageDark,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: "rgba(253,248,242,0.95)",
          borderColor: "#e8e2d8",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: COLORS.sage }}
            >
              <ChefHat className="h-6 w-6" style={{ color: COLORS.white }} />
            </div>

            <div>
              <h1 className="text-2xl font-bold" style={{ color: COLORS.sage }}>
                VibeBite
              </h1>
              <p className="text-sm text-gray-500">Smart Restaurant</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden text-right md:block">
              <p className="text-sm text-gray-500">Welcome</p>
              <h2 className="font-semibold" style={{ color: COLORS.sage }}>
                {customerName}
              </h2>
            </div>

            <div
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                background: COLORS.sage,
                color: COLORS.white,
              }}
            >
              Table {tableNo}
            </div>

            <button
              onClick={() => router.push("/cart")}
              className="relative rounded-full p-3 shadow"
              style={{ background: COLORS.white }}
            >
              <ShoppingCart className="h-6 w-6" style={{ color: COLORS.sage }} />
              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: COLORS.orange,
                    color: COLORS.white,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <h2 className="mb-2 text-4xl font-bold" style={{ color: COLORS.sage }}>
            Delicious Food Awaits 🍽️
          </h2>

          <p className="mb-6 text-gray-500">
            Search your favourite dishes and order instantly.
          </p>

          <div className="flex items-center rounded-2xl bg-white px-5 py-4 shadow">
            <Search className="mr-3 h-5 w-5" style={{ color: COLORS.sage }} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="rounded-full px-5 py-2 font-medium transition"
              style={{
                background:
                  activeCategory === category ? COLORS.orange : COLORS.white,
                color:
                  activeCategory === category ? COLORS.white : COLORS.sage,
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: COLORS.sage }} />
            <p className="text-gray-500">Fetching live menu from server...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
            <p className="font-semibold">Unable to load menu</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>

            {/* Main Menu */}
            <section>
              <h2 className="mb-6 text-3xl font-bold" style={{ color: COLORS.sage }}>
                {activeCategory === "All" ? "Full Menu" : activeCategory}
              </h2>

              {filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  No items found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((dish) => (
                    <article
                      key={dish.id}
                      className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1"
                    >
                      <img
                        src={dish.image_url || "/placeholder.jpg"}
                        alt={dish.name}
                        className="h-56 w-full object-cover"
                      />

                      <div className="p-5">
                        {dish.dietary_type && (
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              background:
                                dish.dietary_type === "Veg" ? "#16a34a" : "#dc2626",
                              color: COLORS.white,
                            }}
                          >
                            {dish.dietary_type}
                          </span>
                        )}

                        <h3
                          className="mt-3 text-xl font-bold"
                          style={{ color: COLORS.sage }}
                        >
                          {dish.name}
                        </h3>

                        {dish.description && (
                          <p className="mt-3 text-gray-600">{dish.description}</p>
                        )}

                        <div className="mt-4 flex gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {dish.prep_time || dish.prep_time_mins || 15} min
                          </span>

                          {dish.calories && (
                            <span className="flex items-center gap-1">
                              <Flame className="h-4 w-4" />
                              {dish.calories} cal
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <Star
                              className="h-4 w-4"
                              fill={COLORS.orange}
                              style={{ color: COLORS.orange }}
                            />
                            {dish.rating || "4.5"}
                          </span>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <h2
                            className="text-2xl font-bold"
                            style={{ color: COLORS.orange }}
                          >
                            ₹{dish.price}
                          </h2>

                          <button
                            onClick={() => addToCart(dish)}
                            className="flex items-center gap-2 rounded-full px-5 py-3 font-medium shadow transition hover:opacity-90"
                            style={{
                              background: COLORS.orange,
                              color: COLORS.white,
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            Add
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => router.push("/cart")}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-xl transition hover:scale-105"
        style={{
          background: COLORS.orange,
          color: COLORS.white,
        }}
      >
        <ShoppingCart className="h-7 w-7" />
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </button>
    </main>
  );
}