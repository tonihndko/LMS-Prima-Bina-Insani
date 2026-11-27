import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import type { PassStatus, UserRole } from "@/generated/prisma/enums";
import { predict, type PredictionFeatures, type PredictionResult } from "./prediction-client";

type Actor = { id: string; role: UserRole };

export class AccessDenied extends Error {}

// Hanya pengajar kelas tersebut, untuk peserta yang terdaftar di kelas itu.
async function assertTeachesStudent(db: PrismaClient, actor: Actor, courseId: string, studentId: string) {
  if (actor.role !== "TEACHER") throw new AccessDenied();
  const enrollment = await db.enrollment.findFirst({
    where: { courseId, studentId, course: { teacherId: actor.id } },
    select: { studentId: true },
  });
  if (!enrollment) throw new AccessDenied();
}

const rate = (part: number, total: number) => (total ? Math.round((part / total) * 100) / 100 : null);

export async function collectFeatures(db: PrismaClient, courseId: string, studentId: string): Promise<PredictionFeatures> {
  const [assignmentCount, submissions, materialCount, completedCount] = await Promise.all([
    db.assignment.count({ where: { courseId } }),
    db.submission.findMany({ where: { studentId, assignment: { courseId } }, select: { score: true } }),
    db.material.count({ where: { courseId } }),
    db.materialCompletion.count({ where: { studentId, material: { courseId } } }),
  ]);
  const scores = submissions.map(({ score }) => score).filter((score): score is number => score !== null);
  return {
    average_score: scores.length ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10 : null,
    submission_rate: rate(submissions.length, assignmentCount),
    material_completion_rate: rate(completedCount, materialCount),
  };
}

export async function createPrediction(
  db: PrismaClient,
  actor: Actor,
  courseId: string,
  studentId: string,
  predictFn: (features: PredictionFeatures) => Promise<PredictionResult> = predict,
) {
  await assertTeachesStudent(db, actor, courseId, studentId);
  const features = await collectFeatures(db, courseId, studentId);
  // Gagal di sini (PredictionUnavailable) berarti tidak ada baris yang disimpan.
  const result = await predictFn(features);
  return db.prediction.create({
    data: {
      courseId, studentId, requestedById: actor.id,
      label: result.label, score: result.score, modelVersion: result.modelVersion, features,
    },
  });
}

export async function confirmEvaluation(
  db: PrismaClient,
  actor: Actor,
  courseId: string,
  studentId: string,
  input: { status: PassStatus; reason: string; predictionId?: string | null },
) {
  await assertTeachesStudent(db, actor, courseId, studentId);
  if (input.predictionId) {
    const prediction = await db.prediction.findFirst({
      where: { id: input.predictionId, courseId, studentId },
      select: { id: true },
    });
    if (!prediction) throw new AccessDenied();
  }
  // Selalu baris baru: keputusan lama tetap menjadi riwayat.
  return db.evaluation.create({
    data: {
      courseId, studentId, teacherId: actor.id,
      status: input.status, reason: input.reason, predictionId: input.predictionId || null,
    },
  });
}

// Prediksi dan keputusan terkini per peserta untuk tabel rekap.
export async function latestReviewByStudent(db: PrismaClient, courseId: string) {
  const [predictions, evaluations] = await Promise.all([
    db.prediction.findMany({
      where: { courseId },
      orderBy: [{ studentId: "asc" }, { createdAt: "desc" }],
      distinct: ["studentId"],
      select: { studentId: true, label: true },
    }),
    db.evaluation.findMany({
      where: { courseId },
      orderBy: [{ studentId: "asc" }, { createdAt: "desc" }],
      distinct: ["studentId"],
      select: { studentId: true, status: true },
    }),
  ]);
  return {
    prediction: new Map(predictions.map((row) => [row.studentId, row.label])),
    evaluation: new Map(evaluations.map((row) => [row.studentId, row.status])),
  };
}
