"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import SearchBar from "@/components/searchbar";
import Categories from "@/components/categories";
import FeaturedDishes from "@/components/featureddishes";
import Specials from "@/components/specials";
import WhyChoose from "@/components/whychoose";
import Stats from "@/components/stats";
import Testimonials from "@/components/testimonials";
import { SiteFooter } from "@/components/site-footer";
export default function HomePage() {

  const router = useRouter();

  const [customerName, setCustomerName] = useState("");

  useEffect(() => {

    const name = localStorage.getItem("customerName");

    if (!name) {
      router.replace("/login");
      return;
    }

    setCustomerName(name);

  }, [router]);

  if (!customerName) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FDF8F2]">

  <Navbar />

  <Hero />

  <section className="max-w-7xl mx-auto px-6 py-10">

    <h1 className="text-4xl font-bold text-[#3F6B63]">
      Welcome, {customerName} 👋
    </h1>

    <p className="mt-3 text-gray-600 text-lg">
      Enjoy your premium dining experience with VibeBite.
    </p>

    <button
      onClick={() => router.push("/menu")}
      className="mt-8 bg-[#F97316] text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
    >
      🍽 Start Dining
    </button>

  </section>

  <Specials />

  <WhyChoose />

  <Testimonials />

  <SiteFooter />
  
</main>
  );
}