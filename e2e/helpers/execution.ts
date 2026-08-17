import { expect, type Page } from "@playwright/test";

export async function openExecutionWorkspace(page: Page) {
  await page.getByRole("link", { name: "Deschide execuția" }).click();
  await expect(page).toHaveURL(/\/execution\/exp:/);
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toBeVisible();
}
