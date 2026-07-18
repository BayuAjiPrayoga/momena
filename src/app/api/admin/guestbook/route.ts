import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — List all guestbook messages (admin)
export async function GET() {
  try {
    const messages = await prisma.guestbookMessage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: { orderNumber: true, slug: true },
        },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[Admin Guestbook API] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// PUT — Toggle hide/unhide message
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isHidden } = body;

    if (!id) {
      return NextResponse.json({ error: "ID pesan diperlukan" }, { status: 400 });
    }

    const updated = await prisma.guestbookMessage.update({
      where: { id },
      data: { isHidden },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error("[Admin Guestbook API] Update Error:", error);
    return NextResponse.json({ error: "Gagal mengubah status" }, { status: 500 });
  }
}
