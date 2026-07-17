import { prisma } from "@/lib/prisma";
import { Users, ShoppingCart, DollarSign, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const totalOrders = await prisma.order.count();
  const activeOrders = await prisma.order.count({ where: { status: "ACTIVE" } });
  
  const payments = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: { in: ["capture", "settlement"] } }
  });
  
  const totalRevenue = payments._sum.amount || 0;

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { activeUntil: "desc" },
    include: { customer: true, theme: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-900">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pendapatan" 
          value={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
          icon={<DollarSign className="text-emerald-600" />}
          bgColor="bg-emerald-100"
        />
        <StatCard 
          title="Total Pesanan" 
          value={totalOrders.toString()}
          icon={<ShoppingCart className="text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <StatCard 
          title="Pesanan Aktif" 
          value={activeOrders.toString()}
          icon={<Activity className="text-amber-600" />}
          bgColor="bg-amber-100"
        />
        <StatCard 
          title="Total Pengguna" 
          value={totalOrders.toString()} // Sederhana, 1 order = 1 user dlm guest mode
          icon={<Users className="text-purple-600" />}
          bgColor="bg-purple-100"
        />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Pesanan Terbaru</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Pelanggan</th>
                <th className="px-6 py-3 font-medium">Tema</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada pesanan
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs">{order.orderNumber}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.customer.name}</td>
                    <td className="px-6 py-4">{order.theme.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'PENDING_PAYMENT' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor }: { title: string, value: string, icon: React.ReactNode, bgColor: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
