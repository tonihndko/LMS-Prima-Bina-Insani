"use server";

import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/access";
import { db } from "@/lib/db";

type FormState = { error?: string };

const nameSchema = z.string().trim().min(1).max(100);
const accountSchema = z.object({
  name: nameSchema,
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  role: z.enum(["TEACHER", "STUDENT"]),
  password: z.string().min(8).max(128),
});

export async function createAccount(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const fields = accountSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    role: form.get("role"),
    password: form.get("password"),
  });
  if (!fields.success) {
    return { error: "Isi nama, email, peran, dan kata sandi 8–128 karakter." };
  }

  const { name, email, role, password } = fields.data;
  const id = randomUUID();
  const hash = await hashPassword(password);
  try {
    await db.user.create({
      data: {
        id, name, email, role,
        accounts: { create: { accountId: id, providerId: "credential", password: hash } },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Email sudah digunakan." };
    }
    throw error;
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/akun?ok=account");
}

export async function renameAccount(userId: string, _state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const name = nameSchema.safeParse(form.get("name"));
  if (!name.success) return { error: "Isi nama dengan maksimal 100 karakter." };

  const result = await db.user.updateMany({
    where: { id: userId, role: { not: "ADMIN" } },
    data: { name: name.data },
  });
  if (!result.count) notFound();

  revalidatePath("/admin", "layout");
  redirect("/admin/akun?ok=renamed");
}

export async function setAccountActive(userId: string, active: boolean) {
  await requireAdmin();

  await db.$transaction(async (tx) => {
    const result = await tx.user.updateMany({
      where: { id: userId, role: { not: "ADMIN" } },
      data: { active },
    });
    if (!result.count) notFound();
    if (!active) await tx.session.deleteMany({ where: { userId } });
  });

  revalidatePath("/admin", "layout");
  redirect("/admin/akun?ok=" + (active ? "activated" : "deactivated"));
}

const courseSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000),
  teacherId: z.string().min(1),
});

export async function saveCourse(courseId: string | null, _state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const fields = courseSchema.safeParse({
    title: form.get("title"),
    description: form.get("description"),
    teacherId: form.get("teacherId"),
  });
  if (!fields.success) return { error: "Isi nama kelas dan pilih pengajar." };

  const teacher = await db.user.findFirst({
    where: { id: fields.data.teacherId, role: "TEACHER", active: true },
    select: { id: true },
  });
  if (!teacher) return { error: "Pilih pengajar yang aktif." };

  let id = courseId;
  if (id) {
    const result = await db.course.updateMany({ where: { id }, data: fields.data });
    if (!result.count) notFound();
  } else {
    id = (await db.course.create({ data: fields.data })).id;
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/kelas/" + id + "?ok=course");
}

export async function enrollStudent(courseId: string, _state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const studentId = form.get("studentId");
  if (typeof studentId !== "string" || !studentId) return { error: "Pilih peserta." };

  const [course, student] = await Promise.all([
    db.course.findUnique({ where: { id: courseId }, select: { id: true } }),
    db.user.findFirst({ where: { id: studentId, role: "STUDENT", active: true }, select: { id: true } }),
  ]);
  if (!course) notFound();
  if (!student) return { error: "Pilih peserta yang aktif." };

  await db.enrollment.createMany({ data: { courseId, studentId }, skipDuplicates: true });
  revalidatePath("/admin", "layout");
  redirect("/admin/kelas/" + courseId + "?ok=enrolled");
}

export async function removeStudent(courseId: string, studentId: string) {
  await requireAdmin();
  await db.enrollment.deleteMany({ where: { courseId, studentId } });
  revalidatePath("/admin", "layout");
  redirect("/admin/kelas/" + courseId + "?ok=removed");
}
