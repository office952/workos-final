import { expect, test } from "./fixtures";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

test("catalog leads to canonical product confirm and partial EIC", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Produse" }).click();

  await expect(page.getByRole("heading", { name: "Produse" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Litere și semne volumetrice luminoase" }),
  ).toBeVisible();
  await expect(page.getByText("Familie", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Produs", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Panou ACM casetat" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-products.png",
    fullPage: true,
  });

  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    }),
  ).toBeVisible();
  await expect(page.getByText("Material față: Plexiglas 3 mm opal")).toBeVisible();
  await expect(page.getByText("Material volum: Aluminiu 0,6 mm")).toBeVisible();
  await expect(page.getByText("Material spate: Forex 10 mm")).toBeVisible();
  await expect(page.getByText("Iluminare: Iluminare frontală")).toBeVisible();
  await expect(page.getByLabel("Include iluminare")).toHaveCount(0);
  await expect(page.getByLabel("Pas module LED")).toHaveCount(0);
  await expect(page.getByLabel("Rezervă sursă de alimentare")).toHaveCount(0);
  await expect(page.getByText("Setări tehnice")).toHaveCount(0);
  await expect(page.getByText("PRD-LETTERS-FRONTLIT-PLEXI-AL06")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-fresh.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Verifică configurația" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-config-narrow.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByText("Mai sunt informații de completat.")).toBeVisible();
  await expect(page.getByText("Probleme de rezolvat:")).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({ hasText: "Suprafață confirmată (mm²)" }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-readiness.png",
    fullPage: true,
  });

  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("vinyl");
  await page.getByLabel("Culoare față").fill("alb");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-configure.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/settings-product-configure.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/config-product-configure.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-filled.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" })).toBeVisible();
  await expect(page.getByText("Revizuiți configurația.")).toBeVisible();
  await expect(page.getByText("Suprafață confirmată (mm²): 250000")).toBeVisible();
  await expect(page.getByLabel("Textul literelor")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Modifică configurația" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-product-review.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/settings-product-review.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/config-product-review.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-review.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-review.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await expect(page.getByText("Lungime volum: 12,5 m")).toBeVisible();
  await expect(page.getByText("Suprafață față: 0,25 m²")).toBeVisible();
  await expect(page.getByText("Suprafață spate: 0,25 m²")).toBeVisible();
  await expect(page.getByText("Module LED: 125 buc", { exact: true })).toBeVisible();
  await expect(page.getByText("Putere totală LED: 93,75 W")).toBeVisible();
  await expect(page.getByText("Necesar sursă cu rezervă: 117,19 W")).toBeVisible();
  await expect(page.getByText("Sursă selectată 160 W: 1 buc")).toBeVisible();
  await expect(page.getByText("Modul LED 12V: 125 buc", { exact: true })).toBeVisible();
  await expect(page.getByText("Sursă LED 12V 160W: 1 buc", { exact: true })).toBeVisible();
  await expect(page.getByText("Total cost intern estimat: 386,00 EUR")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Materiale" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Servicii" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Manoperă" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Iluminare" }).first()).toBeVisible();
  await expect(page.getByText("Folie Oracal 651: 0,25 m²", { exact: true })).toBeVisible();
  await expect(page.getByText("Aplicare folie față: 0,25 m²", { exact: true })).toBeVisible();
  await expect(page.getByText("Debitare CNC față: 12,5 m", { exact: true })).toBeVisible();
  await expect(page.getByText("Lipire față-volum: 12,5 m", { exact: true })).toBeVisible();
  await expect(page.getByText("Montare module LED: 125 buc", { exact: true })).toBeVisible();
  await expect(page.getByText("Costul intern rămâne parțial: Costuri încă în calibrare.")).toBeVisible();
  await expect(page.locator(".eic-section").getByText("Geometrie confirmată.")).toBeVisible();
  await expect(
    page.getByText("Cantitatea de module LED nu poate fi calculată", { exact: false }),
  ).toHaveCount(0);
  await expect(page.getByText("Regula de rezervă PSU nu este stabilită")).toHaveCount(0);
  await expect(page.getByText("25 %")).toHaveCount(0);
  await expect(page.getByText("psuReservePercent")).toHaveCount(0);
  await expect(page.getByText("regula de pas LED")).toHaveCount(0);
  await expect(page.getByText("Neincluse încă în costul intern pilot: Iluminare")).toHaveCount(0);
  await expect(page.getByText("RETURN_CANT")).toHaveCount(0);
  await expect(page.getByText("Lungime cant")).toHaveCount(0);
  await expect(page.locator(".quote-section").getByRole("heading", { name: "Ofertă" })).toBeVisible();
  await expect(page.locator(".quote-section").getByText("Costul intern nu este complet.")).toBeVisible();
  await expect(page.getByText("Preț final client")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Previzualizare producție" })).toBeVisible();
  await expect(page.getByText("Aplicare folie").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/owner-surfaces-confirm.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/settings-product-confirm.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-product-review-confirm.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/config-product-confirm.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-confirm.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-product-result.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-modules.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-psu.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-resources.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-eic.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-eic-total.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-eic-breakdown.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-eic-cnc.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-eic-assembly.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-eic-lighting.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-confirmed.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-eic-preview.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-eic-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-product-confirmed-narrow.png",
    fullPage: true,
  });
});
