import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      // "server-only" melempar error di luar React Server; tes memanggil modul server secara langsung.
      "server-only": path.resolve(__dirname, "tests/server-only-stub.ts"),
    },
  },
  test: {
    globalSetup: ["tests/global-setup.ts"],
    // Satu database tes dipakai bersama, jadi berkas tes dijalankan berurutan.
    fileParallelism: false,
  },
});
