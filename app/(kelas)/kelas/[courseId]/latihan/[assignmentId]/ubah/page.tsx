import Link from "next/link";
import { notFound } from "next/navigation";
import { updateAssignment } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { assignmentPath } from "@/lib/presentation";

export const metadata = { title: "Ubah latihan" };

export default async function EditAssignmentPage({ params }: { params: Promise<{ courseId: string; assignmentId: string }> }) {
  const { courseId, assignmentId } = await params;
  const user = await requireUser();
  const course = await getTeachingCourse(courseId, user);
  const assignment = await db.assignment.findFirst({
    where: { id: assignmentId, courseId },
    select: { title: true, instructions: true, _count: { select: { submissions: true } } },
  });
  if (!assignment) notFound();

  return (
    <>
      <Link className="back-link" href={assignmentPath(courseId, assignmentId)}>← Kembali ke latihan</Link>
      <header className="page-heading">
        <p className="eyebrow accent">{course.title}</p><h1>Ubah latihan</h1>
        {assignment._count.submissions > 0 && (
          <p className="note-box" role="note">
            Sudah ada {assignment._count.submissions} jawaban. Ubah instruksi hanya untuk perbaikan kecil agar penilaian tetap adil.
          </p>
        )}
      </header>
      <section className="panel form-panel">
        <ActionForm action={updateAssignment.bind(null, courseId, assignmentId)} label="Simpan perubahan">
          <label htmlFor="title">Judul latihan<input id="title" name="title" maxLength={120} required defaultValue={assignment.title} /></label>
          <label htmlFor="instructions">Instruksi<textarea id="instructions" name="instructions" rows={7} maxLength={4000} required defaultValue={assignment.instructions} /></label>
        </ActionForm>
      </section>
    </>
  );
}
