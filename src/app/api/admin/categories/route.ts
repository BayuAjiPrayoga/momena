import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.eventCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[Categories API] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil kategori" }, { status: 500 });
  }
}
