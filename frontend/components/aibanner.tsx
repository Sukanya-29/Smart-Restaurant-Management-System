"use client";

import Link from "next/link";
import { Bot, Sparkles, ArrowRight } from "lucide-react";

export default function AIBanner() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-[#3F6B63] via-[#2d5b54] to-orange-500 p-10 text-white shadow-2xl">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Left Side */}

            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-md">

                <Sparkles size={18} />

                <span className="font-medium">
                  AI Powered Experience
                </span>

              </div>

              <h2 className="text-5xl font-extrabold leading-tight">
                Meet Your
                <br />
                AI Restaurant Assistant
              </h2>

              <p className="mt-6 text-lg leading-8 text-orange-100">
                Discover personalized food recommendations,
                healthier meal suggestions, calorie information,
                order tracking, and instant restaurant support—
                all powered by AI.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <Link href="/ai-assistant">

                  <button className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-[#3F6B63] transition hover:scale-105">

                    <Bot size={20} />

                    Chat with AI

                  </button>

                </Link>

                <Link href="/menu">

                  <button className="flex items-center gap-2 rounded-2xl border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-[#3F6B63]">

                    Explore Menu

                    <ArrowRight size={18} />

                  </button>

                </Link>

              </div>

            </div>

            {/* Right Side */}

            <div className="flex justify-center">

              <div className="relative">

                <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl"></div>

                <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-lg">

                  <Bot
                    size={150}
                    className="text-white"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}