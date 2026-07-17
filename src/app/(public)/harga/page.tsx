import Link from "next/link";
import { Check, Sparkles, Crown, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harga & Paket",
  description:
    "Pilih paket undangan digital yang sesuai kebutuhan Anda. Mulai dari Rp 99.000.",
};

/* Placeholder data — akan diganti Prisma query saat DB aktif */
const packages = [
  {
    id: "pkg-starter",
    name: "Starter",
    price: 99000,
    icon: Star,
    desc: "Untuk yang butuh undangan simpel & elegan.",
    maxGuests: 100,
    maxPhotos: 5,
    maxRevisions: 1,
    features: [
      "RSVP",
      "Buku Ucapan",
      "Musik Latar",
      "Peta Lokasi",
      "Kalender",
      "Countdown",
      "Galeri Foto",
    ],
    excluded: ["Amplop Digital", "Love Story"],
    popular: false,
  },
  {
    id: "pkg-populer",
    name: "Populer",
    price: 199000,
    icon: Sparkles,
    desc: "Paling banyak dipilih — fitur lengkap.",
    maxGuests: 500,
    maxPhotos: 15,
    maxRevisions: 3,
    features: [
      "RSVP",
      "Buku Ucapan",
      "Musik Latar",
      "Peta Lokasi",
      "Kalender",
      "Countdown",
      "Galeri Foto",
      "Amplop Digital",
      "Love Story",
    ],
    excluded: [],
    popular: true,
  },
  {
    id: "pkg-premium",
    name: "Premium",
    price: 399000,
    icon: Crown,
    desc: "Pengalaman paling premium untuk hari spesial.",
    maxGuests: 2000,
    maxPhotos: 30,
    maxRevisions: 10,
    features: [
      "RSVP",
      "Buku Ucapan",
      "Musik Latar",
      "Peta Lokasi",
      "Kalender",
      "Countdown",
      "Galeri Foto",
      "Amplop Digital",
      "Love Story",
    ],
    excluded: [],
    popular: false,
  },
];

export default function HargaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1510] to-[#0f0d0a]">
      {/* Header */}
      <section className="pt-24 pb-12 px-6 text-center">
        <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843]/60 font-[family-name:var(--font-body)]">
          Harga & Paket
        </p>
        <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-display)] text-white mt-3">
          Pilih Paket Anda
        </h1>
        <p className="text-white/40 mt-4 max-w-lg mx-auto font-[family-name:var(--font-body)]">
          Semua paket sudah termasuk tema pilihan Anda, aktif 365 hari, dan
          dukungan penuh.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                pkg.popular
                  ? "border-[#D4A843]/50 bg-gradient-to-b from-[#D4A843]/5 to-transparent scale-[1.02] md:scale-105 shadow-2xl shadow-[#D4A843]/5"
                  : "border-white/[0.06] bg-[#1a1510] hover:border-white/10"
              }`}
            >
              {pkg.popular && (
                <div className="bg-[#D4A843] text-[#1a1510] text-xs font-bold text-center py-1.5 font-[family-name:var(--font-body)]">
                  🔥 PALING POPULER
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                <pkg.icon
                  className={`w-8 h-8 mb-4 ${
                    pkg.popular ? "text-[#D4A843]" : "text-white/30"
                  }`}
                />

                <h3 className="text-xl font-semibold text-white font-[family-name:var(--font-display)]">
                  {pkg.name}
                </h3>
                <p className="text-sm text-white/40 mt-1 font-[family-name:var(--font-body)]">
                  {pkg.desc}
                </p>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-white font-[family-name:var(--font-display)]">
                    Rp {pkg.price.toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm text-white/30 font-[family-name:var(--font-body)]">
                    {" "}
                    / undangan
                  </span>
                </div>

                {/* Specs */}
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between text-white/50 font-[family-name:var(--font-body)]">
                    <span>Maks. Tamu</span>
                    <span className="text-white font-medium">
                      {pkg.maxGuests.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/50 font-[family-name:var(--font-body)]">
                    <span>Maks. Foto</span>
                    <span className="text-white font-medium">
                      {pkg.maxPhotos}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/50 font-[family-name:var(--font-body)]">
                    <span>Revisi</span>
                    <span className="text-white font-medium">
                      {pkg.maxRevisions}x
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-2.5 flex-1">
                  {pkg.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-sm text-white/60 font-[family-name:var(--font-body)]"
                    >
                      <Check className="w-4 h-4 text-[#D4A843] shrink-0" />
                      {f}
                    </div>
                  ))}
                  {pkg.excluded.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-sm text-white/20 line-through font-[family-name:var(--font-body)]"
                    >
                      <Check className="w-4 h-4 text-white/10 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={`/book?package=${pkg.id}`}
                  className={`mt-8 block text-center py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 font-[family-name:var(--font-body)] ${
                    pkg.popular
                      ? "bg-[#D4A843] text-[#1a1510] hover:bg-[#FFD966]"
                      : "bg-white/5 text-white/70 border border-white/10 hover:border-[#D4A843]/30 hover:text-[#D4A843]"
                  }`}
                >
                  Pilih {pkg.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
