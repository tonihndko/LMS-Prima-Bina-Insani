import Link from "next/link";
import { notFound } from "next/navigation";
import { reuseMaterial, setMaterialCompleted } from "@/app/material-actions";
import { ActionForm } from "@/components/action-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { Flash } from "@/components/flash";
import { FileList } from "@/components/file-list";
import { getCourse, requireUser } from "@/lib/access";
import { attachmentMetadata } from "@/lib/attachments";
import { db } from "@/lib/db";
import { coursePath, displayDate } from "@/lib/presentation";

export const metadata = { title: "Detail materi" };

export default async function MaterialPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; materialId: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { courseId, materialId } = await params;
  const { ok } = await searchParams;
  const user = await requireUser();
  const course = await getCourse(courseId, user);
  const isTeacher = course.teacherId === user.id;
  const material = await db.material.findFirst({
    where: { id: materialId, courseId },
    include: {
      files: { select: attachmentMetadata },
      source: { select: { course: { select: { title: true } } } },
      completions: { where: { studentId: user.id }, select: { completedAt: true } },
    },
  });
  if (!material) notFound();

  const [otherCourses, completedCount, studentCount] = isTeacher
    ? await Promise.all([
        db.course.findMany({ where: { teacherId: user.id, id: { not: courseId } }, select: { id: true, title: true }, orderBy: { title: "asc" } }),
        db.materialCompletion.count({ where: { materialId, student: { enrollments: { some: { courseId } } } } }),
        db.enrollment.count({ where: { courseId } }),
      ])
    : [[], 0, 0];
  const completion = material.completions[0];
  const path = coursePath(courseId) + "/materi/" + materialId;

  return (
    <>
      <Breadcrumb items={[
        { href: "/kelas", label: "Kelas saya" },
        { href: coursePath(courseId), label: course.title },
        { href: coursePath(courseId) + "/materi", label: "Materi" },
        { href: path, label: material.title },
      ]} />
      <Flash ok={ok} />
      <header className="page-heading">
        <p className="eyebrow accent">{course.title}</p><h1>{material.title}</h1>
        <p className="muted">
          Diunggah {displayDate(material.createdAt)}
          {material.source && " · Disalin dari kelas " + material.source.course.title}
          {isTeacher && " · " + completedCount + " dari " + studentCount + " peserta menandai selesai"}
        </p>
        {isTeacher && (
          <div className="action-row">
            <Link className="button secondary compact" href={path + "/ubah"}>Ubah materi</Link>
          </div>
        )}
      </header>
      <section className="panel text-panel">
        <h2>Berkas materi</h2>
        {material.description && <p className="prose">{material.description}</p>}
        <FileList files={material.files} />
      </section>
      {user.role === "STUDENT" && (
        <section className="section panel text-panel" aria-labelledby="penyelesaian">
          <h2 id="penyelesaian">Penyelesaian materi</h2>
          <p className="muted">
            {completion
              ? "Kamu menandai materi ini selesai pada " + displayDate(completion.completedAt) + "."
              : "Tandai selesai setelah kamu mempelajari materi ini. Tanda ini merupakan konfirmasi mandiri dan terlihat oleh pengajar."}
          </p>
          <form action={setMaterialCompleted.bind(null, courseId, materialId, !completion)} className="action-row">
            <button className={"button compact " + (completion ? "secondary" : "primary")} type="submit">
              {completion ? "Batalkan tanda selesai" : "Tandai selesai"}
            </button>
          </form>
        </section>
      )}
      {isTeacher && otherCourses.length > 0 && (
        <section className="section panel form-panel" aria-labelledby="pakai-ulang">
          <h2 id="pakai-ulang">Pakai ulang di kelas lain</h2>
          <p className="muted">Materi dan berkasnya disalin. Perubahan pada salinan tidak mengubah materi ini.</p>
          <ActionForm action={reuseMaterial.bind(null, courseId, materialId)} label="Salin materi">
            <label>Kelas tujuan
              <select name="targetCourseId" required defaultValue="">
                <option value="" disabled>Pilih kelas</option>
                {otherCourses.map((other) => <option key={other.id} value={other.id}>{other.title}</option>)}
              </select>
            </label>
          </ActionForm>
        </section>
      )}
    </>
  );
}
