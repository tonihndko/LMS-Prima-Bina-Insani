import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";

export const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL! }) });

export async function resetDatabase() {
  await db.$executeRawUnsafe(
    'TRUNCATE "Evaluation", "Prediction", "FollowUp", "MaterialCompletion", "Attachment", "Material", "Submission", "Assignment", "Enrollment", "Course", "Session", "Account", "User" CASCADE',
  );
}

// Dua kelas dengan pengajar berbeda; Budi peserta kelas A.
export async function seedTwoClasses() {
  const [sari, andi, budi] = await Promise.all([
    db.user.create({ data: { name: "Bu Sari", email: "sari@test.local", role: "TEACHER" } }),
    db.user.create({ data: { name: "Pak Andi", email: "andi@test.local", role: "TEACHER" } }),
    db.user.create({ data: { name: "Budi", email: "budi@test.local", role: "STUDENT" } }),
  ]);
  const classA = await db.course.create({ data: { title: "Kelas A", description: "", teacherId: sari.id } });
  const classB = await db.course.create({ data: { title: "Kelas B", description: "", teacherId: andi.id } });
  await db.enrollment.create({ data: { courseId: classA.id, studentId: budi.id } });
  return { sari, andi, budi, classA, classB };
}
