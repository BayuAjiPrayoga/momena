import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminThemesPage() {
  const themes = await prisma.theme.findMany({
    include: { category: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-900">
          Katalog Tema
        </h1>
        <Link 
          href="/admin/themes/tambah"
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-gray-900 font-medium rounded-lg hover:bg-[#FFD966] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Tema
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Tema</th>
                <th className="px-6 py-4 font-medium">Kategori & Gaya</th>
                <th className="px-6 py-4 font-medium">Component Key</th>
                <th className="px-6 py-4 font-medium">Harga Dasar</th>
                <th className="px-6 py-4 font-medium">Statistik</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {themes.map((theme) => (
                <tr key={theme.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                        <Image 
                          src={theme.thumbnailUrl} 
                          alt={theme.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{theme.name}</p>
                        <div className="flex gap-2 mt-1">
                          {theme.isActive ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Aktif</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Draft</span>
                          )}
                          {theme.isBestSeller && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Best Seller</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{theme.category.name}</p>
                    <p className="text-xs text-gray-500">{theme.styleGroup}</p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {theme.componentKey}
                    </code>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Rp {theme.basePrice.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    {theme._count.orders} Terjual
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Hanya lewat database untuk sementara">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
