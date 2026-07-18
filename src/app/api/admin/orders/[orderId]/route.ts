import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { sendWhatsAppMessage } from "@/lib/wamify";

// GET — Detail order
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        theme: true,
        package: true,
        category: true,
        guests: { orderBy: { respondedAt: "desc" } },
        guestbook: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[Admin Order Detail] GET Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PUT — Update status order
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await req.json();
    const { status, action } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, theme: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    const updateData: any = {};

    // Handle specific actions
    if (action === "verify_payment") {
      updateData.status = "ACTIVE";
      updateData.slug = updateData.slug || nanoid(8).toLowerCase();
      updateData.activeUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      // Record payment
      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: "manual_transfer",
          amount: 0, // Will be set from the payment form
          status: "settlement",
          verifiedBy: "admin",
        },
      });

      // Send WA notification
      const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/u/${updateData.slug}`;
      const clientUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/client/${order.id}`;
      const msg = `Halo ${order.customer.name}! 🎉\n\nPembayaran untuk undangan digital (Tema: ${order.theme.name}) telah diverifikasi.\n\nUndangan Anda sudah aktif:\n🌐 ${inviteUrl}\n\nPanel Klien:\n📊 ${clientUrl}\n\nTerima kasih telah menggunakan Momena Labs!`;

      if (order.customer.phone) {
        await sendWhatsAppMessage({ to: order.customer.phone, message: msg }).catch(console.error);
      }
    } else if (action === "reject_payment") {
      updateData.status = "CANCELLED";
    } else if (action === "archive") {
      updateData.status = "ARCHIVED";
    } else if (status) {
      updateData.status = status;
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("[Admin Order Detail] PUT Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui order" }, { status: 500 });
  }
}
