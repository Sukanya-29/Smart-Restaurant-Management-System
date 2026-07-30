"use client";

import { useRouter } from "next/navigation";
import { ChefHat, Users, Building2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-5">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#3F6B63] w-20 h-20 rounded-full flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-[#3F6B63]">
          Welcome to VibeBite
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Choose how you want to continue
        </p>

        {/* Customer Card - FIXED ROUTE HERE */}
        <button
          onClick={() => router.push("/cust-login")}
          className="w-full mt-10 border-2 border-[#F97316] rounded-2xl p-5 hover:bg-orange-50 transition text-left"
        >
          <div className="flex items-center gap-4">
            <Users className="w-10 h-10 text-[#F97316]" />

            <div>
              <h2 className="text-xl font-bold text-black">
                Customer
              </h2>

              <p className="text-gray-500 text-sm">
                Start dining and place your order
              </p>
            </div>
          </div>
        </button>

        {/* Restaurant Portal Card */}
        <button
          onClick={() => router.push("/portal")}
          className="w-full mt-5 border-2 border-[#3F6B63] rounded-2xl p-5 hover:bg-green-50 transition text-left"
        >
          <div className="flex items-center gap-4">
            <Building2 className="w-10 h-10 text-[#3F6B63]" />

            <div>
              <h2 className="text-xl font-bold text-black">
                Restaurant Portal
              </h2>

              <p className="text-gray-500 text-sm">
                Admin • Staff • Kitchen
              </p>
            </div>
          </div>
        </button>

      </div>
    </main>
  );
}