import Link from "next/link";
import { CheckCircle2, Clock, Heart, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesanan Berhasil",
};

type SearchParams = Promise<{ order_id?: string; status?: string }>;

export default async function BookSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { order_id, status } = await searchParams;
  const isPending = status === "pending";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1510] to-[#0f0d0a] flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center space-y-8 animate-[fade-in_0.6s_ease-out]">
        {isPending ? (
          <Clock className="w-16 h-16 text-yellow-500 mx-auto" />
        ) : (
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        )}

        <h1 className="text-3xl font-[family-name:var(--font-display)] text-white">
          {isPending ? "Menunggu Pembayaran" : "Pesanan Berhasil! 🎉"}
        </h1>

        <p className="text-white/50 font-[family-name:var(--font-body)]">
          {isPending
            ? "Silakan selesaikan pembayaran Anda. Undangan akan aktif setelah pembayaran dikonfirmasi."
            : "Undangan digital Anda sedang diproses. Kami akan mengirimkan link undangan melalui WhatsApp dan email."}
        </p>

        {order_id && (
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-white/30 font-[family-name:var(--font-body)]">
              Nomor Pesanan
            </p>
            <p className="text-sm text-[#D4A843] font-mono mt-1">{order_id}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-[#D4A843] text-[#1a1510] font-semibold rounded-full hover:bg-[#FFD966] transition-all font-[family-name:var(--font-body)] flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <Link
            href="/katalog"
            className="text-sm text-white/40 hover:text-[#D4A843] transition font-[family-name:var(--font-body)] flex items-center justify-center gap-1"
          >
            Lihat tema lainnya <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
