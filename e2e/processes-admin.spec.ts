import { expect, test } from "./fixtures";

test("processes admin inspects capability-bound operational processes", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sistem produs" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Resurse și cost intern" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Procese operaționale" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Persoane" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Utilaje și zone" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-admin-home.png",
    fullPage: true,
  });

  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-admin-nav.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Procese operaționale" }).click();
  await expect(
    page.getByRole("heading", { name: "Procese operaționale" }),
  ).toBeVisible();
  await expect(page.getByText(/Procese \d+ · Capabilități \d+ · Cu furnizor \d+ · Fără furnizor \d+/)).toBeVisible();
  await expect(
    page.getByText(
      "Procesele descriu cum se lucrează. Editarea lor nu este disponibilă în această etapă.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Debitare", exact: true })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByRole("button", { name: "Formare", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sudură", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Print / finisare", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Debitare foaie CNC" })).toBeVisible();
  await expect(page.getByText("Necesită")).toBeVisible();
  await expect(page.getByText("Debitare CNC", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Acoperită").first()).toBeVisible();
  await expect(page.getByText("CNC 4020").first()).toBeVisible();
  await expect(page.getByText("CUT_SHEET_CNC")).not.toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-overview.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Sudură", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Îmbinare sudură oțel" })).toBeVisible();
  await expect(page.getByText("Îmbinare sudură oțel").first()).toBeVisible();
  await page.getByRole("button", { name: "Print / finisare", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Printare format mare" })).toBeVisible();
  await expect(page.getByText("Printare format mare").first()).toBeVisible();
  await page.getByRole("button", { name: "Debitare", exact: true }).click();
  await expect(page.getByRole("button", { name: "Editează" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-home.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-catalog.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-categories.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-cnc.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-cnc.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: /Debitare foaie CNC/ }).click();
  await expect(page.getByRole("heading", { name: "Debitare foaie CNC" })).toBeVisible();
  await expect(page.getByText("Rețetă: Configurată").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-process-recipe-state.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Formare", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Formare profil aluminiu" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Formare profil", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Rețetă: Configurată").first()).toBeVisible();
  await expect(page.getByText("Folosit de")).toBeVisible();
  await expect(page.getByText(/Volum \/ Aluminiu/)).toBeVisible();
  await expect(page.getByText("Resurse / Cost rămâne autoritatea monetară")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-forming.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-forming.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-recipe.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-where-used.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-resource-link.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Sudură", exact: true }).click();
  await page.getByRole("button", { name: /Îmbinare sudură oțel/ }).click();
  await expect(page.getByRole("heading", { name: "Îmbinare sudură oțel" })).toBeVisible();
  await expect(page.getByText("Sudură oțel", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Rețetă serviciu: Lipsă").first()).toBeVisible();
  await expect(page.getByText("Aparat sudură oțel").first()).toBeVisible();
  await expect(page.getByText("nicio utilizare derivată încă").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-weld-steel.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: /Îmbinare sudură aluminiu/ }).click();
  await expect(page.getByRole("heading", { name: "Îmbinare sudură aluminiu" })).toBeVisible();
  await expect(page.getByText("Sudură aluminiu", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Aparat sudură aluminiu").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-weld-aluminium.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Print / finisare", exact: true }).click();
  await page.getByRole("button", { name: /Printare format mare/ }).click();
  await expect(page.getByRole("heading", { name: "Printare format mare" })).toBeVisible();
  await expect(page.getByText("Rețetă serviciu: Lipsă").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-print.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Debitare", exact: true }).click();
  await page.getByRole("button", { name: /Decupare contur plotter/ }).click();
  await expect(page.getByRole("heading", { name: "Decupare contur plotter" })).toBeVisible();
  await expect(page.getByText("Decupare plotter", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Rețetă serviciu: Lipsă").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-plotter.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: /Debitare foaie laser/ }).click();
  await expect(page.getByRole("heading", { name: "Debitare foaie laser" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-laser.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Asamblare", exact: true }).click();
  await page.getByRole("button", { name: /Lipire față-volum/ }).click();
  await expect(page.getByRole("heading", { name: "Lipire față-volum" })).toBeVisible();
  await expect(page.getByText("Îndemânare umană").first()).toBeVisible();
  await expect(page.getByText("nicio referință de cost")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-manual.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-assembly.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Electric", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Montare module LED" })).toBeVisible();
  await expect(page.getByText("Asamblare electrică").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-electrical.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Debitare", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Debitare foaie CNC" })).toBeVisible();
  await expect(page.getByText("Utilaj / stație de mașină")).toBeVisible();
  await expect(
    page.getByText("Furnizorii se inspectează în Utilaje și zone"),
  ).toBeVisible();
  await page.getByText("Detalii").click();
  await expect(page.getByText("CUT_SHEET_CNC")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-capability.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-details.png",
    fullPage: true,
  });
  await page.getByText("Detalii").click();

  await page.getByRole("button", { name: "Control calitate", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Probă uniformitate" })).toBeVisible();
  await expect(page.getByText("Fără furnizor").first()).toBeVisible();
  await expect(page.getByText("Fără furnizor configurat")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-qc.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Ambalare", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Ambalare", exact: true })).toBeVisible();
  await expect(page.getByText("Fără furnizor configurat")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-pack.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Finisare", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Aplicare folie" })).toBeVisible();
  await expect(page.getByText("Apare când Finisaj față: Colantat.")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-conditional.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/processes");
  await expect(
    page.getByRole("heading", { name: "Procese operaționale" }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-processes-narrow.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/admin/resources");
  await expect(
    page.getByRole("heading", { name: "Resurse și cost intern" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();

  await page.goto("/components");
  await page.getByRole("button", { name: "Componente de produs" }).click();
  await page.getByRole("button", { name: "Față" }).click();
  await expect(page.getByText("Debitare foaie CNC")).toBeVisible();
  await expect(page.getByText("Plexiglas 3 mm opal")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-components-face.png",
    fullPage: true,
  });

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
  await expect(
    page.getByText("Total cost intern estimat: 595,00 EUR"),
  ).toBeVisible();
  await expect(page.getByText("Preț client")).toHaveCount(0);
  await expect(page.getByText("ExecutionPlan")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-product-regression.png",
    fullPage: true,
  });
});
