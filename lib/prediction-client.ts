import "server-only";
import { z } from "zod";
import type { PassStatus } from "@/generated/prisma/enums";

// Penghubung LMS ke layanan model (FastAPI).
// Selama PREDICTION_API_URL kosong, prediksi memakai model tiruan di bawah ini agar tampilan bisa diuji.
// Data input (fitur) dan format request/response masih harus disepakati dengan tim model & DS;
// ubah FEATURE_SCHEMA_VERSION, collectFeatures() di lib/evaluation.ts, dan responseSchema bila kontrak berubah.

export const FEATURE_SCHEMA_VERSION = "lms-v0";
export const MOCK_MODEL_VERSION = "tiruan-aturan-v0";
const TIMEOUT_MS = 10_000;

export type PredictionFeatures = {
  // Rata-rata nilai latihan yang sudah diperiksa (0–100), null bila belum ada nilai.
  average_score: number | null;
  // Latihan dikumpulkan / latihan tersedia (0–1), null bila kelas belum punya latihan.
  submission_rate: number | null;
  // Materi ditandai selesai / materi tersedia (0–1), null bila kelas belum punya materi.
  material_completion_rate: number | null;
};

export type PredictionResult = { label: PassStatus; score: number | null; modelVersion: string };

export class PredictionUnavailable extends Error {}

const responseSchema = z.object({
  predicted_class: z.enum(["LULUS", "DIPERTIMBANGKAN", "TIDAK_LULUS"]),
  score: z.number().min(0).max(1).nullish(),
  model_version: z.string().trim().min(1).max(100),
});

export function mockPredict(features: PredictionFeatures): PredictionResult {
  const parts: [number | null, number][] = [
    [features.average_score === null ? null : features.average_score / 100, 0.5],
    [features.submission_rate, 0.3],
    [features.material_completion_rate, 0.2],
  ];
  const known = parts.filter((part): part is [number, number] => part[0] !== null);
  if (!known.length) return { label: "DIPERTIMBANGKAN", score: null, modelVersion: MOCK_MODEL_VERSION };
  const weight = known.reduce((sum, [, w]) => sum + w, 0);
  const score = Math.round((known.reduce((sum, [value, w]) => sum + value * w, 0) / weight) * 100) / 100;
  const label: PassStatus = score >= 0.75 ? "LULUS" : score >= 0.5 ? "DIPERTIMBANGKAN" : "TIDAK_LULUS";
  return { label, score, modelVersion: MOCK_MODEL_VERSION };
}

export async function predict(
  features: PredictionFeatures,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<PredictionResult> {
  const baseUrl = env.PREDICTION_API_URL?.trim();
  if (!baseUrl) return mockPredict(features);

  let body: unknown;
  try {
    const response = await fetchImpl(baseUrl.replace(/\/+$/, "") + "/v1/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(env.PREDICTION_API_KEY ? { Authorization: "Bearer " + env.PREDICTION_API_KEY } : {}),
      },
      body: JSON.stringify({ feature_schema_version: FEATURE_SCHEMA_VERSION, features }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) throw new PredictionUnavailable("HTTP " + response.status);
    body = await response.json();
  } catch (error) {
    if (error instanceof PredictionUnavailable) throw error;
    throw new PredictionUnavailable(error instanceof Error ? error.message : "Permintaan gagal");
  }
  const parsed = responseSchema.safeParse(body);
  // Respons tidak valid tidak boleh diganti prediksi palsu.
  if (!parsed.success) throw new PredictionUnavailable("Respons model tidak valid");
  return { label: parsed.data.predicted_class, score: parsed.data.score ?? null, modelVersion: parsed.data.model_version };
}
