import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Flash } from "@/components/flash";
import { notFound } from "next/navigation";
import { gradeSubmission } from "@/app/actions";
import { FileList } from "@/components/file-list";
import { attachmentMetadata } from "@/lib/attachments";
import { ActionForm } from "@/components/action-form";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { assignmentPath, coursePath, displayDate } from "@/lib/presentation";

export const metadata = { title: "Penilaian jawaban" };

type Params = { courseId: string; assignmentId: string; submissionId: string };

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { courseId, assignmentId, submissionId } = await params;
  const { ok } = await searchParams;
  const user = await requireUser();
  const course = await getTeachingCourse(courseId, user);
  const submission = await db.submission.findFirst({
    where: { id: submissionId, assignmentId, assignment: { courseId } },
    include: { assignment: true, student: { select: { name: true } }, files: { select: attachmentMetadata } },
  });
  if (!submission) notFound();

  return (
    <>
      <Breadcrumb items={[
        { href: "/kelas", label: "Kelas saya" },
        { href: coursePath(courseId), label: course.title },
        { href: coursePath(courseId) + "/latihan", label: "Latihan" },
        { href: assignmentPath(courseId, assignmentId), label: submission.assignment.title },
      ]} />
      <Flash ok={ok} />
      <header className="page-heading">
        <p className="eyebrow accent">{submission.assignment.title}</p>
        <h1>Penilaian jawaban</h1>
        <p className="muted">{submission.student.name} · {displayDate(submission.submittedAt)}</p>
      </header>
      <div className="review-layout">
        <section className="panel text-panel">
          <h2>Jawaban peserta</h2>
          {submission.answer && <p className="prose">{submission.answer}</p>}
          <FileList files={submission.files} />
        </section>
        <section className="panel form-panel">
          <h2>Nilai dan umpan balik</h2>
          <ActionForm action={gradeSubmission.bind(null, courseId, assignmentId, submissionId)} label="Simpan penilaian">
            <label htmlFor="score">Nilai (0–100)<input id="score" name="score" type="number" min={0} max={100} step={1} required defaultValue={submission.score ?? undefined} /></label>
            <label htmlFor="feedback">Umpan balik<textarea id="feedback" name="feedback" rows={5} maxLength={2000} required defaultValue={submission.feedback ?? ""} /></label>
          </ActionForm>
        </section>
      </div>
    </>
  );
}
