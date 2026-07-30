"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat } from "lucide-react";
import { signIn } from "next-auth/react";

export default function CustLoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || phone.length < 10) {
      alert("Please enter valid name and phone number");
      return;
    }
    localStorage.setItem("customerName", name);
    localStorage.setItem("customerPhone", phone);
    router.push("/customer-auth");
  };

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-5">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        
        <div className="flex justify-center mb-5">
          <div className="bg-[#3F6B63] w-20 h-20 rounded-full flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-[#3F6B63]">
          Customer Login
        </h1>
        <p className="text-center text-gray-500 mt-2 text-sm">
          Sign in quickly with OAuth or enter your details
        </p>

        {/* OAuth Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            <span>🌐</span> Continue with Google
          </button>

          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition shadow-sm"
          >
            <span>🐙</span> Continue with GitHub
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">or enter manually</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Original Manual Form */}
        <form onSubmit={handleProceed} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-[#F97316]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit number"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-[#F97316]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F97316] text-white py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition mt-2"
          >
            Proceed to Verify
          </button>
        </form>

      </div>
    </main>
  );
}