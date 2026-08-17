import { expect, test } from "./fixtures";

test("catalog shows ACM cassette and confirms honest partial EIC", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Produse" }).click();
  await expect(page.getByRole("heading", { name: "Produse" })).toBeVisible();
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
  await expect(page.getByText("Sistem de prindere: Cornier oțel")).toBeVisible();
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
  await expect(page.getByText("Prindere cadru intern").first()).toBeVisible();
  await expect(page.getByText("Ambalare").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-processes.png",
    fullPage: true,
  });

  await expect(page.locator(".eic-section").getByText("Parțial", { exact: true })).toBeVisible();
  await expect(page.getByText("Evidență de cost indisponibilă")).toBeVisible();
  await expect(page.getByText("Preț final client")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-eic-partial.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "Panou ACM casetat" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/acm-narrow.png",
    fullPage: true,
  });
});
