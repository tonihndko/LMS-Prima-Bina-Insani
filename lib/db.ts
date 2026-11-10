import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalDb = globalThis as typeof globalThis & { primeCapsDb?: PrismaClient };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Jalankan npm run setup untuk membuat konfigurasi database.");

export const db =
  globalDb.primeCapsDb ?? new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

if (process.env.NODE_ENV !== "production") globalDb.primeCapsDb = db;
