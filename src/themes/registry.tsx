/**
 * Theme Registry — maps componentKey → React component.
 * Ref: docs/02_ARSITEKTUR_DEVOPS.md §4
 *
 * Cara menambah tema baru:
 * 1. Buat folder /themes/{kategori}/{theme-key}/index.tsx
 * 2. Komponen harus menerima props { data: InvitationData }
 * 3. Daftarkan di registry di bawah
 * 4. Insert row Theme di DB lewat admin dashboard (atau seed)
 */

import type { ComponentType } from "react";
import type { ThemeProps } from "@/lib/types";
import dynamic from "next/dynamic";

type ThemeComponent = ComponentType<ThemeProps>;

const themeRegistry: Record<string, ThemeComponent> = {
  "lux-art-1": dynamic(() => import("@/themes/wedding/lux-art-1"), {
    loading: () => <ThemeLoadingSkeleton />,
  }),
  "rustik-1": dynamic(() => import("@/themes/wedding/rustik-1"), {
    loading: () => <ThemeLoadingSkeleton />,
  }),
  "elegant-dark": dynamic(() => import("@/themes/wedding/elegant-dark"), {
    loading: () => <ThemeLoadingSkeleton />,
  }),
  "sunda": dynamic(() => import("@/themes/wedding/sunda"), {
    loading: () => <ThemeLoadingSkeleton />,
  }),
};

export function getThemeComponent(componentKey: string): ThemeComponent | null {
  return themeRegistry[componentKey] ?? null;
}

export function getAvailableThemeKeys(): string[] {
  return Object.keys(themeRegistry);
}

/** Skeleton placeholder saat tema loading */
function ThemeLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold-300 border-t-gold-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-neutral-500 font-[family-name:var(--font-body)]">
          Memuat undangan...
        </p>
      </div>
    </div>
  );
}
