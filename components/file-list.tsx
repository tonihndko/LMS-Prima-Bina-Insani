type Attachment = { id: string; filename: string; size: number };

const sizeFormat = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

function sizeLabel(bytes: number) {
  if (bytes >= 1024 * 1024) return sizeFormat.format(bytes / (1024 * 1024)) + " MB";
  if (bytes >= 1024) return sizeFormat.format(bytes / 1024) + " KB";
  return bytes + " B";
}

export function FileList({ files }: { files: Attachment[] }) {
  if (!files.length) return null;
  return (
    <ul className="file-list">
      {files.map((file) => (
        <li key={file.id}>
          <div className="file-info"><strong>{file.filename}</strong><small>{sizeLabel(file.size)}</small></div>
          <a className="button compact secondary" href={"/berkas/" + file.id} aria-label={"Unduh " + file.filename}>Unduh</a>
        </li>
      ))}
    </ul>
  );
}
