"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Armchair,
  Search,
  Users,
  QrCode,
  Clock3,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type TableType = {
  id: number;
  table_number: number;
  seats: number;
  status: "Available" | "Occupied" | "Reserved";
  guests: number;
  time: string;
};

export default function TablesPage() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State for changing table status
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch Tables from FastAPI Backend
  const fetchTables = async () => {
    try {
      const res = await fetch(`${API_BASE}/tables/`);
      if (res.ok) {
        const data = await res.json();
        // Map backend schema to frontend table structure
        const formattedTables: TableType[] = data.map((t: any) => ({
          id: t.id,
          table_number: t.table_number ?? t.id,
          seats: t.capacity ?? t.seats ?? 4,
          status: t.status || "Available",
          guests: t.guests ?? (t.status === "Occupied" ? 2 : 0),
          time: t.time || (t.status === "Occupied" ? "20 min" : "-"),
        }));
        setTables(formattedTables);
      }
    } catch (err) {
      console.error("Failed to fetch tables:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Handle Table Status Update via PATCH Endpoint
  const handleUpdateStatus = async (newStatus: "Available" | "Occupied" | "Reserved") => {
    if (!selectedTable) return;
    setUpdating(true);

    try {
      // Optimistic UI Update
      setTables((prev) =>
        prev.map((t) =>
          t.id === selectedTable.id ? { ...t, status: newStatus } : t
        )
      );

      const res = await fetch(`${API_BASE}/tables/${selectedTable.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        fetchTables(); // Revert on failure
      }
    } catch (err) {
      console.error("Failed to update table status:", err);
      fetchTables();
    } finally {
      setUpdating(false);
      setShowStatusModal(false);
      setSelectedTable(null);
    }
  };

  const filteredTables = useMemo(() => {
    return tables.filter((table) =>
      String(table.table_number).includes(search)
    );
  }, [tables, search]);

  // Dynamic Metrics
  const totalTablesCount = tables.length;
  const availableCount = tables.filter((t) => t.status === "Available").length;
  const occupiedCount = tables.filter((t) => t.status === "Occupied").length;
  const reservedCount = tables.filter((t) => t.status === "Reserved").length;
  const occupancyRate = totalTablesCount
    ? Math.round((occupiedCount / totalTablesCount) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#3F6B63] flex items-center gap-3">
            <Armchair className="w-10 h-10" />
            Table Management
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor restaurant tables and reservations in real time.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search table number..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <Armchair className="w-10 h-10 text-[#3F6B63]" />
          <p className="text-gray-500 mt-4">Total Tables</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "..." : totalTablesCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
          <p className="text-gray-500 mt-4">Available</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "..." : availableCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <Users className="w-10 h-10 text-orange-500" />
          <p className="text-gray-500 mt-4">Occupied</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "..." : occupiedCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <CalendarDays className="w-10 h-10 text-blue-600" />
          <p className="text-gray-500 mt-4">Reserved</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "..." : reservedCount}
          </h2>
        </div>
      </div>

      {/* Restaurant Floor */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#3F6B63]">
              Restaurant Floor
            </h2>
            <p className="text-gray-500 mt-1">
              View live table occupancy and manage reservations.
            </p>
          </div>

          <button className="bg-[#3F6B63] hover:bg-[#355b54] text-white px-5 py-3 rounded-xl font-semibold transition">
            + Add Table
          </button>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl text-center text-gray-500 shadow">
            Loading table layout from database...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  {/* Table Header */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-[#3F6B63]">
                      Table {table.table_number}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        table.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : table.status === "Occupied"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>

                  {/* Information */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#F97316]" />
                      <span>Seats: {table.seats}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock3 className="w-5 h-5 text-[#F97316]" />
                      <span>Time: {table.time}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#F97316]" />
                      <span>Guests: {table.guests}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* QR */}
                  <button className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 py-3 rounded-xl transition">
                    <QrCode className="w-5 h-5" />
                    View QR Code
                  </button>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <button className="bg-[#3F6B63] hover:bg-[#355b54] text-white py-3 rounded-xl font-medium transition">
                      Details
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTable(table);
                        setShowStatusModal(true);
                      }}
                      className="bg-[#F97316] hover:bg-[#EA580C] text-white py-3 rounded-xl font-medium transition"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTables.length === 0 && (
              <div className="col-span-full bg-white p-10 rounded-2xl text-center text-gray-400">
                No matching tables found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change Status Modal */}
      {showStatusModal && selectedTable && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold text-[#3F6B63]">
              Update Table {selectedTable.table_number}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Select new status for this table:
            </p>

            <div className="space-y-3 mt-6">
              {(["Available", "Occupied", "Reserved"] as const).map(
                (status) => (
                  <button
                    key={status}
                    disabled={updating}
                    onClick={() => handleUpdateStatus(status)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold border transition text-left flex justify-between items-center ${
                      selectedTable.status === status
                        ? "border-[#3F6B63] bg-[#3F6B63]/10 text-[#3F6B63]"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span>{status}</span>
                    {selectedTable.status === status && (
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Current
                      </span>
                    )}
                  </button>
                )
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedTable(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-medium text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reservations & Analytics */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Today's Reservations */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📅 Today's Reservations
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Table 3</h3>
                <p className="text-sm text-gray-500">
                  Sharma Family • 6 Guests
                </p>
              </div>
              <span className="font-semibold text-[#F97316]">7:30 PM</span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Table 6</h3>
                <p className="text-sm text-gray-500">
                  Gupta Group • 8 Guests
                </p>
              </div>
              <span className="font-semibold text-[#F97316]">8:00 PM</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Table 9</h3>
                <p className="text-sm text-gray-500">
                  Birthday Celebration
                </p>
              </div>
              <span className="font-semibold text-[#F97316]">9:15 PM</span>
            </div>
          </div>
        </div>

        {/* Tables Freeing Soon */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            ⏳ Tables Freeing Soon
          </h2>
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
              <h3 className="font-semibold">Table 2</h3>
              <p className="text-sm text-gray-600 mt-1">
                Expected to be free in 5 minutes.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
              <h3 className="font-semibold">Table 4</h3>
              <p className="text-sm text-gray-600 mt-1">
                Dining time: 45 minutes.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
              <h3 className="font-semibold">Table 7</h3>
              <p className="text-sm text-gray-600 mt-1">
                Bill requested by customer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Analytics */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-green-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-green-700">
            Occupancy Rate
          </h3>
          <p className="text-4xl font-bold mt-3">{occupancyRate}%</p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-700">
            Peak Dining Hour
          </h3>
          <p className="text-4xl font-bold mt-3">8 PM</p>
        </div>

        <div className="bg-orange-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-orange-700">
            Average Dining Time
          </h3>
          <p className="text-4xl font-bold mt-3">58 min</p>
        </div>
      </div>

      {/* Popular Tables */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">
        <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
          🏆 Most Requested Tables
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-orange-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Table 5</h3>
            <p className="text-gray-500 mt-2">Window Seat</p>
            <p className="text-3xl font-bold text-[#F97316] mt-2">
              42 Bookings
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Table 3</h3>
            <p className="text-gray-500 mt-2">Family Table</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              38 Bookings
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 text-center">
            <h3 className="font-bold text-lg">Table 8</h3>
            <p className="text-gray-500 mt-2">Group Dining</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              35 Bookings
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📋 Recent Table Activity
          </h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Table 4 Occupied</h3>
                <p className="text-sm text-gray-500">
                  4 guests checked in via QR Code.
                </p>
              </div>
              <span className="text-sm text-gray-400">3 min ago</span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Table 2 Bill Paid</h3>
                <p className="text-sm text-gray-500">Table is now available.</p>
              </div>
              <span className="text-sm text-gray-400">15 min ago</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Reservation Confirmed</h3>
                <p className="text-sm text-gray-500">
                  Table 6 reserved for 8:00 PM.
                </p>
              </div>
              <span className="text-sm text-gray-400">25 min ago</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            🔔 Floor Notifications
          </h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-700">
                Waiting Customers
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Three parties are waiting for a table.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4">
              <h3 className="font-semibold text-blue-700">
                Reservation Reminder
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Table 3 reservation starts in 20 minutes.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4">
              <h3 className="font-semibold text-green-700">
                Tables Available
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Four tables are ready for new customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="mt-10 bg-[#3F6B63] rounded-2xl text-white p-8">
        <h2 className="text-3xl font-bold">📊 Today's Floor Summary</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div>
            <p className="text-white/70">Total Guests</p>
            <h3 className="text-3xl font-bold mt-2">
              {tables.reduce((acc, t) => acc + t.guests, 0)}
            </h3>
          </div>
          <div>
            <p className="text-white/70">Reservations</p>
            <h3 className="text-3xl font-bold mt-2">{reservedCount}</h3>
          </div>
          <div>
            <p className="text-white/70">Tables Served</p>
            <h3 className="text-3xl font-bold mt-2">{occupiedCount}</h3>
          </div>
          <div>
            <p className="text-white/70">Occupancy</p>
            <h3 className="text-3xl font-bold mt-2">{occupancyRate}%</h3>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-500 border-t pt-6">
        <p>© 2026 VibeBite Table Management</p>
        <p className="mt-2">
          Built with ❤️ using Next.js, Tailwind CSS & Supabase
        </p>
      </footer>
    </main>
  );
}