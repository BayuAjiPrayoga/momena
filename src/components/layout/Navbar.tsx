"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog Tema" },
  { href: "/harga", label: "Harga" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#1a1510]/80 border-b border-[#D4A843]/10">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Heart className="w-5 h-5 text-[#D4A843] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold font-[family-name:var(--font-display)] text-[#D4A843]">
            Momena
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-white/60 hover:text-[#D4A843] transition-colors font-[family-name:var(--font-body)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/book"
          className="hidden md:inline-flex px-5 py-2 bg-[#D4A843] text-[#1a1510] text-sm font-semibold rounded-full hover:bg-[#FFD966] transition-all hover:scale-105 font-[family-name:var(--font-body)]"
        >
          Buat Undangan
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white/70 hover:text-[#D4A843] transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a1510]/95 backdrop-blur-xl border-t border-[#D4A843]/10 animate-[fade-in-down_0.3s_ease-out]">
          <ul className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-white/70 hover:text-[#D4A843] transition font-[family-name:var(--font-body)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="inline-flex px-5 py-2.5 bg-[#D4A843] text-[#1a1510] text-sm font-semibold rounded-full hover:bg-[#FFD966] transition font-[family-name:var(--font-body)] w-full justify-center"
              >
                Buat Undangan
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
