import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest config.
 *
 * The `@` alias mirrors `tsconfig.json`'s `paths` (`@/*` -> `./src/*`); without
 * it every `@/...` import in a test fails to resolve.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});