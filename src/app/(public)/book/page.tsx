import { Suspense } from "react";
import BookingWizard from "@/components/booking/BookingWizard";
import Script from "next/script";
import { SNAP_JS_URL, MIDTRANS_CLIENT_KEY } from "@/lib/midtrans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Undangan",
  description: "Buat undangan digital premium Anda sekarang — pilih tema, isi data, bayar, langsung aktif.",
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1510] to-[#0f0d0a] py-24 px-6">
      {/* Midtrans Snap.js */}
      {MIDTRANS_CLIENT_KEY && (
        <Script
          src={SNAP_JS_URL}
          data-client-key={MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      )}

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <p className="text-sm tracking-[0.2em] uppercase text-[#D4A843]/60 font-[family-name:var(--font-body)]">
          Booking
        </p>
        <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] text-white mt-3">
          Buat Undangan Anda
        </h1>
      </div>

      <Suspense fallback={<div className="text-center text-white/30">Memuat...</div>}>
        <BookingWizard />
      </Suspense>
    </div>
  );
}
