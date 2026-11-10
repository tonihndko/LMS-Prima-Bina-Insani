import Link from "next/link";
import type { listAssignments } from "@/lib/classroom";
import { assignmentPath, displayDate } from "@/lib/presentation";
import { Status } from "./status";

export function AssignmentList({
  assignments,
  courseId,
  isTeacher,
}: {
  assignments: Awaited<ReturnType<typeof listAssignments>>;
  courseId: string;
  isTeacher: boolean;
}) {
  return (
    <div className="panel list-panel">
      {assignments.length ? assignments.map((assignment) => {
        const href = assignmentPath(courseId, assignment.id);
        const submission = assignment.submissions[0];
        return (
          <article key={assignment.id} className="task-row">
            <div className="task-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H6V3h1Zm6 0v5h5M9 12h6m-6 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="task-main">
              <h3><Link href={href}>{assignment.title}</Link></h3>
              <p>{isTeacher
                ? assignment.submissions.length + " terkumpul · " + assignment.submissions.filter(({ score }) => score !== null).length + " dinilai"
                : displayDate(assignment.createdAt)}</p>
            </div>
            {!isTeacher && <Status submission={submission} />}
            <Link className="button compact secondary" href={href}>
              {isTeacher ? "Lihat jawaban" : submission ? "Lihat latihan" : "Kerjakan"}
            </Link>
          </article>
        );
      }) : <p className="empty">Belum ada latihan di kelas ini.</p>}
    </div>
  );
}
