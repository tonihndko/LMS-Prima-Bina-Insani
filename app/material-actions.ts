"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getTeachingCourse, requireUser } from "@/lib/access";
import { attachmentRows, readUploads } from "@/lib/attachments";
import { db } from "@/lib/db";
import { coursePath } from "@/lib/presentation";

const materialSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(4000),
});

export async function createMaterial(
  courseId: string,
  _state: { error?: string },
  form: FormData,
): Promise<{ error?: string }> {
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
  const path = coursePath(courseId) + "/materi";
  revalidatePath(path);
  redirect(path + "/" + material.id);
}
