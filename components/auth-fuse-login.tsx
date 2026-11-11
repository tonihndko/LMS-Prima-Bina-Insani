"use client";

import { Typewriter as AuthTypewriter, PasswordInput } from "@/components/ui/auth-fuse";
import { ActionForm } from "@/components/action-form";
import { PLATFORM_NAME } from "@/lib/brand";

// Esensi login page lama dipertahankan: hero gradient biru→navy, logo klien
// di plate putih, story track, caption — dipadukan gaya shadcn/Tailwind.
export function AuthHero() {
  return (
    <section className="login-art" aria-label={"Tentang " + PLATFORM_NAME}>
      <div className="login-story">
        <p className="eyebrow login-anim" style={{ animationDelay: "100ms" }}>Kelas dan progres</p>
        <h1 className="login-anim" style={{ animationDelay: "200ms" }}>
          <AuthTypewriter text={["Latihan kelas,", "dalam satu ruang."]} speed={70} />
        </h1>
        <p className="login-anim" style={{ animationDelay: "420ms" }}>Buka latihan, kumpulkan jawaban, dan pantau hasil belajar.</p>
        <div className="story-track login-anim" style={{ animationDelay: "520ms" }} aria-hidden="true">
          <span><b>01</b> Latihan</span><span><b>02</b> Jawaban</span><span><b>03</b> Penilaian</span>
        </div>
      </div>
      <p className="login-caption login-anim" style={{ animationDelay: "700ms" }}>{PLATFORM_NAME.toUpperCase()} / RUANG KELAS DEMO</p>
    </section>
  );
}

interface AuthCardProps {
  action: (state: { error?: string }, form: FormData) => Promise<{ error?: string }>;
  demoAccounts: { admin: string; teacher: string; student: string; password: string };
}

export function AuthCard({ action, demoAccounts }: AuthCardProps) {
  return (
    <div className="login-card login-anim" style={{ animationDelay: "350ms" }}>
      <p className="eyebrow accent">Akun kelas</p>
      <h2>Masuk ke kelas</h2>
      <p className="muted">Gunakan akun admin, pengajar, atau peserta.</p>
      <ActionForm action={action} label="Masuk">
        <div className="grid gap-2">
          <label htmlFor="email">Email
            <input id="email" name="email" type="email" autoComplete="username" required placeholder="nama@contoh.com" />
          </label>
        </div>
        <PasswordInput
          name="password"
          label="Kata sandi"
          required
          autoComplete="current-password"
          maxLength={128}
          className="min-h-[43px]"
        />
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
  );
}
