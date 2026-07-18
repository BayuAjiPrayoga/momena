import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — Aggregated report data
export async function GET() {
  try {
    // 1. Revenue total
    const payments = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: { in: ["capture", "settlement"] } },
    });
    const totalRevenue = payments._sum.amount || 0;

    // 2. Order counts by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusMap: Record<string, number> = {};
    ordersByStatus.forEach((o) => {
      statusMap[o.status] = o._count.id;
    });

    const totalOrders = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const activeOrders = statusMap["ACTIVE"] || 0;

    // 3. Theme popularity (top themes by order count)
    const themeStats = await prisma.order.groupBy({
      by: ["themeId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    const themeIds = themeStats.map((t) => t.themeId);
    const themes = await prisma.theme.findMany({
      where: { id: { in: themeIds } },
      select: { id: true, name: true, styleGroup: true },
    });

    const themePopularity = themeStats.map((t) => {
      const theme = themes.find((th) => th.id === t.themeId);
      return {
        name: theme?.name || "Unknown",
        styleGroup: theme?.styleGroup || "",
        count: t._count.id,
      };
    });

    // 4. Revenue by category
    const ordersByCategory = await prisma.order.groupBy({
      by: ["categoryId"],
      _count: { id: true },
    });

    const catIds = ordersByCategory.map((c) => c.categoryId);
    const categories = await prisma.eventCategory.findMany({
      where: { id: { in: catIds } },
      select: { id: true, name: true },
    });

    const categoryStats = ordersByCategory.map((c) => {
      const cat = categories.find((ct) => ct.id === c.categoryId);
      return {
        name: cat?.name || "Unknown",
        count: c._count.id,
      };
    });

    // 5. Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentPayments = await prisma.payment.findMany({
      where: {
        status: { in: ["capture", "settlement"] },
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amount: true, createdAt: true },
    });

    const monthlyRevenue: Record<string, number> = {};
    recentPayments.forEach((p) => {
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, "0")}`;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + p.amount;
    });

    // Sort by month
    const monthlyData = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));

    // 6. RSVP stats
    const totalGuests = await prisma.guest.count();
    const attendingGuests = await prisma.guest.count({ where: { rsvpStatus: "ATTENDING" } });
    const totalMessages = await prisma.guestbookMessage.count();

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      activeOrders,
      themePopularity,
      categoryStats,
      monthlyData,
      totalGuests,
      attendingGuests,
      totalMessages,
      statusMap,
    });
  } catch (error) {
    console.error("[Reports API] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data laporan" }, { status: 500 });
  }
}
