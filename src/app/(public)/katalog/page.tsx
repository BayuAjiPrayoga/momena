import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import KatalogClient from "@/components/public/KatalogClient";

export const metadata: Metadata = {
  title: "Katalog Tema",
  description: "Pilih tema undangan digital eksklusif untuk momen spesial Anda.",
};

export const dynamic = "force-dynamic";

export default async function KatalogPage() {
  const dbThemes = await prisma.theme.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

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

      <KatalogClient themes={dbThemes} />
    </div>
  );
}
