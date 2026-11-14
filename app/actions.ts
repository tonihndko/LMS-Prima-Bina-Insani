"use server";

import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { attachmentRows, readUploads } from "@/lib/attachments";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { assignmentPath, coursePath } from "@/lib/presentation";

type FormState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(128),
});

export async function login(_state: FormState, form: FormData): Promise<FormState> {
  const fields = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!fields.success) return { error: "Isi email dan kata sandi yang valid." };

  try {
    await auth.api.signInEmail({ body: fields.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.body?.code === "ACCOUNT_INACTIVE") return { error: "Akun nonaktif. Hubungi admin." };
      return { error: error.status === "TOO_MANY_REQUESTS"
        ? "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi."
        : "Email atau kata sandi tidak sesuai." };
    }
    throw error;
  }
  redirect("/");
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/masuk");
}

const assignmentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  instructions: z.string().trim().min(1).max(4000),
});

export async function createAssignment(courseId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  await getTeachingCourse(courseId, user);

  const fields = assignmentSchema.safeParse({
    title: form.get("title"),
    instructions: form.get("instructions"),
  });
  if (!fields.success) return { error: "Isi judul (maks. 120 karakter) dan instruksi (maks. 4.000 karakter)." };

  const assignment = await db.assignment.create({ data: { courseId, ...fields.data } });
  revalidatePath(coursePath(courseId));
  revalidatePath(coursePath(courseId) + "/latihan");
  redirect(assignmentPath(courseId, assignment.id) + "?ok=assignment");
}

export async function updateAssignment(courseId: string, assignmentId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  await getTeachingCourse(courseId, user);

  const fields = assignmentSchema.safeParse({
    title: form.get("title"),
    instructions: form.get("instructions"),
  });
  if (!fields.success) return { error: "Isi judul (maks. 120 karakter) dan instruksi (maks. 4.000 karakter)." };

  // ponytail: instruksi lama tidak diversikan; tambah riwayat versi bila penilaian perlu ditelusuri.
  const result = await db.assignment.updateMany({ where: { id: assignmentId, courseId }, data: fields.data });
  if (!result.count) notFound();
  const path = assignmentPath(courseId, assignmentId);
  revalidatePath(coursePath(courseId));
  revalidatePath(coursePath(courseId) + "/latihan");
  revalidatePath(path);
  redirect(path + "?ok=assignment-updated");
}

const followUpSchema = z.object({
  note: z.string().trim().min(1).max(2000),
});

function studentPath(courseId: string, studentId: string) {
  return coursePath(courseId) + "/peserta/" + studentId;
}

export async function createFollowUp(courseId: string, studentId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  await getTeachingCourse(courseId, user);
  const enrolled = await db.enrollment.findUnique({ where: { courseId_studentId: { courseId, studentId } }, select: { studentId: true } });
  if (!enrolled) notFound();

  const fields = followUpSchema.safeParse({ note: form.get("note") });
  if (!fields.success) return { error: "Isi catatan tindak lanjut (maks. 2.000 karakter)." };

  await db.followUp.create({ data: { courseId, studentId, teacherId: user.id, note: fields.data.note } });
  revalidatePath(studentPath(courseId, studentId));
  revalidatePath(coursePath(courseId));
  redirect(studentPath(courseId, studentId) + "?ok=followup");
}

export async function setFollowUpStatus(courseId: string, studentId: string, followUpId: string, status: "OPEN" | "DONE") {
  const user = await requireUser();
  await getTeachingCourse(courseId, user);
  const result = await db.followUp.updateMany({ where: { id: followUpId, courseId, studentId }, data: { status } });
  if (!result.count) notFound();
  revalidatePath(studentPath(courseId, studentId));
  revalidatePath(coursePath(courseId));
  redirect(studentPath(courseId, studentId) + "?ok=followup-" + status.toLowerCase());
}

const answerSchema = z.string().trim().max(5000);

export async function submitAnswer(courseId: string, assignmentId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  if (user.role !== "STUDENT") notFound();
  const assignment = await db.assignment.findFirst({
    where: {
      id: assignmentId,
      courseId,
      course: { teacherId: { not: user.id }, enrollments: { some: { studentId: user.id } } },
    },
    select: { id: true },
  });
  if (!assignment) notFound();

  const answer = answerSchema.safeParse(form.get("answer") ?? "");
  if (!answer.success) return { error: "Jawaban teks maksimal 5.000 karakter." };
  const { files, error } = readUploads(form);
  if (error) return { error };
  if (!answer.data && !files.length) return { error: "Isi jawaban teks atau lampirkan berkas." };

  try {
    await db.submission.create({
      data: {
        assignmentId: assignment.id,
        studentId: user.id,
        answer: answer.data,
        files: { create: await attachmentRows(files) },
      },
    });
  } catch (error) {
    // Unique (assignmentId, studentId): satu pengumpulan per latihan, misalnya dari tab lama.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Jawaban untuk latihan ini sudah dikumpulkan. Muat ulang halaman untuk melihatnya." };
    }
    throw error;
  }
  const path = assignmentPath(courseId, assignment.id);
  revalidatePath(coursePath(courseId));
  revalidatePath(coursePath(courseId) + "/latihan");
  revalidatePath(path);
  redirect(path + "?ok=submitted");
}

const gradeSchema = z.object({
  score: z.string().regex(/^\d{1,3}$/).transform(Number).pipe(z.number().int().min(0).max(100)),
  feedback: z.string().trim().min(1).max(2000),
});

export async function gradeSubmission(courseId: string, assignmentId: string, submissionId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  if (user.role !== "TEACHER") notFound();
  const submission = await db.submission.findFirst({
    where: { id: submissionId, assignmentId, assignment: { courseId, course: { teacherId: user.id } } },
    select: { id: true },
  });
  if (!submission) notFound();

  const fields = gradeSchema.safeParse({
    score: form.get("score"),
    feedback: form.get("feedback"),
  });
  if (!fields.success) return { error: "Masukkan nilai bulat 0–100 dan umpan balik (maks. 2.000 karakter)." };

  await db.submission.update({ where: { id: submission.id }, data: fields.data });
  const path = assignmentPath(courseId, assignmentId);
  revalidatePath(coursePath(courseId));
  revalidatePath(coursePath(courseId) + "/latihan");
  revalidatePath(path);
  redirect(path + "?ok=graded");
}
