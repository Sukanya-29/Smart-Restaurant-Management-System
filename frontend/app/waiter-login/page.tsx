"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export default function WaiterLoginPage() {
  const router = useRouter();

  const [waiterId, setWaiterId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Fixed Credentials Check & Session Storage Integration
    if (
      waiterId === "waiter01" &&
      password === "vibebite123"
    ) {
      sessionStorage.setItem("waiter_auth", "true");
      router.push("/waiter");
      return;
    }

    setError("Invalid Waiter ID or Password");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-orange-50 px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold text-center text-[#3F6B63]">
          🍽 VibeBite
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Waiter Login
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="mb-2 block font-medium">
              Waiter ID
            </label>

            <div className="flex items-center rounded-xl border px-3">
              <User size={18} className="text-gray-400" />

              <input
                type="text"
                value={waiterId}
                onChange={(e) =>
                  setWaiterId(e.target.value)
                }
                placeholder="Enter Waiter ID"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <div className="flex items-center rounded-xl border px-3">
              <Lock size={18} className="text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="waiter-pass"
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter Password"
                className="w-full p-3 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Login
          </button>

        </form>

      </div>

    </main>
  );
}