import Link from "next/link";
import {
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Momena Labs — Platform Undangan Digital Self-Service",
  description:
    "Buat undangan digital pernikahan, khitanan, aqiqah & acara lainnya dalam hitungan menit. Pilih tema, isi data, bayar, langsung jadi.",
};

/* ─── Placeholder data (akan diganti Prisma query saat DB aktif) ─── */
const featuredThemes = [
  {
    slug: "lux-art-1",
    name: "Lux Art 1",
    style: "Lux Art",
    price: 150000,
    color: "from-[#D4A843]/20 to-[#8C6D1F]/10",
    accent: "#D4A843",
  },
  {
    slug: "rustik-1",
    name: "Rustik 1",
    style: "Rustik",
    price: 150000,
    color: "from-[#6B8F6B]/20 to-[#445844]/10",
    accent: "#6B8F6B",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Jadi Dalam Hitungan Menit",
    desc: "Tanpa menunggu antrian admin. Pilih tema, isi data, bayar — undangan langsung aktif.",
  },
  {
    icon: Sparkles,
    title: "Tema Premium Variatif",
    desc: "Koleksi tema elegan & modern yang terus bertambah. Setiap tema dirancang detail.",
  },
  {
    icon: Shield,
    title: "RSVP & Guestbook Otomatis",
    desc: "Tamu bisa langsung RSVP dan menulis ucapan. Data real-time di dashboard Anda.",
  },
  {
    icon: Clock,
    title: "Aktif 365 Hari",
    desc: "Undangan Anda tetap aktif hingga 1 tahun penuh, bisa diakses kapan saja.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1510] via-[#2a2018] to-[#1a1510]">
        {/* BG pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' fill='%23D4A843' fill-opacity='0.3'/%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8 animate-[fade-in_1s_ease-out]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A843]/10 rounded-full border border-[#D4A843]/20">
            <Sparkles className="w-4 h-4 text-[#D4A843]" />
            <span className="text-xs text-[#D4A843] font-[family-name:var(--font-body)]">
              Platform Undangan Digital #1
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-display)] text-white leading-tight">
            Undangan Digital
            <br />
            <span className="text-shimmer-gold">Premium & Instan</span>
          </h1>

          <p className="text-base md:text-lg text-white/50 font-[family-name:var(--font-body)] max-w-2xl mx-auto leading-relaxed">
            Pilih tema elegan, isi data acara, bayar — undangan langsung aktif.
            <br className="hidden md:block" />
            Tanpa menunggu admin, tanpa ribet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/katalog"
              className="px-8 py-3.5 bg-[#D4A843] text-[#1a1510] font-semibold rounded-full hover:bg-[#FFD966] transition-all duration-300 hover:scale-105 font-[family-name:var(--font-body)] flex items-center gap-2"
            >
              Lihat Katalog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/harga"
              className="px-8 py-3.5 border border-white/20 text-white/70 font-semibold rounded-full hover:border-[#D4A843]/50 hover:text-[#D4A843] transition-all duration-300 font-[family-name:var(--font-body)]"
            >
              Lihat Harga
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="py-20 md:py-28 bg-[#0f0d0a] px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843]/60 font-[family-name:var(--font-body)]">
              Kenapa Momena?
            </p>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-white mt-3">
              Semua Serba Otomatis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#D4A843]/20 transition-all duration-300 group"
              >
                <b.icon className="w-8 h-8 text-[#D4A843]/70 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                  {b.title}
                </h3>
                <p className="text-sm text-white/40 mt-2 font-[family-name:var(--font-body)] leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Themes ─── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#0f0d0a] to-[#1a1510] px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843]/60 font-[family-name:var(--font-body)]">
              Koleksi Tema
            </p>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-white mt-3">
              Tema Pilihan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredThemes.map((theme) => (
              <Link
                key={theme.slug}
                href={`/themes-preview/${theme.slug}?to=Nama+Tamu`}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#D4A843]/30 transition-all duration-300"
              >
                <div
                  className={`aspect-[4/3] bg-gradient-to-br ${theme.color} flex items-center justify-center`}
                >
                  <div className="text-center space-y-3">
                    <Heart
                      className="w-12 h-12 mx-auto opacity-30 group-hover:scale-110 transition-transform"
                      style={{ color: theme.accent }}
                    />
                    <p
                      className="text-3xl font-[family-name:var(--font-script)]"
                      style={{ color: theme.accent }}
                    >
                      Ahmad & Fatimah
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-[#1a1510]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold font-[family-name:var(--font-body)]">
                        {theme.name}
                      </h3>
                      <p className="text-xs text-white/40 font-[family-name:var(--font-body)]">
                        Gaya: {theme.style}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-[#D4A843]/10 text-[#D4A843] rounded-full font-[family-name:var(--font-body)]">
                      Preview →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/katalog"
              className="text-sm text-[#D4A843] hover:text-[#FFD966] transition font-[family-name:var(--font-body)] inline-flex items-center gap-2"
            >
              Lihat semua tema <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 md:py-28 bg-[#0f0d0a] px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843]/60 font-[family-name:var(--font-body)]">
              Cara Kerja
            </p>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-white mt-3">
              4 Langkah Mudah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Pilih Tema", desc: "Pilih dari koleksi tema premium kami" },
              { step: "02", title: "Isi Data", desc: "Masukkan nama, tanggal, dan lokasi acara" },
              { step: "03", title: "Bayar", desc: "Pembayaran instan via transfer/QRIS" },
              { step: "04", title: "Bagikan!", desc: "Link undangan langsung siap dibagikan" },
            ].map((s) => (
              <div key={s.step} className="text-center space-y-3">
                <span className="text-3xl font-bold text-[#D4A843]/20 font-[family-name:var(--font-display)]">
                  {s.step}
                </span>
                <h3 className="text-white font-semibold font-[family-name:var(--font-body)]">
                  {s.title}
                </h3>
                <p className="text-xs text-white/40 font-[family-name:var(--font-body)]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#0f0d0a] to-[#1a1510] px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <Heart className="w-10 h-10 text-[#D4A843] mx-auto" />
          <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-white">
            Siap Buat Undangan?
          </h2>
          <p className="text-white/40 font-[family-name:var(--font-body)]">
            Mulai dari{" "}
            <span className="text-[#D4A843] font-semibold">Rp 99.000</span>{" "}
            saja. Aktif 365 hari penuh.
          </p>
          <Link
            href="/book"
            className="inline-flex px-10 py-4 bg-[#D4A843] text-[#1a1510] text-lg font-semibold rounded-full hover:bg-[#FFD966] transition-all duration-300 hover:scale-105 font-[family-name:var(--font-body)] items-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Buat Undangan Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
