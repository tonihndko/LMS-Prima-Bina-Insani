import Link from "next/link";
import { AssignmentList } from "@/components/assignment-list";
import { getCourse, requireUser } from "@/lib/access";
import { listAssignments } from "@/lib/classroom";
import { coursePath } from "@/lib/presentation";

export const metadata = { title: "Latihan" };

export default async function AssignmentsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUser();
  const course = await getCourse(courseId, user);
  const isTeacher = user.role === "TEACHER";
  const assignments = await listAssignments(courseId, isTeacher ? undefined : user.id);

  return (
    <>
      <header className="page-heading section-toolbar">
        <div><p className="eyebrow accent">{course.title}</p><h1>Latihan</h1><p className="muted">Daftar latihan dan status pengumpulan.</p></div>
        {isTeacher && <Link className="button primary" href={coursePath(courseId) + "/latihan/baru"}>Buat latihan</Link>}
      </header>
      <AssignmentList assignments={assignments} courseId={courseId} isTeacher={isTeacher} />
    </>
  );
}
