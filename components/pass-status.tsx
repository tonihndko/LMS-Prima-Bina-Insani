import type { PassStatus } from "@/generated/prisma/enums";

export const passStatusLabels: Record<PassStatus, string> = {
  LULUS: "Lulus",
  DIPERTIMBANGKAN: "Dipertimbangkan",
  TIDAK_LULUS: "Tidak Lulus",
};

const tone: Record<PassStatus, string> = {
  LULUS: "status-done",
  DIPERTIMBANGKAN: "status-waiting",
  TIDAK_LULUS: "status-late",
};

export function PassBadge({ status, prefix }: { status?: PassStatus | null; prefix?: string }) {
  if (!status) return <span className="status status-new">{prefix ? prefix + ": belum ada" : "Belum ada"}</span>;
  return <span className={"status " + tone[status]}>{prefix ? prefix + ": " : ""}{passStatusLabels[status]}</span>;
}
