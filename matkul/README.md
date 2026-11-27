# Bahan mata kuliah MBKM

Folder ini berisi tambahan untuk empat mata kuliah MBKM: Pemrograman Lanjut, Machine Learning, Deep Learning, dan Data Science. Isinya **bukan** bagian dari aplikasi dan tidak diimpor oleh kode web maupun API.

## Batas ASAH dan matkul

| | ASAH (milik tim A26-CS015) | Matkul (tambahan individu) |
|---|---|---|
| Isi | Semua fitur di project plan ASAH: web LMS (Next.js + PostgreSQL), API FastAPI dengan model 3 kelas (Lulus, Dipertimbangkan, Tidak Lulus) yang membandingkan Random Forest dan XGBoost, draf laporan Gemini, dan deployment | Bahan yang tidak diminta project plan, misalnya model MLP untuk DL, analisis dan laporan per matkul, dan PRD versi akademik (`docs/PRD-Prima-Bina-Insani.md`) |
| Lokasi | `app/`, `components/`, `lib/`, `prisma/`, `scripts/`, dan folder model/API tim | `matkul/` dan PRD di `docs/` |
| Penilaian | Dinilai Dicoding, dikerjakan bersama tim | Dinilai dosen matkul |

Aturannya sederhana:

1. Bahan matkul boleh **memakai** hasil ASAH (data, model, tangkapan layar aplikasi), tetapi tidak menyalin kode ASAH ke sini. Cukup tulis rujukan ke file aslinya.
2. Kode aplikasi tidak boleh bergantung pada isi `matkul/`.
3. Fitur project plan didahulukan. Bahan matkul dikerjakan setelah semua fitur ASAH selesai.

## Subfolder

- [`pemrograman-lanjut/`](pemrograman-lanjut/README.md)
- [`ml/`](ml/README.md)
- [`dl/`](dl/README.md)
- [`ds/`](ds/README.md)

## Tag sebelum presentasi

Semua bahan tetap di branch `main`. Branch lain dipakai sebentar untuk mengerjakan, lalu digabung lewat PR. Sebelum tiap presentasi, beri tag pada versi yang akan didemokan supaya versinya tersimpan:

```sh
git tag presentasi-ml
git push origin presentasi-ml
```

Nama tag yang disarankan: `presentasi-pemrograman-lanjut`, `presentasi-ml`, `presentasi-dl`, dan `presentasi-ds`.
