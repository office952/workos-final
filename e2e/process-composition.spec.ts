import { expect, test } from "./fixtures";
import { adminHomeLink } from "./helpers/navigation";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

test("letters critical processes complete vinyl paint and electrical routes", async ({
  page,
}) => {
  await page.goto("/admin");
  await adminHomeLink(page, "Procese operaționale").click();
  await expect(
    page.getByRole("heading", { name: "Procese operaționale" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Compoziții produse" }).click();
  await expect(page.getByRole("button", { name: "Fără finisaj" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByText("Traseu tehnologic").first()).toBeVisible();
  await expect(page.getByText("Calcul iluminare").first()).toBeVisible();
  await expect(page.getByText("Parțială").first()).toBeVisible();
  await expect(page.getByText("Costuri interne").first()).toBeVisible();
  await expect(page.getByText("Complete pentru configurația curentă").first()).toBeVisible();
  await expect(page.getByText("Calculată").first()).toBeVisible();
  await expect(page.getByText("Regula de rezervă PSU")).toHaveCount(0);
  await expect(
    page.getByText("Cantitatea de module LED nu poate fi calculată", { exact: false }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Selecția fizică a sursei nu este disponibilă", { exact: false }),
  ).toHaveCount(0);
  await expect(page.getByText("Montare module LED").first()).toBeVisible();
  await expect(page.getByText("Pregătire sursă de alimentare").first()).toBeVisible();
  await expect(page.getByText("Execuție").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Față", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Iluminare", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Corp", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Produs", exact: true })).toBeVisible();
  await expect(page.getByText("Cablare electrică").first()).toBeVisible();
  await expect(page.getByText("Închidere corp").first()).toBeVisible();
  await expect(page.getByText("Probă aprindere").first()).toBeVisible();
  await expect(page.getByText("Probă uniformitate").first()).toBeVisible();
  await expect(page.getByText("Control calitate final").first()).toBeVisible();
  await expect(page.getByText("Ambalare").first()).toBeVisible();
  await expect(page.getByText("Aplicare folie")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Vopsire RAL" })).toHaveCount(0);
  await expect(page.getByText("Îmbinare sudură oțel")).toHaveCount(0);
  await expect(page.getByText("Printare format mare")).toHaveCount(0);
  await expect(page.getByText("ExecutionPlan")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-letters-composition.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-none.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-electrical.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-processes.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-psu.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-admin-processes.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-place-led.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-install-psu.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-closure.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-qc.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-pack.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-readiness.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-process-cost-completeness-60mm.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Colantat față și volum" }).click();
  await expect(page.getByText("Necesită calibrare").first()).toBeVisible();
  await expect(page.getByText("Finisaj față: Colantat").first()).toBeVisible();
  await expect(page.getByText("Finisaj volum: Colantat").first()).toBeVisible();
  await expect(page.getByText("Aplicare folie").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vopsire RAL" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-vinyl.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-process-cost-completeness-vinyl.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Volum vopsit" }).click();
  await expect(page.getByText("Necesită calibrare").first()).toBeVisible();
  await expect(page.getByText("Vopsire RAL").first()).toBeVisible();
  await expect(page.getByText("Finisaj volum: Vopsit").first()).toBeVisible();
  await expect(page.getByText("Finisaj volum: Colantat")).toHaveCount(0);
  await expect(page.getByText("Decizie owner")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-paint.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/processes");
  await page.getByRole("button", { name: "Compoziții produse" }).click();
  await expect(page.getByRole("button", { name: "Volum vopsit" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-narrow.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/admin/processes");
  await expect(page.getByRole("heading", { name: "Debitare foaie CNC" })).toBeVisible();
  await page.getByRole("button", { name: "Finisare", exact: true }).click();
  await page.getByRole("button", { name: /Vopsire RAL/ }).click();
  await expect(page.getByRole("heading", { name: "Vopsire RAL" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-catalog.png",
    fullPage: true,
  });

  await page.goto("/admin/resources");
  await expect(
    page.getByRole("heading", { name: "Resurse și cost intern" }),
  ).toBeVisible();

  await page.goto("/components");
  await page.getByRole("button", { name: "Componente de produs" }).click();
  await page.getByRole("button", { name: "Față" }).click();
  await expect(page.getByText("Debitare foaie CNC").first()).toBeVisible();

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
  await page.getByLabel("Finisaj volum").selectOption("painted");
  await page.getByLabel("Culoare volum").fill("RAL 9010");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await expect(
    page.getByText("Total cost intern estimat: 432,50 EUR"),
  ).toBeVisible();
  await expect(page.getByText("Vopsire RAL: 12,5 m", { exact: true })).toBeVisible();
  await expect(page.getByText("ExecutionPlan")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/process-completion-product.png",
    fullPage: true,
  });
});
