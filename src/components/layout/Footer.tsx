import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f0d0a] border-t border-[#D4A843]/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#D4A843]" />
              <span className="text-lg font-[family-name:var(--font-display)] text-[#D4A843]">
                Momena Labs
              </span>
            </div>
            <p className="text-sm text-white/40 font-[family-name:var(--font-body)] leading-relaxed max-w-xs">
              Platform undangan digital self-service. Pilih tema, isi data,
              bayar — langsung jadi dalam hitungan menit.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider font-[family-name:var(--font-body)]">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/katalog", label: "Katalog Tema" },
                { href: "/harga", label: "Harga & Paket" },
                { href: "/book", label: "Buat Undangan" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-[#D4A843] transition font-[family-name:var(--font-body)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider font-[family-name:var(--font-body)]">
              Hubungi Kami
            </h3>
            <ul className="space-y-2 text-sm text-white/40 font-[family-name:var(--font-body)]">
              <li>📱 WhatsApp: 0812-xxxx-xxxx</li>
              <li>📧 hello@momena.id</li>
              <li>📍 Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 font-[family-name:var(--font-body)]">
            © {new Date().getFullYear()} Momena Labs. All rights reserved.
          </p>
          <p className="text-xs text-white/20 font-[family-name:var(--font-body)]">
            Made with <Heart className="w-3 h-3 inline text-[#D4A843]/40" /> in
            Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
