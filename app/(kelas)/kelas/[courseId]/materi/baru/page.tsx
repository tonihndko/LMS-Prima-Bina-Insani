import Link from "next/link";
import { createMaterial } from "@/app/material-actions";
import { ActionForm } from "@/components/action-form";
import { FileField } from "@/components/file-field";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { coursePath } from "@/lib/presentation";

export const metadata = { title: "Unggah materi" };

export default async function CreateMaterialPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUser();
  const course = await getTeachingCourse(courseId, user);

  return (
    <>
      <Link className="back-link" href={coursePath(courseId) + "/materi"}>← Kembali ke materi</Link>
      <header className="page-heading">
        <p className="eyebrow accent">{course.title}</p><h1>Unggah materi</h1>
        <p className="muted">Materi akan tersedia bagi peserta kelas setelah disimpan.</p>
      </header>
      <section className="panel form-panel">
        <ActionForm action={createMaterial.bind(null, courseId)} label="Simpan materi">
          <label>Judul materi<input name="title" maxLength={120} required /></label>
          <label>Deskripsi<textarea name="description" rows={4} maxLength={4000} /></label>
          <FileField label="Berkas materi" required />
        </ActionForm>
      </section>
    </>
  );
}
