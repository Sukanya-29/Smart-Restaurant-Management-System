"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  ChefHat,
  Clock3,
  Search,
  CheckCircle2,
  Timer,
  Flame,
  Loader2,
  RefreshCw,
  UtensilsCrossed,
  Lock,ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation"

type OrderItem = {
  id?: number;
  order_id?: number;
  menu_item_id: number;
  quantity: number;
  menu_items?: {
    name: string;
  };
};

type KitchenOrder = {
  id: number;
  table_id: number | string;
  customer_name: string | null;
  customer_phone?: string | null;
  total_amount?: number;
  status: string; // 'pending', 'preparing', 'ready', 'served', 'completed'
  payment_status?: string;
  created_at?: string;
  order_items?: OrderItem[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const SECURE_PASSWORD = "vibebite#0";

export default function KitchenPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("kitchen_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECURE_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("kitchen_auth", "true");
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kitchen_auth");
    setIsAuthenticated(false);
    setPassword("");
    setError("");
    setOrders([]); 
    router.push("/portal");
  };

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch kitchen orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchOrders]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
      } else {
        alert("Failed to update status on server.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        (order.customer_name || "Guest")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        String(order.id).includes(search) ||
        String(order.table_id).includes(search)
    );
  }, [orders, search]);


  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#3F6B63] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-md">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-[#3F6B63] mb-2">Kitchen Restricted Area</h1>
          <p className="text-gray-500 text-sm mb-6">
            Please enter the secure kitchen password to view live orders.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <input
                type="password"
                name="kitchen-pass"
                autoComplete="new-password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:border-[#F97316] transition text-gray-800"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#F97316] text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-md"
            >
              Submit <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    );
  }


  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "Pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing" || o.status === "Preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready" || o.status === "Ready").length;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#3F6B63] flex items-center gap-3">
            <ChefHat className="w-10 h-10" />
            Kitchen Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage live kitchen orders efficiently.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-3 bg-white border rounded-xl hover:bg-gray-50 text-gray-600 transition"
            title="Refresh Orders"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red-600 bg-white border px-4 py-3 rounded-xl hover:bg-red-50 transition shadow-sm"
          >
            Logout
          </button>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <Clock3 className="w-10 h-10 text-yellow-500" />

          <p className="text-gray-500 mt-4">Pending Orders</p>

          <h2 className="text-3xl font-bold mt-2">{pendingCount}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <Flame className="w-10 h-10 text-orange-500" />

          <p className="text-gray-500 mt-4">Preparing</p>

          <h2 className="text-3xl font-bold mt-2">{preparingCount}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />

          <p className="text-gray-500 mt-4">Ready Orders</p>

          <h2 className="text-3xl font-bold mt-2">{readyCount}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <Timer className="w-10 h-10 text-blue-600" />

          <p className="text-gray-500 mt-4">Average Prep Time</p>

          <h2 className="text-3xl font-bold mt-2">12 min</h2>
        </div>
      </div>

      {/* Live Kitchen Orders Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
          <span>Loading Live Kitchen Orders...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center mt-10 shadow">
          <p className="text-xl text-gray-500 font-medium">No live orders found.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6 mt-10">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-[#3F6B63]">
                    Order #{order.id}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {order.customer_name || "Guest"}
                  </p>

                  <p className="text-sm text-gray-400">
                    Table: {order.table_id}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                    order.status.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status.toLowerCase() === "preparing"
                      ? "bg-blue-100 text-blue-700"
                      : order.status.toLowerCase() === "ready"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Ordered Items */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Ordered Items</h3>

                <ul className="space-y-2">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item, index) => (
                      <li
                        key={item.id || index}
                        className="bg-gray-50 rounded-lg px-4 py-2 flex justify-between items-center"
                      >
                        <span>🍽️ {item.menu_items?.name || `Item #${item.menu_item_id}`}</span>
                        <span className="font-semibold text-[#F97316]">
                          Qty: {item.quantity}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">No item list details</li>
                  )}
                </ul>
              </div>

              {/* Preparation Time */}
              <div className="flex items-center gap-2 mt-6 text-gray-600">
                <Clock3 className="w-5 h-5" />

                <span>
                  Placed at:{" "}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently"}
                </span>
              </div>

              {/* Action Buttons */}
              {(() => {
                const currentStatus = order.status.toLowerCase();
                return (
                  <div className="mt-8 pt-4 border-t">
                    {currentStatus === "pending" && (
                      <button
                        disabled={updatingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                        className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updatingId === order.id && <Loader2 className="w-5 h-5 animate-spin" />}
                        Start Preparing
                      </button>
                    )}

                    {currentStatus === "preparing" && (
                      <button
                        disabled={updatingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "ready")}
                        className="w-full bg-[#3F6B63] hover:bg-[#355b54] text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updatingId === order.id && <Loader2 className="w-5 h-5 animate-spin" />}
                        Mark Ready
                      </button>
                    )}

                    {currentStatus === "ready" && (
                      <button
                        disabled={updatingId === order.id}
                        onClick={() => updateOrderStatus(order.id, "served")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updatingId === order.id && <Loader2 className="w-5 h-5 animate-spin" />}
                        <UtensilsCrossed className="w-5 h-5" />
                        Mark Served
                      </button>
                    )}

                    {(currentStatus === "served" || currentStatus === "completed") && (
                      <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold text-center flex items-center justify-center gap-2 border">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Order Served & Completed
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* Kitchen Performance */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Kitchen Summary */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📊 Kitchen Performance
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-600">Orders Completed Today</span>
              <span className="text-2xl font-bold text-green-600">87</span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-600">Average Cooking Time</span>
              <span className="text-2xl font-bold text-blue-600">12 min</span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-600">Kitchen Efficiency</span>
              <span className="text-2xl font-bold text-green-600">96%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Chefs</span>
              <span className="text-2xl font-bold text-[#F97316]">8</span>
            </div>
          </div>
        </div>

        {/* Urgent Orders */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            🚨 Urgent Orders
          </h2>

          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
              <h3 className="font-semibold">Order #1004</h3>

              <p className="text-sm text-gray-600 mt-1">
                Waiting for more than 15 minutes.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4">
              <h3 className="font-semibold">Order #1002</h3>

              <p className="text-sm text-gray-600 mt-1">
                Complete preparation within 3 minutes.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4">
              <h3 className="font-semibold">Kitchen Status</h3>

              <p className="text-sm text-gray-600 mt-1">
                All cooking stations are operating normally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chef Leaderboard */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">
        <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
          👨‍🍳 Today's Top Chefs
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-orange-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Chef Arjun</h3>

            <p className="text-gray-500 mt-2">Orders Completed</p>

            <p className="text-3xl font-bold text-[#F97316] mt-2">32</p>
          </div>

          <div className="bg-green-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Chef Priya</h3>

            <p className="text-gray-500 mt-2">Orders Completed</p>

            <p className="text-3xl font-bold text-green-600 mt-2">28</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Chef Rahul</h3>

            <p className="text-gray-500 mt-2">Orders Completed</p>

            <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Recent Kitchen Activity */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📋 Recent Kitchen Activity
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-semibold">Order #1003 completed</p>
                <p className="text-sm text-gray-500">
                  Handed over to the serving staff.
                </p>
              </div>

              <span className="text-sm text-gray-400">2 min ago</span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-semibold">Chef Priya started Order #1002</p>
                <p className="text-sm text-gray-500">Preparation has begun.</p>
              </div>

              <span className="text-sm text-gray-400">6 min ago</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">New Order #1005 received</p>
                <p className="text-sm text-gray-500">
                  Waiting for chef assignment.
                </p>
              </div>

              <span className="text-sm text-gray-400">8 min ago</span>
            </div>
          </div>
        </div>

        {/* Kitchen Notifications */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            🔔 Kitchen Notifications
          </h2>

          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-700">Peak Hour</h3>

              <p className="text-sm text-gray-600 mt-1">
                Lunch rush is active. Please prioritize pending orders.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4">
              <h3 className="font-semibold text-blue-700">New Menu Item</h3>

              <p className="text-sm text-gray-600 mt-1">
                Chef's Special Pasta has been added to today's menu.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4">
              <h3 className="font-semibold text-green-700">
                Kitchen Running Smoothly
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                No critical delays detected in the kitchen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Summary */}
      <div className="mt-10 bg-[#3F6B63] rounded-2xl text-white p-8">
        <h2 className="text-3xl font-bold">📅 Today's Kitchen Summary</h2>

        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div>
            <p className="text-white/70">Total Orders</p>

            <h3 className="text-3xl font-bold mt-2">127</h3>
          </div>

          <div>
            <p className="text-white/70">Completed</p>

            <h3 className="text-3xl font-bold mt-2">87</h3>
          </div>

          <div>
            <p className="text-white/70">Pending</p>

            <h3 className="text-3xl font-bold mt-2">22</h3>
          </div>

          <div>
            <p className="text-white/70">Efficiency</p>

            <h3 className="text-3xl font-bold mt-2">96%</h3>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-500 border-t pt-6">
        <p>© 2026 VibeBite Kitchen Management</p>

        <p className="mt-2">
          Built with ❤️ using Next.js, Tailwind CSS & Supabase
        </p>
      </footer>
    </main>
  );
}