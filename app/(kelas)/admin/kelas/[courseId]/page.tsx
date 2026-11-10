import Link from "next/link";
import { notFound } from "next/navigation";
import { enrollStudent, removeStudent } from "@/app/admin-actions";
import { ActionForm } from "@/components/action-form";
import { CourseForm } from "@/components/course-form";
import { requireAdmin } from "@/lib/access";
import { db } from "@/lib/db";

export const metadata = { title: "Administrasi kelas" };

export default async function AdminCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  await requireAdmin();
  const { courseId } = await params;
  const [course, teachers, candidates] = await Promise.all([
    db.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: { select: { name: true, active: true } },
        _count: { select: { assignments: true } },
        enrollments: {
          orderBy: { student: { name: "asc" } },
          include: { student: { select: {
            name: true, active: true,
            submissions: { where: { assignment: { courseId } }, select: { score: true } },
          } } },
        },
      },
    }),
    db.user.findMany({
      where: { role: "TEACHER", active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.user.findMany({
      where: { role: "STUDENT", active: true, enrollments: { none: { courseId } } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!course) notFound();

  return (
    <>
      <Link className="back-link" href="/admin">← Kembali ke dasbor admin</Link>
      <header className="page-heading">
        <p className="eyebrow accent">Administrasi kelas</p>
        <h1>{course.title}</h1>
        <p className="muted">Pengajar saat ini: {course.teacher.name}{!course.teacher.active && " (nonaktif)"}</p>
      </header>
      <div className="review-layout">
        <section className="panel form-panel">
          <h2>Pengaturan kelas</h2>
          {teachers.length ? <CourseForm course={course} teachers={teachers} /> : <p className="muted">Belum ada pengajar aktif untuk ditugaskan.</p>}
        </section>
        <section className="panel form-panel">
          <h2>Tempatkan peserta</h2>
          {candidates.length ? (
            <ActionForm action={enrollStudent.bind(null, courseId)} label="Tambahkan peserta">
              <label><span id="student-label">Peserta</span><select aria-labelledby="student-label" name="studentId" required defaultValue=""><option value="" disabled>Pilih peserta</option>
                {candidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} · {candidate.email}</option>)}
              </select></label>
            </ActionForm>
          ) : <p className="muted">Semua peserta aktif sudah ditempatkan di kelas ini.</p>}
        </section>
      </div>
      <section className="section" aria-labelledby="progres-admin">
        <div className="section-heading"><h2 id="progres-admin">Progres peserta</h2></div>
        <div className="panel table-wrap">
          <table>
            <thead><tr><th scope="col">Peserta</th><th scope="col">Dikumpulkan</th><th scope="col">Dinilai</th><th scope="col">Penempatan</th></tr></thead>
            <tbody>
              {course.enrollments.map(({ student, studentId }) => (
                <tr key={studentId}>
                  <th scope="row">{student.name}{!student.active && " (nonaktif)"}</th>
                  <td>{student.submissions.length} / {course._count.assignments}</td>
                  <td>{student.submissions.filter(({ score }) => score !== null).length} / {course._count.assignments}</td>
                  <td><form action={removeStudent.bind(null, courseId, studentId)}><button className="button secondary compact" type="submit">Keluarkan dari kelas</button></form></td>
                </tr>
              ))}
              {!course.enrollments.length && <tr><td colSpan={4}>Belum ada peserta di kelas ini.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
