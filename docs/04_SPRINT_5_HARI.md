# Sprint 5 Hari — Momena Labs MVP
Cara pakai: setiap hari punya **tujuan**, **urutan task**, dan **contoh prompt** yang bisa Anda paste langsung ke chat agent di Antigravity (mode Planning untuk task besar, Fast untuk task kecil/berulang). Selalu buka sesi dengan agent membaca `AGENTS.md`, `01_PRD_Momena_Labs.md`, dan `02_ARSITEKTUR_DEVOPS.md` (taruh ketiganya di `/docs`).

**Sebelum Hari 1:** siapkan akun Vercel, Supabase, Midtrans (sandbox), Wamify, Resend, dan domain `momena.id` (atau domain sementara) — ini pekerjaan manusia, tidak bisa didelegasikan ke agent.

---

## Hari 1 — Fondasi: Infra, Skema Data, Design System, 2 Tema Pertama

**Tujuan:** project bisa jalan lokal & ter-deploy ke Vercel (walau kosong), skema DB final, 2 komponen tema sudah bisa render data dummy.

Task:
1. Init repo Next.js 15 + TS + Tailwind + shadcn/ui, hubungkan ke Vercel & GitHub Actions.
2. Setup Supabase project, isi `prisma/schema.prisma` (copy dari `02_ARSITEKTUR_DEVOPS.md §3`), jalankan migrasi pertama.
3. Buat `/lib/design-tokens.ts` (warna, font, spacing) berdasar mood "elegant/modern" — jadikan basis semua tema.
4. Bangun 2 komponen tema (`/themes/wedding/lux-art-1`, `/themes/wedding/rustik-1`) dengan data dummy, mengikuti kontrak `InvitationData`.
5. Setup `.agents/skills/invitation-theme/SKILL.md` dan `AGENTS.md` di root (dari dokumen 3).

Contoh prompt (Planning Mode):
> "Baca /docs/01_PRD_Momena_Labs.md dan /docs/02_ARSITEKTUR_DEVOPS.md. Buatkan implementation plan untuk: (1) inisialisasi project Next.js 15 + TS + Tailwind + shadcn/ui, (2) schema Prisma sesuai dokumen arsitektur §3, (3) dua komponen tema wedding pertama (lux-art-1 dan rustik-1) yang comply dengan interface InvitationData. Tampilkan plan-nya dulu sebelum eksekusi."

**Definisi selesai Hari 1:** `npm run dev` render katalog kosong + `/themes-preview/lux-art-1` dan `/rustik-1` tampil dengan data dummy, migration Prisma sukses, deploy preview Vercel hijau.

---

## Hari 2 — Katalog Publik + Flow Booking/Checkout + Payment Sandbox

**Tujuan:** klien bisa pilih tema dari katalog publik, isi form data acara, dan menyelesaikan pembayaran sandbox Midtrans, order otomatis tercatat di DB.

Task:
1. Halaman katalog publik (`/(public)`) — list kategori & tema, filter gaya, halaman demo tema dengan query personalisasi nama tamu (`?to=Nama+Tamu`, pola yang sama dipakai kompetitor jadi familiar bagi klien).
2. Halaman harga & paket (Starter/Populer/Premium) dari tabel `Package`.
3. Flow booking multi-step: pilih tema → pilih paket → form data acara (Zod schema per kategori event) → upload media ke Supabase Storage → tambah daftar tamu (manual + upload CSV) → checkout.
4. Integrasi Midtrans Snap (sandbox) + endpoint webhook `/api/webhooks/midtrans` dengan verifikasi signature.
5. Setelah payment sukses → auto set `Order.status = ACTIVE`, generate `slug` unik & `guestSlug` per tamu.

Contoh prompt:
> "Implementasikan flow booking sesuai modul B di PRD: multi-step form (tema→paket→data acara→media→daftar tamu→checkout). Gunakan react-hook-form + zod. Integrasikan Midtrans Snap sandbox untuk pembayaran, dan buat webhook handler yang memverifikasi signature sebelum update status order. Tulis test untuk skenario payment sukses dan gagal."

**Definisi selesai Hari 2:** end-to-end dari pilih tema sampai bayar (sandbox) berhasil membuat `Order` berstatus `ACTIVE` di database.

---

## Hari 3 — Halaman Undangan Tamu (Guest Page) + Notifikasi

**Tujuan:** halaman undangan tamu publik lengkap fitur, dan notifikasi WA/email otomatis terkirim di titik-titik penting.

Task:
1. Route `/u/[orderSlug]/[guestSlug]` (SSR + ISR) yang me-render komponen tema sesuai `Theme.componentKey` dengan data dari `Order` + personalisasi nama tamu dari `Guest`.
2. Fitur di dalam halaman tamu: countdown, galeri, maps+calendar, RSVP form (submit ke `/api/orders/:id/rsvp`), buku ucapan, amplop digital, audio player, tombol share WA per-tamu.
3. Integrasi Wamify: kirim WA otomatis saat order dibuat, payment sukses, undangan live, reminder H-1.
4. Integrasi Resend: email cadangan untuk notifikasi yang sama.
5. Rate limiting sederhana untuk endpoint RSVP/guestbook (cegah spam).

Contoh prompt:
> "Bangun route publik /u/[orderSlug]/[guestSlug] sesuai modul C di PRD, render via themes/registry.ts berdasarkan Theme.componentKey milik order tsb. Pastikan ISR dengan revalidate wajar (misal 60 detik) agar update data klien cepat terlihat tamu. Tambahkan RSVP dan guestbook form yang submit ke server action. Setelah itu, buat helper /lib/wamify.ts untuk kirim pesan via Wamify, dan panggil di titik: order dibuat, payment sukses, undangan live."

**Definisi selesai Hari 3:** membuka link tamu di HP menampilkan undangan lengkap & fungsional, RSVP tersimpan ke DB, WA notifikasi terkirim di sandbox/testing number.

---

## Hari 4 — Dashboard Klien + Dashboard Admin

**Tujuan:** klien bisa self-service kelola order sendiri, admin bisa mengawasi semua order & tema tanpa Excel/WA manual.

Task:
1. Dashboard klien (`/(client)/client/[orderId]`, diakses via link khusus): status order, daftar tamu + status RSVP, rekap statistik tamu, daftar pesan buku tamu.
2. Dashboard admin (`/(admin)/admin`, role-gated): kanban order (drag status), CRUD tema, CRUD paket & harga, antrean verifikasi pembayaran manual, moderasi guestbook, laporan penjualan dasar (chart sederhana).
3. Role-based access: `Admin.role` menentukan menu yang tampil (Super Admin vs Production vs Support).

Contoh prompt:
> "Buat dashboard admin sesuai modul E di PRD. Gunakan RSC untuk data fetching, client component hanya untuk interaksi kanban (drag-drop status order). Terapkan role gating: PRODUCTION tidak bisa akses laporan keuangan, SUPPORT tidak bisa edit tema. Tambahkan halaman verifikasi pembayaran manual dengan preview bukti transfer dan tombol approve/reject yang otomatis trigger notifikasi ke klien saat approve."

**Definisi selesai Hari 4:** admin bisa melihat & mengelola seluruh order dari 1 dashboard tanpa buka WhatsApp/Excel; klien bisa self-service edit data & lihat RSVP tanpa hubungi admin.

---

## Hari 5 — QA, Isi Katalog Riil, Deploy Produksi, Launch Checklist

**Tujuan:** sistem stabil, katalog terisi tema riil (bukan cuma dummy), siap terima order sungguhan.

Task:
1. Port/tambahkan 3–5 tema tambahan (total minimal 6-8 tema, campuran Wedding & Khitanan) mengikuti skill `invitation-theme`.
2. QA end-to-end (Playwright): booking flow, payment sandbox→ live test kecil, RSVP, guestbook, notifikasi.
3. Load test ringan halaman tamu (`/u/...`) untuk simulasi banyak akses bersamaan.
4. Setup domain wildcard `*.momena.id` → Vercel, pindah Midtrans ke mode live (setelah dokumen bisnis disetujui — jika belum, tetap sandbox + fallback manual transfer untuk go-live awal).
5. Checklist keamanan: cek RLS aktif di semua tabel sensitif, cek tidak ada secret ke-commit, cek log tidak menyimpan data pribadi tamu mentah.
6. Siapkan 1-2 order dummy "showcase" untuk demo penjualan.

Contoh prompt:
> "Jalankan QA agent: tulis Playwright test untuk full flow booking→payment sandbox→guest page→RSVP→guestbook. Laporkan bug yang ditemukan sebagai checklist, jangan langsung fix semuanya sekaligus — urutkan berdasar severity."

**Definisi selesai Hari 5 (Launch Checklist):**
- [ ] Minimal 6-8 tema live di katalog (≥2 kategori event)
- [ ] Booking → payment → guest page → RSVP → guestbook semua tervalidasi lulus test
- [ ] Notifikasi WA/email terkirim benar di semua titik trigger
- [ ] Dashboard admin & klien berfungsi penuh
- [ ] Domain wildcard aktif, HTTPS valid
- [ ] Sentry & uptime monitoring aktif
- [ ] RLS & keamanan data tamu dicek manual sekali oleh Anda (bukan hanya agent)
- [ ] Fallback pembayaran manual transfer tetap tersedia sebagai jaring pengaman

---

## Catatan Realistis

Dengan tim solo + AI agent, 5 hari **cukup untuk MVP fungsional inti** seperti di atas, tapi **jumlah tema visual berkualitas tinggi** adalah faktor risiko terbesar (desain butuh iterasi rasa, bukan cuma logika). Strategi realistis: hari 1-4 pastikan *sistem*-nya beres total dengan 2 tema, hari 5 baru gaspol nambah variasi tema — dan kalau butuh, produksi tema tambahan bisa lanjut di minggu ke-2 secara paralel sambil sistem sudah bisa mulai terima order dengan katalog terbatas.
