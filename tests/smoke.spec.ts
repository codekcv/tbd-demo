import { expect, test } from "@playwright/test";

test("the app boots and renders its heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Concept Scoreboard" })).toBeVisible();
});

// Asserts the indicator renders in either state on purpose. Asserting "connected" would
// tie the health of trunk to the uptime of a Convex deployment, and a red trunk should
// mean our code is broken, not that someone else's service blinked.
test("the convex status indicator renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/connect(ed|ing) to convex|convex connected/)).toBeVisible();
});
