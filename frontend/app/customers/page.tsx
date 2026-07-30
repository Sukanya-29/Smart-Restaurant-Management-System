"use client";

import { useState, useMemo, useEffect } from "react";
import { Users, Search, ShoppingBag, BadgeIndianRupee, X } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  visits: number;
  spent: number;
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Fetch Customers from FastAPI Backend
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch(`${API_BASE}/customers`);
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  // Search Filtering
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
    );
  }, [customers, search]);

  // Dynamic Statistics
  const totalSpent = useMemo(
    () => customers.reduce((sum, c) => sum + c.spent, 0),
    [customers]
  );
  const totalVisits = useMemo(
    () => customers.reduce((sum, c) => sum + c.visits, 0),
    [customers]
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-10 h-10 text-[#3F6B63]" />
          <h1 className="text-4xl font-bold text-[#3F6B63]">
            Customer Management
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-xl border bg-white w-full sm:w-80 outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-emerald-100 p-4 rounded-xl text-[#3F6B63]">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Customers</p>
            <h3 className="text-2xl font-bold">{customers.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-orange-100 p-4 rounded-xl text-[#F97316]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Visits</p>
            <h3 className="text-2xl font-bold">{totalVisits}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-xl text-green-600">
            <BadgeIndianRupee className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Customer Spend</p>
            <h3 className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Phone</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Visits</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Total Spent</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  Loading customers from server...
                </td>
              </tr>
            ) : filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b hover:bg-orange-50/50 transition"
              >
                <td className="px-6 py-5 font-medium">{customer.name}</td>
                <td className="px-6 py-5 text-gray-600">{customer.phone}</td>
                <td className="px-6 py-5 text-gray-600">{customer.visits}</td>
                <td className="px-6 py-5 font-semibold text-[#F97316]">
                  ₹{customer.spent.toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="bg-[#3F6B63] text-white px-4 py-2 rounded-lg hover:bg-[#355b54] transition font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {!loading && filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedCustomer && (
        <div
          onClick={() => setSelectedCustomer(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-[430px] p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-[#3F6B63] mb-5">
              Customer Details
            </h2>

            <div className="space-y-3 text-lg text-gray-700">
              <p>
                <strong className="text-gray-900">Name:</strong> {selectedCustomer.name}
              </p>
              <p>
                <strong className="text-gray-900">Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong className="text-gray-900">Phone:</strong> {selectedCustomer.phone}
              </p>
              <p>
                <strong className="text-gray-900">Total Visits:</strong> {selectedCustomer.visits}
              </p>
              <p>
                <strong className="text-gray-900">Total Spent:</strong>{" "}
                <span className="text-[#F97316] font-semibold">
                  ₹{selectedCustomer.spent.toLocaleString()}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="mt-6 w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}