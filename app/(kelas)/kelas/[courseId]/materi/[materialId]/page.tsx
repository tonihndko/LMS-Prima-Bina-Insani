import Link from "next/link";
import { notFound } from "next/navigation";
import { FileList } from "@/components/file-list";
import { getCourse, requireUser } from "@/lib/access";
import { attachmentMetadata } from "@/lib/attachments";
import { db } from "@/lib/db";
import { coursePath, displayDate } from "@/lib/presentation";

export const metadata = { title: "Detail materi" };

export default async function MaterialPage({ params }: { params: Promise<{ courseId: string; materialId: string }> }) {
  const { courseId, materialId } = await params;
  const user = await requireUser();
  const course = await getCourse(courseId, user);
  const material = await db.material.findFirst({
    where: { id: materialId, courseId },
    include: { files: { select: attachmentMetadata } },
  });
  if (!material) notFound();

  return (
    <>
      <Link className="back-link" href={coursePath(courseId) + "/materi"}>← Kembali ke materi</Link>
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
