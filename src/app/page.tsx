import Link from "next/link";
import { Heart } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1510] via-[#2a2018] to-[#1a1510] text-white px-6">
      <div className="text-center space-y-6 max-w-2xl mx-auto animate-[fade-in_1s_ease-out]">
        <Heart className="w-12 h-12 text-[#D4A843] mx-auto" />
        <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-display)] text-[#D4A843]">
          Momena Labs
        </h1>
        <p className="text-lg text-white/60 font-[family-name:var(--font-body)]">
          Platform Undangan Digital Self-Service — Wedding, Khitanan, Aqiqah & lainnya.
          <br />
          <span className="text-sm text-white/40">Pilih tema → Isi data → Bayar → Langsung jadi.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/themes-preview/lux-art-1?to=Budi+Santoso"
            className="px-8 py-3 bg-[#D4A843] text-[#1a1510] font-semibold rounded-full hover:bg-[#FFD966] transition-all duration-300 hover:scale-105 font-[family-name:var(--font-body)]"
          >
            Preview: Lux Art 1
          </Link>
          <Link
            href="/themes-preview/rustik-1?to=Budi+Santoso"
            className="px-8 py-3 border-2 border-[#6B8F6B] text-[#9FBF9F] font-semibold rounded-full hover:bg-[#6B8F6B]/20 transition-all duration-300 hover:scale-105 font-[family-name:var(--font-body)]"
          >
            Preview: Rustik 1
          </Link>
        </div>

        <p className="text-xs text-white/30 pt-8 font-[family-name:var(--font-body)]">
          🚧 MVP dalam pembangunan — Sprint Hari 1
        </p>
      </div>
    </main>
  );
}
