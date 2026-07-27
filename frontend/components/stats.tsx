"use client";

import {
  Users,
  ShoppingBag,
  Star,
  UtensilsCrossed,
} from "lucide-react";

const stats = [
  {
    title: "Happy Customers",
    value: "25K+",
    icon: Users,
    color: "bg-orange-100 text-orange-500",
  },
  {
    title: "Orders Served",
    value: "100K+",
    icon: ShoppingBag,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Average Rating",
    value: "4.9★",
    icon: Star,
    color: "bg-yellow-100 text-yellow-500",
  },
  {
    title: "Menu Items",
    value: "150+",
    icon: UtensilsCrossed,
    color: "bg-blue-100 text-blue-600",
  },
];

export default function Stats() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-[#3F6B63]">
            Trusted by Thousands
          </h2>

          <p className="mt-3 text-gray-500">
            Serving delicious food with exceptional service every day.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl bg-[#FDF8F2] p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                <div
                  className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${item.color}`}
                >
                  <Icon size={36} />
                </div>

                <h3 className="text-4xl font-extrabold text-[#3F6B63]">
                  {item.value}
                </h3>

                <p className="mt-3 text-gray-600">
                  {item.title}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}