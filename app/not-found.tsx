import Link from "next/link";

export default function NotFound() {
  return (
    <main id="konten" className="error-page">
      <div className="panel text-panel">
        <p className="eyebrow accent">404</p>
        <h1>Halaman tidak tersedia</h1>
        <p className="muted">Alamat ini tidak ditemukan atau tidak tersedia untuk akunmu.</p>
        <Link className="button primary" href="/kelas">Kembali ke kelas</Link>
      </div>
    </main>
  );
}
