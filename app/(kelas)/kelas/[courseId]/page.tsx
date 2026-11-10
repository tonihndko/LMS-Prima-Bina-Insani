import Link from "next/link";
import { AssignmentList } from "@/components/assignment-list";
import { Donut, Sparkline } from "@/components/charts";
import { Flash } from "@/components/flash";
import { listAssignments } from "@/lib/classroom";
import { getCourse, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { coursePath, lastNDays } from "@/lib/presentation";

export const metadata = { title: "Dashboard kelas" };

export default async function CoursePage({ params, searchParams }: { params: Promise<{ courseId: string }>; searchParams: Promise<{ ok?: string }> }) {
  const { courseId } = await params;
  const { ok } = await searchParams;
  const user = await requireUser();
  const course = await getCourse(courseId, user);
  const isTeacher = course.teacherId === user.id;

  const [assignments, enrollments] = await Promise.all([
    listAssignments(courseId, isTeacher ? undefined : user.id),
    isTeacher ? db.enrollment.findMany({
      where: { courseId },
      select: { studentId: true, student: { select: { name: true } } },
      orderBy: { student: { name: "asc" } },
    }) : [],
  ]);

  const submissions = assignments.flatMap((assignment) => assignment.submissions);
  const graded = submissions.filter(({ score }) => score !== null).length;
  const daily = lastNDays(14).map((day) =>
    submissions.filter(({ submittedAt }) => {
      const date = new Date(submittedAt);
      return date >= day && date < new Date(day.getTime() + 86_400_000);
    }).length
  );
  const counts = [
    ["Latihan tersedia", assignments.length],
    ["Jawaban terkumpul", submissions.length],
    ["Jawaban dinilai", graded],
  ];

  return (
    <>
      <Flash ok={ok} />
      <header className="course-banner">
        <div className="banner-copy">
          <p className="eyebrow">Kelas demo · {isTeacher ? "Pengajar" : "Peserta"}</p>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
        {isTeacher && <Link className="button on-banner" href={coursePath(courseId) + "/latihan/baru"}><span aria-hidden="true">+</span> Buat latihan</Link>}
        {isTeacher && <div className="banner-viz"><Donut value={graded} total={submissions.length} label="Jawaban dinilai" /></div>}
      </header>
      {isTeacher && <div className="sparkline-wrap"><p className="eyebrow accent">Pengumpulan 14 hari terakhir</p><Sparkline counts={daily} /></div>}
      <div className="stats" aria-label="Ringkasan kelas">
        {counts.map(([label, count]) => <article key={label} className="stat"><span>{label}</span><strong>{count}</strong></article>)}
      </div>
      <section className="section" aria-labelledby="daftar-latihan">
        <div className="section-heading">
          <p className="eyebrow accent">Aktivitas kelas</p><h2 id="daftar-latihan">Daftar latihan</h2>
        </div>
        <AssignmentList assignments={assignments} courseId={courseId} isTeacher={isTeacher} />
      </section>
      {isTeacher && (
        <section className="section" aria-labelledby="progres">
          <div className="section-heading"><p className="eyebrow accent">Pemantauan</p><h2 id="progres">Progres peserta</h2></div>
          <div className="panel table-wrap" tabIndex={0} role="region" aria-label="Tabel progres peserta">
            <table>
              <thead><tr><th scope="col">Peserta</th><th scope="col">Dikumpulkan</th><th scope="col">Dinilai</th></tr></thead>
              <tbody>
                {enrollments.length ? enrollments.map(({ studentId, student }) => {
                  const work = submissions.filter((submission) => submission.studentId === studentId);
                  return (
                    <tr key={studentId}>
                      <th scope="row">{student.name}</th>
                      <td>{work.length} / {assignments.length}</td>
                      <td>{work.filter(({ score }) => score !== null).length} / {assignments.length}</td>
                    </tr>
                  );
                }) : <tr><td colSpan={3}>Belum ada peserta di kelas ini.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
