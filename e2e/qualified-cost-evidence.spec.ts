import { expect, test } from "./fixtures";
import { adminHomeLink } from "./helpers/navigation";

test("owner can add and edit a qualified tariff from Costuri interne", async ({
  page,
}) => {
  await page.goto("/admin");
  await adminHomeLink(page, "Resurse și cost intern").click();
  await expect(page.getByRole("heading", { name: "Resurse și costuri" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Costuri interne" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("button", { name: "Alege elementul" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Dovezi de cost" })).toHaveCount(0);

  await page.getByRole("button", { name: "Adaugă tarif" }).click();
  await expect(page.getByRole("dialog", { name: "Adaugă tarif" })).toBeVisible();
  const addDrawer = page.getByRole("dialog", { name: "Adaugă tarif" });
  await addDrawer.getByLabel("Resursă").selectOption({ label: "Profil aluminiu 0,6 mm" });
  await addDrawer.getByLabel("Adâncime volum").fill("40");
  await addDrawer.getByRole("textbox", { name: "Tarif" }).fill("2.50");
  await addDrawer.getByRole("button", { name: "Salvează tarif" }).click();

  await expect(page.getByRole("dialog", { name: "Adaugă tarif" })).toHaveCount(0);
  await expect(page.getByText("2,50 EUR / m").first()).toBeVisible();
  await expect(page.getByText("40 mm").first()).toBeVisible();
  await expect(page.getByText("volumeDepthMm")).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Profil aluminiu 0,6 mm" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Profil aluminiu 0,6 mm" })).toHaveCount(0);
  await page.getByRole("row", { name: /Profil aluminiu 0,6 mm/ }).filter({ hasText: "40 mm" }).click();
  await expect(page.getByRole("dialog", { name: "Profil aluminiu 0,6 mm" })).toBeVisible();
  await page.getByRole("button", { name: "Editează tarif" }).click();
  await expect(page.getByLabel("Adâncime volum")).toHaveCount(0);
  const amount = page.getByRole("textbox", { name: "Tarif" });
  await amount.fill("2.75");
  await page.getByRole("button", { name: "Salvează tarif" }).click();
  await expect(page.getByText("2,75 EUR / m").first()).toBeVisible();
  await expect(page.getByText("40 mm").first()).toBeVisible();
});
