import { expect, type Page } from "@playwright/test";

export async function openAccountMenu(page: Page): Promise<void> {
  const panel = page.getByRole("dialog", { name: "Datele contului" });
  if (await panel.isVisible()) {
    return;
  }
  await page.getByRole("button", { name: "Cont", exact: true }).click();
  await expect(panel).toBeVisible();
}

export async function closeAccountMenu(page: Page): Promise<void> {
  const panel = page.getByRole("dialog", { name: "Datele contului" });
  if (!(await panel.isVisible())) {
    return;
  }
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
}

export async function setTheme(page: Page, name: "Deschisă" | "Întunecată" | "Sistem"): Promise<void> {
  await openAccountMenu(page);
  await page.getByRole("button", { name }).click();
  await closeAccountMenu(page);
}

export async function logoutCloudFromMenu(page: Page): Promise<void> {
  await openAccountMenu(page);
  await page.getByRole("button", { name: "Ieși din cont" }).click();
}

export async function expectAccountOrganization(page: Page, name: string): Promise<void> {
  await openAccountMenu(page);
  await expect(page.getByRole("dialog", { name: "Datele contului" })).toContainText(name);
  await closeAccountMenu(page);
}

export async function switchOrganization(page: Page, label: string): Promise<void> {
  await openAccountMenu(page);
  await page.getByLabel("Schimbă organizația").selectOption({ label });
}
