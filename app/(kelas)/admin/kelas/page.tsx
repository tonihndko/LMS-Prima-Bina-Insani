import Link from "next/link";
import { CourseForm } from "@/components/course-form";
import { requireAdmin } from "@/lib/access";
import { db } from "@/lib/db";

export const metadata = { title: "Kelola kelas" };

export default async function AdminClassesPage() {
  await requireAdmin();
  const [courses, teachers] = await Promise.all([
    db.course.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, teacher: { select: { name: true } }, _count: { select: { enrollments: true } } },
    }),
    db.user.findMany({
      where: { role: "TEACHER", active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <>
      <header className="page-heading"><p className="eyebrow accent">Administrasi</p><h1>Kelola kelas</h1></header>
      <section className="panel list-panel" aria-label="Daftar kelas">
        {courses.length ? courses.map((course) => (
          <article className="task-row" key={course.id}>
            <div className="task-main">
              <h3><Link href={"/admin/kelas/" + course.id}>{course.title}</Link></h3>
              <p>{course.teacher.name} · {course._count.enrollments} peserta</p>
            </div>
            <Link className="button secondary compact" href={"/admin/kelas/" + course.id}>Kelola kelas</Link>
          </article>
        )) : <p className="empty">Belum ada kelas.</p>}
      </section>
      <section className="section panel form-panel">
        <h2>Buat kelas</h2>
        {teachers.length ? <CourseForm teachers={teachers} /> : <p className="muted">Buat akun pengajar aktif sebelum menambahkan kelas.</p>}
      </section>
    </>
  );
}
