import type { UserRole } from "@/generated/prisma/enums";

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  TEACHER: "Pengajar",
  STUDENT: "Peserta",
};
