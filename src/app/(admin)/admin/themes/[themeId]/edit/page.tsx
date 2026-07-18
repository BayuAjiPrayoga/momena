"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const themeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  styleGroup: z.string().min(1, "Group gaya wajib diisi"),
  componentKey: z.string().min(1, "Component key wajib diisi"),
  thumbnailUrl: z.string().min(1, "URL Thumbnail wajib diisi"),
  basePrice: z.number().min(0, "Harga tidak boleh negatif"),
  isActive: z.boolean(),
  isBestSeller: z.boolean(),
});

type ThemeForm = z.infer<typeof themeSchema>;

export default function EditThemePage() {
  const router = useRouter();
  const params = useParams();
  const themeId = params.themeId as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ThemeForm>({
    resolver: zodResolver(themeSchema),
  });

  useEffect(() => {
    // Fetch categories and theme data in parallel
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch(`/api/admin/themes?all=true`).then((r) => r.json()),
    ])
      .then(([catData, themesData]) => {
        if (catData.categories) setCategories(catData.categories);

        const theme = (themesData.themes || []).find((t: any) => t.id === themeId);
        if (theme) {
          reset({
            name: theme.name,
            slug: theme.slug,
            categoryId: theme.categoryId,
            styleGroup: theme.styleGroup,
            componentKey: theme.componentKey,
            thumbnailUrl: theme.thumbnailUrl,
            basePrice: theme.basePrice,
            isActive: theme.isActive,
            isBestSeller: theme.isBestSeller,
          });
        } else {
          setError("Tema tidak ditemukan");
        }
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setIsFetching(false));
  }, [themeId, reset]);

  const onSubmit = async (data: ThemeForm) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/themes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: themeId, ...data }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan tema");
      }

      router.push("/admin/themes");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/themes" className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-900">
          Edit Tema
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tema</label>
              <input
                {...register("name")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug URL</label>
              <input
                {...register("slug")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
              />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                {...register("categoryId")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
              >
                <option value="">Pilih Kategori...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style Group</label>
              <input
                {...register("styleGroup")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
              />
              {errors.styleGroup && <p className="text-red-500 text-xs mt-1">{errors.styleGroup.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Component Key</label>
              <input
                {...register("componentKey")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
              />
              {errors.componentKey && <p className="text-red-500 text-xs mt-1">{errors.componentKey.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Dasar (Rp)</label>
              <input
                type="number"
                {...register("basePrice", { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
              />
              {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
            <input
              {...register("thumbnailUrl")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
            />
            {errors.thumbnailUrl && <p className="text-red-500 text-xs mt-1">{errors.thumbnailUrl.message}</p>}
          </div>

          <div className="flex gap-6 pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isActive")} className="w-5 h-5 text-[#D4A843] rounded border-gray-300 focus:ring-[#D4A843]" />
              <span className="text-sm font-medium text-gray-700">Publikasikan (Aktif)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isBestSeller")} className="w-5 h-5 text-[#D4A843] rounded border-gray-300 focus:ring-[#D4A843]" />
              <span className="text-sm font-medium text-gray-700">Tandai Best Seller</span>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#D4A843] text-gray-900 font-semibold rounded-lg hover:bg-[#FFD966] transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
