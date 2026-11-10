import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";

const env = [
  'DATABASE_URL="postgresql://primecaps:primecaps_local@127.0.0.1:15432/primecaps"',
  'BETTER_AUTH_URL="http://127.0.0.1:3030"',
  'BETTER_AUTH_SECRET="' + randomBytes(32).toString("hex") + '"',
  "",
].join("\n");

try {
  await writeFile(new URL("../.env", import.meta.url), env, { flag: "wx", mode: 0o600 });
} catch (error) {
  if (error.code !== "EEXIST") throw error;
}
