# Arsitektur Teknis & DevOps — Momena Labs
Versi 1.0 — 18 Juli 2026

Prinsip penentuan stack: **build cepat dalam 5 hari bersama AI coding agent, minim devops manual, tapi tetap production-grade dan mudah di-scale**. Semua pilihan di bawah sengaja dibuat *opinionated* (satu pilihan per layer) supaya AI agent tidak "bingung" memilih alternatif saat coding — ini penting agar file `AGENTS.md` (dokumen 3) bisa memberi instruksi yang tegas.

---

## 1. Stack Terpilih

| Layer | Pilihan | Alasan |
|---|---|---|
| Frontend + Backend | **Next.js 15 (App Router) + TypeScript** | Full-stack dalam satu repo (API routes/server actions) → lebih cepat untuk AI agent membangun dalam 5 hari dibanding split repo frontend/backend. SSR/ISR bagus untuk halaman tamu (read-heavy, butuh cepat & SEO). |
| Styling/UI | **Tailwind CSS + shadcn/ui** | Cepat dibangun agent, konsisten desain, mudah dikustomisasi per tema. |
| Database | **PostgreSQL (via Supabase)** | Supabase = Postgres + Auth + Storage + Realtime dalam satu managed service → menghilangkan kerja devops setup auth/storage dari nol. |
| ORM | **Prisma (dengan PrismaPg Adapter)** | Schema-as-code, migrations otomatis, terintegrasi stabil dengan Supabase Connection Pooler. |
| Auth | **Custom JWT HTTP-Only Cookies (Admin) & Guest Checkout (Klien)** | Lebih cepat dibangun, tidak bergantung pada library berat, cocok untuk model guest checkout tanpa perlu akun. |
| File storage (foto/musik/video) | **Supabase Storage** (atau Cloudflare R2 jika volume besar di Fase 2) | Terintegrasi langsung dengan auth/RLS. |
| Payment Gateway | **Midtrans Snap** (VA, QRIS, e-wallet, kartu) sebagai utama, fallback transfer manual + upload bukti | Paling umum & cepat diintegrasikan untuk bisnis Indonesia; sandbox tersedia sejak hari 1. |
| Notifikasi WA | **Wamify (WhatsApp API)** untuk MVP → migrasi ke **WhatsApp Cloud API resmi (Meta)** di Fase 2 | Approval WA Business API resmi bisa lambat; Wamify bisa langsung dipakai hari 1 dan mudah integrasinya. |
| Notifikasi Email | **Resend** | API sederhana, cepat diintegrasikan dengan React Email templates. |
| Hosting/Deploy | **Vercel** (Next.js app) + **Supabase Cloud** (DB/Auth/Storage) | Zero-devops: git push → auto deploy, edge network otomatis, wildcard subdomain didukung. |
| CI/CD | **GitHub Actions** (lint, typecheck, test) + **Vercel auto-deploy** dari branch `main`/preview dari PR | Standar, murah setup. |
| Monitoring/Error | **Sentry** (error tracking) + **Vercel Analytics** (performance) + **UptimeRobot** (uptime check halaman tamu publik) | Setup < 30 menit, cukup untuk MVP. |
| Domain | **Wildcard subdomain**: `{slug}.momena.id` via Vercel Domains + DNS wildcard `*.momena.id` | Tiap undangan dapat subdomain unik tanpa provisioning manual. Custom domain penuh = add-on Fase 1.5. |

> Catatan devops: dengan kombinasi Vercel + Supabase, **tidak perlu server/VM manual, tidak perlu Docker/K8s untuk MVP**. Ini keputusan sadar demi kecepatan 5 hari — revisit di Fase 3 jika butuh kontrol infra lebih (misal load sangat tinggi atau kebutuhan compliance khusus).

---

## 2. Diagram Arsitektur (deskripsi tekstual)

```
[Browser Klien/Tamu]
        │  HTTPS
        ▼
[Vercel Edge Network] ── cache halaman tamu (ISR) ──► [Next.js App (App Router)]
        │                                                     │
        │                                     ┌───────────────┼─────────────────┐
        │                                     ▼               ▼                 ▼
        │                              [Prisma Client]  [Supabase Storage] [Server Actions/API Routes]
        │                                     │                                  │
        │                                     ▼                                  ▼
        │                          [Supabase Postgres + RLS]        [Midtrans Snap API] ──(webhook)──► update order status
        │                                                                          │
        └── notifikasi ◄── [Queue/Trigger ringan (DB webhook / cron Vercel)] ◄─────┘
                                     │
                         ┌───────────┴───────────┐
                         ▼                       ▼
                 [Fonnte/Wablas API]       [Resend Email API]
```

Alur pembayaran: Checkout → Next.js server action buat transaksi Midtrans → redirect/Snap popup → user bayar → Midtrans kirim **webhook** ke endpoint `/api/webhooks/midtrans` → verifikasi signature → update `orders.status` → trigger job kirim notifikasi WA/email + generate slug undangan tamu.

---

## 3. Skema Database (inti)

```prisma
// prisma/schema.prisma (ringkas — tabel inti)

model EventCategory {
  id        String   @id @default(cuid())
  name      String   // "Wedding", "Khitanan", "Aqiqah", "Ulang Tahun"
  slug      String   @unique
  icon      String?
  themes    Theme[]
  createdAt DateTime @default(now())
}

model Theme {
  id            String        @id @default(cuid())
  name          String        // "Lux Art 1", "Rustik 3"
  slug          String        @unique
  categoryId    String
  category      EventCategory @relation(fields: [categoryId], references: [id])
  styleGroup    String        // "Lux Art" | "Rustik" | "Lux Flower" | "Elegant" ...
  componentKey  String        // key React component untuk render, mis. "lux-art-1"
  thumbnailUrl  String
  basePrice     Int           // harga dasar dalam rupiah
  isActive      Boolean       @default(true)
  isBestSeller  Boolean       @default(false)
  hasPhotoVariant Boolean     @default(true) // ada versi "tanpa foto"
  createdAt     DateTime      @default(now())
  orders        Order[]
}

model Package {
  id          String  @id @default(cuid())
  name        String  // "Starter", "Populer", "Premium"
  price       Int
  maxGuests   Int
  maxPhotos   Int
  maxRevisions Int
  features    Json    // list fitur yang di-enable (rsvp, music, gift, maps, calendar, ...)
  activeDays  Int     @default(365)
}

model Customer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String
  authUserId String  @unique // link ke Supabase auth.users
  orders    Order[]
  createdAt DateTime @default(now())
}

model Order {
  id            String     @id @default(cuid())
  orderNumber   String     @unique
  customerId    String
  customer      Customer   @relation(fields: [customerId], references: [id])
  categoryId    String
  themeId       String
  theme         Theme      @relation(fields: [themeId], references: [id])
  packageId     String
  status        OrderStatus @default(NEW)
  eventData     Json        // nama mempelai/anak, tanggal, lokasi, cerita, dll (fleksibel per kategori)
  mediaAssets   Json        // urls foto/galeri/musik
  giftInfo      Json?       // rekening/QRIS
  slug          String      @unique // subdomain: {slug}.momena.id
  activeUntil   DateTime?
  guests        Guest[]
  payments      Payment[]
  guestbook     GuestbookMessage[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum OrderStatus {
  NEW
  PENDING_PAYMENT
  PAYMENT_REVIEW      // untuk transfer manual
  ACTIVE
  COMPLETED
  ARCHIVED
  CANCELLED
}

model Guest {
  id           String   @id @default(cuid())
  orderId      String
  order        Order    @relation(fields: [orderId], references: [id])
  name         String
  phone        String?
  guestSlug    String   // untuk URL personalisasi: /u/{order.slug}/{guestSlug}
  rsvpStatus   RsvpStatus @default(PENDING)
  rsvpGuestCount Int?
  respondedAt  DateTime?
}

enum RsvpStatus {
  PENDING
  ATTENDING
  NOT_ATTENDING
  MAYBE
}

model GuestbookMessage {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  name      String
  message   String
  isHidden  Boolean  @default(false) // moderasi admin
  createdAt DateTime @default(now())
}

model Payment {
  id            String   @id @default(cuid())
  orderId       String
  order         Order    @relation(fields: [orderId], references: [id])
  method        String   // "midtrans_va", "qris", "manual_transfer"
  amount        Int
  status        String   // "pending", "success", "failed"
  proofUrl      String?  // bukti transfer manual
  gatewayRef    String?  // transaction id Midtrans
  verifiedBy    String?  // adminId jika manual
  createdAt     DateTime @default(now())
}

model Admin {
  id       String   @id @default(cuid())
  name     String
  email    String   @unique
  role     AdminRole @default(PRODUCTION)
}

enum AdminRole {
  SUPER_ADMIN
  PRODUCTION
  SUPPORT
}
```

**Catatan desain skema:**
- `eventData` & `mediaAssets` sengaja `Json` (bukan kolom kaku) karena tiap kategori event (wedding vs khitanan) punya field berbeda — fleksibel tanpa migrasi tiap kali nambah kategori baru. Validasi struktur dilakukan di application layer (Zod schema per kategori).
- `Theme.componentKey` menghubungkan data ke **komponen React fisik** yang meng-render tema (lihat §4) — bukan template string dinamis, demi performa & keamanan (hindari render HTML arbitrary).
- Row Level Security (RLS) Supabase diterapkan di level Postgres: customer hanya bisa baca/tulis `Order` miliknya sendiri (match `customer.authUserId = auth.uid()`); admin pakai service role key di server actions.

---

## 4. Pola "Theme Engine" (bagian paling kritikal)

Karena bisnis ini berbasis katalog tema visual (seperti AA Digital), keputusan arsitektur pentingnya adalah: **tema = komponen React terdaftar, bukan HTML/CSS yang di-generate bebas oleh user**.

```
/themes
  /wedding
    /lux-art-1/index.tsx      ← komponen presentasional, terima props InvitationData
    /rustik-3/index.tsx
  /khitanan
    /ceria-1/index.tsx
  registry.ts                  ← map componentKey → komponen (dipakai saat render halaman tamu)
```

- Menambah tema baru = tambah 1 komponen + daftarkan di `registry.ts` + insert row `Theme` lewat admin dashboard (upload thumbnail, isi harga). Tidak perlu migrasi DB.
- Halaman tamu (`/u/[orderSlug]/[guestSlug]`) di-render server-side dengan **ISR (revalidate tiap beberapa menit)** — cepat untuk tamu, tapi tetap update ketika klien edit data.
- Semua tema wajib menerima props terstruktur yang sama (nama, tanggal, galeri, lokasi, musik, dst) sehingga form booking generik bisa dipakai lintas tema — ini yang membuat proses booking **otomatis tanpa admin**, beda dari kompetitor yang manual re-input.

---

## 5. Daftar Endpoint Inti (REST/Server Actions)

```
GET   /api/themes?category=wedding          → katalog tema (publik)
GET   /api/themes/:slug                      → detail + demo data
POST  /api/orders                            → buat order baru (draft)
PATCH /api/orders/:id                        → update data acara/media/tamu
POST  /api/orders/:id/guests/bulk            → import tamu (CSV) → auto generate guestSlug
POST  /api/checkout/:orderId                 → create Midtrans transaction
POST  /api/webhooks/midtrans                 → verifikasi & update status pembayaran
GET   /u/:orderSlug/:guestSlug               → halaman undangan tamu (SSR/ISR, publik)
POST  /api/orders/:id/rsvp                   → submit RSVP tamu
POST  /api/orders/:id/guestbook              → submit ucapan
GET   /admin/api/orders                      → list order (kanban) — admin only
PATCH /admin/api/orders/:id/status           → ubah status/verifikasi manual
POST  /admin/api/themes                      → CRUD tema — admin only
GET   /admin/api/reports/sales               → laporan penjualan
```

---

## 6. Keamanan

- RLS Postgres per customer (lihat §3).
- Validasi input di server pakai **Zod** untuk tiap `eventData` schema per kategori.
- Rate limiting endpoint publik (RSVP/guestbook) untuk cegah spam — pakai Vercel Edge Middleware + Upstash Redis (opsional Fase 1.5).
- Signature verification wajib di webhook Midtrans (jangan percaya payload tanpa validasi).
- Data rekening bank/QRIS klien: simpan sebagai teks biasa cukup (bukan data kartu kredit), tapi batasi akses hanya pemilik order + admin.
- Kebijakan retensi data tamu: hapus/anonimkan `Guest.phone` & `GuestbookMessage` setelah `activeUntil` + 90 hari grace period (job cron).

---

## 7. Rencana Skalabilitas

- **Baca >> Tulis**: halaman tamu di-cache agresif (ISR/CDN) — mayoritas trafik adalah baca undangan, bukan transaksi.
- **Lonjakan musiman**: monitoring load sebelum weekend (peak hari nikah), Vercel auto-scale edge, Supabase bisa upgrade compute plan saat traffic tinggi.
- **Migrasi Fase 3** (jika perlu kontrol lebih): pisah service notifikasi/queue ke worker terpisah (misal Inngest/Trigger.dev untuk job async: kirim WA, generate laporan) — sudah bisa disiapkan strukturnya dari MVP supaya migrasi mulus.

---

## 8. Checklist DevOps Hari-ke-Hari (ringkas, detail penuh di dokumen 4)

- [ ] Repo GitHub + branch protection `main`
- [ ] Project Vercel terhubung ke repo, env vars (Supabase, Midtrans, Fonnte, Resend) diisi di Vercel dashboard
- [ ] Project Supabase dibuat, `prisma migrate deploy` dijalankan di CI
- [ ] Wildcard domain `*.momena.id` diarahkan ke Vercel
- [ ] Sentry DSN terpasang
- [ ] GitHub Actions: `lint` + `typecheck` + `test` wajib lulus sebelum merge ke `main`
