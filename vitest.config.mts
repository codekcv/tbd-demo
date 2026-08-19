import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node environment on purpose: unit tests here cover pure logic (flag rule
    // evaluation, bucketing, registry validation). Browser behaviour is Playwright's job.
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "tests/**"],
  },
});
