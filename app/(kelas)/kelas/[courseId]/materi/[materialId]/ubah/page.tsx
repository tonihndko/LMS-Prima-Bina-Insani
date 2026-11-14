import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMaterial } from "@/app/material-actions";
import { ActionForm } from "@/components/action-form";
import { FileField } from "@/components/file-field";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { attachmentMetadata } from "@/lib/attachments";
import { db } from "@/lib/db";
import { coursePath } from "@/lib/presentation";

export const metadata = { title: "Ubah materi" };

export default async function EditMaterialPage({ params }: { params: Promise<{ courseId: string; materialId: string }> }) {
  const { courseId, materialId } = await params;
  const user = await requireUser();
  const course = await getTeachingCourse(courseId, user);
  const material = await db.material.findFirst({
    where: { id: materialId, courseId },
    include: { files: { select: attachmentMetadata } },
  });
  if (!material) notFound();
  const back = coursePath(courseId) + "/materi/" + materialId;

  return (
    <>
      <Link className="back-link" href={back}>← Kembali ke materi</Link>
      <header className="page-heading">
        <p className="eyebrow accent">{course.title}</p><h1>Ubah materi</h1>
        <p className="muted">Perubahan langsung terlihat oleh peserta kelas.</p>
      </header>
      <section className="panel form-panel">
        <ActionForm action={updateMaterial.bind(null, courseId, materialId)} label="Simpan perubahan">
          <label>Judul materi<input name="title" maxLength={120} required defaultValue={material.title} /></label>
          <label>Deskripsi<textarea name="description" rows={4} maxLength={4000} defaultValue={material.description} /></label>
          <fieldset className="file-remove">
            <legend>Berkas saat ini</legend>
            {material.files.map((file) => (
              <label key={file.id} className="check-row">
                <input type="checkbox" name="removeFiles" value={file.id} /> Hapus {file.filename}
              </label>
            ))}
          </fieldset>
          <FileField label="Tambah berkas" />
        </ActionForm>
      </section>
    </>
  );
}
