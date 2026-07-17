import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const guestbookSchema = z.object({
  orderId: z.string().min(1),
  name: z.string().min(2, "Nama minimal 2 karakter").max(50),
  message: z.string().min(5, "Pesan minimal 5 karakter").max(500),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = guestbookSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const { orderId, name, message } = result.data;

    // Cek apakah order valid
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    const gbMessage = await prisma.guestbookMessage.create({
      data: {
        orderId,
        name,
        message,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: {
        id: gbMessage.id,
        name: gbMessage.name,
        message: gbMessage.message,
        createdAt: gbMessage.createdAt.toISOString()
      } 
    });
  } catch (error) {
    console.error("[Guestbook API] Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
