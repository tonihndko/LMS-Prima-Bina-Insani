const MESSAGES: Record<string, string> = {
  submitted: "Jawaban berhasil dikirim.",
  graded: "Nilai dan umpan balik tersimpan.",
  material: "Materi berhasil diunggah.",
  assignment: "Latihan baru dibuat.",
  "assignment-updated": "Latihan diperbarui.",
  "material-updated": "Materi diperbarui.",
  "material-reused": "Materi disalin ke kelas ini.",
  "material-deleted": "Materi dihapus.",
  "assignment-deleted": "Latihan dihapus.",
  completed: "Materi ditandai selesai.",
  uncompleted: "Tanda selesai dibatalkan.",
  followup: "Catatan tindak lanjut tersimpan.",
  prediction: "Prediksi baru tersimpan. Keputusan pengajar tidak berubah.",
  evaluation: "Keputusan kelulusan tersimpan.",
  "followup-done": "Tindak lanjut ditandai selesai.",
  "followup-open": "Tindak lanjut dibuka kembali.",
  account: "Akun berhasil dibuat.",
  renamed: "Nama akun diperbarui.",
  deactivated: "Akun dinonaktifkan.",
  activated: "Akun diaktifkan.",
  course: "Kelas tersimpan.",
  enrolled: "Peserta ditambahkan ke kelas.",
  removed: "Peserta dikeluarkan dari kelas.",
};

export function Flash({ ok }: { ok?: string }) {
  const message = ok ? MESSAGES[ok] : undefined;
  if (!message) return null;
  return <p className="flash" role="status">{message}</p>;
}
