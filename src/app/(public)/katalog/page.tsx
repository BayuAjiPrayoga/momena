"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Eye, ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";

/* Placeholder data — akan diganti Prisma query saat DB aktif */
const themes = [
  {
    slug: "lux-art-1",
    name: "Lux Art 1",
    styleGroup: "Lux Art",
    category: "Wedding",
    price: 150000,
    isBestSeller: true,
    accent: "#D4A843",
    bgGradient: "from-[#D4A843]/20 to-[#8C6D1F]/10",
  },
  {
    slug: "rustik-1",
    name: "Rustik 1",
    styleGroup: "Rustik",
    category: "Wedding",
    price: 150000,
    isBestSeller: false,
    accent: "#6B8F6B",
    bgGradient: "from-[#6B8F6B]/20 to-[#445844]/10",
  },
];

const styleGroups = ["Semua", ...new Set(themes.map((t) => t.styleGroup))];

export default function KatalogPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered =
    activeFilter === "Semua"
      ? themes
      : themes.filter((t) => t.styleGroup === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1510] to-[#0f0d0a]">
      {/* ─── Header ─── */}
      <section className="pt-24 pb-12 px-6 text-center">
        <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843]/60 font-[family-name:var(--font-body)]">
          Koleksi Tema
        </p>
        <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-display)] text-white mt-3">
          Katalog Undangan
        </h1>
        <p className="text-white/40 mt-4 max-w-lg mx-auto font-[family-name:var(--font-body)]">
          Pilih tema yang sesuai dengan gaya acara Anda. Setiap tema bisa
          dikustomisasi dengan data acara Anda sendiri.
        </p>
      </section>

      {/* ─── Filters ─── */}
      <section className="px-6 pb-10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-3">
          {styleGroups.map((group) => (
            <button
              key={group}
              onClick={() => setActiveFilter(group)}
              className={`px-5 py-2 text-sm rounded-full border transition-all font-[family-name:var(--font-body)] ${
                activeFilter === group
                  ? "bg-[#D4A843] border-[#D4A843] text-[#1a1510] scale-105"
                  : "border-white/10 text-white/50 hover:border-[#D4A843]/30 hover:text-[#D4A843]"
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Theme Grid ─── */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((theme) => (
            <div
              key={theme.slug}
              className="group rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#D4A843]/30 transition-all duration-300 bg-[#1a1510]"
            >
              {/* Thumbnail placeholder */}
              <div
                className={`aspect-[3/4] bg-gradient-to-br ${theme.bgGradient} relative flex items-center justify-center`}
              >
                {theme.isBestSeller && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#D4A843] text-[#1a1510] text-xs font-bold rounded-full flex items-center gap-1 font-[family-name:var(--font-body)]">
                    <Sparkles className="w-3 h-3" /> Best Seller
                  </span>
                )}
                <div className="text-center space-y-3">
                  <Heart
                    className="w-14 h-14 mx-auto opacity-20 group-hover:scale-110 transition-transform duration-300"
                    style={{ color: theme.accent }}
                  />
                  <p
                    className="text-3xl font-[family-name:var(--font-script)] opacity-40"
                    style={{ color: theme.accent }}
                  >
                    A & F
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={`/themes-preview/${theme.slug}?to=Nama+Tamu`}
                    className="px-6 py-2.5 bg-white text-[#1a1510] text-sm font-semibold rounded-full flex items-center gap-2 hover:scale-105 transition-transform font-[family-name:var(--font-body)]"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold font-[family-name:var(--font-body)]">
                      {theme.name}
                    </h3>
                    <p className="text-xs text-white/30 font-[family-name:var(--font-body)]">
                      {theme.category} · Gaya {theme.styleGroup}
                    </p>
                  </div>
                  <span className="text-xs text-[#D4A843] bg-[#D4A843]/10 px-2.5 py-1 rounded-full font-[family-name:var(--font-body)]">
                    {theme.category}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <p className="text-sm text-white/50 font-[family-name:var(--font-body)]">
                    Mulai dari{" "}
                    <span className="text-[#D4A843] font-semibold">
                      Rp {theme.price.toLocaleString("id-ID")}
                    </span>
                  </p>
                  <Link
                    href={`/book?theme=${theme.slug}`}
                    className="text-xs text-[#D4A843] hover:text-[#FFD966] transition font-[family-name:var(--font-body)] flex items-center gap-1"
                  >
                    Pilih <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/30 font-[family-name:var(--font-body)]">
              Belum ada tema untuk filter ini.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
