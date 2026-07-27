"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingCart, User, Bot, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import ServiceRequestModal from "@/components/service-request-modal";
import ServiceSuccessPopup from "@/components/service-success-popup";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Navbar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomerName(localStorage.getItem("customerName") || "Guest");
    setCustomerPhone(localStorage.getItem("customerPhone") || "Not Available");
    setTableNo(localStorage.getItem("tableNo") || "--");
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const logout = () => {
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerPhone");
    localStorage.removeItem("tableNo");
    localStorage.removeItem("cart");
    router.replace("/login");
  };

  // 👇 Yeh function service select hone par backend (Supabase) mein request bhejega
  const handleServiceSelect = async (service: string) => {
    setSelectedService(service);
    setShowServiceModal(false);
    setShowSuccessPopup(true);

    try {
      await fetch(`${API_BASE_URL}/waiter-requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_no: tableNo !== "--" ? tableNo : "01",
          customer_name: customerName || "Guest",
          service: service,
        }),
      });
    } catch (err) {
      console.error("Error saving service request to database:", err);
    }

    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 2000);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl shadow-lg">
            🍽️
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#3F6B63]">
              VibeBite
            </h1>
            <p className="text-xs text-gray-500">
              Smart Restaurant
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="font-medium text-gray-700 transition hover:text-orange-500"
          >
            Home
          </Link>

          <Link
            href="/menu"
            className="font-medium text-gray-700 transition hover:text-orange-500"
          >
            Menu
          </Link>

          <Link
            href="/ai-assistant"
            className="flex items-center gap-2 font-medium text-gray-700 transition hover:text-orange-500"
          >
            <Bot size={18} />
            AI Assistant
          </Link>

          <button
            onClick={() => setShowServiceModal(true)}
            className="font-medium text-gray-700 transition hover:text-orange-500"
          >
            🍽 Request Service
          </button>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="rounded-xl p-3 transition hover:bg-orange-100"
          >
            <ShoppingCart className="text-orange-500" size={22} />
          </Link>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setOpen(!open)}
              className="rounded-xl p-3 transition hover:bg-orange-100"
            >
              <User className="text-[#3F6B63]" size={22} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white shadow-2xl border border-orange-100 overflow-hidden">
                <div className="bg-orange-500 text-white p-5">
                  <p className="text-xl font-bold">{customerName}</p>
                  <p className="text-sm opacity-90">{customerPhone}</p>
                  <p className="text-sm mt-1">🍽 Table {tableNo}</p>
                </div>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-orange-50 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button className="rounded-xl p-3 transition hover:bg-orange-100 md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Service Request Modal */}
      <ServiceRequestModal
        open={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSelect={handleServiceSelect}
      />

      {/* Success Popup */}
      <ServiceSuccessPopup
        open={showSuccessPopup}
        service={selectedService}
      />
    </header>
  );
}