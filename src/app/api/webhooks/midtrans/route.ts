import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/lib/midtrans";

/**
 * Webhook handler untuk notifikasi dari Midtrans.
 * URL ini harus didaftarkan di Midtrans Dashboard > Settings > Notification.
 *
 * Docs: https://docs.midtrans.com/reference/handling-notifications
 */
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

    console.log(
      `[Midtrans Webhook] Order ${order_id}: status=${transaction_status}, fraud=${fraud_status}`
    );

    // Determine if payment is successful
    const isSuccess =
      (transaction_status === "capture" && fraud_status === "accept") ||
      transaction_status === "settlement";

    const isPending =
      transaction_status === "pending";

    const isFailed =
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire";

    /**
     * TODO: Saat Prisma/DB aktif:
     * 1. Update Payment record (status, gatewayRef)
     * 2. Update Order.status:
     *    - isSuccess → ACTIVE
     *    - isPending → PENDING_PAYMENT
     *    - isFailed → CANCELLED
     * 3. Generate Order.slug (unique slug untuk URL undangan)
     * 4. Kirim notifikasi WA/email ke customer
     *
     * Contoh:
     * if (isSuccess) {
     *   await prisma.order.update({
     *     where: { orderNumber: order_id },
     *     data: {
     *       status: 'ACTIVE',
     *       slug: nanoid(10),
     *       activeUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
     *     },
     *   });
     * }
     */

    if (isSuccess) {
      console.log(`[Midtrans Webhook] ✅ Payment SUCCESS for ${order_id}`);
    } else if (isPending) {
      console.log(`[Midtrans Webhook] ⏳ Payment PENDING for ${order_id}`);
    } else if (isFailed) {
      console.log(`[Midtrans Webhook] ❌ Payment FAILED for ${order_id}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("[Midtrans Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
