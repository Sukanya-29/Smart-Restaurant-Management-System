"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Boxes,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Matches your FastAPI / Supabase Schema
type InventoryItem = {
  id: number;
  name: string;
  category: string;
  current_stock: number;
  unit: string;
  reorder_level: number;
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Fetch Inventory from FastAPI (Connected to Supabase)
  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE}/inventory/`);
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (err) {
      console.error("Failed to fetch inventory from FastAPI:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Update Stock API Call matching `PATCH /inventory/{item_id}/stock`
  const handleStockUpdate = async (id: number, delta: number) => {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;

    const newStock = Math.max(0, item.current_stock + delta);

    // Optimistic UI Update
    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, current_stock: newStock } : i))
    );

    try {
      await fetch(`${API_BASE}/inventory/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_stock: newStock }),
      });
    } catch (err) {
      console.error("Failed to update stock on backend:", err);
      fetchInventory(); // Revert back on error
    } finally {
      setShowUpdateModal(false);
    }
  };

  const filteredInventory = useMemo(() => {
    if (!inventory || inventory.length === 0) return [];
    return inventory.filter(
      (item) =>
        (item?.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
        (item?.category && item.category.toLowerCase().includes(search.toLowerCase()))
    );
  }, [inventory, search]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#3F6B63] flex items-center gap-3">
            <Package className="w-10 h-10" />
            Inventory Management
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor stock levels and manage restaurant inventory.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <Boxes className="w-10 h-10 text-[#3F6B63]" />
          <p className="text-gray-500 mt-4">Total Items</p>
          <h2 className="text-3xl font-bold mt-2">{inventory.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
          <p className="text-gray-500 mt-4">Low Stock</p>
          <h2 className="text-3xl font-bold mt-2">
            {inventory.filter((item) => item.current_stock <= item.reorder_level).length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
          <p className="text-gray-500 mt-4">Healthy Stock</p>
          <h2 className="text-3xl font-bold mt-2">
            {inventory.filter((item) => item.current_stock > item.reorder_level).length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <TrendingDown className="w-10 h-10 text-orange-500" />
          <p className="text-gray-500 mt-4">Critical Items</p>
          <h2 className="text-3xl font-bold mt-2">
            {inventory.filter((item) => item.current_stock <= 5).length}
          </h2>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="mt-10 bg-white rounded-2xl shadow overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-[#3F6B63]">
              Inventory Stock
            </h2>
            <p className="text-gray-500 mt-1">
              Track ingredient availability and update stock levels.
            </p>
          </div>

          <button className="bg-[#3F6B63] hover:bg-[#355b54] text-white px-5 py-3 rounded-xl font-semibold transition">
            + Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4">Item</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Current Stock</th>
                <th className="text-left px-6 py-4">Minimum</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Loading inventory data from database...
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-orange-50 transition"
                  >
                    <td className="px-6 py-5 font-semibold">{item.name}</td>
                    <td className="px-6 py-5 text-gray-600">{item.category}</td>
                    <td className="px-6 py-5 font-semibold">
                      {item.current_stock} {item.unit}
                    </td>
                    <td className="px-6 py-5">
                      {item.reorder_level} {item.unit}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          item.current_stock <= item.reorder_level
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.current_stock <= item.reorder_level ? "Low Stock" : "Healthy"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowViewModal(true);
                          }}
                          className="px-4 py-2 rounded-lg bg-[#3F6B63] text-white hover:bg-[#355b54]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowUpdateModal(true);
                          }}
                          className="px-4 py-2 rounded-lg bg-[#F97316] text-white hover:bg-[#EA580C]"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Analytics */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            ⚠️ Low Stock Alerts
          </h2>
          <div className="space-y-4">
            {inventory
              .filter((item) => item.current_stock <= item.reorder_level)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Only {item.current_stock} {item.unit} remaining
                      </p>
                    </div>
                    <button
                      onClick={() => handleStockUpdate(item.id, 10)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Stock Updates */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📦 Recent Stock Updates
          </h2>
          <div className="space-y-5">
            <div className="flex justify-between border-b pb-4">
              <div>
                <h3 className="font-semibold">Tomatoes</h3>
                <p className="text-sm text-gray-500">Added 20 kg to inventory</p>
              </div>
              <span className="text-sm text-gray-400">Today</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <div>
                <h3 className="font-semibold">Cooking Oil</h3>
                <p className="text-sm text-gray-500">Added 15 litres</p>
              </div>
              <span className="text-sm text-gray-400">Today</span>
            </div>
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Pasta</h3>
                <p className="text-sm text-gray-500">Added 30 kg</p>
              </div>
              <span className="text-sm text-gray-400">Yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Most Used Ingredients */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">
        <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
          🔥 Most Used Ingredients Today
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-orange-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Mozzarella Cheese</h3>
            <p className="text-gray-500 mt-2">Used Today</p>
            <p className="text-3xl font-bold text-[#F97316] mt-2">18 kg</p>
          </div>
          <div className="bg-green-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Tomatoes</h3>
            <p className="text-gray-500 mt-2">Used Today</p>
            <p className="text-3xl font-bold text-green-600 mt-2">14 kg</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Burger Buns</h3>
            <p className="text-gray-500 mt-2">Used Today</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">12 Packs</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Supplier Information */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            🚚 Supplier Information
          </h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Fresh Farms Pvt. Ltd.</h3>
                <p className="text-sm text-gray-500">Vegetables & Fruits</p>
              </div>
              <button className="bg-[#3F6B63] text-white px-4 py-2 rounded-lg hover:bg-[#355b54]">
                Contact
              </button>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Dairy World</h3>
                <p className="text-sm text-gray-500">Cheese & Dairy Products</p>
              </div>
              <button className="bg-[#3F6B63] text-white px-4 py-2 rounded-lg hover:bg-[#355b54]">
                Contact
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Food Supplies Co.</h3>
                <p className="text-sm text-gray-500">Grocery & Essentials</p>
              </div>
              <button className="bg-[#3F6B63] text-white px-4 py-2 rounded-lg hover:bg-[#355b54]">
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Activity */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📋 Inventory Activity
          </h2>
          <div className="space-y-5">
            <div className="border-b pb-4">
              <p className="font-semibold">Mozzarella Cheese Restocked</p>
              <p className="text-sm text-gray-500 mt-1">
                Added 20 kg to inventory.
              </p>
              <span className="text-xs text-gray-400">15 minutes ago</span>
            </div>
            <div className="border-b pb-4">
              <p className="font-semibold">Burger Buns Updated</p>
              <p className="text-sm text-gray-500 mt-1">
                Stock reduced after lunch orders.
              </p>
              <span className="text-xs text-gray-400">1 hour ago</span>
            </div>
            <div>
              <p className="font-semibold">Tomatoes Delivered</p>
              <p className="text-sm text-gray-500 mt-1">
                Supplier delivered 50 kg.
              </p>
              <span className="text-xs text-gray-400">Yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="mt-10 bg-[#3F6B63] rounded-2xl text-white p-8">
        <h2 className="text-3xl font-bold">📊 Today's Inventory Summary</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div>
            <p className="text-white/70">Total Products</p>
            <h3 className="text-3xl font-bold mt-2">{inventory.length}</h3>
          </div>
          <div>
            <p className="text-white/70">Low Stock</p>
            <h3 className="text-3xl font-bold mt-2">
              {inventory.filter((item) => item.current_stock <= item.reorder_level).length}
            </h3>
          </div>
          <div>
            <p className="text-white/70">Deliveries</p>
            <h3 className="text-3xl font-bold mt-2">7</h3>
          </div>
          <div>
            <p className="text-white/70">Inventory Health</p>
            <h3 className="text-3xl font-bold mt-2">94%</h3>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-500 border-t pt-6">
        <p>© 2026 VibeBite Inventory Management</p>
        <p className="mt-2">
          Built with ❤️ using Next.js, Tailwind CSS & Supabase
        </p>
      </footer>

      {/* View Inventory Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[430px] rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#3F6B63] mb-5">
              Inventory Details
            </h2>
            <div className="space-y-3 text-lg">
              <p><strong>Item:</strong> {selectedItem.name}</p>
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p>
                <strong>Current Stock:</strong> {selectedItem.current_stock}{" "}
                {selectedItem.unit}
              </p>
              <p>
                <strong>Minimum Stock:</strong> {selectedItem.reorder_level}{" "}
                {selectedItem.unit}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedItem.current_stock <= selectedItem.reorder_level
                  ? "Low Stock"
                  : "Healthy"}
              </p>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="mt-6 w-full rounded-xl bg-red-500 py-3 text-white hover:bg-red-600 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Inventory Modal */}
      {showUpdateModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[430px] rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#F97316] mb-5">
              Update Stock
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleStockUpdate(selectedItem.id, 5)}
                className="rounded-xl bg-green-600 py-3 text-white hover:bg-green-700 font-semibold"
              >
                +5 Stock
              </button>
              <button
                onClick={() => handleStockUpdate(selectedItem.id, -5)}
                className="rounded-xl bg-orange-500 py-3 text-white hover:bg-orange-600 font-semibold"
              >
                -5 Stock
              </button>
            </div>
            <button
              onClick={() => setShowUpdateModal(false)}
              className="mt-5 w-full rounded-xl bg-gray-500 py-3 text-white hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}