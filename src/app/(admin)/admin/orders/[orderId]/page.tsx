"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Archive,
  Users,
  MessageSquare,
  CreditCard,
  Clock,
  Loader2,
  Copy,
  Eye,
} from "lucide-react";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  slug?: string;
  activeUntil?: string;
  createdAt: string;
  eventData: any;
  customer: { name: string; email: string; phone: string };
  theme: { name: string; slug: string; styleGroup: string };
  package: { name: string; price: number; maxGuests: number };
  category: { name: string };
  guests: any[];
  guestbook: any[];
  payments: any[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NEW: { label: "Baru", color: "bg-blue-100 text-blue-700" },
  PENDING_PAYMENT: { label: "Menunggu Bayar", color: "bg-amber-100 text-amber-700" },
  PAYMENT_REVIEW: { label: "Review Bayar", color: "bg-orange-100 text-orange-700" },
  ACTIVE: { label: "Aktif", color: "bg-emerald-100 text-emerald-700" },
  COMPLETED: { label: "Selesai", color: "bg-gray-100 text-gray-700" },
  ARCHIVED: { label: "Arsip", color: "bg-gray-100 text-gray-500" },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleAction = async (action: string) => {
    if (!confirm(`Yakin ingin ${action === "verify_payment" ? "verifikasi pembayaran" : action === "reject_payment" ? "tolak pembayaran" : "arsipkan"} order ini?`)) return;
    setActionLoading(action);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        // Refresh order data
        const refreshRes = await fetch(`/api/admin/orders/${orderId}`);
        const refreshData = await refreshRes.json();
        setOrder(refreshData.order);
      } else {
        alert("Gagal melakukan aksi");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Order tidak ditemukan.</p>
        <Link href="/admin/orders" className="text-blue-600 mt-2 inline-block">← Kembali</Link>
      </div>
    );
  }

  let evt = order.eventData;
  if (typeof evt === "string") {
    try { evt = JSON.parse(evt); } catch { evt = {}; }
  }

  const statusConfig = STATUS_CONFIG[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
  const inviteUrl = order.slug ? `${window.location.origin}/u/${order.slug}` : null;
  const attendingCount = order.guests.filter((g: any) => g.rsvpStatus === "ATTENDING").reduce((s: number, g: any) => s + (g.rsvpGuestCount || 1), 0);
  const notAttendingCount = order.guests.filter((g: any) => g.rsvpStatus === "NOT_ATTENDING").length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-900">
              {order.orderNumber}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Dibuat {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {(order.status === "PENDING_PAYMENT" || order.status === "PAYMENT_REVIEW") && (
          <>
            <button onClick={() => handleAction("verify_payment")} disabled={!!actionLoading} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
              {actionLoading === "verify_payment" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Verifikasi Pembayaran
            </button>
            <button onClick={() => handleAction("reject_payment")} disabled={!!actionLoading} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50">
              {actionLoading === "reject_payment" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Tolak
            </button>
          </>
        )}

        {inviteUrl && (
          <Link href={inviteUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
            <Eye className="w-4 h-4" /> Lihat Undangan
          </Link>
        )}

        <Link href={`/client/${order.id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition">
          <ExternalLink className="w-4 h-4" /> Panel Klien
        </Link>

        {order.status === "ACTIVE" && (
          <button onClick={() => handleAction("archive")} disabled={!!actionLoading} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
            <Archive className="w-4 h-4" /> Arsipkan
          </button>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D4A843]" /> Info Pelanggan
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Nama:</span> <span className="font-medium text-gray-900">{order.customer.name}</span></p>
            <p><span className="text-gray-500">Email:</span> <span className="text-gray-900">{order.customer.email}</span></p>
            <p><span className="text-gray-500">WA:</span> <span className="text-gray-900">{order.customer.phone}</span></p>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#D4A843]" /> Info Pesanan
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Tema:</span> <span className="font-medium text-gray-900">{order.theme.name}</span></p>
            <p><span className="text-gray-500">Paket:</span> <span className="text-gray-900">{order.package.name} (Rp {order.package.price.toLocaleString("id-ID")})</span></p>
            <p><span className="text-gray-500">Kategori:</span> <span className="text-gray-900">{order.category.name}</span></p>
            {order.activeUntil && (
              <p><span className="text-gray-500">Aktif sampai:</span> <span className="text-gray-900">{new Date(order.activeUntil).toLocaleDateString("id-ID")}</span></p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4A843]" /> Statistik
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">{attendingCount}</p>
              <p className="text-xs text-emerald-600">Hadir</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{notAttendingCount}</p>
              <p className="text-xs text-red-600">Tidak Hadir</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg col-span-2">
              <p className="text-2xl font-bold text-blue-600">{order.guestbook.length}</p>
              <p className="text-xs text-blue-600">Ucapan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Data */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Data Acara</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Mempelai Pria</p>
            <p className="font-medium text-gray-900">{evt.person1Name || "-"} <span className="text-gray-500 font-normal">({evt.person1FullName})</span></p>
            <p className="text-gray-500">Putra dari: {evt.person1Parents || "-"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Mempelai Wanita</p>
            <p className="font-medium text-gray-900">{evt.person2Name || "-"} <span className="text-gray-500 font-normal">({evt.person2FullName})</span></p>
            <p className="text-gray-500">Putri dari: {evt.person2Parents || "-"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Akad Nikah</p>
            <p className="text-gray-900">{evt.akadDate || "-"} · {evt.akadTime || "-"}</p>
            <p className="font-medium text-gray-900">{evt.akadVenue || "-"}</p>
            <p className="text-gray-500">{evt.akadAddress || "-"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Resepsi</p>
            <p className="text-gray-900">{evt.resepsiDate || "-"} · {evt.resepsiTime || "-"}</p>
            <p className="font-medium text-gray-900">{evt.resepsiVenue || "-"}</p>
            <p className="text-gray-500">{evt.resepsiAddress || "-"}</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {order.payments.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D4A843]" /> Riwayat Pembayaran
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Tanggal</th>
                  <th className="px-6 py-3 font-medium">Metode</th>
                  <th className="px-6 py-3 font-medium">Jumlah</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.payments.map((p: any) => (
                  <tr key={p.id}>
                    <td className="px-6 py-3">{new Date(p.createdAt).toLocaleDateString("id-ID")}</td>
                    <td className="px-6 py-3 capitalize">{p.method?.replace("_", " ")}</td>
                    <td className="px-6 py-3 font-medium">Rp {p.amount?.toLocaleString("id-ID") || "0"}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "settlement" || p.status === "capture" ? "bg-emerald-100 text-emerald-700" :
                        p.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RSVP List */}
      {order.guests.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4A843]" /> Daftar RSVP ({order.guests.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Nama</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-center">Jumlah</th>
                  <th className="px-6 py-3 font-medium">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.guests.map((g: any) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{g.name}</p>
                      <p className="text-xs text-gray-500">{g.phone || "-"}</p>
                    </td>
                    <td className="px-6 py-3">
                      {g.rsvpStatus === "ATTENDING" && <span className="text-emerald-600 text-xs font-medium">✓ Hadir</span>}
                      {g.rsvpStatus === "NOT_ATTENDING" && <span className="text-red-600 text-xs font-medium">✗ Tidak</span>}
                      {g.rsvpStatus === "MAYBE" && <span className="text-amber-600 text-xs font-medium">? Mungkin</span>}
                      {g.rsvpStatus === "PENDING" && <span className="text-gray-400 text-xs">Belum</span>}
                    </td>
                    <td className="px-6 py-3 text-center">{g.rsvpStatus === "ATTENDING" ? g.rsvpGuestCount || 1 : "-"}</td>
                    <td className="px-6 py-3 text-xs text-gray-500">{g.respondedAt ? new Date(g.respondedAt).toLocaleDateString("id-ID") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guestbook */}
      {order.guestbook.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#D4A843]" /> Buku Ucapan ({order.guestbook.length})
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {order.guestbook.map((msg: any) => (
              <div key={msg.id} className={`p-4 rounded-lg border ${msg.isHidden ? "bg-red-50 border-red-200 opacity-60" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900 text-sm">{msg.name}</p>
                  <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1 italic">"{msg.message}"</p>
                {msg.isHidden && <span className="text-xs text-red-500 mt-1 inline-block">Disembunyikan</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
