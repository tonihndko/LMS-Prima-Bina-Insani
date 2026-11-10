import "server-only";
import { db } from "./db";

export function listAssignments(courseId: string, studentId?: string) {
  return db.assignment.findMany({
    where: { courseId },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      title: true,
      createdAt: true,
      submissions: {
        where: studentId ? { studentId } : undefined,
        select: { studentId: true, score: true },
      },
    },
  });
}
