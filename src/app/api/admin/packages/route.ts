import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

// GET — Public: list all packages
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("[Packages API] Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data paket" }, { status: 500 });
  }
}

// POST — Admin: create new package
const packageSchema = z.object({
  name: z.string().min(1, "Nama paket wajib diisi"),
  price: z.number().min(0),
  maxGuests: z.number().min(1),
  maxPhotos: z.number().min(1),
  maxRevisions: z.number().min(0),
  features: z.any(), // JSON object
  activeDays: z.number().min(1).default(365),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = packageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, package: pkg });
  } catch (error) {
    console.error("[Packages API] Create Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PUT — Admin: update package
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID paket diperlukan" }, { status: 400 });
    }

    const pkg = await prisma.package.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, package: pkg });
  } catch (error) {
    console.error("[Packages API] Update Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui paket" }, { status: 500 });
  }
}

// DELETE — Admin: delete package
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID paket diperlukan" }, { status: 400 });
    }

    await prisma.package.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Packages API] Delete Error:", error);
    return NextResponse.json({ error: "Paket mungkin sedang digunakan" }, { status: 400 });
  }
}
