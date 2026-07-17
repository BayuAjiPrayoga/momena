import { NextRequest, NextResponse } from "next/server";
import { createSnapTransaction } from "@/lib/midtrans";
import { fullBookingSchema } from "@/lib/validations/booking";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = fullBookingSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Ambil data paket dan tema
    const pkg = await prisma.package.findUnique({ where: { id: data.packageId } });
    const theme = await prisma.theme.findUnique({ where: { slug: data.themeSlug } });

    if (!pkg || !theme) {
      return NextResponse.json({ error: "Paket atau tema tidak valid" }, { status: 400 });
    }

    const orderNumber = `MOM-${Date.now()}-${nanoid(6)}`;

    // 1. Upsert Customer (Guest checkout = pakai email)
    const customer = await prisma.customer.upsert({
      where: { email: data.customerEmail },
      update: {
        name: data.customerName,
        phone: data.customerPhone,
      },
      create: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      }
    });

    // Format event data (JSON)
    const eventData = {
      person1Name: data.person1Name,
      person1FullName: data.person1FullName,
      person1Parents: data.person1Parents,
      person2Name: data.person2Name,
      person2FullName: data.person2FullName,
      person2Parents: data.person2Parents,
      akadDate: data.akadDate,
      akadTime: data.akadTime,
      akadVenue: data.akadVenue,
      akadAddress: data.akadAddress,
      akadMapsUrl: data.akadMapsUrl,
      resepsiDate: data.resepsiDate,
      resepsiTime: data.resepsiTime,
      resepsiVenue: data.resepsiVenue,
      resepsiAddress: data.resepsiAddress,
      resepsiMapsUrl: data.resepsiMapsUrl,
    };

    // 2. Create Order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        categoryId: theme.categoryId,
        themeId: theme.id,
        packageId: pkg.id,
        status: "PENDING_PAYMENT",
        eventData: JSON.stringify(eventData), // Simpan data acara
      }
    });

    if (!process.env.MIDTRANS_SERVER_KEY) {
      // Dummy mode kalau belum di set
      return NextResponse.json({
        orderId: orderNumber,
        snapToken: null,
        redirectUrl: null,
        demo: true
      });
    }

    // 3. Create Midtrans Transaction
    const snap = await createSnapTransaction({
      orderId: orderNumber,
      grossAmount: pkg.price,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
      itemName: `Momena - ${theme.name} (${pkg.name})`,
    });

    return NextResponse.json({
      orderId: orderNumber,
      snapToken: snap.token,
      redirectUrl: snap.redirect_url,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
