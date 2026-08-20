import { expect, test } from "./fixtures";

const enabled = process.env.WORKOS_CLOUD_E2E === "1";
const userA = process.env.WORKOS_CLOUD_E2E_USER_A ?? "user.a@isolation.test";
const userB = process.env.WORKOS_CLOUD_E2E_USER_B ?? "user.b@isolation.test";
const userC = process.env.WORKOS_CLOUD_E2E_USER_C ?? "user.c@isolation.test";
const password = process.env.WORKOS_CLOUD_E2E_PASSWORD ?? "OwnerPass12";

test.describe("Cloud two-organization isolation", () => {
  test.skip(!enabled, "requires isolated Cloud QA stack");

  test("USER_A sees only Atelier Alpha and has no switcher", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email").fill(userA);
    await page.getByLabel("Parolă").fill(password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByLabel("Organizație curentă")).toContainText("Atelier Alpha");
    await expect(page.getByLabel("Schimbă organizația")).toHaveCount(0);
    await page.getByRole("link", { name: "Comercial" }).click();
    await page.getByRole("link", { name: "Clienți" }).click();
    await expect(page.getByText("Client Alpha")).toBeVisible();
    await expect(page.getByText("Client Test")).toHaveCount(0);
    await page.screenshot({
      path: "docs/worklog/screenshots/slice4-user-a.png",
      fullPage: true,
    });
  });

  test("USER_B sees only TEST COMPANY and no HUB equipment", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email").fill(userB);
    await page.getByLabel("Parolă").fill(password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByLabel("Organizație curentă")).toContainText("TEST COMPANY");
    await expect(page.getByLabel("Schimbă organizația")).toHaveCount(0);
    await page.getByRole("link", { name: "Comercial" }).click();
    await page.getByRole("link", { name: "Clienți" }).click();
    await expect(page.getByText("Client Test")).toBeVisible();
    await expect(page.getByText("Client Alpha")).toHaveCount(0);
    await page.getByRole("link", { name: "Administrare" }).click();
    await page.getByRole("link", { name: "Utilaje și zone" }).click();
    await expect(page.getByText("MCH-CNC-4020")).toHaveCount(0);
    await page.screenshot({
      path: "docs/worklog/screenshots/slice4-user-b.png",
      fullPage: true,
    });
  });

  test("USER_C must choose an organization and loses operator identity on switch", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Email").fill(userC);
    await page.getByLabel("Parolă").fill(password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByLabel("Organizație")).toBeVisible();
    await page.getByLabel("Organizație").selectOption({ label: "Atelier Alpha" });
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByLabel("Organizație curentă")).toContainText("Atelier Alpha");
    await page.getByRole("link", { name: "Comercial" }).click();
    await page.getByRole("link", { name: "Clienți" }).click();
    await expect(page.getByText("Client Alpha")).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/slice4-switch-a.png",
      fullPage: true,
    });

    await page.getByLabel("Schimbă organizația").selectOption({ label: "TEST COMPANY" });
    await expect(page.getByLabel("Organizație curentă")).toContainText("TEST COMPANY");
    await expect(page.getByRole("button", { name: "Identifică-te" })).toBeVisible();
    await expect(page.getByText("Client Alpha")).toHaveCount(0);
    await expect(page.getByText("Client Test")).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/slice4-switch-b.png",
      fullPage: true,
    });
  });
});
