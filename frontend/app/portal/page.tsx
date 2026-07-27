"use client";

import { useRouter } from "next/navigation";
import { ChefHat, UserCog, UtensilsCrossed } from "lucide-react";

export default function PortalPage() {
  const router = useRouter();

  const roles = [
    {
      title: "Manager",
      description: "Manage restaurant operations, analytics and staff.",
      icon: UserCog,
      color: "bg-blue-100 text-blue-600",
      route: "/admin-login",
    },
    {
      title: "Chef",
      description: "View incoming orders and update food status.",
      icon: ChefHat,
      color: "bg-green-100 text-green-600",
      route: "/kitchen",
    },
    {
      title: "Waiter",
      description: "Handle customer service requests and orders.",
      icon: UtensilsCrossed,
      color: "bg-orange-100 text-orange-600",
      route: "/waiter-login",
    },
  ];

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-[#3F6B63]">
            🍽 VibeBite
          </h1>

          <p className="mt-3 text-xl text-gray-600">
            Portal
          </p>

          <p className="mt-2 text-gray-500">
            Select your role to continue.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <div
                key={role.title}
                className="rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${role.color}`}
                >
                  <Icon size={40} />
                </div>

                <h2 className="text-2xl font-bold text-[#3F6B63]">
                  {role.title}
                </h2>

                <p className="mt-3 min-h-[70px] text-gray-500">
                  {role.description}
                </p>

                <button
                  onClick={() => router.push(role.route)}
                  className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Continue
                </button>
              </div>
            );
          })}

        </div>
      </div>
    </main>
  );
}