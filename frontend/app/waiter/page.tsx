"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WaiterRequestList, {
  WaiterRequest,
} from "@/components/waiter-request-list";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function WaiterPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<WaiterRequest[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem("waiter_auth");
    if (!auth) {
      router.push("/waiter-login");
      return;
    }
    fetchRequests();
  }, [router]);

  // Fetch live service requests from FastAPI backend
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/waiter-requests/`);
      if (!res.ok) throw new Error("Failed to fetch service requests");
      
      const data = await res.json();
      const formatted: WaiterRequest[] = data.map((item: any) => {
        const diffSeconds = Math.floor(
          (new Date().getTime() - new Date(item.created_at).getTime()) / 1000
        );
        const minutes = Math.floor(diffSeconds / 60);
        const waitingTime = minutes > 0 ? `${minutes} min` : `${diffSeconds} sec`;

        return {
          id: item.id,
          tableNo: item.table_no,
          customerName: item.customer_name,
          service: item.service,
          waitingTime: waitingTime,
          waitingSeconds: diffSeconds,
          status: item.status as "Pending" | "Accepted",
        };
      });
      setRequests(formatted);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Handle Accept via Backend API
  const handleAccept = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/waiter-requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Accepted" }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: "Accepted" } : request
          )
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Handle Complete via Backend API
  const handleComplete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/waiter-requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((request) => request.id !== id));
      }
    } catch (err) {
      console.error("Error completing request:", err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("waiter_auth");
    router.push("/waiter-login");
  };

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const acceptedCount = requests.filter(
    (request) => request.status === "Accepted"
  ).length;

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#3F6B63]">
              👨‍🍳 Waiter Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage customer service requests in real time.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <div className="rounded-2xl bg-white px-6 py-4 shadow">
                <p className="text-sm text-gray-500">Pending</p>
                <h2 className="text-3xl font-bold text-orange-600">
                  {pendingCount}
                </h2>
              </div>

              <div className="rounded-2xl bg-white px-6 py-4 shadow">
                <p className="text-sm text-gray-500">Accepted</p>
                <h2 className="text-3xl font-bold text-green-600">
                  {acceptedCount}
                </h2>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-red-600 bg-white border px-4 py-4 rounded-2xl hover:bg-red-50 transition shadow"
            >
              Logout
            </button>
          </div>
        </div>

        <WaiterRequestList
          requests={requests}
          onAccept={handleAccept}
          onComplete={handleComplete}
        />
      </div>
    </main>
  );
}