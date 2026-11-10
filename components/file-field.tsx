"use client";

import { acceptedFiles, MAX_FILE_MB, MAX_FILES, validateFiles } from "@/lib/file-policy";

export function FileField({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <div className="file-field">
      <label htmlFor="files">{label}</label>
      <input
        id="files"
        name="files"
        type="file"
        accept={acceptedFiles}
        multiple
        required={required}
        aria-describedby="file-help"
        onChange={(event) => {
          const input = event.currentTarget;
          input.setCustomValidity(validateFiles(Array.from(input.files ?? [])) ?? "");
        }}
      />
      <p id="file-help" className="muted">Maksimal {MAX_FILES} berkas, {MAX_FILE_MB} MB per berkas. Mendukung PDF, Word, PowerPoint, Excel, teks, gambar, ZIP, audio, dan MP4.</p>
    </div>
  );
}
