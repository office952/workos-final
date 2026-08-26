import { expect, test } from "@playwright/test";

const shot = (name: string) => `docs/worklog/screenshots/hf-wave3-${name}.png`;

function syntheticPassword(): string {
  const value = process.env.WORKOS_WAVE3_CLOUD_PASSWORD ?? "";
  if (!value) {
    throw new Error("WORKOS_WAVE3_CLOUD_PASSWORD missing for Cloud login E2E");
  }
  return value;
}

test.describe("Wave 3 Cloud login gate", () => {
  test("shows boot then missing-config without treating it as a wrong password", async ({
    page,
  }) => {
    let releaseSession: (() => void) | null = null;
    const held = new Promise<void>((resolve) => {
      releaseSession = resolve;
    });
    await page.route("**/api/cloud/session", async (route) => {
      await held;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          mode: "cloud",
          authConfigured: false,
          user: null,
          organization: null,
          memberships: [],
        }),
      });
    });
    const navigation = page.goto("/atelier");
    await expect(page.getByRole("heading", { name: "Se încarcă" })).toBeVisible();
    await page.screenshot({ path: shot("cloud-loading"), fullPage: true });
    releaseSession?.();
    await navigation;
    await expect(page.getByRole("heading", { name: "Autentificare indisponibilă" })).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveCount(0);
    await page.screenshot({ path: shot("auth-config-missing"), fullPage: true });
  });

  test("rejects invalid credentials and returns to the intended route after login", async ({
    page,
  }) => {
    const password = syntheticPassword();
    await page.goto("/atelier");
    await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Sari la autentificare" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#autentificare")).toBeFocused();
    await page.screenshot({ path: shot("cloud-login"), fullPage: true });
    await page.getByLabel("Email").fill("owner.wave3@example.test");
    await page.getByLabel("Parolă").fill("WrongPass12");
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("alert")).toHaveText("Email sau parolă greșită.");
    await expect(page.getByText("WrongPass12")).toHaveCount(0);
    await page.screenshot({ path: shot("login-error"), fullPage: true });

    await page.getByLabel("Parolă").fill(password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
    await expect(page).toHaveURL(/\/atelier(?:#.*)?$/);
    await expect(page.getByLabel("Organizație curentă")).toBeVisible();
    await page.goto("/atelier");
    await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#continut-principal")).toBeFocused();

    await page.goto("/atelier?next=https://evil.example");
    await expect(page).toHaveURL(/\/atelier/);
    await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();

    await page.getByRole("button", { name: "Ieși din cont" }).click();
    await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
  });
});
