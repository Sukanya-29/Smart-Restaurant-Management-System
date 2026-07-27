"use client";

import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  veg: boolean;
  available: boolean;
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    veg: true,
    available: true,
  });

  // Fetch Menu Items from FastAPI Supabase Endpoint
  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/menu/`);
      if (res.ok) {
        const data = await res.json();
        // Map Supabase schema fields to Frontend state format
        const formattedItems: MenuItem[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          veg: item.dietary_type === "Veg",
          available: item.is_available,
        }));
        setMenuItems(formattedItems);
      }
    } catch (err) {
      console.error("Failed to fetch menu items from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Save Dish (Handles Create & Update)
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price) {
      alert("Please enter dish name and price.");
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      dietary_type: formData.veg ? "Veg" : "Non-Veg",
      is_available: formData.available,
    };

    try {
      if (editingItem) {
        // Optimistic UI update
        setMenuItems((prev) =>
          prev.map((dish) =>
            dish.id === editingItem.id
              ? {
                  ...dish,
                  name: formData.name,
                  category: formData.category,
                  price: Number(formData.price),
                  veg: formData.veg,
                  available: formData.available,
                }
              : dish
          )
        );

        // Update Availability via PATCH route
        await fetch(`${API_BASE}/menu/${editingItem.id}/availability`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_available: formData.available }),
        });
      } else {
        // Create new menu item via POST route
        const res = await fetch(`${API_BASE}/menu/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const newItem = await res.json();
          setMenuItems((prev) => [
            ...prev,
            {
              id: newItem.id,
              name: newItem.name,
              category: newItem.category,
              price: newItem.price,
              veg: newItem.dietary_type === "Veg",
              available: newItem.is_available,
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to save menu item:", err);
      fetchMenuItems(); // Revert on failure
    } finally {
      setShowModal(false);
      setEditingItem(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        veg: true,
        available: true,
      });
    }
  };

  // Delete Dish locally
  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      setMenuItems((prev) => prev.filter((dish) => dish.id !== id));
    }
  };

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#3F6B63] flex items-center gap-3">
            <UtensilsCrossed className="w-10 h-10" />
            Menu Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage dishes, prices and availability.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({
              name: "",
              category: "",
              price: "",
              veg: true,
              available: true,
            });
            setShowModal(true);
          }}
          className="bg-[#3F6B63] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#355b54] transition"
        >
          <Plus className="w-5 h-5" />
          Add New Dish
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow p-5 mt-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Search dish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow mt-8 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#3F6B63] text-white">
            <tr>
              <th className="p-4 text-left">Dish</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500">
                  Loading menu items from database...
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-semibold">{item.name}</td>

                  <td className="p-4">{item.category}</td>

                  <td className="p-4">₹{item.price}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.veg
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.veg ? "Veg" : "Non-Veg"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.available
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditingItem(item);

                        setFormData({
                          name: item.name,
                          category: item.category,
                          price: item.price.toString(),
                          veg: item.veg,
                          available: item.available,
                        });

                        setShowModal(true);
                      }}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                    >
                      <Pencil className="w-4 h-4 text-blue-700" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-700" />
                    </button>
                  </td>
                </tr>
              ))
            )}

            {!loading && filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-400">
                  No dishes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-[#3F6B63]">
              {editingItem ? "Edit Dish" : "Add Dish"}
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Dish Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.veg}
                    onChange={(e) =>
                      setFormData({ ...formData, veg: e.target.checked })
                    }
                  />
                  Veg
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available: e.target.checked,
                      })
                    }
                  />
                  Available
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg bg-[#3F6B63] text-white hover:bg-[#355b54] transition"
                >
                  {editingItem ? "Update" : "Add Dish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}