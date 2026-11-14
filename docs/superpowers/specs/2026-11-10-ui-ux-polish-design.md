# Desain UI/UX — LMS Prima Bina Insani

Tanggal: 2026-11-10
Status: disetujui

## Latar

UI sudah solid (palet hijau konsisten, skip-link, focus-visible, responsif 800/540px).
Ini penyempurnaan pada empat area yang dipilih pengguna, bukan desain ulang.

Keputusan bersama:
- Fokus: keempat area sekaligus (feedback form, data viz, halaman/navigasi kelas, aksesibilitas/mobile).
- Grafik: SVG inline server-rendered, tanpa dependensi baru.
- Feedback sukses: flag URL (`?ok=...`), bukan toast context.
- Eksekusi di branch baru `feature/ui-ux-polish`.

## Bagian 1 — Feedback form & respons

1. Tombol submit memakai `useFormStatus` (sudah terpakai via `useActionState` di
   `ActionForm`): label berubah "Memproses…" + spinner SVG saat pending.
2. Area pesan (`form-alert`, strip sukses) dibungkus `aria-live="polite"`.
3. Sukses setelah redirect: server action redirect ke path + `?ok=submitted`
   (submitAnswer), `?ok=graded` (gradeSubmission), dst. Halaman membaca
   `searchParams.ok` dan merender strip hijau `role="status"` di atas panel.
   Pesan dipetakan dari nilai flag; flag tak dikenal diabaikan.
4. Empty state lebih ramah: satu kalimat konteks + ikon SVG dokumen kecil.
   Berlaku untuk "Belum ada jawaban yang masuk" dan "Belum ada kelas".

## Bagian 2 — Data viz (SVG inline)

Komponen baru `components/charts.tsx`, server component, tanpa "use client",
tanpa dependensi. Semua grafik `aria-hidden` + teks ringkasan terpisah untuk
screen reader. Tinggi tetap: donut 120px, bar 180px, sparkline 40px.

1. **Donut progres** — persentase penilaian selesai (admin) / progres pribadi
   (ringkasan kelas). SVG circle + stroke-dasharray, warna `--green` di atas
   track `--mist`, angka persentase di tengah.
2. **Bar distribusi nilai** — dasbor admin, histogram 0–100 per 10 poin dari
   semua submission dinilai. Bar `--green`, grid `--line`, label tabular-nums.
   Hanya tampil jika ada ≥1 submission dinilai, selain itu empty state.
3. **Sparkline pengumpulan** — banner kelas (pengajar): jumlah submission per
   hari, 14 hari terakhir.

Sumber data: agregasi dari query yang sudah ada; tidak ada query backend baru
selain `_count` tambahan.

## Bagian 3 — Halaman & navigasi kelas

1. "Kelas saya": baris teks → kartu (judul, deskripsi, pengajar, 2 stat mini:
   latihan, materi) via `_count`.
2. Banner kelas (pengajar): stat X/Y jawaban terkumpul + donut penilaian.
3. `status-new` diberi outline halus agar tak tertukar dengan status dinilai.
4. Breadcrumb semantik (`<nav aria-label="Breadcrumb">`) di halaman dalam
   (detail latihan, materi); eyebrow nama kelas menjadi link.

## Bagian 4 — Aksesibilitas & mobile

1. Target sentuh: pada ≤540px, `.button.compact` min-height 40px + padding lebih.
2. Verifikasi semua input punya `<label>` eksplisit; `aria-live` pada area pesan.
3. Tabel mobile: `.table-wrap` dapat fokus keyboard — `tabIndex={0}`,
   `role="region"`, `aria-label`.
4. `prefers-reduced-motion`: transisi & animasi donut/spinner dimatikan.
5. Sidebar mobile nav: scrollbar tipis + `-webkit-overflow-scrolling`.

## File terdampak

- Baru: `components/charts.tsx` (~100 baris).
- Ubah: `components/action-form.tsx`, `components/status.tsx`,
  `app/actions.ts` (flag redirect), 8 halaman di `app/`.
- `app/globals.css` +~150 baris.

## Batas

- Tidak ada dependensi baru, tidak ada perubahan skema DB atau logika bisnis.
- Admin tetap tidak bisa mengunduh berkas (kebijakan akses tidak disentuh).

## Verifikasi

- `npm run check` lulus.
- `npm run build` lulus.
- Uji manual alur README (admin → pengajar → peserta) dengan fokus pada:
  flag URL tampil sekali, spinner saat submit, grafik muncul dengan data seed,
  ukuran layar 375px dan 768px.
