import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rahasia-momena-labs-super-aman"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Hanya proteksi rute admin, tapi kecualikan halaman login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("admin_session")?.value;
    
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      // Token valid, boleh lanjut
      return NextResponse.next();
    } catch (error) {
      // Token tidak valid/expired
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
