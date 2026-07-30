"use client";

import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  return (
    <section className="bg-[#FDF8F2] px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-[#3F6B63]">
            Find Your Favorite Food
          </h2>

          <p className="mt-3 text-gray-600">
            Search from hundreds of delicious dishes.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">

          {/* Search Box */}
          <div className="flex flex-1 items-center rounded-2xl bg-white px-5 py-4 shadow-lg">

            <Search
              className="mr-3 text-orange-500"
              size={22}
            />

            <input
              type="text"
              placeholder="Search Pizza, Burger, Pasta..."
              className="w-full bg-transparent text-lg outline-none"
            />

          </div>

          {/* Filter Button */}

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-orange-600">

            <SlidersHorizontal size={20} />

            Filters

          </button>

        </div>

        {/* Quick Search */}

        <div className="mt-8 flex flex-wrap justify-center gap-4">

          {[
            "Pizza",
            "Burger",
            "Pasta",
            "Chinese",
            "South Indian",
            "Desserts",
            "Coffee",
            "Drinks",
          ].map((item) => (
            <button
              key={item}
              className="rounded-full border border-orange-200 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-orange-500 hover:text-white"
            >
              {item}
            </button>
          ))}

        </div>

      </div>
    </section>
  );
}