import Link from "next/link";
import { requireAdmin } from "@/lib/access";
import { db } from "@/lib/db";

export const metadata = { title: "Dasbor admin" };

export default async function AdminPage() {
  await requireAdmin();
  const [accounts, courses] = await Promise.all([
    db.user.count(),
    db.course.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true, title: true,
        teacher: { select: { name: true, active: true } },
        _count: { select: { enrollments: true } },
        assignments: { select: { submissions: { select: { score: true } } } },
      },
    }),
  ]);
  const participants = courses.reduce((total, course) => total + course._count.enrollments, 0);
  const stats = [["Akun", accounts], ["Kelas", courses.length], ["Penempatan peserta", participants]] as const;

  return (
    <>
      <header className="course-banner">
        <div className="banner-copy">
          <p className="eyebrow">Administrasi · Data simulasi</p>
          <h1>Dasbor admin</h1>
          <p>Atur akun, penugasan pengajar, dan penempatan peserta dalam kelas.</p>
        </div>
        <Link className="button on-banner" href="/admin/akun">Kelola akun</Link>
      </header>
      <div className="stats" aria-label="Ringkasan administrasi">
        {stats.map(([label, value]) => <article className="stat" key={label}><span>{label}</span><strong>{value}</strong></article>)}
      </div>
      <section className="section" aria-labelledby="rekap-kelas">
        <div className="section-heading section-toolbar">
          <div><p className="eyebrow accent">Kelas</p><h2 id="rekap-kelas">Rekap kelas</h2></div>
          <Link className="button secondary compact" href="/admin/kelas">Kelola kelas</Link>
        </div>
        <div className="panel table-wrap">
          <table>
            <thead><tr><th scope="col">Kelas</th><th scope="col">Pengajar</th><th scope="col">Peserta</th><th scope="col">Latihan</th><th scope="col">Dinilai / Terkumpul</th></tr></thead>
            <tbody>
              {courses.map((course) => {
                const answers = course.assignments.flatMap((assignment) => assignment.submissions);
                return (
                  <tr key={course.id}>
                    <th scope="row"><Link className="inline-link" href={"/admin/kelas/" + course.id}>{course.title}</Link></th>
                    <td>{course.teacher.name}{!course.teacher.active && " (nonaktif)"}</td>
                    <td>{course._count.enrollments}</td>
                    <td>{course.assignments.length}</td>
                    <td>{answers.filter(({ score }) => score !== null).length} / {answers.length}</td>
                  </tr>
                );
              })}
              {!courses.length && <tr><td colSpan={5}>Belum ada kelas.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
