import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteAssignment, updateAssignment } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { assignmentPath, toJakartaInput } from "@/lib/presentation";

export const metadata = { title: "Ubah latihan" };

export default async function EditAssignmentPage({ params }: { params: Promise<{ courseId: string; assignmentId: string }> }) {
  const { courseId, assignmentId } = await params;
  const user = await requireUser();
  const course = await getTeachingCourse(courseId, user);
  const assignment = await db.assignment.findFirst({
    where: { id: assignmentId, courseId },
    select: { title: true, instructions: true, dueAt: true, _count: { select: { submissions: true } } },
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
          <label htmlFor="dueAt">Tenggat (opsional, WIB)<input id="dueAt" name="dueAt" type="datetime-local" defaultValue={toJakartaInput(assignment.dueAt)} /></label>
          <p className="muted small">Kosongkan untuk menghapus tenggat. Jawaban setelah tenggat tetap diterima dan ditandai terlambat.</p>
        </ActionForm>
      </section>
      <section className="section panel form-panel danger-panel" aria-labelledby="hapus-latihan">
        <h2 id="hapus-latihan">Hapus latihan</h2>
        {assignment._count.submissions > 0 ? (
          <p className="muted">
            Latihan ini tidak dapat dihapus karena sudah memiliki {assignment._count.submissions} jawaban peserta. Menghapusnya akan menghilangkan nilai dan umpan balik.
          </p>
        ) : (
          <>
            <p className="muted">Belum ada jawaban untuk latihan ini. Latihan akan dihapus permanen.</p>
            <ActionForm action={deleteAssignment.bind(null, courseId, assignmentId)} label="Hapus latihan" danger>
              <label className="check-row"><input type="checkbox" name="confirm" value="yes" required /> Saya paham latihan ini tidak dapat dikembalikan.</label>
            </ActionForm>
          </>
        )}
      </section>
    </>
  );
}
