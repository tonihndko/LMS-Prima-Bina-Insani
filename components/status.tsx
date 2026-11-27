type StatusSubmission = { score: number | null; submittedAt?: Date } | null | undefined;

export function Status({ submission, dueAt = null }: { submission?: StatusSubmission; dueAt?: Date | null }) {
  if (!submission) {
    return dueAt && dueAt < new Date()
      ? <span className="status status-late">Lewat tenggat</span>
      : <span className="status status-new">Belum dikumpulkan</span>;
  }
  const late = dueAt && submission.submittedAt && submission.submittedAt > dueAt;
  return (
    <span className="status-group">
      {submission.score === null
        ? <span className="status status-waiting">Sudah dikumpulkan</span>
        : <span className="status status-done">Sudah dinilai</span>}
      {late && <span className="status status-late">Terlambat</span>}
    </span>
  );
}
