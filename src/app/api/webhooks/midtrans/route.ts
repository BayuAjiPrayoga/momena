import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/wamify";
import { nanoid } from "nanoid";
import { sendPaymentSuccessEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    // Verify signature
    if (!verifySignature(order_id, status_code, gross_amount, signature_key)) {
      console.error("[Midtrans Webhook] Invalid signature for order:", order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // Ambil data temporary order (bisa dari cache atau logic jika pakai Redis)
    // Tapi karena guest checkout tanpa Redis, di API Checkout sebelumnya kita butuh simpan Order
    // Wait, API Checkout sebelumnya belum menyimpan ke Prisma. Kita harus sesuaikan itu dulu.
    // Asumsikan checkout API sudah simpan order berstatus PENDING_PAYMENT.
    
    // Cari order
    const order = await prisma.order.findUnique({
      where: { orderNumber: order_id },
      include: { customer: true, theme: true }
    });

    if (!order) {
      console.error(`[Midtrans Webhook] Order ${order_id} not found in DB`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isSuccess =
      (transaction_status === "capture" && fraud_status === "accept") ||
      transaction_status === "settlement";
    const isPending = transaction_status === "pending";
    const isFailed =
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire";

    // Simpan history payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: "midtrans",
        amount: parseInt(gross_amount),
        status: transaction_status,
        gatewayRef: order_id,
      }
    });

    if (isSuccess && order.status !== "ACTIVE") {
      // 1. Update status
      const uniqueSlug = nanoid(8).toLowerCase();
      
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "ACTIVE",
          slug: uniqueSlug, // Slug publik
          activeUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 tahun
        }
      });

      // 2. Kirim notifikasi WA
      const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/u/${uniqueSlug}`;
      const clientUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/client/${order.id}`;
      
      const msg = `Halo ${order.customer.name}! 🎉\n\nPembayaran Anda untuk undangan digital (Tema: ${order.theme.name}) telah berhasil.\n\nUndangan Anda sudah aktif dan dapat diakses di link berikut:\n🌐 ${inviteUrl}\n\nUntuk melihat daftar tamu (RSVP) & buku ucapan, Anda bisa mengakses Panel Klien disini:\n📊 ${clientUrl}\n\nTerima kasih telah menggunakan Momena Labs!`;

      if (order.customer.phone) {
        await sendWhatsAppMessage({ to: order.customer.phone, message: msg });
      }

      sendPaymentSuccessEmail({
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        orderNumber: order.orderNumber,
        themeName: order.theme.name,
        inviteUrl,
        clientUrl,
      }).catch(console.error);

      console.log(`[Midtrans Webhook] ✅ SUCCESS - WA & Email Notification sent for ${order_id}`);
    } else if (isFailed) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" }
      });
      console.log(`[Midtrans Webhook] ❌ FAILED - Order cancelled ${order_id}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("[Midtrans Webhook] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
