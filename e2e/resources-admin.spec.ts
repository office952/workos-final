import { mkdir } from "node:fs/promises";
import { expect, test } from "./fixtures";
import { setTheme } from "./helpers/account";
import { adminHomeLink } from "./helpers/navigation";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

const EVIDENCE_DIR = ".tmp/review/resources-cost-ux-amend";

test("resources admin is a flat rate workspace, not a catalog cascade", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
  await expect(adminHomeLink(page, "Sistem produs")).toBeVisible();
  await expect(adminHomeLink(page, "Resurse și cost intern")).toBeVisible();

  await adminHomeLink(page, "Resurse și cost intern").click();
  await expect(page.getByRole("heading", { name: "Resurse și costuri" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Costuri interne" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(page.getByRole("button", { name: "Adaugă tarif" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Costuri interne" })).toBeVisible();
  await expect(page.getByText("Plexiglas 3 mm opal").first()).toBeVisible();
  await expect(page.getByText("16,00 EUR / m²").first()).toBeVisible();
  await expect(page.getByText("Profil aluminiu 0,6 mm").first()).toBeVisible();
  await expect(page.getByText("30 mm").first()).toBeVisible();
  await expect(page.getByText("60 mm").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Alege elementul" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Dovezi de cost" })).toHaveCount(0);
  await expect(page.getByText("volumeDepthMm")).toHaveCount(0);

  await page.getByRole("button", { name: "Resurse" }).click();
  await expect(page.getByText("Plexiglas 3 mm opal").first()).toBeVisible();
  await expect(page.getByText(/Material · Plexiglas/).first()).toBeVisible();

  await page.getByRole("button", { name: "Rețete" }).click();
  await expect(page.getByText("Formare profil aluminiu").first()).toBeVisible();
  await expect(page.getByText("Aplicare folie față").first()).toBeVisible();

  await mkdir(EVIDENCE_DIR, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/admin/resources");
  await expect(page.getByRole("heading", { name: "Resurse și costuri" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Costuri interne" })).toBeVisible();
  await page.screenshot({
    path: `${EVIDENCE_DIR}/01-costuri-interne-1440-light.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Adaugă tarif" }).click();
  await expect(page.getByRole("dialog", { name: "Adaugă tarif" })).toBeVisible();
  await page.screenshot({
    path: `${EVIDENCE_DIR}/02-adauga-tarif-1440-light.png`,
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Adaugă tarif" })).toHaveCount(0);

  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/admin/resources");
  await expect(page.getByRole("heading", { name: "Resurse și costuri" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Adaugă tarif" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Alege elementul" })).toHaveCount(0);
  await expect(page.getByText("16,00 EUR / m²").first()).toBeVisible();
  await expect(page.getByRole("table", { name: "Costuri interne" })).toBeVisible();
  await page.screenshot({
    path: `${EVIDENCE_DIR}/03-costuri-interne-768-light.png`,
    fullPage: true,
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await setTheme(page, "Întunecată");
  await page.goto("/admin/resources");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("table", { name: "Costuri interne" })).toBeVisible();
  await page.screenshot({
    path: `${EVIDENCE_DIR}/04-costuri-interne-1440-dark.png`,
    fullPage: true,
  });
  await setTheme(page, "Deschisă");

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await expect(page.getByText("Total cost intern estimat: 382,50 EUR")).toBeVisible();
  await expect(page.getByText("Preț final client: 624,82 EUR")).toBeVisible();
});
