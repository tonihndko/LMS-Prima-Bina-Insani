const MESSAGES: Record<string, string> = {
  submitted: "Jawaban berhasil dikirim.",
  graded: "Nilai dan umpan balik tersimpan.",
  material: "Materi berhasil diunggah.",
  assignment: "Latihan baru dibuat.",
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
