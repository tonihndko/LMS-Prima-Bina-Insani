import { redirect } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { Brand } from "@/components/brand";
import { getViewer } from "@/lib/access";
import { demoAccounts } from "@/lib/demo";
import { PLATFORM_NAME } from "@/lib/brand";
import { login } from "@/app/actions";

export const metadata = { title: "Masuk" };

export default async function LoginPage() {
  if (await getViewer()) redirect("/");

  return (
    <main id="konten" className="login-layout">
      <section className="login-art" aria-label={"Tentang " + PLATFORM_NAME}>
        <Brand href="/masuk" />
        <div className="login-story">
          <p className="eyebrow">Kelas dan progres</p>
          <h1>Latihan kelas,<br /> dalam satu ruang.</h1>
          <p>Buka latihan, kumpulkan jawaban, dan pantau hasil belajar.</p>
          <div className="story-track" aria-hidden="true">
            <span><b>01</b> Latihan</span><span><b>02</b> Jawaban</span><span><b>03</b> Penilaian</span>
          </div>
        </div>
        <p className="login-caption">{PLATFORM_NAME.toUpperCase()} / RUANG KELAS DEMO</p>
      </section>
      <section className="login-body">
        <div className="login-card">
          <p className="eyebrow accent">Akun kelas</p>
          <h2>Masuk ke kelas</h2>
          <p className="muted">Gunakan akun admin, pengajar, atau peserta.</p>
          <ActionForm action={login} label="Masuk">
            <label htmlFor="email">Email<input id="email" name="email" type="email" autoComplete="username" required placeholder="nama@contoh.com" /></label>
            <label htmlFor="password">Kata sandi<input id="password" name="password" type="password" autoComplete="current-password" maxLength={128} required /></label>
          </ActionForm>
          <details className="demo-access">
            <summary>Lihat akun demo lokal</summary>
            <dl>
              <dt>Admin</dt><dd><code>{demoAccounts.admin}</code></dd>
              <dt>Pengajar</dt><dd><code>{demoAccounts.teacher}</code></dd>
              <dt>Peserta</dt><dd><code>{demoAccounts.student}</code></dd>
              <dt>Kata sandi</dt><dd><code>{demoAccounts.password}</code></dd>
            </dl>
          </details>
        </div>
      </section>
    </main>
  );
}
