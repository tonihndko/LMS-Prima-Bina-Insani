import Link from "next/link";
import { getCourse, requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { coursePath, displayDate } from "@/lib/presentation";

export const metadata = { title: "Materi" };

export default async function MaterialsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUser();
  const course = await getCourse(courseId, user);
  const materials = await db.material.findMany({
    where: { courseId },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: { id: true, title: true, createdAt: true, _count: { select: { files: true } } },
  });
  const path = coursePath(courseId) + "/materi";

  return (
    <>
      <header className="page-heading section-toolbar">
        <div><p className="eyebrow accent">{course.title}</p><h1>Materi</h1><p className="muted">Berkas pembelajaran untuk kelas ini.</p></div>
        {user.role === "TEACHER" && <Link className="button primary" href={path + "/baru"}>Unggah materi</Link>}
      </header>
      <div className="panel list-panel">
        {materials.length ? materials.map((material) => (
          <article className="task-row" key={material.id}>
            <div className="task-main">
              <h3><Link href={path + "/" + material.id}>{material.title}</Link></h3>
              <p>{material._count.files} berkas · {displayDate(material.createdAt)}</p>
            </div>
            <Link className="button secondary compact" href={path + "/" + material.id}>Lihat materi</Link>
          </article>
        )) : <p className="empty">Belum ada materi di kelas ini.</p>}
      </div>
    </>
  );
}
