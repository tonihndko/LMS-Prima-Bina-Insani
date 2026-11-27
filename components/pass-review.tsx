import { requestPrediction, saveEvaluation } from "@/app/prediction-actions";
import { ActionForm } from "@/components/action-form";
import { PassBadge, passStatusLabels } from "@/components/pass-status";
import type { PassStatus } from "@/generated/prisma/enums";
import type { PredictionFeatures } from "@/lib/prediction-client";
import { MOCK_MODEL_VERSION } from "@/lib/prediction-client";
import { displayDate } from "@/lib/presentation";

type Prediction = {
  id: string; label: PassStatus; score: number | null; modelVersion: string;
  features: unknown; createdAt: Date; requestedBy: { name: string };
};
type Evaluation = {
  id: string; status: PassStatus; reason: string; createdAt: Date;
  teacher: { name: string }; prediction: { label: PassStatus } | null;
};

const percent = (value: number | null) => (value === null ? "belum ada" : Math.round(value * 100) + "%");

function FeatureList({ features }: { features: unknown }) {
  const data = features as Partial<PredictionFeatures>;
  return (
    <ul className="feature-list">
      <li>Rata-rata nilai: <strong>{data.average_score ?? "belum ada"}</strong></li>
      <li>Latihan dikumpulkan: <strong>{percent(data.submission_rate ?? null)}</strong></li>
      <li>Materi selesai: <strong>{percent(data.material_completion_rate ?? null)}</strong></li>
    </ul>
  );
}

export function PassReview({
  courseId, studentId, predictions, evaluations,
}: {
  courseId: string; studentId: string; predictions: Prediction[]; evaluations: Evaluation[];
}) {
  const latest = predictions[0];
  const current = evaluations[0];
  const history = [
    ...predictions.map((item) => ({ kind: "prediction" as const, at: item.createdAt, item })),
    ...evaluations.map((item) => ({ kind: "evaluation" as const, at: item.createdAt, item })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <section className="section" aria-labelledby="kelulusan" id="kelulusan">
      <div className="section-heading"><p className="eyebrow accent">Evaluasi</p><h2 id="kelulusan">Prediksi & keputusan kelulusan</h2></div>
      <div className="review-layout">
        <div className="panel text-panel">
          <h3>Prediksi model</h3>
          {latest ? (
            <>
              <p className="review-badge"><PassBadge status={latest.label} /></p>
              <p className="muted">
                {latest.score !== null && "Skor " + latest.score.toLocaleString("id-ID", { minimumFractionDigits: 2 }) + " · "}
                Model {latest.modelVersion} · {displayDate(latest.createdAt)}
              </p>
              <p className="muted small-gap">Data yang dipakai:</p>
              <FeatureList features={latest.features} />
              {latest.modelVersion === MOCK_MODEL_VERSION && (
                <p className="note-box" role="note">Ini prediksi dari model tiruan untuk uji tampilan, bukan model asli.</p>
              )}
            </>
          ) : <p className="muted">Belum ada prediksi untuk peserta ini.</p>}
          <p className="muted small-gap">Prediksi hanya bahan pertimbangan. Meminta prediksi baru tidak mengubah keputusan pengajar.</p>
          <ActionForm action={requestPrediction.bind(null, courseId, studentId)} label={latest ? "Minta prediksi baru" : "Minta prediksi"}>
            {null}
          </ActionForm>
        </div>
        <div className="panel form-panel">
          <h3>Keputusan pengajar</h3>
          {current ? (
            <>
              <p className="review-badge"><PassBadge status={current.status} /></p>
              <p className="prose">{current.reason}</p>
              <p className="muted">{current.teacher.name} · {displayDate(current.createdAt)}</p>
            </>
          ) : <p className="muted">Belum ada keputusan. Status kelulusan baru berlaku setelah pengajar mengonfirmasi.</p>}
          <ActionForm action={saveEvaluation.bind(null, courseId, studentId)} label={current ? "Ubah keputusan" : "Simpan keputusan"}>
            <fieldset className="radio-group">
              <legend>{current ? "Keputusan baru" : "Status kelulusan"}</legend>
              {(Object.keys(passStatusLabels) as PassStatus[]).map((status) => (
                <label key={status} className="check-row">
                  <input type="radio" name="status" value={status} required /> {passStatusLabels[status]}
                  {latest?.label === status && <span className="muted"> (sesuai prediksi)</span>}
                </label>
              ))}
            </fieldset>
            <label htmlFor="reason">Alasan
              <textarea id="reason" name="reason" rows={3} maxLength={2000} required placeholder="Contoh: Semua latihan terkumpul dan nilai tugas akhir 85." />
            </label>
            {latest && <input type="hidden" name="predictionId" value={latest.id} />}
          </ActionForm>
        </div>
      </div>
      {history.length > 0 && (
        <details className="panel list-panel history">
          <summary>Riwayat prediksi dan keputusan ({history.length})</summary>
          {history.map((entry) => entry.kind === "prediction" ? (
            <article className="task-row" key={"p" + entry.item.id}>
              <div className="task-main">
                <h3>Prediksi model</h3>
                <p>{entry.item.requestedBy.name} · {entry.item.modelVersion} · {displayDate(entry.at)}</p>
              </div>
              <PassBadge status={entry.item.label} />
            </article>
          ) : (
            <article className="task-row" key={"e" + entry.item.id}>
              <div className="task-main">
                <h3>Keputusan pengajar</h3>
                <p className="prose">{entry.item.reason}</p>
                <p>{entry.item.teacher.name} · {displayDate(entry.at)}
                  {entry.item.prediction && " · prediksi saat itu: " + passStatusLabels[entry.item.prediction.label]}</p>
              </div>
              <PassBadge status={entry.item.status} />
            </article>
          ))}
        </details>
      )}
    </section>
  );
}
