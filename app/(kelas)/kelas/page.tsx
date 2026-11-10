import Link from "next/link";
import { redirect } from "next/navigation";
import { courseAccess, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { coursePath } from "@/lib/presentation";

export const metadata = { title: "Kelas saya" };

export default async function CoursesPage() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");
  const courses = await db.course.findMany({
    where: courseAccess(user),
    orderBy: { title: "asc" },
    select: {
      id: true, title: true, description: true,
      teacher: { select: { name: true } },
      _count: { select: { assignments: true, materials: true, enrollments: true } },
    },
  });
  if (courses.length === 1) redirect(coursePath(courses[0].id));

  return (
    <>
      <header className="page-heading">
        <p className="eyebrow accent">Ruang belajar</p>
        <h1>Kelas saya</h1>
        <p className="muted">Pilih kelas yang ingin kamu buka.</p>
      </header>
      {courses.length ? (
        <div className="class-grid">
          {courses.map((course) => (
            <Link key={course.id} className="class-card" href={coursePath(course.id)}>
              <p className="eyebrow accent">{course.teacher.name}</p>
              <h2>{course.title}</h2>
              <p className="muted">{course.description}</p>
              <div className="class-card-stats">
                <span><strong>{course._count.assignments}</strong> latihan</span>
                <span><strong>{course._count.materials}</strong> materi</span>
                <span><strong>{course._count.enrollments}</strong> peserta</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="panel list-panel">
          <p className="empty empty-rich">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true"><path d="M4 5h16v14H4V5Zm3 4h10M7 13h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Belum ada kelas untuk akun ini. Hubungi admin untuk penempatan.
          </p>
        </div>
      )}
    </>
  );
}
