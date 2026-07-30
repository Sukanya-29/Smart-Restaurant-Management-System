"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  Download,
  TrendingUp,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AnalyticsData {
  total_revenue: number;
  total_orders: number;
  customers: number;
  growth: string;
  sales: { day: string; revenue: number; orders: number }[];
  top_items: { name: string; sold: number; revenue: number }[];
  kpis: {
    avg_order_value: number;
    table_occupancy: string;
    repeat_customers: string;
    customer_rating: number;
  };
  financial_summary: {
    total_revenue: number;
    total_expenses: number;
    net_profit: number;
    profit_margin: string;
  };
  top_categories: { name: string; revenue: number }[];
}

export default function ReportsPage() {
  const [range, setRange] = useState("Today");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const fetchAnalytics = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reports/analytics?range=${encodeURIComponent(selectedRange)}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error("Failed to fetch reports analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const sales = data?.sales || [];
  const topItems = data?.top_items || [];
  const totalRevenue = data?.total_revenue || 0;
  const totalOrders = data?.total_orders || 0;
  const customers = data?.customers || 0;
  const growth = data?.growth || "0%";

  const maxRevenue = sales.length ? Math.max(...sales.map((s) => s.revenue), 1) : 1;
  const maxOrders = sales.length ? Math.max(...sales.map((s) => s.orders), 1) : 1;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#3F6B63] flex items-center gap-3">
            <BarChart3 className="w-10 h-10" />
            Reports & Analytics
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor restaurant performance, revenue and business insights.
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-5 py-3 rounded-xl border bg-white outline-none cursor-pointer"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>

          <button className="bg-[#3F6B63] hover:bg-[#355b54] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <DollarSign className="w-10 h-10 text-green-600" />
          <p className="text-gray-500 mt-4">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "..." : `₹${totalRevenue.toLocaleString()}`}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <ShoppingBag className="w-10 h-10 text-orange-500" />
          <p className="text-gray-500 mt-4">Total Orders</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "..." : totalOrders.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <Users className="w-10 h-10 text-blue-600" />
          <p className="text-gray-500 mt-4">Customers</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "..." : customers.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <TrendingUp className="w-10 h-10 text-purple-600" />
          <p className="text-gray-500 mt-4">Growth</p>
          <h2 className="text-3xl font-bold mt-2">{growth}</h2>
        </div>
      </div>

      {/* Sales Analytics */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📈 Revenue Overview
          </h2>
          <div className="space-y-5">
            {loading ? (
              <p className="text-gray-400">Loading sales data...</p>
            ) : (
              sales.map((item) => {
                const width = Math.round((item.revenue / maxRevenue) * 100);
                return (
                  <div key={item.day}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.day}</span>
                      <span className="font-semibold">
                        ₹{item.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3F6B63] rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            🛒 Orders Breakdown
          </h2>
          <div className="space-y-5">
            {loading ? (
              <p className="text-gray-400">Loading order data...</p>
            ) : (
              sales.map((item) => {
                const width = Math.round((item.orders / maxOrders) * 100);
                return (
                  <div key={item.day}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.day}</span>
                      <span className="font-semibold">{item.orders} Orders</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F97316] rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">
        <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
          🏆 Best Selling Menu Items
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">Dish</th>
                <th className="text-left py-4">Units Sold</th>
                <th className="text-left py-4">Revenue</th>
                <th className="text-left py-4">Performance</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Loading top items...
                  </td>
                </tr>
              ) : (
                topItems.map((item) => (
                  <tr
                    key={item.name}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-4 font-semibold">{item.name}</td>
                    <td>{item.sold}</td>
                    <td>₹{item.revenue.toLocaleString()}</td>
                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Excellent
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Insights */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        {/* Business KPIs */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📊 Business Insights
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-green-50 rounded-xl p-5">
              <p className="text-gray-500">Avg Order Value</p>
              <h3 className="text-3xl font-bold text-green-700 mt-2">
                ₹{data?.kpis?.avg_order_value || 845}
              </h3>
            </div>

            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-gray-500">Table Occupancy</p>
              <h3 className="text-3xl font-bold text-blue-700 mt-2">
                {data?.kpis?.table_occupancy || "78%"}
              </h3>
            </div>

            <div className="bg-orange-50 rounded-xl p-5">
              <p className="text-gray-500">Repeat Customers</p>
              <h3 className="text-3xl font-bold text-orange-600 mt-2">
                {data?.kpis?.repeat_customers || "62%"}
              </h3>
            </div>

            <div className="bg-purple-50 rounded-xl p-5">
              <p className="text-gray-500">Customer Rating</p>
              <h3 className="text-3xl font-bold text-purple-700 mt-2">
                ⭐ {data?.kpis?.customer_rating || 4.8}
              </h3>
            </div>
          </div>
        </div>

        {/* Profit Summary */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            💰 Financial Summary
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between border-b pb-4">
              <span>Total Revenue</span>
              <span className="font-bold text-green-700">
                ₹{data?.financial_summary?.total_revenue?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex justify-between border-b pb-4">
              <span>Total Expenses</span>
              <span className="font-bold text-red-600">
                ₹{data?.financial_summary?.total_expenses?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex justify-between border-b pb-4">
              <span>Net Profit</span>
              <span className="font-bold text-[#3F6B63]">
                ₹{data?.financial_summary?.net_profit?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Profit Margin</span>
              <span className="font-bold text-blue-700">
                {data?.financial_summary?.profit_margin || "43%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">
        <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
          🤖 AI Business Recommendations
        </h2>

        <div className="space-y-5">
          <div className="border-l-4 border-green-500 bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold">Increase Weekend Inventory</h3>
            <p className="text-gray-600 mt-1">
              Weekend demand is consistently higher. Consider stocking 20% more ingredients to avoid shortages.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 bg-orange-50 rounded-xl p-4">
            <h3 className="font-semibold">Promote Cold Coffee</h3>
            <p className="text-gray-600 mt-1">
              Cold Coffee has high sales and profit margins. Feature it as a combo with snacks.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold">Optimize Staff Scheduling</h3>
            <p className="text-gray-600 mt-1">
              Friday evening shows peak traffic. Schedule additional waiters between 6 PM and 10 PM.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Top Categories */}
      <div className="grid xl:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            📋 Recent Business Activity
          </h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Weekend Sales Record</h3>
                <p className="text-sm text-gray-500">Highest revenue recorded this month.</p>
              </div>
              <span className="text-sm text-gray-400">Today</span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Inventory Restocked</h3>
                <p className="text-sm text-gray-500">Fresh vegetables and dairy replenished.</p>
              </div>
              <span className="text-sm text-gray-400">Yesterday</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">New Customer Milestone</h3>
                <p className="text-sm text-gray-500">Crossed 1,250 registered customers.</p>
              </div>
              <span className="text-sm text-gray-400">2 Days Ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-[#3F6B63] mb-6">
            🏆 Top Performing Categories
          </h2>
          <div className="space-y-5">
            {(data?.top_categories || []).map((cat) => (
              <div key={cat.name} className="flex justify-between">
                <span>{cat.name}</span>
                <span className="font-bold text-green-600">
                  ₹{cat.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="mt-10 bg-[#3F6B63] rounded-2xl text-white p-8">
        <h2 className="text-3xl font-bold">📊 Business Summary ({range})</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div>
            <p className="text-white/70">Revenue</p>
            <h3 className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</h3>
          </div>
          <div>
            <p className="text-white/70">Orders</p>
            <h3 className="text-3xl font-bold mt-2">{totalOrders.toLocaleString()}</h3>
          </div>
          <div>
            <p className="text-white/70">Avg. Order</p>
            <h3 className="text-3xl font-bold mt-2">
              ₹{data?.kpis?.avg_order_value || 845}
            </h3>
          </div>
          <div>
            <p className="text-white/70">Customer Rating</p>
            <h3 className="text-3xl font-bold mt-2">
              ⭐ {data?.kpis?.customer_rating || 4.8}
            </h3>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 border-t pt-6 text-center text-gray-500">
        <p>© 2026 VibeBite Reports & Analytics</p>
        <p className="mt-2">Built with ❤️ using Next.js, Tailwind CSS & Supabase</p>
      </footer>
    </main>
  );
}