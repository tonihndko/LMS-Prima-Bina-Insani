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
