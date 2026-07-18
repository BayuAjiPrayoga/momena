import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, musicUrl, bankName, bankNumber, bankAccountName, coverPhoto, bridePhoto, groomPhoto } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let evt: any = order.eventData;
    if (typeof evt === "string") {
      try { evt = JSON.parse(evt); } catch (e) { evt = {}; }
    }

    // Update fields
    if (musicUrl !== undefined) evt.musicUrl = musicUrl;
    if (coverPhoto) evt.coverPhotoUrl = coverPhoto;
    if (bridePhoto) evt.person2Photo = bridePhoto;
    if (groomPhoto) evt.person1Photo = groomPhoto;
    
    // Update gift info (bank account)
    if (bankName || bankNumber || bankAccountName) {
      evt.giftInfo = {
        ...evt.giftInfo,
        bankAccounts: [
          {
            bank: bankName || "",
            number: bankNumber || "",
            name: bankAccountName || ""
          }
        ]
      };
    }

    // Save back to DB
    await prisma.order.update({
      where: { id: orderId },
      data: {
        eventData: JSON.stringify(evt)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Client Order Update API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
