---
name: theme-migration
description: Migrasikan sebuah desain tema undangan dari katalog referensi (screenshot/demo situs kompetitor) menjadi komponen React yang comply dengan kontrak InvitationData Momena Labs. Gunakan saat user memberi link/screenshot demo tema dan minta itu dijadikan tema baru di sistem.
---

## 0. Prinsip Wajib Sebelum Mulai (baca dulu, jangan dilewati)

Tujuan skill ini adalah **mengambil pola struktur & mood desain** (urutan section, gaya tipografi, nuansa warna, layout), **bukan** mengcopy 1:1 aset visual kompetitor. Ini bukan cuma soal etika — juga risiko bisnis nyata untuk Momena Labs:

- **Jangan** download & pakai ulang foto/ornamen grafis milik situs referensi (`wp-content/uploads/...` dsb) — itu aset berhak cipta milik mereka.
- **Jangan** reproduksi logo/watermark/nama brand kompetitor.
- **Boleh & dianjurkan:** catat *struktur* halaman (urutan section apa saja, elemen apa muncul di mana), *gaya* (elegan/rustik/minimalis, palet warna dominan, jenis font — serif vs script vs sans), dan *pola interaksi* (misal: tombol "Buka Undangan" di cover, countdown di atas, dst) — ini pola desain umum industri, aman dipakai sebagai referensi/inspirasi.
- Ganti semua foto contoh dengan **foto dummy berlisensi bebas** (Unsplash/Pexels) untuk data demo, dan pastikan ornamen grafis (bunga, garis, frame) dibuat/diambil dari aset original atau library ikon/SVG berlisensi, bukan hasil crop dari situs kompetitor.
- Jika ragu suatu elemen "terlalu mirip", ubah proporsional (warna, jenis font, komposisi) sampai jadi interpretasi baru, bukan tiruan piksel-demi-piksel.

Agent **wajib berhenti dan bertanya ke user** jika instruksi yang diberikan tampak minta duplikasi identik (misal: "screenshot ini, buat persis sama pixel-nya").

## 1. Langkah Analisis Struktur (bukan aset)

Saat diberi link demo atau screenshot referensi, ekstrak dulu **section map**-nya dalam bentuk daftar, contoh hasil analisis untuk tema bergaya "Lux Art":

```
1. Cover      — nama tamu personalisasi, nama mempelai, tanggal, tombol "Buka Undangan"
2. Countdown  — hitung mundur ke tanggal acara
3. Mempelai   — foto + nama + orang tua (pria & wanita)
4. Quote      — kutipan singkat (mis. ayat/quote)
5. Love Story — timeline 3-5 momen dengan foto
6. Galeri     — grid foto (4-9 foto)
7. Acara      — detail akad & resepsi, tombol maps + tambah kalender
8. RSVP       — form konfirmasi kehadiran
9. Ucapan     — daftar buku tamu + form kirim ucapan
10. Amplop    — rekening/QRIS dengan tombol copy
11. Footer    — musik toggle, credit
```

Simpan section map ini sebagai komentar di atas file komponen — jadi dokumentasi hidup.

## 2. Petakan ke Kontrak `InvitationData`

Cek `/lib/types.ts` — **semua** tema harus menerima props yang sama persis (ini kontrak lintas tema, jangan diubah per tema). Jika referensi punya section yang belum ada di `InvitationData` (misal "hitungan hari puasa" khusus tema tertentu), diskusikan dulu ke user apakah perlu extend interface global atau cukup jadi bagian opsional (`?`), jangan bikin prop khusus liar per tema.

## 3. Tentukan Token Desain Tema Ini

Isi objek konfigurasi kecil per tema (bukan hardcode di JSX), contoh:

```ts
// themes/wedding/lux-art-1/tokens.ts
export const luxArt1Tokens = {
  palette: { primary: "#7a5c3e", accent: "#d4af37", bg: "#faf6f0" },
  fontHeading: "var(--font-playfair)",   // serif elegan
  fontBody: "var(--font-inter)",
  ornamentStyle: "gold-line",             // dari /lib/ornaments (aset original kita)
  mood: "luxury-classic",
};
```

## 4. Bangun Komponen

```
themes/wedding/lux-art-1/
  index.tsx        ← komponen utama, terima props InvitationData
  tokens.ts         ← seperti di atas
  sections/          ← optional, pecah per section jika kompleks
```

Aturan:
- Server Component secara default; `"use client"` hanya untuk bagian interaktif (audio toggle, form RSVP, countdown).
- Dukung **dua varian** (dengan foto / tanpa foto, seperti pola "Lihat Demo" vs "Lihat Tanpa Foto" yang lazim di pasar) lewat **satu komponen dengan conditional render** (`props.showPhotos`), bukan duplikat file terpisah — lebih mudah maintain.
- Mobile-first: desain & test di viewport 375px dulu, baru lebar.
- Gunakan `next/image` untuk semua foto (optimasi otomatis, penting karena tamu buka dari HP/koneksi seluler).

## 5. Registrasi & Seed Data

1. Tambahkan entri di `/themes/registry.ts`:
   ```ts
   "lux-art-1": dynamic(() => import("./wedding/lux-art-1")),
   ```
2. Tambahkan seed dummy di `/prisma/seed.ts` (pakai foto Unsplash/Pexels berlisensi bebas, bukan foto asli calon klien) supaya tema langsung muncul di katalog demo.
3. Isi metadata `Theme` di DB: `name`, `styleGroup`, `basePrice`, `thumbnailUrl`, `hasPhotoVariant: true`.

## 6. QA Checklist Sebelum Dianggap Selesai

- [ ] Section map (langkah 1) cocok dengan hasil render aktual
- [ ] Tidak ada aset (foto/ornamen) yang diambil langsung dari situs referensi
- [ ] Props sesuai kontrak `InvitationData`, lulus `tsc --noEmit`
- [ ] Tampil benar di viewport 375px dan 1280px
- [ ] Kedua varian (dengan/tanpa foto) berfungsi dari satu komponen
- [ ] Snapshot test Playwright ditambahkan untuk halaman demo tema ini
- [ ] Lighthouse performance halaman demo ≥ 85 (mobile)

## 7. Contoh Prompt untuk Memicu Skill Ini

> "Migrasikan tema dari [link/screenshot referensi] jadi tema baru bernama 'elegant-2' kategori wedding. Ikuti skill theme-migration: analisis struktur section-nya dulu, tampilkan section map-nya ke saya untuk saya approve, baru bangun komponennya. Jangan pakai foto/ornamen dari situs referensi — pakai foto dummy Unsplash dan ornamen dari /lib/ornaments."
