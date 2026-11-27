import { execSync } from "node:child_process";
import "dotenv/config";

// Tes menghapus seluruh data, jadi wajib memakai database terpisah dari DATABASE_URL.
export default function setup() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("Isi TEST_DATABASE_URL di .env dengan database khusus tes (bukan database utama).");
  if (url === process.env.DATABASE_URL) throw new Error("TEST_DATABASE_URL tidak boleh sama dengan DATABASE_URL.");
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
}
