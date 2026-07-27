"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

// Single fixed password for Manager/Admin access
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "vibebite@123";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, automatically redirect to admin dashboard
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn === "true") {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("Incorrect Password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF8F2] to-orange-100 p-4">
      <div className="w-[420px] rounded-3xl bg-white shadow-2xl p-10">
        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 rounded-full p-5 shadow-md">
            <Lock className="text-white" size={34} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center text-[#3F6B63]">
          Manager Login
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Enter manager password
        </p>

        <form onSubmit={handleLogin} className="mt-8">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter Password"
              className="w-full rounded-2xl border-2 border-orange-200 px-5 py-4 pr-14 text-lg outline-none focus:border-orange-500 transition"
              autoFocus
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {show ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center text-red-500 font-medium animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-8 w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white transition hover:bg-orange-600 hover:scale-[1.02] shadow-lg"
          >
            🔒 Access Dashboard
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full rounded-2xl border-2 border-[#3F6B63] py-4 text-lg font-semibold text-[#3F6B63] transition hover:bg-[#3F6B63] hover:text-white"
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
}