import { expect, test } from "@playwright/test";

// Placeholder so the pipeline has an end-to-end layer before the flag service lands.
test("the app boots and renders its heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Concept Scoreboard" })).toBeVisible();
});
