import { saveCourse } from "@/app/admin-actions";
import { ActionForm } from "./action-form";

type CourseFields = { id: string; title: string; description: string; teacherId: string };

export function CourseForm({
  course,
  teachers,
}: {
  course?: CourseFields;
  teachers: { id: string; name: string }[];
}) {
  return (
    <ActionForm action={saveCourse.bind(null, course?.id ?? null)} label={course ? "Simpan kelas" : "Buat kelas"}>
      <label>Nama kelas<input name="title" maxLength={120} required defaultValue={course?.title} /></label>
      <label>Deskripsi<textarea name="description" maxLength={1000} rows={3} defaultValue={course?.description} /></label>
      <label>
        <span id="teacher-label">Pengajar</span>
        <select aria-labelledby="teacher-label" name="teacherId" required defaultValue={teachers.some(({ id }) => id === course?.teacherId) ? course?.teacherId : ""}>
          <option value="" disabled>Pilih pengajar aktif</option>
          {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
        </select>
      </label>
    </ActionForm>
  );
}
