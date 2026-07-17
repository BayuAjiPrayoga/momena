import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, MessageSquare, ExternalLink, Calendar, 
  MapPin, Clock, ArrowLeft, CheckCircle2 
} from "lucide-react";
import type { Metadata } from "next";

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

        {/* Action Card */}
        {isPaid && (
          <section className="p-6 rounded-2xl bg-[#D4A843]/5 border border-[#D4A843]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/50 mb-1 font-[family-name:var(--font-body)]">Link Undangan Anda:</p>
              <a href={inviteUrl} target="_blank" rel="noreferrer" className="text-lg font-mono text-[#D4A843] hover:underline flex items-center gap-2">
                {inviteUrl} <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <button className="px-5 py-2.5 bg-[#D4A843] text-[#1a1510] text-sm font-semibold rounded-full hover:bg-[#FFD966] transition-all font-[family-name:var(--font-body)]">
              Copy Link
            </button>
          </section>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={<Users className="text-emerald-400" />} label="Konfirmasi Hadir (Tamu)" value={attendingCount} />
          <StatCard icon={<Users className="text-red-400" />} label="Tidak Hadir" value={notAttendingCount} />
          <StatCard icon={<MessageSquare className="text-blue-400" />} label="Total Ucapan" value={order._count.guestbook} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* RSVP Table */}
          <section className="space-y-4">
            <h3 className="text-xl font-[family-name:var(--font-display)] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4A843]" /> Daftar RSVP
            </h3>
            <div className="bg-[#1a1510] border border-white/10 rounded-2xl overflow-hidden">
              {order.guests.length === 0 ? (
                <div className="p-8 text-center text-white/40 font-[family-name:var(--font-body)]">
                  Belum ada tamu yang merespons.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm font-[family-name:var(--font-body)]">
                    <thead className="bg-white/5 text-white/40">
                      <tr>
                        <th className="px-4 py-3 font-medium">Nama Tamu</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-center">Jml</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {order.guests.map((g) => (
                        <tr key={g.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3">
                            <p className="font-medium">{g.name}</p>
                            <p className="text-xs text-white/30">{g.phone || "-"}</p>
                          </td>
                          <td className="px-4 py-3">
                            {g.rsvpStatus === "ATTENDING" && <span className="text-emerald-400 text-xs">Hadir</span>}
                            {g.rsvpStatus === "NOT_ATTENDING" && <span className="text-red-400 text-xs">Tidak Hadir</span>}
                            {g.rsvpStatus === "MAYBE" && <span className="text-yellow-400 text-xs">Mungkin</span>}
                          </td>
                          <td className="px-4 py-3 text-center">{g.rsvpStatus === "ATTENDING" ? g.rsvpGuestCount : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Guestbook List */}
          <section className="space-y-4">
            <h3 className="text-xl font-[family-name:var(--font-display)] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#D4A843]" /> Buku Tamu
            </h3>
            <div className="bg-[#1a1510] border border-white/10 rounded-2xl p-4 space-y-3">
              {order.guestbook.length === 0 ? (
                <div className="p-4 text-center text-white/40 font-[family-name:var(--font-body)]">
                  Belum ada ucapan.
                </div>
              ) : (
                order.guestbook.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-sm">{msg.name}</p>
                      <p className="text-xs text-white/30">
                        {new Date(msg.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <p className="text-sm text-white/70 italic font-[family-name:var(--font-body)] leading-relaxed">
                      "{msg.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="bg-[#1a1510] p-6 rounded-2xl border border-white/10 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-white/40 font-[family-name:var(--font-body)]">{label}</p>
        <p className="text-2xl font-bold font-[family-name:var(--font-display)]">{value}</p>
      </div>
    </div>
  );
}
