const formatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  dateStyle: "medium",
  timeStyle: "short",
});

export function displayDate(date: Date) {
  return formatter.format(date) + " WIB";
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
