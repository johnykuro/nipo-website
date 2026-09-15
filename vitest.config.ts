import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["worker/**/*.test.ts", "netlify/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
