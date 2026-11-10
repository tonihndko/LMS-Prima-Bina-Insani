import type { Prisma } from "@/generated/prisma/client";
import { getViewer } from "@/lib/access";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const user = await getViewer();
  if (!user || user.role === "ADMIN") return new Response(null, { status: 404 });

  const { fileId } = await params;
  const course: Prisma.CourseWhereInput = user.role === "TEACHER"
    ? { teacherId: user.id }
    : { enrollments: { some: { studentId: user.id } } };
  const file = await db.attachment.findFirst({
    where: {
      id: fileId,
      OR: [
        { material: { course } },
        { submission: { assignment: { course }, ...(user.role === "STUDENT" ? { studentId: user.id } : {}) } },
      ],
    },
    select: { filename: true, size: true, content: true },
  });
  if (!file) return new Response(null, { status: 404 });

  const escaped = encodeURIComponent(file.filename).replace(/['()*]/g, (value) =>
    "%" + value.charCodeAt(0).toString(16).toUpperCase()
  );
  const fallback = file.filename.replace(/[^\w. -]/g, "_");
  return new Response(new Uint8Array(file.content), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="' + fallback + '"; filename*=UTF-8\'\'' + escaped,
      "Content-Length": String(file.size),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
