import { z } from "zod/v4";

/**
 * Validasi data booking undangan wedding.
 * Digunakan di BookingWizard (client) & checkout API (server).
 */

// Step 1: Tema
export const themeStepSchema = z.object({
  themeSlug: z.string().min(1, "Pilih tema terlebih dahulu"),
});

// Step 2: Paket
export const packageStepSchema = z.object({
  packageId: z.string().min(1, "Pilih paket terlebih dahulu"),
});

// Step 3: Data Acara (Wedding)
export const eventDataSchema = z.object({
  // Mempelai 1
  person1Name: z.string().min(2, "Nama panggilan minimal 2 karakter"),
  person1FullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  person1Parents: z.string().min(3, "Nama orang tua wajib diisi"),

  // Mempelai 2
  person2Name: z.string().min(2, "Nama panggilan minimal 2 karakter"),
  person2FullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  person2Parents: z.string().min(3, "Nama orang tua wajib diisi"),

  // Akad
  akadDate: z.string().min(1, "Tanggal akad wajib diisi"),
  akadTime: z.string().min(1, "Waktu akad wajib diisi"),
  akadVenue: z.string().min(3, "Nama venue akad wajib diisi"),
  akadAddress: z.string().min(5, "Alamat akad wajib diisi"),
  akadMapsUrl: z.string().url("URL Maps harus valid").optional().or(z.literal("")),

  // Resepsi
  resepsiDate: z.string().min(1, "Tanggal resepsi wajib diisi"),
  resepsiTime: z.string().min(1, "Waktu resepsi wajib diisi"),
  resepsiVenue: z.string().min(3, "Nama venue resepsi wajib diisi"),
  resepsiAddress: z.string().min(5, "Alamat resepsi wajib diisi"),
  resepsiMapsUrl: z.string().url("URL Maps harus valid").optional().or(z.literal("")),
});

// Step 4: Data Klien (Guest Checkout)
export const customerDataSchema = z.object({
  customerName: z.string().min(2, "Nama pemesan wajib diisi"),
  customerEmail: z.email("Format email tidak valid"),
  customerPhone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^[0-9+]+$/, "Nomor HP hanya boleh berisi angka dan +"),
});

// Combined schema (full booking)
export const fullBookingSchema = themeStepSchema
  .merge(packageStepSchema)
  .merge(eventDataSchema)
  .merge(customerDataSchema);

export type ThemeStepData = z.infer<typeof themeStepSchema>;
export type PackageStepData = z.infer<typeof packageStepSchema>;
export type EventDataForm = z.infer<typeof eventDataSchema>;
export type CustomerDataForm = z.infer<typeof customerDataSchema>;
export type FullBookingData = z.infer<typeof fullBookingSchema>;
