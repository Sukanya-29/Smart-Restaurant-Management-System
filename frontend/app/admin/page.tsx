"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  IndianRupee,
  Users,
  Package,
  Bell,
  Search,
  Menu,
  UserCog,
  Table2,
  BarChart3,
  RefreshCw,
  Loader2,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Authentication check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");

    if (isLoggedIn !== "true") {
      router.replace("/admin-login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.replace("/admin-login");
  };

  // Fetch Live Orders from FastAPI
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch live orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // 5 sec auto sync
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Helper to calculate total order price
  const getOrderTotal = (order: any) => {
    if (order.total !== undefined && order.total !== null) return order.total;
    if (!order.items || order.items.length === 0) return 0;
    return order.items.reduce((sum: number, item: any) => {
      const price = item.menu_item?.price || item.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  // Backend Status Update API call
  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
        );
        setShowUpdateModal(false);
      } else {
        alert("Failed to update order status in backend.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Backend Delete Order API call
  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm(`Delete Order #${orderId}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        alert("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Calculated Real-time Stats from Backend Orders
  const todayRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + getOrderTotal(o), 0);
  }, [orders]);

  const pendingCount = useMemo(
    () => orders.filter((o) => (o.status || "").toLowerCase() === "pending").length,
    [orders]
  );
  const preparingCount = useMemo(
    () => orders.filter((o) => (o.status || "").toLowerCase() === "preparing").length,
    [orders]
  );
  const readyCount = useMemo(
    () => orders.filter((o) => (o.status || "").toLowerCase() === "ready").length,
    [orders]
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = order.customer || order.customer_name || "";
      const id = String(order.id);
      return (
        customer.toLowerCase().includes(search.toLowerCase()) ||
        id.includes(search)
      );
    });
  }, [orders, search]);

  return (
    <main id="top" className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 min-h-screen bg-[#3F6B63] text-white p-6">
          <h1 className="text-3xl font-bold mb-10">🍽️ VibeBite</h1>

          <nav className="space-y-4">
            {/* Dashboard */}
            <a
              href="#top"
              className="flex items-center gap-3 w-full bg-white/20 rounded-xl px-4 py-3"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </a>

            {/* Orders */}
            <a
              href="#orders"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-white/10 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              Orders
            </a>

            {/* Menu */}
            <Link
              href="/menu-management"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-white/10 transition"
            >
              <UtensilsCrossed className="w-5 h-5" />
              Menu
            </Link>

            {/* Inventory */}
            <Link
              href="/inventory"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-white/10 transition"
            >
              <Package className="w-5 h-5" />
              Inventory
            </Link>

            {/* Customers */}
            <Link
              href="/customers"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-white/10 transition"
            >
              <Users className="w-5 h-5" />
              Customers
            </Link>

            {/* Staff */}
            <Link
              href="/staff"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-white/10 transition"
            >
              <UserCog className="w-5 h-5" />
              Staff
            </Link>

            {/* Tables */}
            <Link
              href="/tables"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-white/10 transition"
            >
              <Table2 className="w-5 h-5" />
              Tables
            </Link>

            {/* Reports */}
            <Link
              href="/reports"
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-white/10 transition"
            >
              <BarChart3 className="w-5 h-5" />
              Reports
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-4xl font-bold text-[#3F6B63]">Admin Dashboard</h1>

              <p className="text-gray-500 mt-2">
                Welcome back! Here's today's restaurant overview.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-3 rounded-xl border bg-white w-72 outline-none focus:ring-2 focus:ring-[#F97316]"
                />
              </div>

              <button
                onClick={fetchOrders}
                title="Refresh Live Data"
                className="bg-white p-3 rounded-xl shadow hover:bg-gray-50 transition"
              >
                <RefreshCw className="w-6 h-6 text-[#3F6B63]" />
              </button>

              <button className="bg-white p-3 rounded-xl shadow">
                <Bell className="w-6 h-6 text-[#3F6B63]" />
              </button>

              <button
                onClick={logout}
                className="rounded-xl bg-red-500 px-5 py-3 text-white font-semibold hover:bg-red-600 transition"
              >
                Logout
              </button>

              <button className="lg:hidden bg-white p-3 rounded-xl shadow">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
            <div className="bg-white rounded-2xl p-6 shadow">
              <IndianRupee className="w-10 h-10 text-green-600" />

              <p className="text-gray-500 mt-4">Today's Revenue</p>

              <h2 className="text-3xl font-bold mt-2">
                ₹{todayRevenue > 0 ? todayRevenue.toLocaleString() : "18,450"}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <ShoppingBag className="w-10 h-10 text-orange-500" />

              <p className="text-gray-500 mt-4">Total Orders</p>

              <h2 className="text-3xl font-bold mt-2">
                {orders.length > 0 ? orders.length : 127}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <Users className="w-10 h-10 text-blue-600" />

              <p className="text-gray-500 mt-4">Customers</p>

              <h2 className="text-3xl font-bold mt-2">
                {orders.length > 0
                  ? new Set(orders.map((o) => o.customer || o.customer_name)).size
                  : 68}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <Package className="w-10 h-10 text-purple-600" />

              <p className="text-gray-500 mt-4">Low Stock</p>

              <h2 className="text-3xl font-bold mt-2">9 Items</h2>
            </div>
          </div>

          {/* Live Orders */}
          <div id="orders" className="mt-10 bg-white rounded-2xl shadow overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-[#3F6B63]">Live Orders</h2>

                <p className="text-gray-500 mt-1">
                  Track and manage all active customer orders.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500 flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#F97316]" /> Loading live orders...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4">Order ID</th>
                      <th className="text-left px-6 py-4">Customer</th>
                      <th className="text-left px-6 py-4">Table</th>
                      <th className="text-left px-6 py-4">Amount</th>
                      <th className="text-left px-6 py-4">Status</th>
                      <th className="text-left px-6 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => {
                      const customerName = order.customer || order.customer_name || "Guest";
                      const tableDisplay =
                        order.table ||
                        (order.table_id ? `T${order.table_id}` : "Takeaway");
                      const amount = getOrderTotal(order);
                      const status = order.status || "Pending";

                      return (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-orange-50 transition"
                        >
                          <td className="px-6 py-5 font-semibold">#{order.id}</td>

                          <td className="px-6 py-5 capitalize">{customerName}</td>

                          <td className="px-6 py-5">{tableDisplay}</td>

                          <td className="px-6 py-5 font-semibold text-[#F97316]">
                            ₹{amount}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                                status.toLowerCase() === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : status.toLowerCase() === "preparing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder({
                                    ...order,
                                    customer: customerName,
                                    table: tableDisplay,
                                    total: amount,
                                    status: status,
                                  });
                                  setShowViewModal(true);
                                }}
                                className="px-4 py-2 rounded-lg bg-[#3F6B63] text-white hover:bg-[#355b54]"
                              >
                                View
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedOrder({
                                    ...order,
                                    customer: customerName,
                                    table: tableDisplay,
                                    total: amount,
                                    status: status,
                                  });
                                  setShowUpdateModal(true);
                                }}
                                className="px-4 py-2 rounded-lg bg-[#F97316] text-white hover:bg-[#EA580C]"
                              >
                                Update
                              </button>

                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400">
                          No active orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Analytics & Insights */}
          <div className="grid xl:grid-cols-2 gap-6 mt-10">
            {/* Most Ordered Dishes */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
                🔥 Most Ordered Dishes
              </h2>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Margherita Pizza</h3>
                    <p className="text-sm text-gray-500">Ordered 58 times today</p>
                  </div>
                  <span className="font-bold text-[#F97316]">₹17,400</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Veg Burger</h3>
                    <p className="text-sm text-gray-500">Ordered 42 times today</p>
                  </div>
                  <span className="font-bold text-[#F97316]">₹8,820</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Pasta Alfredo</h3>
                    <p className="text-sm text-gray-500">Ordered 31 times today</p>
                  </div>
                  <span className="font-bold text-[#F97316]">₹10,540</span>
                </div>
              </div>
            </div>

            {/* Low Stock */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold text-red-600 mb-6">
                ⚠️ Low Stock Alerts
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span>Mozzarella Cheese</span>
                  <span className="text-red-600 font-bold">3 Left</span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>Tomatoes</span>
                  <span className="text-red-600 font-bold">5 Left</span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span>Burger Buns</span>
                  <span className="text-red-600 font-bold">8 Left</span>
                </div>

                <div className="flex justify-between">
                  <span>Cold Drinks</span>
                  <span className="text-orange-600 font-bold">10 Left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Summary */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-yellow-100 rounded-2xl p-6">
              <h3 className="text-yellow-700 text-lg font-semibold">
                Pending Orders
              </h3>
              <p className="text-4xl font-bold mt-3">
                {orders.length > 0 ? pendingCount : 12}
              </p>
            </div>

            <div className="bg-blue-100 rounded-2xl p-6">
              <h3 className="text-blue-700 text-lg font-semibold">Preparing</h3>
              <p className="text-4xl font-bold mt-3">
                {orders.length > 0 ? preparingCount : 18}
              </p>
            </div>

            <div className="bg-green-100 rounded-2xl p-6">
              <h3 className="text-green-700 text-lg font-semibold">
                Ready Orders
              </h3>
              <p className="text-4xl font-bold mt-3">
                {orders.length > 0 ? readyCount : 9}
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid xl:grid-cols-2 gap-6 mt-10">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
                📋 Recent Activity
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-semibold">Order #1004 accepted</p>
                    <p className="text-sm text-gray-500">
                      Kitchen started preparing the order.
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">2 min ago</span>
                </div>

                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-semibold">New customer registered</p>
                    <p className="text-sm text-gray-500">
                      Customer logged in using QR ordering.
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">5 min ago</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Inventory updated</p>
                    <p className="text-sm text-gray-500">
                      Fresh vegetables added to stock.
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">10 min ago</span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
                🔔 Notifications
              </h2>

              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <p className="font-semibold text-red-700">Low Stock Alert</p>
                  <p className="text-sm text-gray-600">
                    Mozzarella Cheese stock is below the minimum level.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                  <p className="font-semibold text-yellow-700">
                    High Order Volume
                  </p>
                  <p className="text-sm text-gray-600">
                    Peak dining hours are active. Kitchen workload is high.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                  <p className="font-semibold text-green-700">Daily Goal</p>
                  <p className="text-sm text-gray-600">
                    Revenue target achieved for today.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t pt-6 text-center text-gray-500">
            <p>© 2026 VibeBite Smart Restaurant Management System</p>
            <p className="mt-2">Built with ❤️ using Next.js, Tailwind CSS & Supabase</p>
          </footer>
        </section>
      </div>

      {/* View Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-5 text-2xl font-bold text-[#3F6B63]">Order Details</h2>

            <div className="space-y-3 text-lg">
              <p>
                <strong>Order ID:</strong> #{selectedOrder.id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder.customer}
              </p>
              <p>
                <strong>Table:</strong> {selectedOrder.table}
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedOrder.total}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>

              {/* Display items if available from backend */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <p className="font-bold text-sm text-gray-600 mb-2">Items:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto text-sm">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.menu_item?.name || `Item #${item.menu_item_id}`} x{" "}
                          {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ₹
                          {(
                            (item.menu_item?.price || 0) * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              className="mt-6 w-full rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-5 text-2xl font-bold text-[#F97316]">
              Update Status
            </h2>

            <div className="space-y-3">
              {["Pending", "Preparing", "Ready", "Served"].map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  onClick={() => handleUpdateStatus(status)}
                  className="w-full rounded-xl bg-orange-500 py-3 text-white hover:bg-orange-600 font-semibold transition disabled:opacity-50"
                >
                  {updating ? "Updating..." : status}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowUpdateModal(false)}
              className="mt-5 w-full rounded-xl bg-gray-500 py-3 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}