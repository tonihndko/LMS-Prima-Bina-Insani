import Link from "next/link";
import { createAssignment } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { coursePath } from "@/lib/presentation";

export const metadata = { title: "Buat latihan" };

export default async function CreateAssignmentPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUser();
  const course = await getTeachingCourse(courseId, user);

  return (
    <>
      <Link className="back-link" href={coursePath(courseId)}>← Kembali ke kelas</Link>
      <header className="page-heading">
        <p className="eyebrow accent">{course.title}</p>
        <h1>Buat latihan</h1>
        <p className="muted">Latihan tersedia bagi peserta kelas setelah disimpan.</p>
      </header>
      <section className="panel form-panel">
        <ActionForm action={createAssignment.bind(null, courseId)} label="Simpan latihan">
          <label htmlFor="title">Judul latihan<input id="title" name="title" maxLength={120} required placeholder="Contoh: Membaca tabel frekuensi" /></label>
          <label htmlFor="instructions">Instruksi<textarea id="instructions" name="instructions" rows={7} maxLength={4000} required /></label>
        </ActionForm>
      </section>
    </>
  );
}
