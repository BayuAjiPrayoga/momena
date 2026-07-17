import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const themeSchema = z.object({
  name: z.string().min(1, "Nama tema wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  styleGroup: z.string().min(1, "Group wajib diisi"),
  componentKey: z.string().min(1, "Component key wajib diisi"),
  thumbnailUrl: z.string().min(1, "Thumbnail URL wajib diisi"),
  basePrice: z.number().min(0),
  isActive: z.boolean(),
  isBestSeller: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = themeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Pastikan slug unik
    const existing = await prisma.theme.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug tema sudah digunakan" }, { status: 400 });
    }

    const theme = await prisma.theme.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        styleGroup: data.styleGroup,
        componentKey: data.componentKey,
        thumbnailUrl: data.thumbnailUrl,
        basePrice: data.basePrice,
        isActive: data.isActive,
        isBestSeller: data.isBestSeller,
      }
    });

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("[Themes API] Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID tema diperlukan" }, { status: 400 });
    }

    await prisma.theme.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Themes API] Delete Error:", error);
    return NextResponse.json({ error: "Tema mungkin sedang digunakan oleh pesanan" }, { status: 400 });
  }
}
