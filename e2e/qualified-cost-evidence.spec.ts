import { expect, test } from "./fixtures";
import { adminHomeLink } from "./helpers/navigation";

test("owner can create and edit a qualified cost row without losing the qualifier", async ({
  page,
}) => {
  await page.goto("/admin");
  await adminHomeLink(page, "Resurse și cost intern").click();
  await expect(
    page.getByRole("heading", { name: "Resurse și cost intern" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dovezi de cost" }).click();
  await page.getByRole("button", { name: /Adaugă dovadă — Profil aluminiu/ }).click();
  await page.getByLabel("Adâncime volum").fill("40");
  await page.getByLabel("Tarif").fill("2.5");
  await page.getByRole("button", { name: "Confirmă tarif" }).click();
  await expect(page.getByText("Adâncime volum").first()).toBeVisible();
  await expect(page.getByText("40 mm").first()).toBeVisible();
  await expect(page.getByText("2,50 EUR / m · Adâncime volum: 40 mm").first()).toBeVisible();
  await expect(page.getByText("volumeDepthMm")).toHaveCount(0);

  await page.getByRole("button", { name: "Confirmă tarif" }).click();
  const amount = page.getByLabel("Tarif");
  await amount.fill("2.75");
  await page.getByRole("button", { name: "Confirmă tarif" }).click();
  await expect(page.getByText("2,75 EUR / m · Adâncime volum: 40 mm").first()).toBeVisible();
  await expect(page.getByText("40 mm").first()).toBeVisible();
  await expect(page.getByLabel("Adâncime volum")).toHaveCount(0);
});
