"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChefHat, Phone, User } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function CustomerLoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNo, setTableNo] = useState("01");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const table = params.get("table");
    if (table) setTableNo(table);
  }, [params]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (phone.length !== 10) {
      alert("Enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      // Send customer info to FastAPI backend
      const res = await fetch(`${API_BASE}/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          table_no: tableNo,
        }),
      });

      if (!res.ok) {
        throw new Error("Backend connection failed");
      }

      // Save locally for frontend sessions
      localStorage.setItem("customerName", name.trim());
      localStorage.setItem("customerPhone", phone.trim());
      localStorage.setItem("tableNo", tableNo);

      router.push("/");
    } catch (err) {
      console.error("FastAPI Login Error:", err);
      // Fallback: Continue via localStorage if backend is offline
      localStorage.setItem("customerName", name.trim());
      localStorage.setItem("customerPhone", phone.trim());
      localStorage.setItem("tableNo", tableNo);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-5">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-5">
          <div className="bg-[#3F6B63] w-20 h-20 rounded-full flex items-center justify-center shadow-md">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center text-[#3F6B63]">
          VibeBite
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Smart Restaurant Experience
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="font-medium text-gray-700">Customer Name</label>

            <div className="mt-2 flex items-center border rounded-xl px-3 py-3 focus-within:border-[#F97316] transition">
              <User className="w-5 h-5 text-gray-400" />
              <input
                className="ml-3 outline-none w-full text-gray-800"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700">Phone Number</label>

            <div className="mt-2 flex items-center border rounded-xl px-3 py-3 focus-within:border-[#F97316] transition">
              <Phone className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                className="ml-3 outline-none w-full text-gray-800"
                placeholder="9876543210"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <div className="bg-[#FDF8F2] rounded-xl p-4 border border-orange-100">
            <p className="text-sm text-gray-500">Dining Table</p>

            <p className="text-3xl font-bold text-[#F97316]">
              Table {tableNo}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F97316] text-white py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition shadow-md hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center">
          <p className="text-[#3F6B63] font-semibold">Loading VibeBite...</p>
        </div>
      }
    >
      <CustomerLoginForm />
    </Suspense>
  );
}