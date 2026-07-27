"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Blogger",
    image: "https://i.pravatar.cc/150?img=32",
    review:
      "Absolutely loved the experience! The AI recommendations were surprisingly accurate and the food quality was outstanding.",
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "Regular Customer",
    image: "https://i.pravatar.cc/150?img=14",
    review:
      "Fast delivery, beautiful interface, and delicious food. VibeBite has become my favorite restaurant platform.",
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Restaurant Enthusiast",
    image: "https://i.pravatar.cc/150?img=48",
    review:
      "Ordering has never been this easy. Everything feels premium and smooth from start to finish.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#FDF8F2] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-[#3F6B63]">
            What Our Customers Say
          </h2>

          <p className="mt-3 text-gray-500">
            Thousands of happy customers trust VibeBite every day.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {testimonials.map((user) => (
            <div
              key={user.id}
              className="rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-6 flex items-center gap-4">

                <img
                  src={user.image}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-xl font-bold text-[#3F6B63]">
                    {user.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {user.role}
                  </p>
                </div>

              </div>

              <div className="mb-5 flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill="currentColor"
                  />
                ))}
              </div>

              <p className="leading-7 text-gray-600">
                "{user.review}"
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}