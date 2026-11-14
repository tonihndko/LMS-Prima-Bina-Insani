# PRD Prima Bina Insani

Dokumen kebutuhan produk untuk LMS dan analisis pembelajaran

Versi 2.0 • 11 November 2026 • Pemilik dan pengembang individu Toni Handoko

Prima Bina Insani adalah aplikasi web untuk mengelola kelas, membagikan materi, mengumpulkan pekerjaan peserta, dan mencatat penilaian. Pengajar menggunakan rekap progres untuk menentukan tindak lanjut. Pengembangan berikutnya menambahkan analisis data dan eksperimen prediksi sebagai bahan tugas besar Pemrograman Lanjut, Data Sains dan Analisis, Machine Learning, serta Deep Learning.

PRD ini menjadi acuan keseluruhan produk. Dokumen mencatat fitur yang sudah tersedia, kebutuhan yang belum dibangun, kriteria penerimaan, serta urutan pengerjaan. Target individu adalah demo siap pada akhir pekan 13, sebelum presentasi pekan 14–16. Kebutuhan capstone ASAH yang lebih luas tetap dicatat sebagai tahap tersendiri.

**Status dokumen:** acuan kerja versi individu, belum merupakan persetujuan lingkup oleh dosen atau mitra. Status implementasi mengacu pada kode commit `ad3fe66` di repositori [LMS Prima Bina Insani](https://github.com/tonihndko/LMS-Prima-Bina-Insani). PRD ini menggantikan PRD versi 1.0 sebagai acuan terbaru.

## 1 Konteks dan dasar keputusan

Project plan ASAH menjelaskan kebutuhan Prima Bina Insani Profesional, lembaga kursus dan pelatihan keterampilan. Menurut dokumen tersebut, pengajar membagikan video dan berkas latihan melalui WhatsApp, sedangkan pemantauan progres belum terpusat. Masalah ini menjadi dasar studi kasus; penyusunan PRD tidak mencakup wawancara baru dengan mitra. Acuan: project plan, halaman PDF 3–4.

Toni mengerjakan versi tugas kampus secara individu dengan kapasitas 4 jam per hari. Pemrograman Lanjut tidak membatasi tech stack. Ketentuan Deep Learning memperbolehkan proyek aplikasi; rubrik rinci mata kuliah lainnya belum tersedia. Dataset mitra juga belum tersedia menurut klarifikasi Toni, walaupun project plan menyebut dataset awal yang masih memerlukan verifikasi.

Keputusan yang sudah ditetapkan dalam pengembangan:

- Nama tampilan platform adalah **Prima Bina Insani**. Nama folder dan paket `prime-caps` merupakan identitas teknis lama.
- Web menggunakan Next.js dan React, dengan PostgreSQL sebagai basis data, mengikuti stack project plan ASAH.
- Aplikasi memiliki tiga peran: Admin, Pengajar, dan Peserta. Fullstack menjadi urutan pengerjaan pertama.
- Materi dan pekerjaan peserta menerima beberapa format berkas. Navigasi mencakup menu antarhalaman dan tombol panah kembali.
- Python menangani eksperimen DS, ML, dan DL. FastAPI menjadi rencana layanan model ketika inferensi langsung ditambahkan.

Situs mitra yang diberikan Toni adalah [primabinainsani.com](https://www.primabinainsani.com/). Situs tersebut menjadi referensi identitas, bukan spesifikasi integrasi atau bukti bahwa LMS telah terhubung dengan sistem mitra.

## 2 Masalah dan tujuan produk

Pengajar perlu mengetahui siapa yang belum mengumpulkan pekerjaan, pekerjaan mana yang menunggu penilaian, serta hasil belajar setiap peserta. Peserta perlu menemukan materi dan latihan, mengirim pekerjaan dengan bukti penerimaan, lalu membaca nilai dan umpan balik. Admin perlu mengatur akun dan penempatan kelas tanpa mengubah kode aplikasi.

Tujuan rilis individu adalah menyelesaikan alur tersebut dan menghasilkan bukti akademik yang dapat diperiksa. Analisis harus memiliki sumber data dan proses yang dapat diulang. Model ML dan DL harus benar-benar dilatih, dibandingkan, dan dievaluasi; halaman prediksi tidak cukup sebagai bukti pelatihan.

| Ukuran keberhasilan | Target rilis individu | Cara memeriksa |
|---|---|---|
| Alur utama LMS | Admin menyiapkan kelas sampai peserta membaca hasil dapat diselesaikan | Skenario demo tiga peran |
| Hak akses | Seluruh kasus akses terlarang dalam matriks uji ditolak | Uji URL, aksi server, dan unduhan |
| Konsistensi data | Jawaban, nilai, dan rekap cocok pada kasus uji | Pembandingan dengan catatan sumber |
| Reproduksibilitas | Setup aplikasi dan eksperimen berhasil dari dokumentasi | Uji lingkungan bersih |
| Bukti akademik | Empat paket presentasi memiliki artefak yang dapat ditelusuri | Pemetaan pada bagian 14 |
| Kesiapan waktu | Versi demo dibekukan akhir pekan 13 | Daftar penerimaan rilis |

Target di atas adalah kriteria penerimaan, bukan klaim hasil pengukuran. Tidak ada target akurasi yang dijanjikan sebelum audit data. Penghematan waktu pengajar dan dampak pada keberhasilan belajar baru dapat diklaim setelah uji mitra dengan pembanding yang sesuai.

## 3 Tahap rilis dan batas lingkup

Gunakan empat tahap berikut untuk membaca prioritas. **R0** adalah fondasi LMS yang tersedia pada kode acuan. **R1** adalah paket minimum presentasi individu. **R2** adalah peningkatan setelah R1 siap. **R3** adalah pemenuhan lanjutan project plan ASAH untuk uji mitra. Urutan ini menetapkan pekerjaan versi individu dan tidak mengubah kewajiban tim ASAH.

| Area | R0 tersedia | R1 target individu | R2 peningkatan | R3 target ASAH |
|---|---|---|---|---|
| Pembelajaran | Akun, kelas, materi, latihan, jawaban, nilai, rekap | Verifikasi ulang dan panduan demo | Ubah materi dan latihan | Pakai ulang materi dan progres materi |
| Analisis | Rekap hitungan aplikasi | Audit OULAD, EDA, kamus fitur | Ekspor analisis LMS | Analisis data mitra |
| ML | Belum ada | Baseline mayoritas dan Random Forest | XGBoost | Tiga status kelulusan berbasis data layak |
| DL | Belum ada | MLP tanpa dan dengan dropout | Ulangan seed tambahan | Adaptasi hanya bila ada manfaat terukur |
| Integrasi | Backend Next.js dan PostgreSQL | Lab membaca hasil eksperimen | Inferensi FastAPI pada sampel OULAD | Model mitra, tinjauan pengajar, Gemini |
| Operasional | Demo lokal dan repositori | Dokumentasi, bukti uji, rekaman | Uji deployment awal | Aplikasi dan API daring serta feedback mitra |

Fitur wajib ASAH yang masih tertunda meliputi perubahan dan penggunaan ulang materi, definisi progres materi, perbandingan RF dan XGBoost, model tiga kelas, FastAPI, tinjauan hasil evaluasi, Gemini, deployment, serta uji mitra. Rilis R1 tidak boleh dilaporkan sebagai penyelesaian seluruh project plan ASAH.

Pembayaran, penggajian, penerbitan atau verifikasi sertifikat, keputusan kelulusan otomatis, integrasi penuh LMS pemerintah, dan aplikasi mobile native berada di luar lingkup project plan. Registrasi mandiri, chat, video conference, auto-grading, deteksi plagiarisme, dan rekomendasi personal juga tidak masuk paket individu. Dukungan MP4 berarti unggah dan unduh berkas, bukan layanan streaming video.

## 4 Pengguna dan kewenangan

Admin mengelola operasional kelas. Pengajar mengelola pembelajaran pada kelas yang ditugaskan kepadanya. Peserta mengakses kelas tempat ia terdaftar dan pekerjaan miliknya. Toni menyiapkan seed dan eksperimen sebagai pengembang; pengembang bukan peran aplikasi tambahan.

| Tindakan | Admin | Pengajar | Peserta |
|---|---|---|---|
| Buat dan nonaktifkan akun pengajar atau peserta | Ya | Tidak | Tidak |
| Buat kelas dan atur penempatan | Ya | Tidak | Tidak |
| Lihat rekap | Semua kelas | Kelas penugasan | Milik sendiri |
| Unggah materi dan buat latihan | Tidak | Kelas penugasan | Tidak |
| Unduh materi | Tidak pada R0 | Kelas penugasan | Kelas terdaftar |
| Kumpulkan jawaban | Tidak | Tidak | Milik sendiri |
| Unduh pekerjaan | Tidak | Kelas penugasan | Pekerjaan sendiri |
| Simpan nilai dan umpan balik | Tidak | Kelas penugasan | Tidak |
| Buka Lab hasil agregat pada R1 | Baca | Baca | Tidak |
| Konfirmasi evaluasi dan terbitkan laporan pada R3 | Rekap saja | Kelas penugasan | Baca laporan sendiri |

Backend memeriksa sesi, status aktif, peran, keanggotaan, dan kepemilikan pada setiap permintaan terkait. Menyembunyikan menu saja tidak memenuhi kebutuhan ini. Akun nonaktif tidak dapat login atau melanjutkan sesi. Perubahan penugasan dan keanggotaan harus berlaku pada permintaan berikutnya.

## 5 Alur pengguna

### Alur pembelajaran yang tersedia

1. Admin masuk, membuat akun aktif, membuat kelas, memilih pengajar, dan menempatkan peserta.
2. Pengajar membuka kelas, mengunggah materi, lalu membuat latihan berisi judul dan instruksi.
3. Peserta membaca materi dan mengirim jawaban teks, lampiran, atau keduanya. Halaman menampilkan status Sudah dikumpulkan.
4. Pengajar membuka jawaban, mengunduh lampiran bila perlu, lalu menyimpan nilai dan umpan balik.
5. Peserta membaca hasil. Rekap menampilkan pengumpulan dan penilaian yang sesuai dengan data tersimpan.

### Alur Lab pada R1 dan R2

Toni mengolah dataset publik, menyimpan split, melatih model, lalu mengekspor metrik dan grafik. Admin atau pengajar membuka Lab yang menampilkan asal data, populasi, metode, dan hasil. Pada R2, pengguna memilih sampel OULAD yang telah dipseudonimkan untuk inferensi melalui FastAPI. Alur ini tidak menulis nilai, status kelulusan, atau prediksi ke akun peserta LMS.

### Alur evaluasi mitra pada R3

Pengajar memeriksa kesiapan data peserta lalu meminta prediksi model mitra. Pengajar melihat label prediksi, versi model, dan waktu prediksi, kemudian mencatat evaluasi terkonfirmasi. Setelah konfirmasi Lulus, pengajar dapat meminta draf laporan Gemini, memeriksa fakta, mengedit, dan menerbitkannya. Peserta hanya melihat laporan miliknya yang sudah diterbitkan. Pengajar tetap dapat mencatat evaluasi dan menulis laporan manual saat layanan AI gagal.

## 6 Halaman dan navigasi

| Halaman | Pengguna | Isi utama | Status |
|---|---|---|---|
| Masuk | Semua | Email, kata sandi, pesan gagal | Tersedia |
| Dasbor admin | Admin | Ringkasan akun, kelas, dan progres | Tersedia |
| Akun | Admin | Buat, ubah nama, aktifkan atau nonaktifkan | Tersedia |
| Kelas administrasi | Admin | Kelas, penugasan, penempatan | Tersedia |
| Kelas saya dan ringkasan | Pengajar, peserta | Kelas sesuai akses dan hitungan progres | Tersedia |
| Materi dan detail materi | Pengajar, peserta | Daftar, deskripsi, unduhan | Tersedia |
| Latihan dan detail latihan | Pengajar, peserta | Instruksi, status, pengumpulan | Tersedia |
| Pemeriksaan jawaban | Pengajar | Jawaban, lampiran, nilai, umpan balik | Tersedia |
| Lab Prediksi | Admin, pengajar | EDA, metrik, kurva, sumber data | R1 |
| Evaluasi dan laporan | Pengajar, peserta terkait | Prediksi, konfirmasi, laporan terbit | R3 |

Admin menggunakan menu Dasbor, Akun, dan Kelas. Pengajar dan peserta menggunakan Kelas saya, Ringkasan, Materi, dan Latihan. R1 menambahkan tautan Lab sesuai kewenangan. Menu menunjukkan halaman aktif dan tetap dapat digunakan pada layar ponsel.

Tombol panah **Kembali** mengikuti riwayat browser. Jika pengguna membuka tautan detail tanpa riwayat yang dapat dikunjungi, tombol menuju bagian induk, misalnya detail latihan menuju daftar latihan. Pada halaman akar tanpa riwayat maupun induk, tombol tidak harus berpindah. Perilaku kembali mengikuti riwayat, sehingga tujuan sebelumnya dapat berada di luar aplikasi.

## 7 Kebutuhan fungsional LMS

Setiap kebutuhan memiliki ID tetap untuk ditautkan ke implementasi dan bukti uji. Status Tersedia menunjukkan keberadaan pada kode R0, bukan sertifikasi kesiapan produksi.

### FR01 Autentikasi dan sesi

**Tersedia, dipertahankan pada R1.** Pengguna masuk dengan email dan kata sandi lalu diarahkan sesuai peran. Kredensial salah, input kosong, dan akun nonaktif ditolak dengan pesan yang dapat dipahami. Logout mengakhiri sesi; halaman terlindungi kembali membutuhkan login. Uji mencakup permintaan langsung ke endpoint autentikasi.

### FR02 Pengelolaan akun

**Tersedia, dipertahankan pada R1.** Admin membuat akun pengajar atau peserta dengan nama, email unik, peran, dan kata sandi awal. Admin dapat mengganti nama, menonaktifkan, serta mengaktifkan akun. Penonaktifan mencabut sesi. Pengelolaan admin tambahan, perubahan email atau peran, dan reset kata sandi mandiri belum termasuk fungsi yang tersedia.

### FR03 Kelas dan keanggotaan

**Tersedia, dipertahankan pada R1.** Admin membuat kelas, memilih satu pengajar aktif, dan menempatkan peserta aktif. Admin dapat mengganti pengajar serta menambah atau menghapus keanggotaan tanpa membuat keanggotaan ganda. Penghapusan keanggotaan mencabut akses kelas dan lampiran tetapi mempertahankan pekerjaan historis. Rekap keanggotaan aktif harus dibedakan dari riwayat pengumpulan.

### FR04 Materi kelas

**Tersedia, dipertahankan pada R1.** Pengajar mengisi judul maksimal 120 karakter, deskripsi opsional maksimal 4.000 karakter, dan satu hingga tiga berkas. Materi valid muncul pada kelas yang benar. Materi tanpa berkas atau unggahan tidak valid ditolak. Peserta dari kelas lain tidak dapat membuka atau mengunduhnya.

### FR05 Latihan

**Tersedia, dipertahankan pada R1.** Pengajar membuat latihan dengan judul 1–120 karakter dan instruksi 1–4.000 karakter. Peserta kelas dapat melihat latihan sesudah tersimpan. Tenggat, bobot, kuis otomatis, dan lampiran khusus instruksi belum tersedia; pengajar dapat membagikan berkas pendukung melalui Materi.

### FR06 Pengumpulan pekerjaan

**Tersedia, dipertahankan pada R1.** Peserta mengirim teks maksimal 5.000 karakter, satu hingga tiga berkas, atau keduanya. Pengumpulan kosong ditolak. Satu peserta memiliki paling banyak satu jawaban per latihan; pengiriman berulang atau bersamaan tidak membuat duplikat maupun menimpa jawaban pertama. Revisi dan pengumpulan ulang memerlukan rancangan versi tersendiri dan tidak termasuk R1.

### FR07 Penilaian dan umpan balik

**Tersedia, dipertahankan pada R1.** Pengajar kelas memberi nilai bilangan bulat 0–100 dan umpan balik 1–2.000 karakter. Nilai 0 sah. Pengajar dapat memperbarui nilai dan umpan balik; input salah tidak mengubah hasil lama. Peserta melihat hasil pada jawabannya sendiri. Riwayat revisi penilaian belum tersedia.

### FR08 Status dan rekap progres

**Tersedia, dipertahankan pada R1.** Status berasal dari data jawaban dan nilai. Tampilan memuat jumlah latihan, pengumpulan, serta jawaban yang sudah dinilai. Pengajar melihat hitungan per peserta; admin melihat rekap kelas. Membuka atau mengunduh materi belum menghasilkan status materi selesai. Definisi rinci tercantum pada bagian 8.

### FR09 Penyimpanan dan unduhan berkas

**Tersedia, dipertahankan pada R1.** Setiap materi atau jawaban menerima maksimal tiga berkas, masing-masing lebih dari 0 dan maksimal 20 MiB, yaitu 20 × 1.024 × 1.024 byte. UI saat ini menuliskan batas ini sebagai 20 MB. Berkas dan catatan induknya tersimpan bersama; kegagalan validasi tidak meninggalkan pengumpulan kosong.

Format yang diterima: PDF; DOC dan DOCX; PPT dan PPTX; XLS dan XLSX; CSV, TXT, MD; JPG, JPEG, PNG, WebP, GIF; ZIP; MP3, M4A, WAV; serta MP4. Sistem memvalidasi ekstensi, jumlah, ukuran, dan nama berkas. Pemeriksaan isi dan pemindaian malware belum tersedia. Unduhan memerlukan sesi dan otorisasi server, menggunakan respons attachment serta larangan cache publik. Berkas tetap tersedia setelah restart aplikasi.

### FR10 Navigasi dan pesan antarmuka

**Tersedia, dipertahankan pada R1.** Menu mengikuti peran, memiliki penanda aktif, dan menyediakan panah kembali. Halaman kosong menjelaskan belum adanya kelas, materi, atau jawaban. Form menampilkan kegagalan tanpa mengesankan data sudah tersimpan. Pengujian penerimaan mencakup layar 390 piksel dan navigasi dengan keyboard.

### FR11 Perubahan dan penggunaan ulang bahan belajar

**Belum tersedia, R2 dan R3.** Pengajar dapat mengubah materi dan instruksi kelasnya. Setelah jawaban masuk, perubahan latihan harus menyimpan versi instruksi agar konteks penilaian dapat ditelusuri. Penggunaan ulang materi ke kelas lain hanya diperbolehkan jika pengajar berwenang pada kedua kelas. Salinan memiliki hubungan sumber yang tercatat; perubahan salinan tidak mengubah sumber.

### FR12 Progres materi dan tindak lanjut

**Belum tersedia, R3.** Pengajar dan mitra menetapkan bukti penyelesaian materi sebelum fitur dibangun. Rancangan awal menggunakan konfirmasi peserta dengan penanda bahwa penyelesaian bersifat pengakuan mandiri. Unduhan saja tidak membuktikan penguasaan. Pengajar dapat mencatat tindak lanjut beserta peserta, alasan, status, dan waktu; catatan hanya terlihat sesuai kewenangan.

## 8 Aturan bisnis dan kondisi khusus

| Kondisi | Status atau perilaku yang diwajibkan |
|---|---|
| Jawaban belum ada | Belum dikumpulkan |
| Jawaban ada dan score bernilai null | Sudah dikumpulkan |
| Jawaban ada dan score 0–100 | Sudah dinilai |
| Belum ada latihan | Hitungan 0 dan pesan kosong; tidak membagi dengan nol |
| Peserta dikeluarkan dari kelas | Akses dicabut; jawaban historis tetap ada |
| Pengajar kelas diganti | Pengajar baru memperoleh akses, pengajar lama kehilangan akses |
| Akun dinonaktifkan | Login ditolak dan sesi dicabut |
| Data atau layanan model belum siap | Tampilkan belum tersedia; alur LMS tetap dapat digunakan |

Untuk peserta, rekap pengumpulan adalah jumlah jawabannya pada latihan kelas. Rekap penilaian menghitung jawaban dengan nilai bukan null. Baris progres membandingkan kedua hitungan dengan jumlah latihan. Untuk pengajar, kartu ringkasan saat ini menghitung seluruh jawaban tersimpan pada latihan kelas, termasuk riwayat peserta yang sudah dikeluarkan; daftar peserta mengikuti keanggotaan terkini. Perbedaan cakupan ini perlu dijelaskan dalam panduan.

R1 tidak memerlukan persentase kelulusan atau rata-rata kelas baru. Jika persentase pengumpulan ditambahkan, pembaginya adalah latihan yang berlaku untuk peserta; kelas tanpa latihan menampilkan tanda belum tersedia. Jangan menggunakan jumlah pengumpulan sebagai ukuran pemahaman atau nilai akhir kursus.

Nilai latihan, prediksi model, dan evaluasi terkonfirmasi adalah tiga data berbeda. Prediksi tidak mengubah nilai. Label risiko dari Lab tidak boleh diubah namanya menjadi Lulus atau Tidak Lulus. Keputusan kelulusan mitra tetap berada pada pihak yang berwenang.

## 9 Kebutuhan Data Sains dan Analisis

### DS01 Sumber dan batas data

**Belum tersedia, R1.** Gunakan OULAD untuk eksperimen. Dokumentasi resmi menyediakan tabel hasil peserta, registrasi, dan interaksi VLE yang saling terhubung. Dataset berlisensi CC BY 4.0. Catat atribusi Kuzilek, Hlosta, dan Zdrahal, versi unduhan, checksum, serta tanggal pengambilan. Referensi: [dokumentasi OULAD](https://research.stem.open.ac.uk/ouanalyse/open-dataset-more/).

Data akun dan kelas demo tetap sintetis. OULAD bukan data peserta Prima Bina Insani. Dataset mitra menjadi sumber ketiga jika kelak tersedia dengan izin dan definisi label yang jelas. Simpan sumber data pada metadata setiap hasil analisis dan model.

### DS02 Populasi dan pertanyaan eksperimen

Pertanyaan R1: dapatkah aktivitas hari 0–27 memperkirakan hasil akhir gagal atau mengundurkan diri pada peserta yang masih terdaftar pada awal hari ke-28?

Pilih satu kombinasi modul dan angkatan setelah memeriksa jumlah peserta dan dukungan kedua kelas, sebelum melihat kinerja model. Satu baris mewakili satu peserta pada kombinasi tersebut. Masukkan registrasi sebelum hari ke-28 dengan tanggal pengunduran diri kosong atau setidaknya hari ke-28. Karena sumber menggunakan resolusi harian, dokumentasikan konvensi batas hari tersebut. Baris dengan tanggal registrasi tidak diketahui dikeluarkan dari eksperimen utama dan jumlahnya dilaporkan.

Target rancangan: Pass dan Distinction menjadi kelas 0; Fail dan kategori pengunduran diri menjadi kelas 1. Periksa ejaan kategori dalam CSV sebelum implementasi, karena dokumentasi dan berkas dapat menggunakan istilah Withdrawn atau Withdrawal. Simpan label asli. Kelas 0 disebut Prediksi hasil berhasil dan kelas 1 Prediksi hasil berisiko; keduanya tidak menjamin hasil individu.

### DS03 Tabel fitur dan kualitas data

Tujuh fitur berikut merupakan rancangan proyek. Fitur hanya menggunakan kejadian sebelum hari ke-28. Join berawal dari daftar peserta agar peserta tanpa log tidak hilang.

| Fitur | Perhitungan | Ketentuan |
|---|---|---|
| clicks_week_1 sampai clicks_week_4 | Jumlah interaksi hari 0–6, 7–13, 14–20, 21–27 | Empat kolom, angka nonnegatif |
| active_days | Jumlah hari berbeda dengan interaksi positif | 0–28 |
| days_since_last_activity | 28 dikurangi hari aktivitas terakhir | 1–28; gunakan 28 jika tanpa log |
| no_activity | Penanda tidak ada interaksi positif pada jendela | 0 atau 1; membedakan nilai penanda |

ID peserta menjadi kunci, bukan fitur. Hasil akhir, aktivitas mulai hari ke-28, dan tanggal pengunduran diri masa depan tidak menjadi masukan model. Audit harus mencatat kunci ganda, nilai kosong, nilai di luar aturan, jumlah sebelum dan sesudah filter, serta alasan pengeluaran baris. Nol berarti tidak ada interaksi tercatat pada jendela, bukan bukti peserta tidak belajar di luar platform.

### DS04 Analisis dan artefak

Sediakan kamus data, laporan mutu data, distribusi target, distribusi aktivitas, pola empat minggu, dan proporsi peserta tanpa log. Analisis yang memengaruhi pemilihan fitur memakai bagian pengembangan. Set uji disimpan untuk evaluasi akhir. Setiap grafik menyebutkan populasi dan jumlah sampel; interpretasi membahas hubungan yang terlihat beserta keterbatasannya.

Kriteria penerimaan: skrip menghasilkan ulang tabel fitur dan grafik; total peserta dapat ditelusuri dari sumber ke hasil filter; seluruh fitur memiliki definisi dan unit; tabel tidak memuat fitur setelah batas observasi. Satu kesimpulan analitis harus menunjuk grafik atau perhitungan pendukung. Data baru diunduh pada tahap pelaksanaan; dokumen ini tidak menyatakan audit telah selesai.

## 10 Kebutuhan Machine Learning dan Deep Learning

### EXP01 Protokol pembandingan

**Belum tersedia, R1.** Gunakan peserta, fitur dasar, dan pembagian yang sama untuk seluruh model. Rencana awal adalah stratifikasi 70 persen latih, 15 persen validasi, dan 15 persen uji. Simpan daftar ID dan seed. Periksa tidak ada peserta lintas split. Jika kelas terlalu kecil, ubah populasi atau strategi evaluasi sebelum pelatihan; jika memakai beberapa angkatan, lakukan pemisahan yang mempertimbangkan peserta dan waktu.

Fit imputasi atau skala menggunakan data latih, lalu terapkan transformasi tersimpan pada validasi dan uji. Pemilihan konfigurasi dan threshold menggunakan validasi. Setelah konfigurasi dibekukan, jalankan evaluasi uji untuk model pembanding yang telah ditetapkan. Prinsip ini mengikuti [panduan pencegahan kebocoran data scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html).

### ML01 Model klasik

Latih DummyClassifier dengan strategi mayoritas sebagai baseline dan Random Forest sebagai model utama. Batasi pencarian RF pada paling banyak enam konfigurasi awal yang tercatat. XGBoost adalah pembanding R2 dan tetap wajib jika target beralih ke pemenuhan lengkap ASAH. Jika bobot kelas dipakai, hitung dari data latih dan catat pengaruhnya.

Gunakan Macro-F1 sebagai metrik utama pembandingan; laporkan precision, recall, F1, support per kelas, confusion matrix, dan accuracy sebagai pelengkap. Catat threshold serta jelaskan contoh false positive dan false negative. Pilih model demonstrasi berdasarkan validasi. Hasil yang kalah dari baseline tetap dilaporkan dan tidak diganti dengan angka contoh.

### DL01 Eksperimen jaringan saraf

Gunakan Keras dengan backend TensorFlow yang versinya dikunci saat implementasi. Arsitektur awal: input tujuh fitur, Dense 32 ReLU, Dense 16 ReLU, output satu sigmoid. Varian pembanding menambahkan dropout 0,2 setelah Dense 32. Kedua varian menggunakan split, transformasi, optimizer, dan batas pelatihan yang sama.

Konfigurasi awal yang diusulkan: binary cross-entropy, Adam dengan learning rate 0,001, batch size 32, maksimal 100 epoch, dan early stopping berdasarkan validation loss dengan patience 10 serta pemulihan bobot terbaik. Konfigurasi merupakan titik awal, bukan hasil tuning. Perilaku early stopping mengacu pada [dokumentasi Keras](https://keras.io/api/callbacks/early_stopping/).

Simpan arsitektur, jumlah parameter, konfigurasi, seed, kurva training dan validation loss, checkpoint terbaik, serta metrik. Penerimaan R1 membutuhkan sedikitnya satu run reproducible untuk masing-masing varian dengan seed yang dicatat. Kesimpulan hanya berlaku pada run tersebut; R2 menambah sedikitnya tiga seed untuk menilai variasi. DL tidak harus mengungguli RF. Pembahasan menjelaskan hasil aktual dropout dan tanda overfitting yang terlihat.

### EXP02 Pencatatan hasil

Setiap eksperimen menyimpan run_id, dataset_version, feature_schema_version, split_version, konfigurasi, versi dependensi, waktu pelatihan, serta keluaran evaluasi. Simpan prediksi per sampel berpseudonim untuk analisis kesalahan. Pembanding memakai definisi metrik yang sama. Catat batas reproduksibilitas perangkat keras ketika hasil floating point berbeda kecil.

Kriteria selesai akademik adalah eksperimen sah dan dapat diperiksa. Pemakaian model pada peserta mitra membutuhkan evaluasi data mitra dan kriteria operasional terpisah; nilai bagus pada OULAD belum memenuhi syarat tersebut.

## 11 Integrasi hasil dan layanan model

### LAB01 Hasil eksperimen dalam aplikasi

**Belum tersedia, R1.** Halaman Lab membaca artefak JSON dan grafik yang diekspor dari eksperimen. Halaman memuat pertanyaan, asal data, populasi, ukuran split, daftar fitur, metrik model, confusion matrix, kurva MLP, serta batas penerapan. Hasil kosong atau berkas rusak menampilkan Belum tersedia. Angka dan grafik tidak boleh dibuat sebagai simulasi tanpa label.

Kontrak minimum hasil ekspor memuat `schema_version`, `run_id`, `dataset`, `cohort`, `observation_window`, `target_mapping`, `sample_counts`, `split_version`, `models`, `figures`, dan `generated_at`. Setiap model menyimpan konfigurasi dan metrik validasi atau uji dengan penanda split. Kriteria penerimaan: angka pada halaman cocok dengan artefak dan tidak memicu pelatihan saat halaman dibuka.

### INT01 Inferensi langsung

**Belum tersedia, R2.** Browser meminta inferensi kepada backend Next.js. Backend memeriksa sesi dan peran, lalu mengirim fitur yang valid ke FastAPI. FastAPI memuat model beserta preprocessing sekali pada startup. Browser tidak memperoleh kredensial layanan dan tidak mengakses database atau layanan model secara langsung.

Kontrak API yang diusulkan adalah `POST /v1/predict`. Request berisi `feature_schema_version` dan tujuh fitur numerik; metadata sampel hanya untuk penelusuran. Response berisi `request_id`, `model_version`, `dataset_domain`, `predicted_class`, `score`, `threshold`, dan `generated_at`. Skor harus disertai maknanya; jangan menyebutnya keyakinan terkalibrasi tanpa evaluasi kalibrasi. Endpoint kesehatan terpisah menginformasikan kesiapan artefak.

Input tidak valid menghasilkan 422, kredensial salah 401 atau 403, artefak belum siap 503. Backend menetapkan timeout awal 10 detik dan menampilkan pesan gagal tanpa mengganti hasil dengan prediksi palsu. Uji memastikan keluaran API sama dengan inferensi skrip untuk input dan model yang sama. Nama endpoint dan kode respons pada bagian ini adalah kontrak rencana, belum endpoint aplikasi yang tersedia.

### INT02 Jembatan menuju data mitra

LMS saat ini menyimpan pengumpulan dan nilai tetapi belum memiliki clickstream harian yang sepadan dengan fitur OULAD. Jumlah pengumpulan tidak boleh langsung menggantikan jumlah klik. Sebelum prediksi peserta mitra, tentukan fitur yang relevan, tambahkan pencatatan aktivitas yang diperlukan, kumpulkan data berizin, lalu validasi ulang.

Model risiko biner pada Lab dan klasifikasi kelulusan tiga kelas ASAH memiliki target berbeda. Model mitra memerlukan definisi Lulus, Dipertimbangkan, dan Tidak Lulus, waktu penggunaan, serta label dari evaluasi pengajar. Jika label hanya mengikuti ambang nilai, aturan ambang harus menjadi baseline. Jangan membentuk kelas Dipertimbangkan dari rentang skor OULAD tanpa validasi makna label.

## 12 Evaluasi dan laporan hasil belajar ASAH

### AI01 Prediksi dan konfirmasi

**Belum tersedia, R3.** Tampilkan prediksi tiga kelas dari model yang telah lolos pemeriksaan data. Simpan snapshot fitur, versi model, label, serta waktu. Pengajar menyimpan status evaluasi terkonfirmasi dan alasan secara terpisah. Pengajar boleh berbeda dari prediksi. Pengujian harus membuktikan perubahan prediksi tidak menimpa evaluasi yang sudah dikonfirmasi.

### AI02 Draf laporan Gemini

**Belum tersedia, R3.** Tombol membuat draf hanya aktif setelah pengajar mengonfirmasi Lulus. Backend memeriksa syarat yang sama pada setiap permintaan. Kirim data minimum materi, nilai, dan catatan pengajar tanpa lampiran mentah atau identitas yang tidak dibutuhkan. Kunci API tersimpan di server. Teks sumber diperlakukan sebagai data dan tidak boleh mengubah aturan penyusunan laporan.

Draf merangkum fakta yang tersedia dan menandai informasi kosong. Pengajar memeriksa, mengedit, lalu menerbitkan laporan. Peserta tidak melihat draf. Simpan versi sumber, pengajar peninjau, dan waktu penerbitan. Jika evaluasi Lulus dicabut atau sumber hasil belajar berubah, laporan perlu ditinjau ulang sebelum tampil sebagai laporan terkini.

Kriteria penerimaan mencakup prediksi Lulus yang belum dikonfirmasi, akses oleh pengajar lain, perubahan nilai, timeout, kuota habis, dan respons kosong. Gangguan Gemini tidak menghapus draf yang sudah diedit atau menghambat penilaian. Laporan manual dapat menjadi cadangan operasional dengan asal pembuatannya tercatat. Draf saran pendampingan generatif menjadi tambahan setelah kebutuhan wajib ASAH selesai.

## 13 Arsitektur dan model data

### Susunan sistem

Browser mengakses UI Next.js berbasis React. Server Components dan Server Actions menangani pembacaan serta perubahan data melalui pemeriksaan akses. Prisma menghubungkan backend dengan PostgreSQL; Better Auth menangani autentikasi dan sesi. Route unduhan memeriksa kepemilikan sebelum membaca isi berkas. Stack ini sudah digunakan pada R0.

Python, pandas, scikit-learn, Keras, serta TensorFlow berada pada lingkungan eksperimen terpisah yang direncanakan. Ekspor hasil menjadi jembatan pertama ke Next.js. FastAPI ditambahkan untuk inferensi dan Gemini dipanggil dari server pada tahap ASAH. Next.js tetap menjadi framework fullstack web; pelatihan Python tidak dipindahkan ke browser atau dijalankan ulang pada setiap request.

| Entitas saat ini | Data dan relasi penting |
|---|---|
| User | Email unik, nama, peran, status aktif |
| Session, Account, Verification | Identitas autentikasi, sesi, dan data pendukung Better Auth |
| Course | Judul, deskripsi, satu pengajar |
| Enrollment | Pasangan unik kelas dan peserta |
| Material | Kelas, judul, deskripsi, waktu pembuatan |
| Assignment | Kelas, judul, instruksi, waktu pembuatan |
| Submission | Latihan, peserta, jawaban, waktu, nilai, umpan balik; pasangan latihan dan peserta unik |
| Attachment | Nama, ukuran, isi Bytes; tepat satu induk materi atau jawaban |

Relasi utama: User pengajar memiliki Course; User peserta mengikuti Course melalui Enrollment. Course memiliki Material dan Assignment. Assignment memiliki Submission milik peserta. Material dan Submission memiliki Attachment. Constraint basis data melengkapi validasi aplikasi, termasuk batas nilai dan hubungan lampiran.

Rencana tambahan R3 meliputi MaterialProgress, LearningEvent, Evaluation, Prediction, LearningReport, dan AuditEvent. Enrollment perlu waktu mulai atau akhir jika analisis riwayat keanggotaan dibutuhkan. Submission perlu riwayat penilaian bila perubahan nilai harus diaudit. Nama entitas ini adalah rancangan dan belum terdapat dalam skema R0.

Berkas R0 tersimpan sebagai Bytes di PostgreSQL untuk menyederhanakan demo dan persistensi. Sebelum penggunaan mitra, ukur kapasitas dan biaya backup. Object storage privat dapat dipilih bila volume meningkat; PostgreSQL kemudian menyimpan metadata dan object key. Pilihan tersebut belum ditetapkan dan tidak mengubah PostgreSQL sebagai basis data utama.

### Struktur pengembangan yang direncanakan

Aplikasi tetap di direktori akar repositori dengan `app/`, `components/`, `lib/`, dan `prisma/`. Tambahkan `docs/` untuk PRD dan panduan, `experiments/` untuk skrip atau notebook, `artifacts/` untuk hasil ringkas, serta `services/model-api/` jika R2 dibangun. Dataset mentah besar, kredensial, dump database, dan lampiran pengguna tidak masuk Git. README mencantumkan cara memperoleh dataset dan menjalankan pipeline.

## 14 Bukti untuk empat mata kuliah

| Mata kuliah | Fokus pembahasan | Artefak minimum | Acuan kebutuhan |
|---|---|---|---|
| Pemrograman Lanjut | Pemisahan tanggung jawab, tipe data, validasi, relasi, transaksi, dan otorisasi | Demo tiga peran, diagram data, alur form ke database, kasus akses terlarang dan input batas | FR01–FR10 |
| Data Sains dan Analisis | Sumber, pembersihan, pemilihan populasi, visualisasi, interpretasi | Kamus data, audit, tabel fitur, notebook EDA, grafik dan keterbatasan | DS01–DS04 |
| Machine Learning | Baseline, pembagian data, pemilihan model, evaluasi dan kesalahan | Konfigurasi RF, metrik, confusion matrix, contoh salah prediksi, model dan preprocessing | EXP01–EXP02, ML01 |
| Deep Learning | Representasi input, jaringan, loss, optimisasi, regularisasi | Arsitektur MLP, perhitungan parameter, dua varian terlatih, kurva dan pembahasan | DL01, EXP01–EXP02 |

Gunakan satu konteks masalah dan repositori, lalu buat empat versi presentasi sesuai fokus dosen. Tunjukkan kontribusi individu melalui perubahan kode, catatan eksperimen, dan penjelasan keputusan. Integrasi Gemini tidak menggantikan bukti melatih jaringan saraf untuk Deep Learning.

Pemetaan ini adalah rencana bukti, bukan jaminan pengakuan nilai. Ketika RPS atau rubrik tersedia, cocokkan kebutuhan dosen dengan artefak yang sudah ada. Jika dosen Pemrograman Lanjut mewajibkan konsep tertentu, tambahkan demonstrasi yang relevan tanpa mengganti stack secara otomatis.

## 15 Kebutuhan nonfungsional

| ID | Target | Kriteria penerimaan |
|---|---|---|
| NFR01 Akses | Otorisasi server pada halaman, aksi, dan unduhan | Kasus lintas peserta, kelas, dan peran ditolak |
| NFR02 Integritas | Tidak ada duplikasi jawaban atau nilai tidak valid | Uji pengiriman ganda, nilai 0 dan 100, serta input di luar rentang |
| NFR03 Ketahanan | LMS tetap berfungsi saat layanan model atau Gemini gagal | Penilaian dapat disimpan; pesan gagal layanan jelas |
| NFR04 Responsivitas | Alur utama dapat digunakan pada lebar 390 dan 1.366 piksel | Form, menu, tabel, dan tombol tetap terjangkau |
| NFR05 Kinerja | Target awal halaman inti paling lama 3 detik pada demo hangat | Ukur di mesin demo dengan dataset seed; unggah berkas diukur terpisah |
| NFR06 Reproduksibilitas | Setup, migrasi, seed, dan eksperimen terdokumentasi | Jalankan dari checkout bersih dengan dependensi terkunci |
| NFR07 Persistensi | Data dan lampiran bertahan setelah restart | Kirim, nilai, restart, lalu baca ulang |
| NFR08 Kejelasan | Label sumber data, status, dan kegagalan dapat dipahami | Tidak ada skor simulasi yang ditampilkan sebagai hasil model |

Angka kinerja adalah usulan target pengujian, belum hasil benchmark. Sebelum R3, tambahkan uji beban sesuai jumlah pengguna mitra, HTTPS, backup dan uji pemulihan, batas kapasitas unggahan, pemantauan error, serta konfigurasi akun produksi. Akun demo dan kata sandi yang dipublikasikan untuk demo lokal tidak digunakan pada layanan mitra.

Log operasional tidak menyimpan kata sandi, token, atau isi pekerjaan. Catat ID permintaan dan jenis kegagalan seperlunya. Retensi data nyata, siapa yang boleh mengekspor, serta prosedur penghapusan ditetapkan bersama mitra sebelum pilot. Data publik yang masuk Lab tetap tidak boleh digabung dengan identitas akun peserta LMS.

## 16 Rencana pengujian dan penerimaan rilis

| Kasus | Skenario utama | Bukti yang diharapkan |
|---|---|---|
| UAT01 | Login sah, salah, nonaktif, logout | Akses sesuai status akun |
| UAT02 | Admin buat akun, kelas, penugasan, dan keanggotaan | Data tersimpan dan akses mengikuti perubahan |
| UAT03 | Pengajar unggah materi beberapa format | Peserta kelas dapat mengunduh isi yang sama |
| UAT04 | Jawaban teks saja, berkas saja, gabungan, dan kosong | Tiga bentuk valid diterima; kosong ditolak |
| UAT05 | Kirim dua kali termasuk permintaan bersamaan | Tetap satu Submission |
| UAT06 | Nilai 0, 100, di luar rentang, pecahan, dan umpan balik kosong | Hanya nilai bulat sah dan umpan balik valid tersimpan |
| UAT07 | Akses pekerjaan peserta lain atau kelas lain | Halaman, aksi, dan unduhan ditolak |
| UAT08 | Ubah pengajar, keluarkan peserta, nonaktifkan akun | Akses lama dicabut dan histori tetap tersimpan |
| UAT09 | Kembali dari detail dan masuk lewat tautan langsung | Riwayat atau halaman induk benar |
| UAT10 | Berkas terlalu besar, kosong, format salah, lebih dari tiga | Tolak tanpa membuat data parsial |
| UAT11 | Periksa rekap dan restart aplikasi | Hitungan sesuai sumber dan data tetap tersedia |
| UAT12 | Periksa data, split, dan fitur eksperimen | Tidak ada kebocoran peserta atau waktu |
| UAT13 | Bandingkan artefak dengan Lab | Angka, model, dan split konsisten |
| UAT14 | FastAPI gagal atau input tidak valid pada R2 | Kesalahan jelas dan LMS tetap berjalan |
| UAT15 | Prediksi Lulus belum dikonfirmasi pada R3 | Pembuatan laporan ditolak |
| UAT16 | Terbitkan laporan lalu akses sebagai peserta lain pada R3 | Hanya pemilik melihat laporan terbit |

Catatan implementasi sebelumnya mencakup uji browser alur LMS, admin, unggahan, navigasi kembali, serta pemeriksaan TypeScript dan build. Penyusunan PRD ini hanya memeriksa kode dan dokumentasi; tidak menjalankan ulang seluruh pengujian tersebut. Saat rilis R1, rekam hasil aktual per kasus beserta commit, lingkungan, waktu, dan bukti agar klaim kesiapan mengacu pada versi yang benar.

R1 dapat dibekukan jika FR01–FR10 lulus pada build target; DS01–DS04, ML01, DL01, EXP01–EXP02, dan LAB01 memiliki keluaran nyata; README dapat diikuti; serta empat versi slide dan rekaman cadangan siap. Tidak boleh ada masalah akses data, kehilangan jawaban, nilai salah, atau crash yang menghambat demo. Uji mitra dan seluruh kebutuhan R3 memiliki daftar penerimaan terpisah.

## 17 Jadwal dan urutan pekerjaan

Pekan mengacu pada informasi semester dari Toni, bukan konversi otomatis dari tanggal dokumen. Satu pekan penuh menyediakan maksimum 28 jam pada 4 jam per hari. Rencanakan 20 jam pekerjaan inti dan 8 jam untuk belajar, revisi, serta hambatan. Pekan 9 yang tersisa disesuaikan dengan hari aktual.

| Pekan | Pekerjaan utama | Hasil yang harus tersedia |
|---|---|---|
| 9 | Catat fondasi fullstack yang sudah ada; ambil dan audit dataset | Inventaris R0, sumber data, populasi dan target |
| 10 | Bentuk fitur dan split; EDA; cek ulang LMS | Pipeline data, grafik awal, skenario demo stabil |
| 11 | Latih baseline, RF, dan dua varian MLP | Hasil validasi, kurva, konfigurasi tersimpan |
| 12 | Bekukan eksperimen; evaluasi uji; bangun Lab | Artefak akhir dan tampilan Lab sesuai hasil |
| 13 | Uji penerimaan, dokumentasi, slide, rekaman | Rilis R1 siap dipresentasikan |
| 14–16 | Presentasi mengikuti jadwal kampus | Demo dari versi beku dan catatan masukan |

Toni bertanggung jawab atas pekerjaan versi individu. Nama anggota tim pada project plan tetap menjadi pembagian tim ASAH dan tidak dipindahkan ke rencana kerja solo ini. Waktu R3 belum dijanjikan; tahap tersebut bergantung pada data, rubrik mitra, infrastruktur, dan kesepakatan tim.

Jika waktu menyempit, tunda inferensi FastAPI, XGBoost, ulangan seed tambahan, serta penyempurnaan visual. Pertahankan alur LMS, audit dan EDA, baseline dan RF, dua varian MLP, serta bukti evaluasi. Bila Lab mengalami kendala, hasil ekspor dan notebook menjadi cadangan presentasi; status LAB01 tetap belum selesai sampai halaman memenuhi kriteria.

## 18 Risiko dan keputusan yang masih terbuka

| Risiko atau keputusan | Dampak | Tindakan dan pemilik |
|---|---|---|
| Dataset mitra belum tersedia | Model operasional belum dapat divalidasi | Toni memakai OULAD untuk R1; mitra menentukan akses data untuk R3 |
| Populasi publik kecil atau timpang | Evaluasi tidak stabil | Audit sebelum model; dokumentasikan perubahan populasi dan split |
| Perbedaan target biner dan tiga kelas | Hasil Lab dapat disalahartikan | Tampilkan sumber, target, dan batas pemakaian pada Lab |
| Rubrik dosen belum lengkap | Bukti belum cocok dengan penilaian | Toni mencocokkan artefak ketika rubrik tersedia |
| Lingkup melampaui waktu solo | Demo inti terlambat | Bekukan R1; kerjakan R2 setelah penerimaan inti |
| Hosting membatasi request unggahan | Berkas valid lokal gagal daring | Verifikasi batas platform dan strategi storage sebelum R3 |
| Gemini gagal atau mengarang fakta | Laporan tidak dapat dipercaya | Wajibkan pemeriksaan pengajar dan sediakan penulisan manual |
| Dataset atau versi eksperimen berubah | Perbandingan tidak sah | Kunci checksum, split, konfigurasi, dan versi hasil |

Keputusan yang perlu ditetapkan sebelum R3 adalah rubrik tiga status dan sumber label; bukti materi selesai; kebutuhan akses admin terhadap berkas; izin dan retensi data nyata; penyimpanan berkas; penyedia PostgreSQL, FastAPI, serta web; dan kriteria penerimaan mitra. Project plan menyebut Blitz Cloud untuk web, tetapi kesesuaian runtime, koneksi, kapasitas, serta biaya belum diverifikasi dalam pekerjaan ini.

## 19 Sumber dan pengendalian perubahan

Sumber utama adalah dokumen pengguna **Salinan dari [Asah 2026] Project Plan - Prime Caps.pdf**. Rujukan halaman memakai nomor halaman PDF: konteks dan lingkup pada 3–10, teknologi pada 13–16, risiko pada 17–19, dan pengujian pada 20–26. Dokumen tersebut menjadi bahan kebutuhan; instruksi pembagian kerja tim di dalamnya tidak menggantikan permintaan Toni untuk versi individu.

Status fitur berasal dari README, `package.json`, `prisma/schema.prisma`, Server Actions, pemeriksaan akses, route berkas, dan komponen navigasi pada commit [ad3fe66](https://github.com/tonihndko/LMS-Prima-Bina-Insani/commit/ad3fe66ec7d43f960b3ea014a10d705c7615f01c). Dokumen rencana dan PRD 1.0 menjadi riwayat keputusan. Versi 2.0 memperluas kebutuhan, menambahkan status implementasi, dan menjelaskan batas R1 terhadap target ASAH.

Referensi teknis digunakan pada bagian terkait: dokumentasi resmi OULAD untuk sumber dan struktur data, scikit-learn untuk pemisahan data dan preprocessing, serta Keras untuk early stopping. Konfigurasi eksperimen, ukuran rilis, serta kontrak API dalam PRD merupakan keputusan rancangan proyek dan perlu diuji saat implementasi.

Setiap perubahan lingkup berikutnya mencatat tanggal, alasan, ID kebutuhan yang berubah, serta pengaruhnya pada jadwal dan bukti mata kuliah. Gunakan versi PRD yang sama dengan commit rilis saat presentasi agar penjelasan fitur dan hasil dapat ditelusuri.
