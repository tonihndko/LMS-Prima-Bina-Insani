"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { getCourse, getTeachingCourse, requireUser } from "@/lib/access";
import { attachmentRows, readUploads } from "@/lib/attachments";
import { db } from "@/lib/db";
import { MAX_FILES } from "@/lib/file-policy";
import { coursePath } from "@/lib/presentation";

type FormState = { error?: string };

const materialSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(4000),
});

function materialPath(courseId: string, materialId: string) {
  return coursePath(courseId) + "/materi/" + materialId;
}

function refresh(courseId: string, materialId?: string) {
  revalidatePath(coursePath(courseId));
  revalidatePath(coursePath(courseId) + "/materi");
  if (materialId) revalidatePath(materialPath(courseId, materialId));
}

export async function createMaterial(courseId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  await getTeachingCourse(courseId, user);
  const fields = materialSchema.safeParse({
    title: form.get("title"),
    description: form.get("description"),
  });
  if (!fields.success) return { error: "Isi judul materi dan gunakan deskripsi maksimal 4.000 karakter." };
  const { files, error } = readUploads(form);
  if (error) return { error };
  if (!files.length) return { error: "Lampirkan minimal satu berkas materi." };

  const material = await db.material.create({
    data: { courseId, ...fields.data, files: { create: await attachmentRows(files) } },
    select: { id: true },
  });
  refresh(courseId);
  redirect(materialPath(courseId, material.id) + "?ok=material");
}

export async function updateMaterial(courseId: string, materialId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  await getTeachingCourse(courseId, user);
  const material = await db.material.findFirst({
    where: { id: materialId, courseId },
    select: { id: true, files: { select: { id: true } } },
  });
  if (!material) notFound();

  const fields = materialSchema.safeParse({
    title: form.get("title"),
    description: form.get("description"),
  });
  if (!fields.success) return { error: "Isi judul materi dan gunakan deskripsi maksimal 4.000 karakter." };
  const { files, error } = readUploads(form);
  if (error) return { error };

  // Hanya berkas milik materi ini yang dapat dihapus, apa pun ID yang dikirim form.
  const removeIds = material.files.map(({ id }) => id).filter((id) => form.getAll("removeFiles").includes(id));
  const total = material.files.length - removeIds.length + files.length;
  if (total < 1) return { error: "Materi harus memiliki minimal satu berkas." };
  if (total > MAX_FILES) return { error: "Materi maksimal memiliki " + MAX_FILES + " berkas. Hapus berkas lama terlebih dahulu." };

  await db.material.update({
    where: { id: material.id },
    data: {
      ...fields.data,
      files: { deleteMany: { id: { in: removeIds } }, create: await attachmentRows(files) },
    },
  });
  refresh(courseId, materialId);
  redirect(materialPath(courseId, materialId) + "?ok=material-updated");
}

export async function reuseMaterial(courseId: string, materialId: string, _state: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  await getTeachingCourse(courseId, user);
  const targetId = form.get("targetCourseId");
  if (typeof targetId !== "string" || !targetId || targetId === courseId) return { error: "Pilih kelas tujuan." };
  // Pengajar harus berwenang pada kelas asal dan kelas tujuan.
  await getTeachingCourse(targetId, user);

  const source = await db.material.findFirst({
    where: { id: materialId, courseId },
    select: { title: true, description: true, files: { select: { filename: true, size: true, content: true } } },
  });
  if (!source) notFound();

  const copy = await db.material.create({
    data: {
      courseId: targetId,
      title: source.title,
      description: source.description,
      sourceId: materialId,
      files: { create: source.files },
    },
    select: { id: true },
  });
  refresh(targetId);
  redirect(materialPath(targetId, copy.id) + "?ok=material-reused");
}

export async function setMaterialCompleted(courseId: string, materialId: string, completed: boolean) {
  const user = await requireUser();
  if (user.role !== "STUDENT") notFound();
  await getCourse(courseId, user);
  const material = await db.material.findFirst({ where: { id: materialId, courseId }, select: { id: true } });
  if (!material) notFound();

  const key = { materialId, studentId: user.id };
  if (completed) {
    await db.materialCompletion.upsert({ where: { materialId_studentId: key }, create: key, update: {} });
  } else {
    await db.materialCompletion.deleteMany({ where: key });
  }
  refresh(courseId, materialId);
  redirect(materialPath(courseId, materialId) + "?ok=" + (completed ? "completed" : "uncompleted"));
}
