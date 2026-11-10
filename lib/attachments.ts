import "server-only";
import { cleanFilename, validateFiles } from "./file-policy";

export function readUploads(form: FormData) {
  const files = form.getAll("files").filter((entry): entry is File => {
    if (!(entry instanceof File)) return false;
    // Multipart decoders can assign a placeholder name to an unselected input.
    return entry.size !== 0 || !["", "blob", "undefined"].includes(entry.name);
  });
  return { files, error: validateFiles(files) };
}

export async function attachmentRows(files: File[]) {
  return Promise.all(files.map(async (file) => ({
    filename: cleanFilename(file.name),
    size: file.size,
    content: new Uint8Array(await file.arrayBuffer()),
  })));
}

export const attachmentMetadata = { id: true, filename: true, size: true } as const;
