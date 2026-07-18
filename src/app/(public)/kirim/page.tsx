import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicLinkGenerator from "@/components/client/PublicLinkGenerator";
import { Metadata } from "next";

type Params = Promise<{}>;
type SearchParams = Promise<{ id?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { id } = await searchParams;
  if (!id) return { title: "Sebar Undangan" };
  
  const order = await prisma.order.findUnique({
    where: { slug: id }
  });

  if (!order) return { title: "Sebar Undangan" };

  let evt: any = order.eventData;
  if (typeof evt === "string") {
    try { evt = JSON.parse(evt); } catch (e) { evt = {}; }
  }

  const title = `Sebar Undangan - ${evt.person1Name || "Mempelai 1"} & ${evt.person2Name || "Mempelai 2"}`;
  
  return {
    title,
    description: "Buat link khusus tamu undangan Anda",
  };
}

export default async function KirimPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Parameter ID Tidak Ditemukan</h1>
          <p className="text-gray-500">Gunakan link dengan format /kirim?id=nama-pasangan</p>
        </div>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { slug: id, status: "ACTIVE" },
  });

  if (!order) {
    notFound();
  }

  let evt: any = order.eventData;
  if (typeof evt === "string") {
    try { evt = JSON.parse(evt); } catch (e) { evt = {}; }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-[family-name:var(--font-display)] text-gray-900 mb-2">
            Sebar Undangan
          </h1>
          <p className="text-gray-500 font-[family-name:var(--font-body)]">
            {evt.person1Name} & {evt.person2Name}
          </p>
        </div>
        <PublicLinkGenerator orderSlug={order.slug || ""} />
      </div>
    </div>
  );
}
