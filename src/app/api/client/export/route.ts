import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        guests: { orderBy: { respondedAt: "desc" } },
        guestbook: { orderBy: { createdAt: "desc" } }
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Build CSV Content
    let csvContent = "Daftar RSVP Tamu\n";
    csvContent += "Nama,No HP,Status RSVP,Jumlah Hadir,Waktu Konfirmasi\n";
    
    order.guests.forEach(g => {
      const statusStr = g.rsvpStatus === "ATTENDING" ? "Hadir" : g.rsvpStatus === "NOT_ATTENDING" ? "Tidak Hadir" : "Mungkin";
      const countStr = g.rsvpStatus === "ATTENDING" ? (g.rsvpGuestCount || 0) : 0;
      const dateStr = g.respondedAt ? g.respondedAt.toLocaleString("id-ID") : "-";
      csvContent += `"${g.name}","${g.phone || ""}","${statusStr}","${countStr}","${dateStr}"\n`;
    });

    csvContent += "\n\nBuku Tamu / Ucapan\n";
    csvContent += "Nama,Ucapan,Waktu\n";

    order.guestbook.forEach(msg => {
      const dateStr = msg.createdAt.toLocaleString("id-ID");
      // Escape quotes in message
      const cleanMsg = msg.message.replace(/"/g, '""');
      csvContent += `"${msg.name}","${cleanMsg}","${dateStr}"\n`;
    });

    // Create response with CSV headers and BOM for Excel
    const response = new NextResponse("\uFEFF" + csvContent);
    response.headers.set("Content-Type", "text/csv; charset=utf-8");
    response.headers.set("Content-Disposition", `attachment; filename="data-tamu-${order.orderNumber}.csv"`);
    
    return response;
  } catch (error) {
    console.error("[Export API] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
