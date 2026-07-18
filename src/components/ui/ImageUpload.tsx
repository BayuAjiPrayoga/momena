"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-white/70">{label}</label>}
      
      {value ? (
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/10 group">
          <Image src={value} alt="Uploaded preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              title="Hapus gambar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-[4/3] rounded-lg border-2 border-dashed border-white/20 hover:border-[#D4A843]/50 hover:bg-[#D4A843]/5 transition cursor-pointer">
          {isUploading ? (
            <div className="flex flex-col items-center text-white/50">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#D4A843]" />
              <span className="text-sm">Mengunggah...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-white/50">
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-sm">Pilih Gambar</span>
              <span className="text-xs mt-1 opacity-70">JPG, PNG (Max 5MB)</span>
            </div>
          )}
          <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} disabled={isUploading} />
        </label>
      )}
    </div>
  );
}
