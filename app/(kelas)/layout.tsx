import type { ReactNode } from "react";
import { logout } from "@/app/actions";
import { PortalNav } from "@/components/portal-nav";
import { Brand } from "@/components/brand";
import { requireUser } from "@/lib/access";

export default async function ClassroomLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";
  const home = isAdmin ? "/admin" : "/kelas";
  const label = { ADMIN: "Admin", TEACHER: "Pengajar", STUDENT: "Peserta" }[user.role];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand href={home} />
        <PortalNav isAdmin={isAdmin} />
        <div className="sidebar-foot">
          <span className="demo-indicator"><i /> Data simulasi</span>
          <div className="account">
            <span className="avatar" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
            <div><strong>{user.name}</strong><small>{label}</small></div>
          </div>
          <form action={logout}><button className="logout" type="submit">Keluar</button></form>
        </div>
      </aside>
      <main id="konten" className="workspace">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
