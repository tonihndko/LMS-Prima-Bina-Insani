import { describe, expect, it } from "vitest";
import { MOCK_MODEL_VERSION, mockPredict, predict, PredictionUnavailable } from "@/lib/prediction-client";

const features = { average_score: 90, submission_rate: 1, material_completion_rate: 0.5 };
const env = { PREDICTION_API_URL: "http://model.test/", PREDICTION_API_KEY: "rahasia" };
const respond = (status: number, body: unknown) => (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe("penghubung model", () => {
  it("memakai model tiruan bila PREDICTION_API_URL kosong", async () => {
    expect(await predict(features, {})).toEqual({ label: "LULUS", score: 0.85, modelVersion: MOCK_MODEL_VERSION });
    expect(mockPredict({ average_score: null, submission_rate: null, material_completion_rate: null }).label).toBe("DIPERTIMBANGKAN");
    expect(mockPredict({ average_score: 30, submission_rate: 0.2, material_completion_rate: 0 }).label).toBe("TIDAK_LULUS");
  });

  it("mengirim data ke /v1/predict dan membaca respons tiga kelas", async () => {
    let request: { url: string; init: RequestInit } | undefined;
    const fetchImpl = (async (url: string, init: RequestInit) => {
      request = { url, init };
      return new Response(JSON.stringify({ predicted_class: "DIPERTIMBANGKAN", score: 0.6, model_version: "rf-1" }));
    }) as unknown as typeof fetch;
    expect(await predict(features, env, fetchImpl)).toEqual({ label: "DIPERTIMBANGKAN", score: 0.6, modelVersion: "rf-1" });
    expect(request?.url).toBe("http://model.test/v1/predict");
    expect((request?.init.headers as Record<string, string>).Authorization).toBe("Bearer rahasia");
    expect(JSON.parse(String(request?.init.body)).features).toEqual(features);
  });

  it("menolak respons error atau tidak valid tanpa membuat prediksi palsu", async () => {
    await expect(predict(features, env, respond(503, {}))).rejects.toBeInstanceOf(PredictionUnavailable);
    await expect(predict(features, env, respond(200, { predicted_class: "LOLOS" }))).rejects.toBeInstanceOf(PredictionUnavailable);
    const offline = (async () => { throw new TypeError("fetch failed"); }) as unknown as typeof fetch;
    await expect(predict(features, env, offline)).rejects.toBeInstanceOf(PredictionUnavailable);
  });
});
