import type { InvitationData } from "@/lib/types";

/**
 * Memetakan Order dari Prisma ke InvitationData standar
 * yang dibutuhkan oleh komponen tema (Theme Component).
 */
export function mapOrderToInvitationData(order: any, guestName?: string): InvitationData {
  // Parsing JSON eventData
  let evt = order.eventData;
  if (typeof evt === "string") {
    try { evt = JSON.parse(evt); } catch (e) { evt = {}; }
  }

  // Guestbook
  const messages = Array.isArray(order.guestbook)
    ? order.guestbook
        .filter((g: any) => !g.isHidden)
        .map((g: any) => ({
          id: g.id,
          name: g.name,
          message: g.message,
          createdAt: g.createdAt instanceof Date ? g.createdAt.toISOString() : String(g.createdAt),
        }))
    : [];

  const person1Name = evt.person1Name || "Mempelai 1";
  const person2Name = evt.person2Name || "Mempelai 2";

  return {
    eventCategory: order.category?.slug || "wedding",
    eventTitle: `Pernikahan ${person1Name} & ${person2Name}`,
    couple: {
      person1: {
        name: person1Name,
        fullName: evt.person1FullName || person1Name,
        parents: evt.person1Parents || "",
      },
      person2: {
        name: person2Name,
        fullName: evt.person2FullName || person2Name,
        parents: evt.person2Parents || "",
      },
    },
    events: [
      {
        name: "Akad Nikah",
        date: evt.akadDate || "",
        time: evt.akadTime || "",
        venue: evt.akadVenue || "",
        address: evt.akadAddress || "",
        mapsUrl: evt.akadMapsUrl || "",
      },
      {
        name: "Resepsi",
        date: evt.resepsiDate || "",
        time: evt.resepsiTime || "",
        venue: evt.resepsiVenue || "",
        address: evt.resepsiAddress || "",
        mapsUrl: evt.resepsiMapsUrl || "",
      },
    ],
    guest: {
      name: guestName || "Tamu Undangan",
      slug: "guest-slug", // TODO: match guest slug logic if needed
    },
    gallery: evt.gallery || [],
    coverPhoto: "/images/themes/lux-art-1-thumb.jpg",
    musicUrl: evt.musicUrl,
    giftInfo: evt.giftInfo || { bankAccounts: [] },
    features: order.package?.features || {
      rsvp: true,
      guestbook: true,
      music: true,
      gift: true,
      maps: true,
      calendar: true,
      countdown: true,
      gallery: true,
      loveStory: false,
    },
    rsvpEndpoint: "/api/rsvp",
    guestbookEndpoint: "/api/guestbook",
    guestbookMessages: messages,
    orderSlug: order.slug || "",
  };
}
