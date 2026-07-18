"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Sparkles,
  Star,
  Crown,
  Users,
  Calendar,
  User,
  CreditCard,
  Loader2,
} from "lucide-react";
import type { FullBookingData } from "@/lib/validations/booking";

interface ThemeOption {
  slug: string;
  name: string;
  styleGroup: string;
  thumbnailUrl: string;
  basePrice: number;
  category: { name: string };
}

interface PackageOption {
  id: string;
  name: string;
  price: number;
  maxGuests: number;
  maxPhotos: number;
  maxRevisions: number;
  features: any;
}

const steps = [
  { label: "Tema", icon: Heart },
  { label: "Paket", icon: Star },
  { label: "Data Acara", icon: Calendar },
  { label: "Data Anda", icon: User },
  { label: "Checkout", icon: CreditCard },
];

type FormData = Partial<FullBookingData>;

export default function BookingWizard() {
  const searchParams = useSearchParams();
  const preselectedTheme = searchParams.get("theme") || "";
  const preselectedPackage = searchParams.get("package") || "";

  const [step, setStep] = useState(preselectedTheme ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic data from DB
  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState<FormData>({
    themeSlug: preselectedTheme,
    packageId: preselectedPackage,
    person1Name: "", person1FullName: "", person1Parents: "",
    person2Name: "", person2FullName: "", person2Parents: "",
    akadDate: "", akadTime: "", akadVenue: "", akadAddress: "", akadMapsUrl: "",
    resepsiDate: "", resepsiTime: "", resepsiVenue: "", resepsiAddress: "", resepsiMapsUrl: "",
    customerName: "", customerEmail: "", customerPhone: "",
  });

  // Fetch themes & packages from DB on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [themesRes, packagesRes] = await Promise.all([
          fetch("/api/admin/themes?list=true"),
          fetch("/api/admin/packages"),
        ]);

        if (themesRes.ok) {
          const themesData = await themesRes.json();
          // The themes API might return { themes: [...] } or be from the katalog
          setThemes(themesData.themes || []);
        }

        if (packagesRes.ok) {
          const packagesData = await packagesRes.json();
          setPackages(packagesData.packages || []);
        }
      } catch (err) {
        console.error("Failed to fetch booking data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const canProceed = (): boolean => {
    if (step === 0) return !!form.themeSlug;
    if (step === 1) return !!form.packageId;
    if (step === 2) {
      return !!(form.person1Name && form.person2Name && form.akadDate && form.akadVenue && form.resepsiDate && form.resepsiVenue);
    }
    if (step === 3) {
      return !!(form.customerName && form.customerEmail && form.customerPhone);
    }
    return true;
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ submit: data.error || "Terjadi kesalahan" });
        setIsSubmitting(false);
        return;
      }

      // Snap Pop-up
      if (data.snapToken && typeof window !== "undefined" && (window as any).snap) {
        (window as any).snap.pay(data.snapToken, {
          onSuccess: () => { window.location.href = `/book/success?order_id=${data.orderId}`; },
          onPending: () => { window.location.href = `/book/success?order_id=${data.orderId}&status=pending`; },
          onError: () => { setErrors({ submit: "Pembayaran gagal. Silakan coba lagi." }); setIsSubmitting(false); },
          onClose: () => { setIsSubmitting(false); },
        });
      } else {
        // Fallback: redirect or demo mode
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else if (data.demo) {
          window.location.href = `/book/success?order_id=${data.orderId}&status=demo`;
        } else {
          setErrors({ submit: "Snap belum dimuat. Refresh halaman dan coba lagi." });
          setIsSubmitting(false);
        }
      }
    } catch {
      setErrors({ submit: "Koneksi gagal. Coba lagi." });
      setIsSubmitting(false);
    }
  };

  const selectedTheme = themes.find((t) => t.slug === form.themeSlug);
  const selectedPackage = packages.find((p) => p.id === form.packageId);

  const getPackageIcon = (name: string) => {
    if (name.toLowerCase().includes("premium")) return Crown;
    if (name.toLowerCase().includes("populer")) return Sparkles;
    return Star;
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-[#D4A843] animate-spin" />
        <p className="text-white/40 font-[family-name:var(--font-body)]">Memuat data tema & paket...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* ─── Stepper ─── */}
      <div className="flex items-center justify-between mb-10 px-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
              i < step ? "bg-[#D4A843] text-[#1a1510]" : i === step ? "bg-[#D4A843]/20 text-[#D4A843] ring-2 ring-[#D4A843]" : "bg-white/5 text-white/20"
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span className={`text-xs hidden sm:block font-[family-name:var(--font-body)] ${i <= step ? "text-[#D4A843]" : "text-white/20"}`}>{s.label}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-[#D4A843]" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {/* ─── Step 0: Pilih Tema ─── */}
      {step === 0 && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
          <h2 className="text-2xl font-[family-name:var(--font-display)] text-white">Pilih Tema Undangan</h2>
          {themes.length === 0 ? (
            <p className="text-white/40 text-center py-8 font-[family-name:var(--font-body)]">Belum ada tema tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {themes.map((t) => (
                <button key={t.slug} onClick={() => update("themeSlug", t.slug)} className={`p-5 rounded-2xl border text-left transition-all ${
                  form.themeSlug === t.slug ? "border-[#D4A843] bg-[#D4A843]/5 scale-[1.02]" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}>
                  <div className="flex items-center gap-3">
                    {t.thumbnailUrl ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5 relative">
                        <img src={t.thumbnailUrl} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Heart className="w-8 h-8 text-[#D4A843] shrink-0" />
                    )}
                    <div>
                      <h3 className="text-white font-semibold font-[family-name:var(--font-body)]">{t.name}</h3>
                      <p className="text-xs text-white/40 font-[family-name:var(--font-body)]">{t.category?.name} · {t.styleGroup}</p>
                    </div>
                  </div>
                  {form.themeSlug === t.slug && <Check className="w-5 h-5 text-[#D4A843] mt-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Step 1: Pilih Paket ─── */}
      {step === 1 && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
          <h2 className="text-2xl font-[family-name:var(--font-display)] text-white">Pilih Paket</h2>
          {packages.length === 0 ? (
            <p className="text-white/40 text-center py-8 font-[family-name:var(--font-body)]">Belum ada paket tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {packages.map((p) => {
                const PkgIcon = getPackageIcon(p.name);
                return (
                  <button key={p.id} onClick={() => update("packageId", p.id)} className={`p-6 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    form.packageId === p.id ? "border-[#D4A843] bg-[#D4A843]/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}>
                    <div className="flex items-center gap-4">
                      <PkgIcon className={`w-8 h-8 ${form.packageId === p.id ? "text-[#D4A843]" : "text-white/30"}`} />
                      <div>
                        <h3 className="text-white font-semibold font-[family-name:var(--font-body)]">{p.name}</h3>
                        <p className="text-xs text-white/40 font-[family-name:var(--font-body)]">{p.maxGuests.toLocaleString()} tamu · {p.maxPhotos} foto · {p.maxRevisions}x revisi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#D4A843] font-[family-name:var(--font-display)]">Rp {p.price.toLocaleString("id-ID")}</span>
                      {form.packageId === p.id && <Check className="w-5 h-5 text-[#D4A843] mt-1 ml-auto" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Step 2: Data Acara ─── */}
      {step === 2 && (
        <div className="space-y-8 animate-[fade-in_0.3s_ease-out]">
          <h2 className="text-2xl font-[family-name:var(--font-display)] text-white">Data Acara Pernikahan</h2>

          {/* Mempelai */}
          {[
            { prefix: "person1" as const, label: "Mempelai Pria" },
            { prefix: "person2" as const, label: "Mempelai Wanita" },
          ].map(({ prefix, label }) => (
            <fieldset key={prefix} className="space-y-3">
              <legend className="text-sm font-semibold text-[#D4A843] font-[family-name:var(--font-body)]">{label}</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Nama Panggilan" value={form[`${prefix}Name`] || ""} onChange={(v) => update(`${prefix}Name`, v)} placeholder="Ahmad" />
                <Input label="Nama Lengkap" value={form[`${prefix}FullName`] || ""} onChange={(v) => update(`${prefix}FullName`, v)} placeholder="Ahmad bin Abdullah" />
              </div>
              <Input label="Putra/Putri dari" value={form[`${prefix}Parents`] || ""} onChange={(v) => update(`${prefix}Parents`, v)} placeholder="Bapak Abdullah & Ibu Aisyah" />
            </fieldset>
          ))}

          {/* Acara */}
          {[
            { prefix: "akad" as const, label: "Akad Nikah" },
            { prefix: "resepsi" as const, label: "Resepsi" },
          ].map(({ prefix, label }) => (
            <fieldset key={prefix} className="space-y-3">
              <legend className="text-sm font-semibold text-[#D4A843] font-[family-name:var(--font-body)]">{label}</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Tanggal" type="date" value={form[`${prefix}Date`] || ""} onChange={(v) => update(`${prefix}Date`, v)} />
                <Input label="Waktu" type="time" value={form[`${prefix}Time`] || ""} onChange={(v) => update(`${prefix}Time`, v)} />
              </div>
              <Input label="Nama Gedung/Venue" value={form[`${prefix}Venue`] || ""} onChange={(v) => update(`${prefix}Venue`, v)} placeholder="Grand Ballroom Hotel XYZ" />
              <Input label="Alamat Lengkap" value={form[`${prefix}Address`] || ""} onChange={(v) => update(`${prefix}Address`, v)} placeholder="Jl. Contoh No. 123, Kota" />
              <Input label="Link Google Maps (opsional)" value={form[`${prefix}MapsUrl`] || ""} onChange={(v) => update(`${prefix}MapsUrl`, v)} placeholder="https://maps.google.com/..." />
            </fieldset>
          ))}
        </div>
      )}

      {/* ─── Step 3: Data Customer ─── */}
      {step === 3 && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
          <h2 className="text-2xl font-[family-name:var(--font-display)] text-white">Data Pemesan</h2>
          <p className="text-sm text-white/40 font-[family-name:var(--font-body)]">Untuk keperluan invoice dan notifikasi status pesanan.</p>
          <div className="space-y-4">
            <Input label="Nama Lengkap" value={form.customerName || ""} onChange={(v) => update("customerName", v)} placeholder="Nama lengkap pemesan" />
            <Input label="Email" type="email" value={form.customerEmail || ""} onChange={(v) => update("customerEmail", v)} placeholder="email@contoh.com" />
            <Input label="Nomor WhatsApp" value={form.customerPhone || ""} onChange={(v) => update("customerPhone", v)} placeholder="08xxxxxxxxxx" />
          </div>
        </div>
      )}

      {/* ─── Step 4: Review & Checkout ─── */}
      {step === 4 && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
          <h2 className="text-2xl font-[family-name:var(--font-display)] text-white">Review Pesanan</h2>

          <div className="space-y-4">
            <ReviewRow label="Tema" value={selectedTheme?.name || "-"} />
            <ReviewRow label="Paket" value={`${selectedPackage?.name || "-"} — Rp ${selectedPackage?.price.toLocaleString("id-ID") || "0"}`} />
            <ReviewRow label="Mempelai" value={`${form.person1Name} & ${form.person2Name}`} />
            <ReviewRow label="Akad" value={`${form.akadDate} · ${form.akadVenue}`} />
            <ReviewRow label="Resepsi" value={`${form.resepsiDate} · ${form.resepsiVenue}`} />
            <ReviewRow label="Pemesan" value={`${form.customerName} (${form.customerEmail})`} />
          </div>

          <div className="p-6 rounded-2xl bg-[#D4A843]/5 border border-[#D4A843]/20">
            <div className="flex items-center justify-between">
              <span className="text-white/60 font-[family-name:var(--font-body)]">Total Pembayaran</span>
              <span className="text-2xl font-bold text-[#D4A843] font-[family-name:var(--font-display)]">
                Rp {selectedPackage?.price.toLocaleString("id-ID") || "0"}
              </span>
            </div>
          </div>

          {errors.submit && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-[family-name:var(--font-body)]">
              {errors.submit}
            </div>
          )}
        </div>
      )}

      {/* ─── Navigation Buttons ─── */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.06]">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 text-sm text-white/50 hover:text-white transition flex items-center gap-2 font-[family-name:var(--font-body)]">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        ) : <div />}

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="px-6 py-2.5 bg-[#D4A843] text-[#1a1510] text-sm font-semibold rounded-full hover:bg-[#FFD966] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 font-[family-name:var(--font-body)]"
          >
            Lanjut <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#D4A843] text-[#1a1510] text-sm font-semibold rounded-full hover:bg-[#FFD966] transition-all disabled:opacity-50 flex items-center gap-2 font-[family-name:var(--font-body)]"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Reusable Input ─── */
function Input({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-white/40 mb-1.5 block font-[family-name:var(--font-body)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843] outline-none transition font-[family-name:var(--font-body)]"
      />
    </label>
  );
}

/* ─── Review Row ─── */
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-white/[0.04]">
      <span className="text-sm text-white/40 font-[family-name:var(--font-body)]">{label}</span>
      <span className="text-sm text-white font-medium text-right font-[family-name:var(--font-body)]">{value}</span>
    </div>
  );
}
