import Link from "next/link";
import { notFound } from "next/navigation";
import { createFollowUp, setFollowUpStatus } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { Flash } from "@/components/flash";
import { Status } from "@/components/status";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { assignmentPath, coursePath, displayDate } from "@/lib/presentation";

export const metadata = { title: "Progres peserta" };

export default async function StudentProgressPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; studentId: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { courseId, studentId } = await params;
  const { ok } = await searchParams;
  const user = await requireUser();
  const course = await getTeachingCourse(courseId, user);
  const enrollment = await db.enrollment.findUnique({
    where: { courseId_studentId: { courseId, studentId } },
    select: { student: { select: { name: true, active: true } } },
  });
  if (!enrollment) notFound();

  const [materials, assignments, followUps] = await Promise.all([
    db.material.findMany({
      where: { courseId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: { id: true, title: true, completions: { where: { studentId }, select: { completedAt: true } } },
    }),
    db.assignment.findMany({
      where: { courseId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: { id: true, title: true, submissions: { where: { studentId }, select: { id: true, score: true } } },
    }),
    db.followUp.findMany({
      where: { courseId, studentId },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      select: { id: true, note: true, status: true, createdAt: true, teacher: { select: { name: true } } },
    }),
  ]);
  const { student } = enrollment;
  const done = materials.filter((material) => material.completions.length).length;
  const submitted = assignments.filter((assignment) => assignment.submissions.length).length;
  const scores = assignments.flatMap((assignment) => assignment.submissions.map(({ score }) => score)).filter((score) => score !== null);
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;

  return (
    <>
      <Breadcrumb items={[
        { href: "/kelas", label: "Kelas saya" },
        { href: coursePath(courseId), label: course.title },
        { href: coursePath(courseId) + "/peserta/" + studentId, label: student.name },
      ]} />
      <Flash ok={ok} />
      <header className="page-heading">
        <p className="eyebrow accent">{course.title} · Peserta</p>
        <h1>{student.name}{!student.active && " (nonaktif)"}</h1>
      </header>
      <div className="stats" aria-label="Ringkasan progres">
        <article className="stat"><span>Materi selesai</span><strong>{done} / {materials.length}</strong></article>
        <article className="stat"><span>Latihan dikumpulkan</span><strong>{submitted} / {assignments.length}</strong></article>
        <article className="stat"><span>Rata-rata nilai</span><strong>{average ?? "–"}</strong></article>
      </div>

      <section className="section" aria-labelledby="tindak-lanjut">
        <div className="section-heading"><p className="eyebrow accent">Pendampingan</p><h2 id="tindak-lanjut">Tindak lanjut</h2></div>
        <div className="panel form-panel">
          <ActionForm action={createFollowUp.bind(null, courseId, studentId)} label="Simpan catatan">
            <label htmlFor="note">Catatan tindak lanjut
              <textarea id="note" name="note" rows={3} maxLength={2000} required placeholder="Contoh: Ajak sesi pendampingan untuk latihan distribusi data." />
            </label>
          </ActionForm>
        </div>
        <div className="panel list-panel">
          {followUps.length ? followUps.map((item) => (
            <article className="task-row" key={item.id}>
              <div className="task-main">
                <p className="prose">{item.note}</p>
                <p>{item.teacher.name} · {displayDate(item.createdAt)}</p>
              </div>
              <span className={"status " + (item.status === "DONE" ? "status-done" : "status-waiting")}>
                {item.status === "DONE" ? "Selesai" : "Perlu ditindaklanjuti"}
              </span>
              <form action={setFollowUpStatus.bind(null, courseId, studentId, item.id, item.status === "DONE" ? "OPEN" : "DONE")}>
                <button className="button secondary compact" type="submit">{item.status === "DONE" ? "Buka kembali" : "Tandai selesai"}</button>
              </form>
            </article>
          )) : <p className="empty">Belum ada catatan tindak lanjut untuk peserta ini.</p>}
        </div>
      </section>

      <section className="section" aria-labelledby="progres-latihan">
        <div className="section-heading"><h2 id="progres-latihan">Latihan</h2></div>
        <div className="panel list-panel">
          {assignments.length ? assignments.map((assignment) => {
            const submission = assignment.submissions[0];
            return (
              <article className="task-row" key={assignment.id}>
                <div className="task-main">
                  <h3>{assignment.title}</h3>
                  {submission?.score != null && <p>Nilai {submission.score}/100</p>}
                </div>
                <Status submission={submission} />
                {submission && (
                  <Link className="button secondary compact" href={assignmentPath(courseId, assignment.id) + "/jawaban/" + submission.id}>Lihat jawaban</Link>
                )}
              </article>
            );
          }) : <p className="empty">Belum ada latihan di kelas ini.</p>}
        </div>
      </section>

      <section className="section" aria-labelledby="progres-materi">
        <div className="section-heading"><h2 id="progres-materi">Materi</h2></div>
        <div className="panel list-panel">
          {materials.length ? materials.map((material) => {
            const completion = material.completions[0];
            return (
              <article className="task-row" key={material.id}>
                <div className="task-main">
                  <h3>{material.title}</h3>
                  {completion && <p>Ditandai selesai {displayDate(completion.completedAt)}</p>}
                </div>
                <span className={"status " + (completion ? "status-done" : "status-new")}>{completion ? "Selesai" : "Belum selesai"}</span>
              </article>
            );
          }) : <p className="empty">Belum ada materi di kelas ini.</p>}
        </div>
      </section>
    </>
  );
}
