import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import type { UserRole } from "@/generated/prisma/enums";
import { auth } from "./auth";
import { db } from "./db";

type Viewer = { id: string; name: string; role: UserRole };

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return db.user.findFirst({
    where: { id: session.user.id, active: true },
    select: { id: true, name: true, role: true },
  });
});

export async function requireUser() {
  const user = await getViewer();
  if (!user) redirect("/masuk");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") notFound();
  return user;
}

export function courseAccess(user: Viewer) {
  switch (user.role) {
    case "TEACHER":
      return { teacherId: user.id };
    case "STUDENT":
      return { enrollments: { some: { studentId: user.id } } };
    case "ADMIN":
      return { id: { in: [] } };
  }
}

export async function getCourse(courseId: string, user: Viewer) {
  const course = await db.course.findFirst({ where: { AND: [{ id: courseId }, courseAccess(user)] } });
  if (!course) notFound();
  return course;
}

export async function getTeachingCourse(courseId: string, user: Viewer) {
  if (user.role !== "TEACHER") notFound();
  const course = await db.course.findFirst({ where: { id: courseId, teacherId: user.id } });
  if (!course) notFound();
  return course;
}
