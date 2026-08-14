import { expect, test } from "@playwright/test";

test("health loop is real and survives reload", async ({ page }) => {
  const fatalErrors: string[] = [];

  page.on("pageerror", (error) => {
    fatalErrors.push(error.message);
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "WorkOS Final" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stare sistem" })).toBeVisible();
  await expect(page.getByText("Backend conectat")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "WorkOS Final" })).toBeVisible();
  await expect(page.getByText("Backend conectat")).toBeVisible();

  expect(fatalErrors).toEqual([]);
});
