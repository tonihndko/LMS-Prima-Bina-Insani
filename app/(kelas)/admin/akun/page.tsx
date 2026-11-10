import Link from "next/link";
import { createAccount, renameAccount, setAccountActive } from "@/app/admin-actions";
import { ActionForm } from "@/components/action-form";
import { requireAdmin } from "@/lib/access";
import { db } from "@/lib/db";
import { roleLabels } from "@/lib/roles";

export const metadata = { title: "Kelola akun" };

export default async function AccountsPage() {
  await requireAdmin();
  const accounts = await db.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true },
  });

  return (
    <>
      <Link className="back-link" href="/admin">← Kembali ke dasbor admin</Link>
      <header className="page-heading"><p className="eyebrow accent">Administrasi</p><h1>Kelola akun</h1></header>
      <section className="panel form-panel">
        <h2>Buat akun</h2>
        <ActionForm action={createAccount} label="Buat akun">
          <label>Nama<input name="name" required maxLength={100} /></label>
          <label>Email<input name="email" type="email" required maxLength={254} /></label>
          <label><span id="role-label">Peran</span><select aria-labelledby="role-label" name="role" required defaultValue=""><option value="" disabled>Pilih peran</option><option value="TEACHER">Pengajar</option><option value="STUDENT">Peserta</option></select></label>
          <label>Kata sandi awal<input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} /></label>
        </ActionForm>
      </section>
      <section className="section" aria-labelledby="daftar-akun">
        <div className="section-heading"><h2 id="daftar-akun">Daftar akun</h2></div>
        <div className="panel list-panel">
          {accounts.map((account) => (
            <article className="account-row" key={account.id}>
              <div className="task-main">
                <h3>{account.name}</h3>
                <p>{account.email} · {roleLabels[account.role]}</p>
              </div>
              <span className={"status " + (account.active ? "status-done" : "status-new")}>{account.active ? "Aktif" : "Nonaktif"}</span>
              {account.role !== "ADMIN" && (
                <details className="account-tools">
                  <summary>Kelola</summary>
                  <ActionForm action={renameAccount.bind(null, account.id)} label="Simpan nama">
                    <label>Nama akun<input name="name" required maxLength={100} defaultValue={account.name} /></label>
                  </ActionForm>
                  <form action={setAccountActive.bind(null, account.id, !account.active)}>
                    <button className="button secondary compact" type="submit">{account.active ? "Nonaktifkan" : "Aktifkan kembali"}</button>
                  </form>
                </details>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
