import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapOrderToInvitationData } from "@/lib/mappers";
import { getThemeComponent } from "@/themes/registry";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ to?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const order = await prisma.order.findUnique({
    where: { slug, status: "ACTIVE" },
    include: { theme: true },
  });

  if (!order) return { title: "Undangan Tidak Ditemukan" };

  let evt: any = order.eventData;
  if (typeof evt === "string") {
    try { evt = JSON.parse(evt); } catch (e) { evt = {}; }
  }

  const title = `The Wedding of ${evt.person1Name || "Mempelai 1"} & ${evt.person2Name || "Mempelai 2"}`;
  
  return {
    title,
    description: `Kami mengundang Anda untuk hadir di hari bahagia kami.`,
    openGraph: {
      title,
      description: `Kami mengundang Anda untuk hadir di hari bahagia kami.`,
      images: [order.theme?.thumbnailUrl || "/images/default-og.jpg"],
    },
  };
}

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { to } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      theme: true,
      guestbook: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order || !order.theme) {
    notFound();
  }

  const invitationData = mapOrderToInvitationData(order, to);
  const themeKey = order.theme.componentKey;

  const ThemeComponent = getThemeComponent(themeKey);

  if (!ThemeComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <h1>Tema tidak ditemukan atau sedang dalam perbaikan.</h1>
      </div>
    );
  }

  return (
    <ThemeComponent data={invitationData} />
  );
}
