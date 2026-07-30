"use client";

import {
  Clock3,
  ShieldCheck,
  Bot,
  UtensilsCrossed,
} from "lucide-react";

const features = [
  {
    title: "Fast Delivery",
    description:
      "Get your favorite meals delivered quickly with real-time order tracking.",
    icon: Clock3,
    bg: "bg-orange-100",
    color: "text-orange-500",
  },
  {
    title: "Fresh Ingredients",
    description:
      "Every dish is prepared using fresh and high-quality ingredients.",
    icon: UtensilsCrossed,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "AI Recommendations",
    description:
      "Our AI helps customers discover meals based on their preferences.",
    icon: Bot,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Secure Ordering",
    description:
      "Reliable ordering experience with safe checkout and live order updates.",
    icon: ShieldCheck,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-[#FDF8F2] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold text-[#3F6B63]">
            Why Choose VibeBite?
          </h2>

          <p className="mt-3 text-gray-600">
            A smarter and faster restaurant experience powered by technology.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                <div
                  className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${feature.bg}`}
                >
                  <Icon
                    size={38}
                    className={feature.color}
                  />
                </div>

                <h3 className="text-2xl font-bold text-[#3F6B63] group-hover:text-orange-500">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}