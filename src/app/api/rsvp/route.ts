import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";
import { nanoid } from "nanoid";

const rsvpSchema = z.object({
  orderId: z.string().min(1),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  status: z.enum(["ATTENDING", "NOT_ATTENDING", "MAYBE"]),
  guestCount: z.number().min(0).max(10).optional().default(1),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const { orderId, name, status, guestCount, phone } = result.data;

    // Cek apakah order valid
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    // Buat guest record dengan slug unik untuk referensi
    const guestSlug = nanoid(10).toLowerCase();

    const guest = await prisma.guest.create({
      data: {
        orderId,
        name,
        phone,
        guestSlug,
        rsvpStatus: status,
        rsvpGuestCount: guestCount,
        respondedAt: new Date(),
      }
    });

    return NextResponse.json({ success: true, guestId: guest.id });
  } catch (error) {
    console.error("[RSVP API] Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
