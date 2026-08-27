import { expect, test } from "./fixtures";
import { selectOrCreateCustomer } from "./helpers/customers";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

test("catalog shows ACM cassette and confirms complete EIC plus quote", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Catalog" }).click();
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Panou ACM casetat" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-catalog-two-products.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Panou ACM casetat" }).click();
  await expect(page.getByRole("heading", { name: "Panou ACM casetat" })).toBeVisible();
  await expect(page.getByText("Material casetă: ACM 3 mm")).toBeVisible();
  await expect(page.getByText("Cadru intern: Profil oțel")).toBeVisible();
  await expect(page.getByText("Iluminare: Fără iluminare")).toBeVisible();
  await expect(page.getByLabel("Sistem de prindere")).toBeVisible();
  await expect(page.getByText("PRD-ACM-CASSETTE-NONE")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-config-initial.png",
    fullPage: true,
  });

  await page.getByLabel("Denumire lucrare").fill("PANOU ACM");
  await page.getByLabel("Sistem de prindere").selectOption("steel_angle");
  await page.getByLabel("Lățime exterioară (mm)").fill("1000");
  await page.getByLabel("Înălțime exterioară (mm)").fill("500");
  await page.getByLabel("Adâncime casetă (mm)").selectOption("40");
  await page.getByLabel("Număr de îndoituri").selectOption("2");
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-config-filled.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(
    page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();

  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  const confirmed = page.locator("section.result-section").filter({
    has: page.getByRole("heading", { name: "Configurație confirmată" }),
  });
  await expect(confirmed.getByText("Sistem de prindere: Cornier oțel")).toBeVisible();
  await expect(page.getByText("Lățime exterioară: 1000 mm (introdus de operator)")).toBeVisible();
  await expect(page.getByText("Suprafață față: 0,5 m²")).toBeVisible();
  await expect(page.getByText("Lățime exterioară cadru: 0,99 m")).toBeVisible();
  await expect(page.getByText("Înălțime exterioară cadru: 0,49 m")).toBeVisible();
  await expect(page.getByText("Perimetru cadru intern: 2,97 m")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-confirmed-truth.png",
    fullPage: true,
  });

  await expect(page.getByText("Foaie dezvoltată (implicit, nu nesting): 0,63 m²")).toBeVisible();
  await expect(page.getByText("Perimetru cadru intern: 2,97 m")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-quantities.png",
    fullPage: true,
  });

  await expect(page.getByText("Debitare foaie CNC").first()).toBeVisible();
  await expect(page.getByText("Formare casetă din foaie").first()).toBeVisible();
  await expect(page.getByText("Prindere cadru intern").first()).toBeVisible();
  await expect(page.getByText("Ambalare").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-processes.png",
    fullPage: true,
  });

  const eic = page.locator(".eic-section");
  await expect(eic.getByText("Complet", { exact: true })).toBeVisible();
  await expect(eic.getByText("Total cost intern estimat: 72,64 EUR")).toBeVisible();
  await expect(eic.getByText("ACM 3 mm: 0,63 m²", { exact: true })).toBeVisible();
  await expect(eic.getByText("Profil oțel cadru intern: 2,97 m", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-eic-complete.png",
    fullPage: true,
  });
  await eic.getByText("Detalii cost intern").click();
  await expect(eic.getByText("ACM 3 mm: 0,63 m² × 32,00 EUR/m² = 20,04 EUR")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-material-breakdown.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-process-breakdown.png",
    fullPage: true,
  });

  const quoteReady = page.locator(".quote-section");
  await expect(quoteReady.getByText("Preț final client: 118,66 EUR")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-commercial-complete.png",
    fullPage: true,
  });

  const quote = page.locator(".quote-section");
  await expect(quote.getByRole("button", { name: "Creează oferta" })).toBeVisible();
  await selectOrCreateCustomer(page, "Client Demo ACM");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByRole("heading", { name: /Ofertă creată|Ofertă acceptată/ })).toBeVisible();
  await expect(quote.getByText("Preț final: 118,66 EUR")).toBeVisible();
  await expect(quote.getByText("Client: Client Demo ACM")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-quote-frozen.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "Panou ACM casetat" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-narrow.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/admin/resources");
  await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
  await page.getByRole("button", { name: "ACM" }).click();
  await expect(page.getByRole("heading", { name: "ACM 3 mm" })).toBeVisible();
  await expect(page.getByText("32,00 EUR / m²")).toBeVisible();
  await expect(page.getByText("Decizie AI / pilot").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-admin-cost-evidence.png",
    fullPage: true,
  });
});
