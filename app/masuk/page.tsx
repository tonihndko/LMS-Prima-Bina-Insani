import { redirect } from "next/navigation";
import { AuthCard, AuthHero } from "@/components/auth-fuse-login";
import { Brand } from "@/components/brand";
import { getViewer } from "@/lib/access";
import { demoAccounts } from "@/lib/demo";
import { login } from "@/app/actions";
import styles from "./login.module.css";

export const metadata = { title: "Masuk" };

export default async function LoginPage() {
  if (await getViewer()) redirect("/");

  return (
    <main id="konten" className={styles.layout}>
      <section className={styles.body} aria-labelledby="login-title">
        <header className={styles.brand}>
          <Brand href="/masuk" />
          <span>Learning Management System</span>
        </header>
        <div className={styles.content}>
          {/* Akun demo hanya ditampilkan di lokal; instance yang di-deploy memakai DEMO_PASSWORD. */}
          <AuthCard action={login} demoAccounts={process.env.NODE_ENV !== "production" ? demoAccounts : undefined} />
        </div>
        <p className={styles.support}>Butuh akun? Hubungi admin kelas.</p>
      </section>
      <AuthHero />
    </main>
  );
}
