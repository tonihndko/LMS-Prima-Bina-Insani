import { redirect } from "next/navigation";
import { AuthCard, AuthHero } from "@/components/auth-fuse-login";
import { Brand } from "@/components/brand";
import { getViewer } from "@/lib/access";
import { demoAccounts } from "@/lib/demo";
import { login } from "@/app/actions";

export const metadata = { title: "Masuk" };

export default async function LoginPage() {
  if (await getViewer()) redirect("/");

  return (
    <main id="konten" className="login-layout">
      <AuthHero />
      <section className="login-body">
        <div className="login-card login-anim" style={{ animationDelay: "350ms" }}>
          <Brand href="/masuk" variant="light" />
          <AuthCard action={login} demoAccounts={demoAccounts} />
        </div>
      </section>
    </main>
  );
}
