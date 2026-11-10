import Link from "next/link";
import { notFound } from "next/navigation";
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
  const material = await db.material.findFirst({
    where: { id: materialId, courseId },
    include: { files: { select: attachmentMetadata } },
  });
  if (!material) notFound();

  return (
    <>
      <Breadcrumb items={[
        { href: "/kelas", label: "Kelas saya" },
        { href: coursePath(courseId), label: course.title },
        { href: coursePath(courseId) + "/materi", label: "Materi" },
        { href: coursePath(courseId) + "/materi/" + materialId, label: material.title },
      ]} />
      <Flash ok={ok} />
      <header className="page-heading">
        <p className="eyebrow accent">{course.title}</p><h1>{material.title}</h1>
        <p className="muted">Diunggah {displayDate(material.createdAt)}</p>
      </header>
      <section className="panel text-panel">
        <h2>Berkas materi</h2>
        {material.description && <p className="prose">{material.description}</p>}
        <FileList files={material.files} />
      </section>
    </>
  );
}
