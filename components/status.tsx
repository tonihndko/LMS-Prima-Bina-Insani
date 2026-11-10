export function Status({ submission }: { submission?: { score: number | null } | null }) {
  if (!submission) return <span className="status status-new">Belum dikumpulkan</span>;
  if (submission.score === null) return <span className="status status-waiting">Sudah dikumpulkan</span>;
  return <span className="status status-done">Sudah dinilai</span>;
}
