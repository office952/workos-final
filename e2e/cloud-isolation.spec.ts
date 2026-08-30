import { expect, test } from "./fixtures";
import { expectAccountOrganization, switchOrganization } from "./helpers/account";

function requiredEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

const enabled = process.env.WORKOS_CLOUD_E2E === "1";
const userA = requiredEnv("WORKOS_CLOUD_E2E_USER_A");
const userB = requiredEnv("WORKOS_CLOUD_E2E_USER_B");
const userC = requiredEnv("WORKOS_CLOUD_E2E_USER_C");
const password = requiredEnv("WORKOS_CLOUD_E2E_PASSWORD");
const orgA = requiredEnv("WORKOS_CLOUD_E2E_ORG_A") ?? "Atelier Alpha";
const orgB = requiredEnv("WORKOS_CLOUD_E2E_ORG_B") ?? "TEST COMPANY";
const missingCredentials = [
  !userA ? "WORKOS_CLOUD_E2E_USER_A" : undefined,
  !userB ? "WORKOS_CLOUD_E2E_USER_B" : undefined,
  !userC ? "WORKOS_CLOUD_E2E_USER_C" : undefined,
  !password ? "WORKOS_CLOUD_E2E_PASSWORD" : undefined,
].filter((name): name is string => Boolean(name));

test.describe("Cloud two-organization isolation", () => {
  test.skip(!enabled, "requires isolated Cloud QA stack (WORKOS_CLOUD_E2E=1)");
  test.skip(
    enabled && missingCredentials.length > 0,
    `Cloud E2E requires explicit credentials: ${missingCredentials.join(", ")}. No implicit password fallback.`,
  );

  test("USER_A sees only Atelier Alpha and has no switcher", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email").fill(userA ?? "");
    await page.getByLabel("Parolă").fill(password ?? "");
    await page.getByRole("button", { name: "Intră" }).click();
    await expectAccountOrganization(page, orgA);
    await expect(page.getByLabel("Schimbă organizația")).toHaveCount(0);
    await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Clienți" }).click();
    await expect(page.getByText("Client Alpha")).toBeVisible();
    await expect(page.getByText("Client Test")).toHaveCount(0);
    await page.screenshot({
      path: "docs/worklog/screenshots/slice4-user-a.png",
      fullPage: true,
    });
  });

  test("USER_B sees only TEST COMPANY and no HUB equipment", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Email").fill(userB ?? "");
    await page.getByLabel("Parolă").fill(password ?? "");
    await page.getByRole("button", { name: "Intră" }).click();
    await expectAccountOrganization(page, orgB);
    await expect(page.getByLabel("Schimbă organizația")).toHaveCount(0);
    await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Clienți" }).click();
    await expect(page.getByText("Client Test")).toBeVisible();
    await expect(page.getByText("Client Alpha")).toHaveCount(0);
    await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Utilaje" }).click();
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
    await page.getByLabel("Email").fill(userC ?? "");
    await page.getByLabel("Parolă").fill(password ?? "");
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByLabel("Organizație")).toBeVisible();
    await page.getByLabel("Organizație").selectOption({ label: orgA });
    await page.getByRole("button", { name: "Intră" }).click();
    await expectAccountOrganization(page, orgA);
    await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Clienți" }).click();
    await expect(page.getByText("Client Alpha")).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/slice4-switch-a.png",
      fullPage: true,
    });

    await switchOrganization(page, orgB);
    await expectAccountOrganization(page, orgB);
    await expect(page.getByRole("button", { name: "Identifică-te" })).toBeVisible();
    await expect(page.getByText("Client Alpha")).toHaveCount(0);
    await expect(page.getByText("Client Test")).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/slice4-switch-b.png",
      fullPage: true,
    });
  });
});
