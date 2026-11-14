# Prima Bina Insani

Aplikasi tugas besar individu untuk memantau pengumpulan latihan dan penilaian. Kelas sintetis memperagakan alur admin, pengajar, dan peserta. [Situs mitra](https://www.primabinainsani.com/).

[PRD keseluruhan versi 2.0](docs/PRD-Prima-Bina-Insani.md) memuat lingkup produk, status implementasi, hak akses, kriteria penerimaan, rencana DS/ML/DL, serta tahap pemenuhan project plan ASAH.

## Menjalankan demo

Siapkan Node.js 22.12+ dan PostgreSQL. Dengan Docker Desktop yang sudah berjalan, gunakan perintah berikut dari folder proyek.

```sh
docker compose up -d --wait database
npm ci
npm run setup
npm run dev
```

Buka [http://127.0.0.1:3030](http://127.0.0.1:3030). Setup membuat konfigurasi lokal, menjalankan migrasi PostgreSQL, dan mengisi data demo. Setup dapat diulang tanpa menimpa jawaban atau nilai yang sudah tersimpan.

Jika menggunakan PostgreSQL lokal yang sudah ada, buat database khusus demo dan isi konfigurasi berikut dalam berkas .env sebelum menjalankan setup.

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:5432/primecaps"
BETTER_AUTH_URL="http://127.0.0.1:3030"
BETTER_AUTH_SECRET="<nilai acak minimal 32 karakter>"
```

Gunakan database demo untuk setup karena perintah tersebut menambahkan akun dan data sintetis. Kata sandi akun demo tersedia pada halaman masuk untuk penggunaan lokal. Daftar lengkap variabel ada di [.env.example](.env.example).

## Akun dan skenario

| Peran | Email |
|---|---|
| Admin | admin@primecaps.test |
| Pengajar | pengajar@primecaps.test |
| Peserta 1 | peserta@primecaps.test |
| Peserta 2 | peserta2@primecaps.test |

Kata sandi akun demo lokal adalah **PrimeCapsDemo2026!**. Nilai ini hanya default lokal; instance yang di-deploy memakai `DEMO_PASSWORD` dan tidak menampilkan akun demo di halaman masuk.

1. Masuk sebagai admin untuk mengelola akun, menugaskan pengajar, menempatkan peserta, dan melihat rekap.
2. Masuk sebagai pengajar. Dari menu Materi, unggah bahan pembelajaran. Dari menu Latihan, buat latihan baru di kelas Dasar Analisis Data.
3. Keluar, lalu masuk sebagai peserta dan buka materi, lalu kumpulkan jawaban teks, berkas, atau keduanya.
4. Masuk kembali sebagai pengajar. Buka latihan, pilih jawaban, lalu simpan nilai dan umpan balik.
5. Masuk sebagai peserta untuk membaca hasil dan melihat perubahan progres.

## Deploy

1. Siapkan PostgreSQL terkelola (misalnya Neon) dan host Node.js.
2. Isi variabel lingkungan di host: `DATABASE_URL`, `BETTER_AUTH_URL` (URL publik aplikasi), `BETTER_AUTH_SECRET`, dan `DEMO_PASSWORD`.
3. Dari komputer lokal dengan `DATABASE_URL` mengarah ke database produksi, jalankan migrasi dan seed sekali:

   ```sh
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

4. Perintah build host: `npm run build` (sudah menjalankan `prisma generate`). Perintah start: `npx next start -p $PORT`.

Unggahan berkas dikirim lewat Server Actions hingga 64 MB per permintaan. Host serverless dengan batas body kecil (misalnya Vercel, sekitar 4,5 MB) akan menolak lampiran besar, jadi pilih host Node.js biasa (misalnya Render) atau turunkan `MAX_FILE_MB` di `lib/file-policy.ts`.

## Materi dan lampiran

Setiap materi dan pengumpulan menerima maksimal 3 berkas dengan ukuran hingga 20 MB per berkas. Format yang diterima meliputi PDF, Word, PowerPoint, Excel, CSV, teks, Markdown, gambar JPG/PNG/WebP/GIF, ZIP, MP3/M4A/WAV, dan MP4.

Berkas demo disimpan di PostgreSQL. Unduhan materi memerlukan akses kelas. Lampiran pekerjaan hanya dapat diunduh oleh peserta pemilik jawaban dan pengajar kelas tersebut.

## Struktur dan pemeriksaan

- **app/** berisi halaman App Router dan Server Actions untuk membuat latihan, mengirim jawaban, dan menilai.
- **lib/** berisi konfigurasi autentikasi, akses basis data, dan pemeriksaan hak kelas.
- **prisma/** berisi skema PostgreSQL, migrasi, dan data awal.
- **components/** berisi komponen tampilan yang dipakai bersama.

Jalankan `npm run check` untuk pemeriksaan TypeScript dan `npm run build` untuk build produksi. `npm run start` menjalankan hasil build pada alamat demo yang sama.

Stack web mengikuti project plan ASAH dengan Next.js, React, dan PostgreSQL. Prisma mengakses basis data dan Better Auth mengelola login serta sesi. Analisis dan pelatihan model berada pada tahap berikutnya. Rencana serving model mengikuti project plan dengan Python dan FastAPI.
