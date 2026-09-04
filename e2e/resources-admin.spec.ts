import { mkdir } from "node:fs/promises";
import { expect, test } from "./fixtures";
import { setTheme } from "./helpers/account";
import { CANONICAL_PRODUCT_CODE } from "./helpers/jobs";
import { adminHomeLink } from "./helpers/navigation";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

const ACM_PRODUCT_CODE = "PRD-ACM-CASSETTE-NONE";
const LETTERS_LABEL =
  "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm";

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
  await expect(page.getByLabel("Produs")).toHaveValue("");
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

test("resources workspace filters by ProductTemplate context", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/admin/resources");
  await expect(page.getByRole("heading", { name: "Resurse și costuri" })).toBeVisible();
  await expect(page.getByLabel("Produs")).toHaveValue("");
  await expect(page.getByRole("table", { name: "Costuri interne" })).toBeVisible();
  await expect(page.getByText("Profil aluminiu 0,6 mm").first()).toBeVisible();
  await expect(page.getByText("ACM 3 mm").first()).toBeVisible();

  await page.getByLabel("Produs").selectOption({ label: LETTERS_LABEL });
  await expect(page).toHaveURL(new RegExp(`product=${CANONICAL_PRODUCT_CODE}`));
  await expect(page.getByText("30 mm").first()).toBeVisible();
  await expect(page.getByText("60 mm").first()).toBeVisible();
  await expect(page.getByText("80 mm").first()).toBeVisible();
  await expect(page.getByText("100 mm").first()).toBeVisible();
  await expect(page.getByText("Plexiglas 3 mm opal").first()).toBeVisible();
  await expect(page.getByText("Ambalare").first()).toBeVisible();
  await expect(page.getByText("ACM 3 mm")).toHaveCount(0);

  await page.getByRole("button", { name: "Resurse" }).click();
  await expect(page.getByText("Plexiglas 3 mm opal").first()).toBeVisible();
  await expect(page.getByText("Manoperă montaj la locație")).toHaveCount(0);
  await page.getByRole("button", { name: "Rețete" }).click();
  await expect(page.getByText("Formare profil aluminiu").first()).toBeVisible();
  await expect(page.getByText("Debitare CNC foaie panou")).toHaveCount(0);
  await page.getByRole("button", { name: "Costuri interne" }).click();

  await page.getByRole("button", { name: "Adaugă tarif" }).click();
  const addTariff = page.getByRole("dialog", { name: "Adaugă tarif" });
  await expect(addTariff).toBeVisible();
  await expect(addTariff.locator("optgroup[label='Folosite de produs']")).toHaveCount(1);
  await expect(addTariff.locator("optgroup[label='Toate resursele']")).toHaveCount(1);
  await expect(addTariff.getByRole("option", { name: "Profil aluminiu 0,6 mm" })).toHaveCount(1);
  await expect(addTariff.getByRole("option", { name: "Manoperă montaj la locație" })).toHaveCount(1);
  await page.keyboard.press("Escape");

  await page.getByLabel("Produs").selectOption({ label: "Panou ACM casetat" });
  await expect(page).toHaveURL(new RegExp(`product=${ACM_PRODUCT_CODE}`));
  await expect(page.getByText("ACM 3 mm").first()).toBeVisible();
  await expect(page.getByText("Ambalare").first()).toBeVisible();
  await expect(page.getByText("Profil aluminiu 0,6 mm")).toHaveCount(0);
  await expect(page.getByText("Plexiglas 3 mm opal")).toHaveCount(0);

  await page.getByLabel("Produs").selectOption({ label: "Toate produsele" });
  await expect(page).not.toHaveURL(/[?&]product=/);
  await expect(page.getByText("Profil aluminiu 0,6 mm").first()).toBeVisible();
  await expect(page.getByText("ACM 3 mm").first()).toBeVisible();

  await page.goto(`/admin/resources?product=${CANONICAL_PRODUCT_CODE}`);
  await expect(page.getByLabel("Produs")).toHaveValue(CANONICAL_PRODUCT_CODE);
  await expect(page.getByText("30 mm").first()).toBeVisible();
  await expect(page.getByText("ACM 3 mm")).toHaveCount(0);

  await page.goto("/admin/product-system");
  await expect(page.getByRole("heading", { name: "Sistem produs" })).toBeVisible();
  await page.getByRole("button", { name: "Produse" }).click();
  await page.getByRole("button", { name: /Litere volumetrice luminoase/ }).click();
  await page.locator("#continut-principal").getByRole("link", { name: "Resurse și costuri" }).click();
  await expect(page.getByRole("heading", { name: "Resurse și costuri" })).toBeVisible();
  await expect(page.getByLabel("Produs")).toHaveValue(CANONICAL_PRODUCT_CODE);
});
