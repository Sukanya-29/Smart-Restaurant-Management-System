"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDF8F2]">
      <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-between gap-12 px-6 py-20 lg:flex-row">

        {/* Left */}
        <div className="max-w-2xl">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
            <Sparkles size={16} />
            AI Powered Restaurant Experience
          </div>

          <h1 className="text-5xl font-extrabold leading-tight text-[#3F6B63] md:text-7xl">
            Smart Dining
            <br />
            Starts With
            <span className="block text-orange-500">
              VibeBite
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            Experience seamless food ordering, smart restaurant management,
            AI-powered recommendations, and real-time order tracking —
            all in one platform.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link href="/menu">
              <button className="flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-orange-600">
                Explore Menu
                <ArrowRight size={18} />
              </button>
            </Link>

            <Link href="/ai-assistant">
              <button className="rounded-2xl border-2 border-[#3F6B63] px-8 py-4 font-semibold text-[#3F6B63] transition hover:bg-[#3F6B63] hover:text-white">
                AI Assistant
              </button>
            </Link>

          </div>

          <div className="mt-12 flex flex-wrap gap-8">

            <div>
              <h2 className="text-3xl font-bold text-[#3F6B63]">
                10K+
              </h2>
              <p className="text-gray-500">
                Happy Customers
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#3F6B63]">
                500+
              </h2>
              <p className="text-gray-500">
                Daily Orders
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#3F6B63]">
                4.9
              </h2>

              <div className="mt-1 flex text-yellow-400">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="relative flex items-center justify-center">

          <div className="absolute h-96 w-96 rounded-full bg-orange-200 blur-3xl opacity-40"></div>

          <div className="relative rounded-[40px] bg-white p-8 shadow-2xl">

            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900"
              alt="Pizza"
              className="h-[430px] w-[430px] rounded-3xl object-cover"
            />

            <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-5 shadow-xl">

              <p className="text-sm text-gray-500">
                Today's Special
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#3F6B63]">
                Paneer Supreme Pizza
              </h3>

              <p className="mt-2 font-semibold text-orange-500">
                ₹349
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}