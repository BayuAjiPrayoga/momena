# AGENTS.md
> Letakkan file ini persis di **root repository** project Momena Labs. Antigravity (dan agent Claude di dalamnya) otomatis membaca file ini sebagai context utama di setiap sesi. Lengkapi dengan `GUARDRAILS.md` dan folder `.agents/skills/` di bawah (contoh disertakan di §6-7).

---

## 1. Ringkasan Proyek

Momena Labs sedang membangun **platform booking undangan digital self-service** (wedding, khitanan, aqiqah, ulang tahun) yang menggantikan proses manual berbasis WhatsApp. Rujukan bisnis & fitur ada di `/docs/01_PRD_Momena_Labs.md`. Rujukan arsitektur teknis ada di `/docs/02_ARSITEKTUR_DEVOPS.md`. **Baca kedua file itu dulu sebelum mengerjakan task apapun.**

Target: MVP jalan dalam 5 hari kerja (rencana harian di `/docs/04_SPRINT_5_HARI.md`).

---

## 2. Keputusan Teknis yang SUDAH FINAL (jangan diganti tanpa persetujuan eksplisit)

- Framework: **Next.js 15 App Router + TypeScript (strict mode)**
- Styling: **Tailwind CSS + shadcn/ui**
- ORM: **Prisma** → **PostgreSQL via Supabase**
- Auth: **Supabase Auth**
- Storage: **Supabase Storage**
- Payment: **Midtrans Snap** (sandbox dulu, fallback manual transfer)
- WA notifikasi: **Fonnte/Wablas** (MVP) — jangan implement WhatsApp Cloud API resmi dulu, itu Fase 2
- Email: **Resend**
- Hosting: **Vercel**
- Validasi: **Zod** untuk semua input server-side
- Testing: **Playwright** untuk E2E, **Vitest** untuk unit test

Jika suatu task sepertinya butuh library/stack lain, **tanyakan dulu (jangan diam-diam ganti)** — tulis alasan di Artifact/implementation plan sebelum eksekusi.

---

## 3. Struktur Folder Wajib

```
/app                      → Next.js App Router
  /(public)                → landing, katalog, demo tema
  /(booking)                → flow checkout
  /(customer)/dashboard     → dashboard klien (protected)
  /(admin)/admin            → dashboard admin (protected, role-gated)
  /u/[orderSlug]/[guestSlug] → halaman undangan tamu (publik, SSR/ISR)
  /api                      → route handlers (webhook, dsb)
/themes
  /wedding/{theme-key}/index.tsx
  /khitanan/{theme-key}/index.tsx
  registry.ts               → mapping componentKey → komponen
/lib                        → prisma client, zod schemas, payment helper, wa helper
/prisma/schema.prisma
/docs                        → PRD, arsitektur, sprint plan (dokumen referensi, JANGAN dihapus)
/.agents/skills/             → skill packages (lihat §7)
/.agents/workflows/          → slash-command workflows (lihat §8)
```

---

## 4. Standar Kode

- TypeScript strict, **tidak ada `any`** kecuali ada komentar alasan.
- Komponen server-first (React Server Components) — gunakan `"use client"` hanya jika benar-benar butuh interaktivitas.
- Semua form pakai `react-hook-form` + `zod` resolver.
- Semua tema di `/themes/**` harus menerima **props terstandar yang sama** (lihat interface `InvitationData` di `/lib/types.ts`) — ini kontrak penting supaya form booking generik bisa dipakai lintas tema.
- Jangan hardcode teks harga/nama tema di komponen — ambil dari database via props.
- Commit kecil & sering, pesan commit jelas (`feat:`, `fix:`, `chore:` prefix).
- Setiap fitur baru → tulis minimal 1 test (unit atau E2E) sebelum dianggap selesai.

---

## 5. Mode Kerja Multi-Agent (Persona)

Ikuti pola *Antigravity multi-agent pipeline*: pisahkan tanggung jawab per persona agar tiap agent fokus dan mudah di-review lewat Artifacts. Gunakan **Planning Mode** dulu untuk task besar (>1 file), baru **Fast Mode** untuk eksekusi task kecil/berulang.

| Persona | Tanggung jawab | Kapan dipanggil |
|---|---|---|
| **Product Agent** | Menerjemahkan PRD → spesifikasi teknis per fitur (`Technical_Specification.md` sementara di task) | Awal tiap modul baru (misal sebelum mulai modul "Checkout") |
| **UI/UX Designer Agent** | Desain komponen (Tailwind tokens, layout, mobile-first), memastikan konsistensi antar tema | Sebelum implementasi komponen visual |
| **Engineer Agent** | Implementasi kode sesuai spesifikasi & desain yang disetujui | Setelah spec/desain di-approve user |
| **QA Agent** | Menulis & menjalankan test (Playwright/Vitest), cek edge case (nomor WA invalid, upload gagal, dsb) | Setelah Engineer selesai satu fitur |
| **DevOps Agent** | Setup env vars, migration Prisma, deploy Vercel, cek CI hijau | Akhir tiap hari sprint |

Setiap persona **wajib menghasilkan Artifact** (implementation plan / walkthrough / test report) yang bisa direview manusia sebelum lanjut ke persona berikutnya — jangan lompat langsung ke kode untuk task besar tanpa plan yang disetujui.

---

## 6. Guardrails (lihat juga `GUARDRAILS.md`)

- **Jangan** menyimpan API key/secret di kode — selalu via env var (`.env.local`, dan set juga di Vercel dashboard).
- **Jangan** mengubah skema Prisma yang sudah dipakai fitur lain tanpa migration plan (`npx prisma migrate dev --name ...`), dan selalu jalankan `prisma generate` setelahnya.
- **Jangan** render HTML dari string dinamis (theme system harus tetap berbasis komponen React terdaftar — lihat `02_ARSITEKTUR_DEVOPS.md §4`), untuk hindari XSS.
- Jika agent stuck loop (>3 percobaan gagal pada task yang sama): **hentikan, laporkan ke user apa yang gagal**, jangan terus mencoba dengan cara yang sama.
- Setiap perubahan yang menyentuh **pembayaran** (`/api/webhooks/midtrans`, model `Payment`) wajib direview manusia sebelum merge — jangan auto-merge ke `main`.
- Data sensitif tamu (nomor WA, rekening bank) tidak boleh muncul di log/console dalam bentuk plain text.

---

## 7. Contoh Skill (`.agents/skills/invitation-theme/SKILL.md`)

```markdown
---
name: invitation-theme
description: Membuat komponen tema undangan baru (React) yang comply dengan kontrak InvitationData. Gunakan saat diminta "buat tema baru" atau "port tema dari referensi".
---

## Langkah
1. Baca interface `InvitationData` di `/lib/types.ts` — komponen HARUS menerima props ini persis.
2. Buat folder `/themes/{kategori}/{theme-key}/index.tsx`.
3. Wajib render section: cover (nama tamu + countdown), info acara, galeri, lokasi (maps+calendar),
   RSVP form, buku ucapan, amplop digital, audio player.
4. Gunakan Tailwind + tokens dari `/lib/design-tokens.ts` — jangan bikin warna/font baru sembarangan.
5. Mobile-first: test di viewport 375px dulu.
6. Daftarkan `componentKey` baru di `/themes/registry.ts`.
7. Tambahkan seed data dummy di `/prisma/seed.ts` supaya tema muncul di katalog demo.
8. Jalankan Playwright snapshot test untuk halaman demo tema ini.
```

---

## 8. Contoh Workflow (`.agents/workflows/daily-standup.md`)

Slash-command `/daily-standup` yang bisa dipanggil tiap awal sesi kerja untuk agent membaca ulang progres:

```markdown
---
name: daily-standup
description: Ringkas progres kemarin dari git log + cek CI status + tampilkan task sprint hari ini dari 04_SPRINT_5_HARI.md
---
1. Jalankan `git log --oneline -20` dan ringkas apa yang sudah selesai.
2. Cek status GitHub Actions terakhir (lulus/gagal).
3. Baca bagian "Hari ke-N" yang relevan di /docs/04_SPRINT_5_HARI.md sesuai tanggal.
4. Tampilkan daftar task hari ini sebagai checklist, tandai yang sudah ada kode pendukungnya.
```

---

## 9. Definition of Done (per fitur)

Sebuah fitur dianggap selesai jika:
- [ ] Sesuai spesifikasi di PRD (`01_PRD_Momena_Labs.md`)
- [ ] Type-safe, lulus `tsc --noEmit`
- [ ] Lulus lint (`eslint`)
- [ ] Ada minimal 1 test (unit/E2E) dan lulus
- [ ] Responsive & sudah dicek di viewport mobile (375px)
- [ ] Tidak ada secret/console.log data sensitif tersisa
- [ ] Preview deploy Vercel untuk PR ini sudah dicek manual sekali oleh user
