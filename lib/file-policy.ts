export const MAX_FILES = 3;
export const MAX_FILE_MB = 20;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

const formats = [
  "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "csv", "txt", "md",
  "jpg", "jpeg", "png", "webp", "gif", "zip", "mp3", "m4a", "wav", "mp4",
];

export const acceptedFiles = formats.map((format) => "." + format).join(",");

export function cleanFilename(name: string) {
  return (name.split(/[\\/]/).at(-1) ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

export function validateFiles(files: Pick<File, "name" | "size">[]) {
  if (files.length > MAX_FILES) return "Pilih maksimal " + MAX_FILES + " berkas.";
  for (const file of files) {
    const filename = cleanFilename(file.name);
    const dot = filename.lastIndexOf(".");
    const extension = dot > 0 ? filename.slice(dot + 1).toLowerCase() : "";
    if (!formats.includes(extension) || filename.length > 180) {
      return "Format atau nama berkas tidak didukung: " + filename.slice(0, 180);
    }
    if (file.size === 0 || file.size > MAX_FILE_BYTES) {
      return "Ukuran setiap berkas harus lebih dari 0 dan maksimal " + MAX_FILE_MB + " MB.";
    }
  }
  return null;
}
