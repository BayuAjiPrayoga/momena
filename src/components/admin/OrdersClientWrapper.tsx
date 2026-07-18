"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Search, Filter, LayoutList, KanbanSquare } from "lucide-react";
import KanbanBoard from "./KanbanBoard";

export default function OrdersClientWrapper({ initialOrders }: { initialOrders: any[] }) {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");

  const filteredOrders = initialOrders.filter((o) => 
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
    o.customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-900">
            Manajemen Pesanan
          </h1>
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex gap-1">
            <button 
              onClick={() => setView("table")}
              className={`p-1.5 rounded-md transition ${view === "table" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              title="Tampilan Tabel"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView("kanban")}
              className={`p-1.5 rounded-md transition ${view === "kanban" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              title="Tampilan Kanban"
            >
              <KanbanSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau no order..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Pelanggan</th>
                  <th className="px-6 py-4 font-medium">Tema & Paket</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Belum ada data pesanan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                          <p className="font-mono text-xs font-semibold text-blue-600">{order.orderNumber}</p>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.activeUntil || Date.now()).toLocaleDateString("id-ID")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                        <p className="text-xs text-gray-500">{order.customer.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.theme.name}</p>
                        <p className="text-xs text-gray-500">{order.package.name} (Rp {order.package.price.toLocaleString("id-ID")})</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'PENDING_PAYMENT' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status === "ACTIVE" && (
                          <div className="flex flex-col items-end gap-2">
                            <Link 
                              href={`/u/${order.slug}`} 
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              Lihat Undangan <ExternalLink className="w-3 h-3" />
                            </Link>
                            <Link 
                              href={`/client/${order.id}`} 
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:underline"
                            >
                              Panel Klien <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <KanbanBoard initialOrders={filteredOrders} />
      )}
    </div>
  );
}
