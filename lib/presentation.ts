const formatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  dateStyle: "medium",
  timeStyle: "short",
});

export function displayDate(date: Date) {
  return formatter.format(date) + " WIB";
}

const inputFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Jakarta",
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

// Nilai untuk <input type="datetime-local">, dalam WIB.
export function toJakartaInput(date: Date | null) {
  return date ? inputFormatter.format(date).replace(" ", "T") : "";
}

// Input datetime-local tidak membawa zona waktu; semua tenggat dibaca sebagai WIB (UTC+7, tanpa DST).
export function parseJakartaInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(value + ":00+07:00");
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isLate(submittedAt: Date, dueAt: Date | null) {
  return dueAt !== null && submittedAt > dueAt;
}

export function coursePath(courseId: string) {
  return "/kelas/" + courseId;
}

export function assignmentPath(courseId: string, assignmentId: string) {
  return coursePath(courseId) + "/latihan/" + assignmentId;
}

export function lastNDays(n: number) {
  const today = new Date();
  return Array.from({ length: n }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (n - 1 - index));
    day.setHours(0, 0, 0, 0);
    return day;
  });
}
