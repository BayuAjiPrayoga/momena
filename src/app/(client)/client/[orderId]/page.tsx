import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import ClientDashboardTabs from "@/components/client/ClientDashboardTabs";

export const metadata: Metadata = {
  title: "Panel Klien | Momena Labs",
  description: "Kelola daftar tamu dan ucapan undangan Anda.",
};

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      theme: true,
      _count: {
        select: {
          guests: true,
          guestbook: true,
        }
      },
      guests: {
        orderBy: { respondedAt: 'desc' }
      },
      guestbook: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!order) {
    notFound();
  }

  const isPaid = order.status === "ACTIVE";
  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/u/${order.slug}`;
  
  let evt: any = order.eventData;
  if (typeof evt === "string") {
    try { evt = JSON.parse(evt); } catch (e) { evt = {}; }
  }

  // Statistik RSVP
  const attendingCount = order.guests
    .filter(g => g.rsvpStatus === "ATTENDING")
    .reduce((sum, g) => sum + (g.rsvpGuestCount || 1), 0);

  const notAttendingCount = order.guests.filter(g => g.rsvpStatus === "NOT_ATTENDING").length;

  return (
    <div className="min-h-screen bg-[#0f0d0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#1a1510] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/50 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold font-[family-name:var(--font-display)] tracking-wide">
              Momena <span className="text-[#D4A843]">Client Panel</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
              isPaid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            }`}>
              {isPaid ? 'Aktif' : 'Menunggu Pembayaran'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-display)]">
            Halo, {order.customer.name}! 👋
          </h2>
          <p className="text-white/50 mt-2 font-[family-name:var(--font-body)]">
            Ini adalah panel khusus untuk memantau undangan pernikahan {evt.person1Name} & {evt.person2Name}.
          </p>
        </section>

        {/* Tabbed Content */}
        <ClientDashboardTabs order={order} inviteUrl={inviteUrl} />
      </main>
    </div>
  );
}
