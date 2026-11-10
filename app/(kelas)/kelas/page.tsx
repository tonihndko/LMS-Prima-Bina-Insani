import Link from "next/link";
import { redirect } from "next/navigation";
import { courseAccess, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { coursePath } from "@/lib/presentation";

export const metadata = { title: "Kelas saya" };

export default async function CoursesPage() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");
  const courses = await db.course.findMany({ where: courseAccess(user), orderBy: { title: "asc" } });
  if (courses.length === 1) redirect(coursePath(courses[0].id));

  return (
    <>
      <header className="page-heading">
        <p className="eyebrow accent">Ruang belajar</p>
        <h1>Kelas saya</h1>
        <p className="muted">Pilih kelas yang ingin kamu buka.</p>
      </header>
      <div className="panel list-panel">
        {courses.length ? courses.map((course) => (
          <Link key={course.id} className="class-link" href={coursePath(course.id)}>
            <strong>{course.title}</strong><span aria-hidden="true">↗</span>
          </Link>
        )) : <p className="empty">Belum ada kelas untuk akun ini.</p>}
      </div>
    </>
  );
}
