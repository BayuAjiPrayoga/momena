"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Eye, EyeOff, Loader2, Search, Filter } from "lucide-react";

interface GuestbookMsg {
  id: string;
  name: string;
  message: string;
  isHidden: boolean;
  createdAt: string;
  order: { orderNumber: string; slug: string | null };
}

export default function AdminGuestbookPage() {
  const [messages, setMessages] = useState<GuestbookMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/guestbook");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHidden = async (id: string, isHidden: boolean) => {
    setToggling(id);
    try {
      const res = await fetch("/api/admin/guestbook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isHidden: !isHidden }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isHidden: !isHidden } : m))
        );
      }
    } catch {
      alert("Gagal mengubah status");
    } finally {
      setToggling(null);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase()) ||
      m.order.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  const hiddenCount = messages.filter((m) => m.isHidden).length;

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-900">Moderasi Buku Ucapan</h1>
          <p className="text-sm text-gray-500 mt-1">
            {messages.length} ucapan total · {hiddenCount} disembunyikan
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama/pesan/order..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Tidak ada ucapan ditemukan.</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white border rounded-xl p-5 flex items-start justify-between gap-4 transition ${
                msg.isHidden ? "border-red-200 bg-red-50/50 opacity-70" : "border-gray-200"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">{msg.name}</p>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400 font-mono">{msg.order.orderNumber}</span>
                  {msg.isHidden && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">Disembunyikan</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed">"{msg.message}"</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(msg.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <button
                onClick={() => toggleHidden(msg.id, msg.isHidden)}
                disabled={toggling === msg.id}
                className={`shrink-0 p-2.5 rounded-lg border transition ${
                  msg.isHidden
                    ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    : "text-red-600 border-red-200 hover:bg-red-50"
                } disabled:opacity-50`}
                title={msg.isHidden ? "Tampilkan kembali" : "Sembunyikan"}
              >
                {toggling === msg.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : msg.isHidden ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
