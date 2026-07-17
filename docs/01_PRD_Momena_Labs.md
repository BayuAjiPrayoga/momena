# PRD — Momena Labs
### Platform Booking & Self-Service Undangan Digital (Wedding, Khitanan, Aqiqah, dll)
Versi 1.0 — 18 Juli 2026

---

## 1. Ringkasan Eksekutif

**Masalah yang kita selesaikan:** Bisnis undangan digital di Indonesia (contoh: AA Digital) saat ini mayoritas beroperasi sebagai *katalog statis + proses manual*: klien pilih tema dari halaman WordPress, transfer bank, kirim data via WhatsApp, lalu tim admin mengetik ulang data ke template satu-per-satu (SLA 1x24 jam). Model ini:
- Tidak scalable (revenue = jam kerja tim admin).
- Tidak ada visibilitas order/status bagi klien maupun owner.
- Tidak ada data (siapa yang RSVP, konversi katalog→checkout, tema mana yang laku).
- Rawan human error saat input ulang nama tamu/tanggal/rekening.

**Visi Momena Labs:** Menjadi platform **self-service booking undangan digital multi-event** (pernikahan, khitanan, aqiqah, ulang tahun, syukuran, lamaran) di mana klien bisa: pilih tema → isi data sendiri lewat form/editor → bayar otomatis (VA/QRIS/e-wallet) → undangan **langsung jadi tanpa menunggu admin** (instan atau near-instan), sementara tim internal cukup mengawasi lewat dashboard admin (produksi tema baru, verifikasi kasus edge, customer support).

**Diferensiasi utama vs kompetitor:** kecepatan (instan vs 24 jam), transparansi (dashboard order & RSVP real-time untuk klien), dan platform multi-event (bukan cuma wedding) di bawah satu sistem admin.

---

## 2. Analisis Kompetitor (ringkas)

| Aspek | AA Digital (referensi) | Rata-rata pasar (Undangan.io-class) | **Target Momena Labs** |
|---|---|---|---|
| Proses order | Manual: WA + transfer + admin input ulang | Sebagian sudah semi self-service | Full self-service, instan |
| Struktur harga | Per tema, tanpa tier jelas di halaman katalog | Tier Silver/Gold/Platinum/Diamond (~50rb–1jt+) | 3–4 paket jelas + add-on à la carte |
| Fitur tamu | Nama tamu personalisasi, maps, love story, galeri, RSVP, buku ucapan, musik, amplop digital, countdown | Sama + kadang live streaming, animasi | Sama + **link personalisasi otomatis per tamu (bulk generate)**, WA blast |
| Dashboard klien | ❌ Tidak ada | Jarang ada | ✅ Ada — status order, edit data, rekap RSVP, ekspor ucapan |
| Dashboard admin | ❌ (kerja manual via WA/Excel) | Bervariasi | ✅ Kanban order, manajemen tema, verifikasi pembayaran, laporan |
| Kategori event | Fokus wedding | Fokus wedding | **Multi-event**: wedding, khitanan, aqiqah, ulang tahun, syukuran |
| Pembayaran | Transfer manual saja | Umumnya masih manual/semi | Gateway otomatis (VA/QRIS/e-wallet) + fallback manual |
| Masa aktif | 1 tahun, lifetime +75rb | Bervariasi | 1 tahun default, opsi extend/lifetime sebagai add-on |

**Insight kunci untuk MVP:** jangan coba menang di jumlah tema dulu (kompetitor sudah punya puluhan). Menangkan di **kecepatan proses + pengalaman klien (dashboard) + cakupan jenis acara**. Tema bisa ditambah bertahap.

---

## 3. Target Pengguna

1. **Klien pemesan (Customer)** — calon pengantin, orang tua yang mengadakan khitanan/aqiqah/ulang tahun anak. Mobile-first, sensitif harga, butuh proses cepat & jelas, sering pesan mepet acara (H-3 s/d H-14).
2. **Tamu undangan (Guest)** — hanya membuka link via WhatsApp, tidak install apps, akses dari HP low-mid end, ekspektasi loading cepat.
3. **Admin/Tim Produksi Momena Labs** — mengelola tema baru, verifikasi pembayaran manual (jika ada), menangani permintaan custom/edit khusus, customer support.
4. **Owner/Momena Labs (bisnis)** — butuh laporan penjualan, tema terlaris, funnel konversi.
5. *(Fase 2)* **Reseller/Affiliate** — mitra yang menjual ulang dengan komisi.

---

## 4. Tujuan Produk & Metrik Sukses (MVP)

| Tujuan | Metrik | Target awal |
|---|---|---|
| Booking mandiri tanpa intervensi admin | % order selesai tanpa admin manual input | ≥ 80% |
| Waktu produksi | Waktu dari bayar → undangan live | < 5 menit (vs 24 jam kompetitor) |
| Konversi katalog → checkout | Visitor → order | Baseline diukur bulan 1, target naik 20% tiap iterasi |
| Retensi fitur RSVP | % order yang tamu-nya mengisi RSVP | ≥ 60% dari total tamu yang dibagikan link |
| Kepuasan | Rating/testimoni pasca acara | ≥ 4.5/5 |

---

## 5. Ruang Lingkup

### 5.1 MVP (target 5 hari build, lihat `04_SPRINT_5_HARI.md`)
- Landing page publik + katalog tema per kategori event (minimal 2 kategori: Wedding, Khitanan; @ 3–5 tema).
- Flow booking: pilih tema → pilih paket → isi form data acara & tamu → upload foto/musik → checkout (payment gateway sandbox/live) → order otomatis terbentuk.
- Rendering halaman undangan tamu (publik, personalisasi nama tamu via slug/query param) dengan fitur inti: cover bernama, countdown, profil mempelai/acara, lokasi (maps) + tambah ke kalender, galeri foto, RSVP + buku ucapan, amplop digital (rekening/QRIS), musik latar, tombol share WA personalisasi per tamu.
- Dashboard klien: status order, edit data undangan sendiri, daftar tamu & rekap RSVP, ekspor ucapan, invoice.
- Dashboard admin: kanban order (Baru → Menunggu Pembayaran → Aktif → Selesai/Arsip), manajemen tema (CRUD), manajemen kategori event & paket harga, verifikasi pembayaran manual (fallback), laporan penjualan dasar, moderasi buku ucapan (opsional hide spam).
- Notifikasi otomatis: WhatsApp/Email saat order dibuat, pembayaran sukses, undangan siap, reminder H-1 acara.

### 5.2 Di luar scope MVP (Fase 2+)
- Cetak fisik & video 3D (add-on seperti kompetitor — integrasi vendor cetak eksternal).
- Custom domain per klien (subdomain dulu di MVP: `namapengantin.momena.id`).
- Program reseller/affiliate dengan komisi otomatis.
- AI-assisted content (misal generate teks love story dari prompt singkat via Claude API).
- Live streaming embed, multi-bahasa undangan, WA bot auto-reply untuk tamu.
- Editor drag-and-drop tema (di MVP: form terstruktur, bukan visual builder bebas).

---

## 6. Modul Fitur Detail

### A. Situs Publik (Marketing + Katalog)
- Landing page: value proposition, kategori event, testimoni, CTA "Buat Undangan".
- Halaman katalog per kategori (Wedding, Khitanan, dst) dengan filter gaya (Elegant, Rustik, Islami, Minimalis, dll — mengikuti pola AA Digital: kelompokkan per "tema look").
- Halaman demo tema: preview penuh dengan data dummy + query nama tamu contoh (pola `?to=Nama+Tamu` yang sudah terbukti dipakai kompetitor — pertahankan pola ini karena familiar bagi klien yang membandingkan).
- Halaman harga (paket + tabel fitur, transparan, tanpa "hidden cost" — ini pain point yang sering dikeluhkan di riset pasar).

### B. Booking / Checkout
1. Pilih kategori event → pilih tema → pilih paket (Starter/Populer/Premium).
2. Form data acara: nama mempelai/anak, tanggal & jam, lokasi (+ pencarian Google Places), akad/resepsi (untuk wedding) atau acara inti (untuk khitanan/aqiqah), cerita singkat, kontak CP.
3. Upload media: foto cover, galeri (maks sesuai paket), musik latar (pilih dari library atau upload), nomor rekening/QRIS untuk amplop digital.
4. Import daftar tamu (manual tambah satu-satu ATAU upload CSV nama+nomor WA) → sistem generate link personalisasi otomatis per tamu.
5. Checkout: ringkasan pesanan, pilih metode bayar (VA BCA/BNI/Mandiri, QRIS, e-wallet, atau transfer manual + upload bukti sebagai fallback).
6. Setelah bayar terverifikasi (webhook otomatis, atau manual oleh admin untuk fallback) → status order "Aktif" → link undangan live otomatis, notifikasi dikirim ke klien.

### C. Halaman Undangan Tamu (Guest-Facing)
Wajib mobile-first, load cepat (guest buka dari chat WA, koneksi bisa lambat):
- Cover dengan nama tamu otomatis dari URL (`momena.id/u/[order-slug]/[guest-slug]`).
- Countdown menuju acara.
- Info mempelai/tuan rumah acara + galeri foto/video.
- Love story / narasi acara (khusus wedding) atau info acara (khitanan/aqiqah).
- Lokasi: embed Google Maps + tombol "Buka di Maps" + "Tambah ke Kalender" (.ics/Google Calendar link).
- RSVP: konfirmasi kehadiran (Hadir/Tidak/Ragu) + jumlah tamu yang dibawa.
- Buku ucapan & doa (publik, dengan moderasi ringan dari admin).
- Amplop digital: nomor rekening (copy-to-clipboard), QRIS statis, tautan e-wallet.
- Musik latar (autoplay setelah interaksi pertama sesuai kebijakan browser).
- Tombol "Bagikan ke tamu lain via WA" — otomatis menyisipkan link dengan nama tamu tsb.

### D. Dashboard Klien (Customer Portal)
- Login (email/nomor WA + OTP).
- Status order & riwayat pembayaran/invoice.
- Edit data undangan (dalam batas revisi paket) tanpa perlu chat admin.
- Manajemen daftar tamu: tambah/edit tamu, lihat status RSVP per tamu, generate ulang link, kirim broadcast WA (Fase 2).
- Rekap RSVP (grafik hadir/tidak/ragu) + ekspor ucapan ke PDF/Excel.
- Perpanjangan masa aktif / upgrade paket.

### E. Dashboard Admin (Internal Momena Labs)
- **Order Management (Kanban):** Baru → Menunggu Pembayaran → Pembayaran Diverifikasi → Aktif → Selesai/Arsip. Bisa filter per kategori event, tema, tanggal acara.
- **Manajemen Tema:** CRUD tema (nama, kategori, thumbnail, komponen render, harga dasar, status aktif/nonaktif, badge "Best Seller"). Ini mem-parity-kan struktur katalog AA Digital (Lux Art, Rustik, Lux Flower, Elegant → jadi kategori "gaya" di sistem baru).
- **Manajemen Paket & Harga:** tier + fitur per tier + add-on (extend masa aktif, custom domain, cetak fisik).
- **Verifikasi Pembayaran:** untuk transfer manual — antrean approve/reject dengan bukti transfer.
- **Moderasi Buku Ucapan:** hide/report pesan spam.
- **Laporan:** penjualan per periode, tema terlaris, funnel katalog→checkout, revenue per kategori event.
- **Voucher/Diskon:** kode promo (Fase 1.5).
- **Manajemen Pengguna Admin:** role (Super Admin, Admin Produksi, Customer Support) dengan hak akses berbeda.

### F. Notifikasi
- Trigger: order dibuat, menunggu pembayaran (reminder 1x setelah 1 jam), pembayaran sukses, undangan live, reminder H-1 acara ke klien, ringkasan RSVP mingguan.
- Kanal: WhatsApp (via WhatsApp Cloud API/BSP seperti Fonnte/Wablas untuk kecepatan implementasi 5 hari) + Email (Resend/SendGrid) sebagai cadangan.

---

## 7. Alur Pengguna Utama (User Flow)

**Flow Booking (Klien):**
`Landing → Pilih Kategori Event → Pilih Tema (lihat demo) → Pilih Paket → Isi Form Data Acara → Upload Media → Tambah Daftar Tamu → Checkout & Bayar → (webhook) → Order Aktif → Notifikasi "Undangan siap" + link dashboard klien`

**Flow Tamu:**
`Terima link WA (personalisasi nama) → Buka undangan → Baca info acara → Tap RSVP → Isi ucapan → (opsional) Kirim amplop digital via QRIS/transfer`

**Flow Admin (kasus normal — tanpa intervensi):**
`Order masuk otomatis ke kanban "Aktif" setelah payment webhook sukses → tidak perlu aksi manual`

**Flow Admin (kasus manual transfer):**
`Order masuk "Menunggu Verifikasi" → Admin cek bukti transfer → Approve/Reject → Jika approve, sistem auto-generate undangan & kirim notifikasi`

---

## 8. Persyaratan Non-Fungsional

- **Mobile-first & performa:** halaman tamu harus tetap cepat di 3G/4G Indonesia — target LCP < 2.5s, gunakan image optimization & ISR/edge caching.
- **Ketersediaan:** target uptime 99.5% (musim nikah adalah peak load — hindari downtime di weekend).
- **Keamanan data pribadi:** data tamu (nama, nomor WA) & data rekening bank klien harus dienkripsi at-rest, akses dibatasi per role, patuh prinsip UU PDP (minimalisasi data, retensi jelas — hapus/anonimkan data tamu setelah masa aktif berakhir + grace period).
- **Skalabilitas:** arsitektur harus tahan lonjakan trafik saat undangan viral di grup WA (satu order bisa diakses ratusan tamu dalam waktu singkat) — gunakan caching agresif untuk halaman baca (read-heavy).
- **SEO:** halaman katalog publik harus SEO-friendly (SSR) untuk akuisisi organik ("undangan digital khitanan", dll).
- **Auditability:** setiap perubahan status order & pembayaran harus tercatat log (untuk sengketa/pembayaran).

---

## 9. Risiko & Asumsi

| Risiko | Mitigasi |
|---|---|
| 5 hari terlalu singkat untuk semua fitur + banyak tema | MVP fokus 2 kategori x 3-5 tema, tema tambahan diproduksi paralel/pasca-launch |
| Payment gateway approval (Midtrans/Xendit) butuh proses KYC bisnis | Mulai sandbox mode hari 1–4, submit dokumen legal Momena Labs paralel, fallback transfer manual tetap aktif saat live |
| WhatsApp Business API approval bisa lambat | Pakai provider unofficial (Fonnte/Wablas) untuk MVP → migrasi ke official BSP di Fase 2 |
| Load tamu tinggi saat hari-H acara | Gunakan ISR/edge cache + CDN, load-test sebelum launch |
| Kualitas visual tema baru (bikin dari nol butuh waktu desainer) | Hari 1-2 fokus port ulang 3-5 tema paling laris sebagai komponen React reusable, bukan re-desain total |

---

## 10. Roadmap Setelah MVP

- **Fase 1.5 (Minggu 2-4):** tambah kategori Aqiqah/Ulang Tahun/Syukuran, voucher/diskon, custom domain add-on, editor foto galeri drag-reorder.
- **Fase 2 (Bulan 2):** program reseller/affiliate, WA blast broadcast ke tamu dari dashboard klien, integrasi cetak fisik & video 3D via vendor partner, AI-assisted copywriting (draft love story/deskripsi acara otomatis via Claude API berdasar input singkat klien).
- **Fase 3 (Bulan 3+):** white-label platform untuk reseller (multi-tenant branding), analytics lanjutan (heatmap katalog), app mobile companion admin.

---

*Dokumen ini adalah living document — update begitu asumsi tervalidasi dari data booking nyata.*
