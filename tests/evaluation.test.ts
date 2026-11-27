import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { AccessDenied, collectFeatures, confirmEvaluation, createPrediction, latestReviewByStudent } from "@/lib/evaluation";
import { PredictionUnavailable, type PredictionResult } from "@/lib/prediction-client";
import { db, resetDatabase, seedTwoClasses } from "./helpers";

const fixed = (label: PredictionResult["label"]) => async (): Promise<PredictionResult> => ({ label, score: 0.5, modelVersion: "uji-1" });

let seed: Awaited<ReturnType<typeof seedTwoClasses>>;
beforeEach(async () => {
  await resetDatabase();
  seed = await seedTwoClasses();
});
afterAll(() => db.$disconnect());

describe("prediksi tidak menimpa keputusan pengajar", () => {
  it("keputusan Lulus tetap Lulus setelah prediksi baru Tidak Lulus", async () => {
    const { sari, budi, classA } = seed;
    const first = await createPrediction(db, sari, classA.id, budi.id, fixed("DIPERTIMBANGKAN"));
    await confirmEvaluation(db, sari, classA.id, budi.id, { status: "LULUS", reason: "Tugas akhir sangat baik", predictionId: first.id });

    await createPrediction(db, sari, classA.id, budi.id, fixed("TIDAK_LULUS"));

    const review = await latestReviewByStudent(db, classA.id);
    expect(review.prediction.get(budi.id)).toBe("TIDAK_LULUS");
    expect(review.evaluation.get(budi.id)).toBe("LULUS");
    const evaluations = await db.evaluation.findMany({ where: { studentId: budi.id } });
    expect(evaluations).toHaveLength(1);
    expect(evaluations[0]).toMatchObject({ status: "LULUS", reason: "Tugas akhir sangat baik", predictionId: first.id });
  });

  it("mengubah keputusan menambah riwayat, keputusan lama tetap tersimpan", async () => {
    const { sari, budi, classA } = seed;
    await confirmEvaluation(db, sari, classA.id, budi.id, { status: "DIPERTIMBANGKAN", reason: "Menunggu tugas akhir" });
    await confirmEvaluation(db, sari, classA.id, budi.id, { status: "LULUS", reason: "Tugas akhir diterima" });

    const history = await db.evaluation.findMany({ where: { studentId: budi.id }, orderBy: { createdAt: "asc" } });
    expect(history.map(({ status }) => status)).toEqual(["DIPERTIMBANGKAN", "LULUS"]);
    expect((await latestReviewByStudent(db, classA.id)).evaluation.get(budi.id)).toBe("LULUS");
  });
});

describe("hak akses", () => {
  it("pengajar kelas lain ditolak dan tidak ada data tersimpan", async () => {
    const { andi, budi, classA } = seed;
    await expect(createPrediction(db, andi, classA.id, budi.id, fixed("LULUS"))).rejects.toBeInstanceOf(AccessDenied);
    await expect(confirmEvaluation(db, andi, classA.id, budi.id, { status: "LULUS", reason: "x" })).rejects.toBeInstanceOf(AccessDenied);
    expect(await db.prediction.count()).toBe(0);
    expect(await db.evaluation.count()).toBe(0);
  });

  it("pengajar tidak bisa memakai kelasnya sendiri untuk peserta yang tidak terdaftar", async () => {
    const { andi, budi, classB } = seed;
    await expect(createPrediction(db, andi, classB.id, budi.id, fixed("LULUS"))).rejects.toBeInstanceOf(AccessDenied);
    await expect(confirmEvaluation(db, andi, classB.id, budi.id, { status: "LULUS", reason: "x" })).rejects.toBeInstanceOf(AccessDenied);
  });

  it("peserta dan admin ditolak", async () => {
    const { budi, classA } = seed;
    const admin = await db.user.create({ data: { name: "Admin", email: "admin@test.local", role: "ADMIN" } });
    for (const actor of [budi, admin]) {
      await expect(createPrediction(db, actor, classA.id, budi.id, fixed("LULUS"))).rejects.toBeInstanceOf(AccessDenied);
      await expect(confirmEvaluation(db, actor, classA.id, budi.id, { status: "LULUS", reason: "x" })).rejects.toBeInstanceOf(AccessDenied);
    }
  });

  it("keputusan tidak boleh merujuk prediksi peserta lain", async () => {
    const { sari, budi, classA } = seed;
    const citra = await db.user.create({ data: { name: "Citra", email: "citra@test.local", role: "STUDENT" } });
    await db.enrollment.create({ data: { courseId: classA.id, studentId: citra.id } });
    const other = await createPrediction(db, sari, classA.id, citra.id, fixed("LULUS"));
    await expect(
      confirmEvaluation(db, sari, classA.id, budi.id, { status: "LULUS", reason: "x", predictionId: other.id }),
    ).rejects.toBeInstanceOf(AccessDenied);
  });
});

describe("prediksi", () => {
  it("layanan model gagal: tidak ada prediksi palsu yang tersimpan", async () => {
    const { sari, budi, classA } = seed;
    const failing = async (): Promise<PredictionResult> => { throw new PredictionUnavailable("timeout"); };
    await expect(createPrediction(db, sari, classA.id, budi.id, failing)).rejects.toBeInstanceOf(PredictionUnavailable);
    expect(await db.prediction.count()).toBe(0);
  });

  it("menyimpan snapshot data yang dikirim ke model", async () => {
    const { sari, budi, classA } = seed;
    const [a1] = await Promise.all([
      db.assignment.create({ data: { courseId: classA.id, title: "L1", instructions: "-" } }),
      db.assignment.create({ data: { courseId: classA.id, title: "L2", instructions: "-" } }),
    ]);
    await db.submission.create({ data: { assignmentId: a1.id, studentId: budi.id, answer: "a", score: 80 } });
    const material = await db.material.create({ data: { courseId: classA.id, title: "M1", description: "" } });
    await db.material.create({ data: { courseId: classA.id, title: "M2", description: "" } });
    await db.materialCompletion.create({ data: { materialId: material.id, studentId: budi.id } });

    const features = await collectFeatures(db, classA.id, budi.id);
    expect(features).toEqual({ average_score: 80, submission_rate: 0.5, material_completion_rate: 0.5 });
    const prediction = await createPrediction(db, sari, classA.id, budi.id, fixed("DIPERTIMBANGKAN"));
    expect(prediction.features).toEqual(features);
  });
});
