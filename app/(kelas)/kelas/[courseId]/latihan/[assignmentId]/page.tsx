import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Flash } from "@/components/flash";
import { notFound } from "next/navigation";
import { submitAnswer } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { FileField } from "@/components/file-field";
import { FileList } from "@/components/file-list";
import { attachmentMetadata } from "@/lib/attachments";
import { Status } from "@/components/status";
import { getCourse, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { assignmentPath, coursePath, displayDate } from "@/lib/presentation";

export const metadata = { title: "Detail latihan" };

export default async function AssignmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; assignmentId: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { courseId, assignmentId } = await params;
  const { ok } = await searchParams;
  const user = await requireUser();
  const course = await getCourse(courseId, user);
  const isTeacher = course.teacherId === user.id;
  const assignment = await db.assignment.findFirst({
    where: { id: assignmentId, courseId },
    include: {
      submissions: {
        where: isTeacher ? undefined : { studentId: user.id },
        include: { student: { select: { name: true } }, files: { select: attachmentMetadata } },
        orderBy: [{ score: { sort: "asc", nulls: "first" } }, { submittedAt: "asc" }],
      },
    },
  });
  if (!assignment) notFound();

  const ownSubmission = isTeacher ? null : assignment.submissions[0];
  return (
    <>
      <Breadcrumb items={[
        { href: "/kelas", label: "Kelas saya" },
        { href: coursePath(courseId), label: course.title },
        { href: coursePath(courseId) + "/latihan", label: "Latihan" },
        { href: assignmentPath(courseId, assignmentId), label: assignment.title },
      ]} />
      <Flash ok={ok} />
      <header className="page-heading">
        <p className="eyebrow accent">{course.title}</p>
        <h1>{assignment.title}</h1>
        {!isTeacher && <Status submission={ownSubmission} />}
      </header>
      <section className="panel text-panel">
        <h2>Instruksi latihan</h2>
        <p className="prose">{assignment.instructions}</p>
      </section>
      {isTeacher ? (
        <section className="section" aria-labelledby="jawaban">
          <div className="section-heading"><h2 id="jawaban">Jawaban peserta</h2></div>
          <div className="panel list-panel">
            {assignment.submissions.length ? assignment.submissions.map((submission) => (
              <article className="task-row" key={submission.id}>
                <span className="avatar person-avatar" aria-hidden="true">{submission.student.name.slice(0, 1).toUpperCase()}</span>
                <div className="task-main">
                  <h3>{submission.student.name}</h3>
                  <p>Dikirim {displayDate(submission.submittedAt)}{submission.score !== null ? " · Nilai " + submission.score + "/100" : ""}</p>
                </div>
                <Status submission={submission} />
                <Link className="button compact secondary" href={assignmentPath(courseId, assignmentId) + "/jawaban/" + submission.id}>
                  {submission.score === null ? "Beri nilai" : "Lihat penilaian"}
                </Link>
              </article>
            )) : <p className="empty">Belum ada jawaban yang masuk.</p>}
          </div>
        </section>
      ) : ownSubmission ? (
        <>
          <section className="section panel text-panel">
            <h2>Jawaban saya</h2>
            <p className="muted">Dikirim {displayDate(ownSubmission.submittedAt)}</p>
            {ownSubmission.answer && <p className="prose">{ownSubmission.answer}</p>}
            <FileList files={ownSubmission.files} />
          </section>
          <section className="section panel text-panel">
            <h2>Hasil penilaian</h2>
            {ownSubmission.score !== null ? (
              <>
                <p className="score">{ownSubmission.score}<small> / 100</small></p>
                <h3>Umpan balik pengajar</h3>
                <p className="prose">{ownSubmission.feedback}</p>
              </>
            ) : <p className="muted">Jawabanmu sudah diterima dan sedang menunggu penilaian.</p>}
          </section>
        </>
      ) : (
        <section className="section panel form-panel">
          <h2>Kumpulkan jawaban</h2>
          <p className="muted">Kirim jawaban teks, berkas, atau keduanya. Setiap latihan menerima satu pengumpulan.</p>
          <ActionForm action={submitAnswer.bind(null, courseId, assignmentId)} label="Kirim jawaban">
            <label htmlFor="answer">Jawaban<textarea id="answer" name="answer" rows={7} maxLength={5000} placeholder="Tulis jawabanmu di sini…" /></label>
            <FileField label="Lampirkan berkas pekerjaan" />
          </ActionForm>
        </section>
      )}
    </>
  );
}
