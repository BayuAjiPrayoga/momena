import { NextRequest, NextResponse } from "next/server";
import { createSnapTransaction } from "@/lib/midtrans";
import { fullBookingSchema } from "@/lib/validations/booking";
import { nanoid } from "nanoid";

// Harga paket (akan dari DB saat Prisma aktif)
const packagePrices: Record<string, number> = {
  "pkg-starter": 99000,
  "pkg-populer": 199000,
  "pkg-premium": 399000,
};

const packageNames: Record<string, string> = {
  "pkg-starter": "Starter",
  "pkg-populer": "Populer",
  "pkg-premium": "Premium",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate with Zod
    const parseResult = fullBookingSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const price = packagePrices[data.packageId];

    if (!price) {
      return NextResponse.json(
        { error: "Paket tidak ditemukan" },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `MOM-${Date.now()}-${nanoid(6)}`;

    /**
     * TODO: Saat Prisma/DB aktif, lakukan:
     * 1. Upsert Customer (berdasarkan email)
     * 2. Create Order record (status: PENDING_PAYMENT)
     * 3. Create Guest records (jika ada)
     *
     * Untuk sekarang kita langsung ke Midtrans.
     */

    // Cek apakah Midtrans keys tersedia
    if (!process.env.MIDTRANS_SERVER_KEY) {
      // Jika belum ada key Midtrans, kembalikan dummy response
      // agar flow tetap bisa ditest secara UI
      return NextResponse.json({
        orderId,
        snapToken: null,
        redirectUrl: null,
        message: "Midtrans belum dikonfigurasi. Set MIDTRANS_SERVER_KEY di .env.local untuk mengaktifkan pembayaran.",
        // Simulasi: langsung berhasil
        demo: true,
      });
    }

    // Create Midtrans Snap transaction
    const snap = await createSnapTransaction({
      orderId,
      grossAmount: price,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      itemName: `Undangan Digital — Paket ${packageNames[data.packageId] || "Custom"}`,
    });

    return NextResponse.json({
      orderId,
      snapToken: snap.token,
      redirectUrl: snap.redirect_url,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
