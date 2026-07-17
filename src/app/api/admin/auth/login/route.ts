import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setSessionCookie } from "@/lib/auth";
import { z } from "zod/v4";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ error: "Kredensial tidak valid" }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, admin.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Kredensial tidak valid" }, { status: 401 });
    }

    // Sign JWT token
    const token = await signToken({ adminId: admin.id, role: admin.role });

    // Set cookie
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Login API] Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
