"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Loader2,
  Activity,
} from "lucide-react";

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  themePopularity: { name: string; styleGroup: string; count: number }[];
  categoryStats: { name: string; count: number }[];
  monthlyData: { month: string; amount: number }[];
  totalGuests: number;
  attendingGuests: number;
  totalMessages: number;
  statusMap: Record<string, number>;
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "Baru",
  PENDING_PAYMENT: "Menunggu Bayar",
  PAYMENT_REVIEW: "Review Bayar",
  ACTIVE: "Aktif",
  COMPLETED: "Selesai",
  ARCHIVED: "Arsip",
  CANCELLED: "Dibatalkan",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-500",
  PENDING_PAYMENT: "bg-amber-500",
  PAYMENT_REVIEW: "bg-orange-500",
  ACTIVE: "bg-emerald-500",
  COMPLETED: "bg-gray-400",
  ARCHIVED: "bg-gray-300",
  CANCELLED: "bg-red-500",
};

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-20 text-gray-500">Gagal memuat data laporan.</div>;
  }

  const maxThemeCount = Math.max(...data.themePopularity.map((t) => t.count), 1);
  const maxMonthlyAmount = Math.max(...data.monthlyData.map((m) => m.amount), 1);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-900">
        Laporan & Analitik
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="text-emerald-600" />}
          label="Total Pendapatan"
          value={`Rp ${data.totalRevenue.toLocaleString("id-ID")}`}
          bg="bg-emerald-100"
        />
        <StatCard
          icon={<ShoppingCart className="text-blue-600" />}
          label="Total Pesanan"
          value={data.totalOrders.toString()}
          bg="bg-blue-100"
        />
        <StatCard
          icon={<Users className="text-purple-600" />}
          label="Total Tamu RSVP"
          value={`${data.attendingGuests} / ${data.totalGuests}`}
          bg="bg-purple-100"
        />
        <StatCard
          icon={<MessageSquare className="text-amber-600" />}
          label="Total Ucapan"
          value={data.totalMessages.toString()}
          bg="bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart (Bar) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D4A843]" /> Pendapatan per Bulan
          </h3>
          {data.monthlyData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada data pendapatan.</p>
          ) : (
            <div className="space-y-3">
              {data.monthlyData.map((m) => {
                const pct = (m.amount / maxMonthlyAmount) * 100;
                const [y, mo] = m.month.split("-");
                const monthName = new Date(parseInt(y), parseInt(mo) - 1).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
                return (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20 shrink-0 text-right">{monthName}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#D4A843] to-[#FFD966] h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      >
                        <span className="text-[10px] font-bold text-[#1a1510]">
                          {m.amount >= 1000000 ? `${(m.amount / 1000000).toFixed(1)}jt` : `${(m.amount / 1000).toFixed(0)}rb`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme Popularity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#D4A843]" /> Tema Terlaris
          </h3>
          {data.themePopularity.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada data penjualan tema.</p>
          ) : (
            <div className="space-y-3">
              {data.themePopularity.map((t, idx) => {
                const pct = (t.count / maxThemeCount) * 100;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs text-gray-700 w-28 shrink-0 truncate font-medium">{t.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(pct, 12)}%` }}
                      >
                        <span className="text-[10px] font-bold text-white">{t.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Funnel (Status Breakdown) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#D4A843]" /> Distribusi Status Order
          </h3>
          <div className="space-y-2">
            {Object.entries(data.statusMap).map(([status, count]) => {
              const pct = data.totalOrders > 0 ? (count / data.totalOrders) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-xs text-gray-700 w-28 shrink-0">{STATUS_LABELS[status] || status}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className={`${STATUS_COLORS[status] || "bg-gray-400"} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#D4A843]" /> Order per Kategori Event
          </h3>
          {data.categoryStats.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada data.</p>
          ) : (
            <div className="space-y-4">
              {data.categoryStats.map((c, idx) => {
                const total = data.categoryStats.reduce((a, b) => a + b.count, 0);
                const pct = total > 0 ? (c.count / total) * 100 : 0;
                const colors = ["bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-blue-500", "bg-pink-500"];
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{c.name}</span>
                      <span className="text-gray-500">{c.count} order ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${colors[idx % colors.length]} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
