# Momena Labs - Platform Undangan Digital Self-Service

Momena Labs adalah platform pembuatan undangan digital berbasis Next.js (App Router) yang dirancang untuk melayani klien secara mandiri (*self-service*). Platform ini mengotomatiskan proses pemilihan tema, pengisian data, pembayaran, hingga generasi undangan, sehingga meniadakan intervensi manual dari sisi admin untuk proses standar.

## ✨ Fitur Utama
1. **Public Catalog & Pricing Dinamis**: Halaman *landing page*, katalog tema, dan harga yang langsung ditarik dari *database*.
2. **Katalog Tema Beragam**: Koleksi tema yang dikelola via database, termasuk tema eksklusif *"Adat Sunda"* dan *"Elegant Dark"*.
3. **Client Dashboard**: Panel khusus untuk pengantin mengelola undangannya:
   - Manajemen Buku Tamu (Guestbook) & RSVP.
   - Ekspor data RSVP & Ucapan ke format CSV.
   - Generator Link WhatsApp Otomatis untuk disebar ke ribuan kontak.
   - Pengaturan mandiri untuk Musik Latar (Backsound) & Rekening Amplop Digital.
4. **Checkout Otomatis**: Integrasi *payment gateway* (Midtrans) untuk pemrosesan order secara *real-time*.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Icons**: Lucide React
- **Payment Gateway**: Midtrans (Sandbox/Production)

## 🚀 Cara Menjalankan Project (Development)

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variables (`.env`)**
   Pastikan Anda memiliki `.env` dengan variabel berikut:
   ```env
   # Database (Supabase / Postgres)
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   
   # Keamanan
   JWT_SECRET="rahasia_jwt_anda"
   
   # Payment Gateway (Midtrans)
   MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
   
   # Whatsapp API (Wamify / Pihak Ketiga)
   WAMIFY_TOKEN="token_anda"
   WAMIFY_SESSION_ID="session_anda"
   ```

3. **Migrasi & Seeding Database**
   Lakukan *push schema* ke database dan suntikkan data awal (Admin, Kategori, Paket, dan Tema):
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Jalankan Server Lokal**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser.

---

## 📝 Status Placeholder & Data *Dummy* (Technical Debt)

Selama proses pengembangan, sistem *hardcode* statis di halaman publik telah dihanguskan. Namun, masih ada beberapa area yang menggunakan data *dummy* atau *hardcode* untuk tujuan pengembangan dan *testing*:

1. **Pratinjau Tema (Theme Preview)**
   - **Lokasi:** `src/lib/dummy-data.ts` & `src/app/themes-preview/[themeKey]/page.tsx`
   - **Status:** **Disengaja (By Design).** Data *dummy* di sini (seperti nama pengantin palsu, galeri *dummy*, dan acara *dummy*) memang dibutuhkan agar calon pembeli bisa melihat pratinjau tema yang berfungsi penuh di halaman Katalog sebelum mereka membeli.
   
2. **Fallback Midtrans Checkout**
   - **Lokasi:** `src/app/api/checkout/route.ts` (Baris 79)
   - **Status:** **Testing/Development.** Jika `MIDTRANS_SERVER_KEY` tidak disetel di `.env`, kode akan melakukan *bypass* pembayaran dan menghasilkan Token Midtrans *dummy*. Ini ditujukan murni agar sistem tetap bisa ditest di *local environment* tanpa Midtrans, namun harus dihapus atau dijaga ketat di tahap *Production*.

3. ~~**Fallback API Kategori (Admin Dashboard)**~~ ✅ **Sudah Diperbaiki.**
   - API `/api/admin/categories` sudah berfungsi penuh menarik data dari `prisma.eventCategory`. *Hardcode fallback* dihapus, diganti dengan pesan error jika koneksi database gagal.

---
*Dibuat oleh Momena Labs Dev Team - 2026*
