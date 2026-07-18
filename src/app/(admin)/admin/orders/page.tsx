import { prisma } from "@/lib/prisma";
import OrdersClientWrapper from "@/components/admin/OrdersClientWrapper";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { activeUntil: "desc" },
    include: { customer: true, theme: true, package: true },
  });

  return <OrdersClientWrapper initialOrders={orders} />;
}
