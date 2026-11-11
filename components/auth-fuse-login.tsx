import { Input, PasswordInput, Typewriter } from "@/components/ui/auth-fuse";
import { ActionForm } from "@/components/action-form";
import styles from "@/app/masuk/login.module.css";

export function AuthHero() {
  return (
    <section className={styles.hero} aria-labelledby="login-hero-title">
      <div className={styles.heroCopy}>
        <h2 id="login-hero-title">
          Belajar di{" "}
          <span className={styles.heroLine}>
            <span className={styles.heroText}>satu ruang.</span>
            <span className={styles.heroTyping} aria-hidden="true">
              <Typewriter text="satu ruang." speed={65} cursor="" />
            </span>
          </span>
        </h2>
        <p>Akses materi, kumpulkan latihan, dan pantau progres belajarmu.</p>
      </div>
    </section>
  );
}

interface AuthCardProps {
  action: (state: { error?: string }, form: FormData) => Promise<{ error?: string }>;
  demoAccounts: { admin: string; teacher: string; student: string; password: string };
}

export function AuthCard({ action, demoAccounts }: AuthCardProps) {
  return (
    <div className={styles.card}>
      <h1 id="login-title">Masuk ke LMS</h1>
      <p className={styles.intro}>Gunakan akun admin, pengajar, atau peserta.</p>
      <ActionForm action={action} label="Masuk">
        <label htmlFor="email">Email
          <Input id="email" name="email" type="email" autoComplete="username" required placeholder="nama@contoh.com" />
        </label>
        <PasswordInput
          name="password"
          label="Kata sandi"
          required
          autoComplete="current-password"
          maxLength={128}
          placeholder="Masukkan kata sandi"
        />
      </ActionForm>
      <details className={styles.demo}>
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
