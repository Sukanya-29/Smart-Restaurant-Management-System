"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";

const dishes = [
  {
    id: 1,
    name: "Paneer Supreme Pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    price: 349,
    rating: 4.9,
    type: "Veg",
  },
  {
    id: 2,
    name: "Classic Cheeseburger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    price: 249,
    rating: 4.8,
    type: "Non-Veg",
  },
  {
    id: 3,
    name: "White Sauce Pasta",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
    price: 299,
    rating: 4.7,
    type: "Veg",
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
    price: 199,
    rating: 4.9,
    type: "Veg",
  },
  {
    id: 5,
    name: "Masala Dosa",
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800",
    price: 179,
    rating: 4.8,
    type: "Veg",
  },
  {
    id: 6,
    name: "Cold Coffee",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
    price: 149,
    rating: 4.6,
    type: "Veg",
  },
  {
    id: 7,
    name: "Veg Momos",
    image:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800",
    price: 189,
    rating: 4.8,
    type: "Veg",
  },
  {
    id: 8,
    name: "Grilled Sandwich",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
    price: 169,
    rating: 4.7,
    type: "Veg",
  },
];

export default function FeaturedDishes() {
  return (
    <section className="bg-[#FDF8F2] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 flex items-center justify-between">

          <div>
            <h2 className="text-4xl font-bold text-[#3F6B63]">
              Featured Dishes
            </h2>

            <p className="mt-2 text-gray-500">
              Customer favourites handpicked for you.
            </p>
          </div>

          <button className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            View All
          </button>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {dishes.map((dish) => (

            <div
              key={dish.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="relative">

                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-lg">
                  <Heart
                    size={18}
                    className="text-red-500"
                  />
                </button>

                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
                    dish.type === "Veg"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {dish.type}
                </span>

              </div>

              <div className="p-6">

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="text-xl font-bold text-[#3F6B63]">
                    {dish.name}
                  </h3>

                  <div className="flex items-center gap-1">

                    <Star
                      size={18}
                      fill="gold"
                      className="text-yellow-400"
                    />

                    <span className="font-semibold">
                      {dish.rating}
                    </span>

                  </div>

                </div>

                <p className="mb-5 text-sm text-gray-500">
                  Freshly prepared using premium ingredients.
                </p>

                <div className="flex items-center justify-between">

                  <h2 className="text-2xl font-bold text-orange-500">
                    ₹{dish.price}
                  </h2>

                  <button className="flex items-center gap-2 rounded-xl bg-[#3F6B63] px-4 py-3 font-semibold text-white transition hover:bg-orange-500">

                    <ShoppingCart size={18} />

                    Add

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}