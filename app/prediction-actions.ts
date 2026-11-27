"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/access";
import { db } from "@/lib/db";
import { AccessDenied, confirmEvaluation, createPrediction } from "@/lib/evaluation";
import { PredictionUnavailable } from "@/lib/prediction-client";
import { coursePath } from "@/lib/presentation";

type FormState = { error?: string };

function studentPath(courseId: string, studentId: string) {
  return coursePath(courseId) + "/peserta/" + studentId;
}

function refresh(courseId: string, studentId: string) {
  revalidatePath(coursePath(courseId));
  revalidatePath(studentPath(courseId, studentId));
  revalidatePath("/admin/kelas/" + courseId);
}

export async function requestPrediction(courseId: string, studentId: string, _state: FormState, _form: FormData): Promise<FormState> {
  const user = await requireUser();
  try {
    await createPrediction(db, user, courseId, studentId);
  } catch (error) {
    if (error instanceof AccessDenied) notFound();
    if (error instanceof PredictionUnavailable) {
      return { error: "Layanan prediksi sedang tidak dapat dihubungi. Coba lagi nanti. Keputusan tetap dapat dicatat tanpa prediksi." };
    }
    throw error;
  }
  refresh(courseId, studentId);
  redirect(studentPath(courseId, studentId) + "?ok=prediction#kelulusan");
}

const evaluationSchema = z.object({
  status: z.enum(["LULUS", "DIPERTIMBANGKAN", "TIDAK_LULUS"]),
  reason: z.string().trim().min(1).max(2000),
  predictionId: z.string().max(64).optional(),
});

export async function saveEvaluation(courseId: string, studentId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const fields = evaluationSchema.safeParse({
    status: form.get("status"),
    reason: form.get("reason"),
    predictionId: form.get("predictionId") || undefined,
  });
  if (!fields.success) return { error: "Pilih status kelulusan dan tulis alasannya (maks. 2.000 karakter)." };

  try {
    await confirmEvaluation(db, user, courseId, studentId, fields.data);
  } catch (error) {
    if (error instanceof AccessDenied) notFound();
    throw error;
  }
  refresh(courseId, studentId);
  redirect(studentPath(courseId, studentId) + "?ok=evaluation#kelulusan");
}
