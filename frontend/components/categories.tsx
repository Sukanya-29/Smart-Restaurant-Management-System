"use client";

import {
  Pizza,
  Beef,
  Soup,
  Coffee,
  IceCream2,
  Sandwich,
  CupSoda,
  UtensilsCrossed,
} from "lucide-react";

const categories = [
  {
    name: "Pizza",
    icon: Pizza,
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Burgers",
    icon: Sandwich,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    name: "Indian",
    icon: UtensilsCrossed,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Chinese",
    icon: Soup,
    color: "bg-red-100 text-red-600",
  },
  {
    name: "Coffee",
    icon: Coffee,
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Desserts",
    icon: IceCream2,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Drinks",
    icon: CupSoda,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "BBQ",
    icon: Beef,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function Categories() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">

          <h2 className="text-4xl font-bold text-[#3F6B63]">
            Browse Categories
          </h2>

          <p className="mt-3 text-gray-500">
            Discover delicious meals from every category.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                className="group rounded-3xl bg-[#FDF8F2] p-8 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${category.color}`}
                >
                  <Icon size={36} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#3F6B63] group-hover:text-orange-500">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Explore tasty {category.name.toLowerCase()} dishes
                </p>

              </button>
            );
          })}

        </div>

      </div>
    </section>
  );
}