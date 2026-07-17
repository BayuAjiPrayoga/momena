import { getThemeComponent, getAvailableThemeKeys } from "@/themes/registry";
import { getDummyInvitationData } from "@/lib/dummy-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Params = Promise<{ themeKey: string }>;
type SearchParams = Promise<{ to?: string }>;

export async function generateStaticParams() {
  return getAvailableThemeKeys().map((key) => ({ themeKey: key }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { themeKey } = await params;
  return {
    title: `Preview Tema: ${themeKey}`,
    description: `Preview undangan digital tema ${themeKey} — Momena Labs`,
  };
}

export default async function ThemePreviewPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { themeKey } = await params;
  const { to } = await searchParams;

  const ThemeComponent = getThemeComponent(themeKey);
  if (!ThemeComponent) notFound();

  const data = getDummyInvitationData(to ? decodeURIComponent(to) : undefined);

  return <ThemeComponent data={data} />;
}
