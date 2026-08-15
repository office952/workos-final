import { expect, test } from "@playwright/test";

test("workcenters admin shows the real shop-floor map without inventing capacity", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Utilaje și capacitate" })).toBeVisible();
  await page.getByRole("link", { name: "Utilaje și capacitate" }).click();
  await expect(
    page.getByRole("heading", { name: "Utilaje și capacitate", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Prezentare" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByText("Zone confirmate")).toBeVisible();
  await expect(page.getByText("12", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Utilaje confirmate")).toBeVisible();
  await expect(page.getByText("11", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText("Nu există ore-mașină, calendar de disponibilitate, limită de sarcini sau limită de angajați."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Editează" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-admin-home.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Zone / Workcenters" }).click();
  await expect(page.getByRole("button", { name: "Masă asamblare 1" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Masă asamblare 2" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stație sudură" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stație debitare metale" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Masă asamblare 1" })).toBeVisible();
  await expect(page.getByText("Activ").first()).toBeVisible();
  await expect(page.getByText("Asamblare manuală").first()).toBeVisible();
  await expect(page.getByText("nu singurul loc din hală").first()).toBeVisible();
  await expect(page.getByText("Lipire față-volum").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-zones.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-assembly-1.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Masă asamblare 2" }).click();
  await expect(page.getByRole("heading", { name: "Masă asamblare 2" })).toBeVisible();
  await expect(page.getByText("Activ").first()).toBeVisible();
  await expect(page.getByText("Asamblare manuală").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-assembly-2.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Stație sudură" }).click();
  await expect(page.getByRole("heading", { name: "Stație sudură" })).toBeVisible();
  await expect(page.getByText("Aparat sudură oțel").first()).toBeVisible();
  await expect(page.getByText("Aparat sudură aluminiu").first()).toBeVisible();
  await expect(page.getByText("niciun proces încă").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-welding.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Stație debitare metale" }).click();
  await expect(page.getByRole("heading", { name: "Stație debitare metale" })).toBeVisible();
  await expect(page.getByText("Debitator metale").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-metal-cutting.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Zonă CNC" }).click();
  await expect(page.getByRole("heading", { name: "Zonă CNC" })).toBeVisible();
  await expect(page.getByText("CNC 4020").first()).toBeVisible();
  await expect(page.getByText("Debitator polistiren").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-cnc.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Zonă formare cant" }).click();
  await expect(page.getByRole("heading", { name: "Zonă formare cant" })).toBeVisible();
  await expect(page.getByText("CNC Cant Litere").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-forming.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Montaj LED / electric" }).click();
  await expect(page.getByRole("heading", { name: "Montaj LED / electric" })).toBeVisible();
  await expect(page.getByText("Asamblare electrică").first()).toBeVisible();
  await expect(page.getByText("niciun utilaj").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-led.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Zonă print" }).click();
  await expect(page.getByRole("heading", { name: "Zonă print" })).toBeVisible();
  await expect(page.getByText("Imprimantă Epson").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-print.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Utilaje", exact: true }).click();
  await expect(page.getByRole("button", { name: "CNC 4020" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Aparat sudură oțel" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Aparat sudură aluminiu" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CNC 4020" })).toBeVisible();
  await expect(page.getByText("Debitare CNC").first()).toBeVisible();
  await expect(page.getByText("Debitare foaie CNC").first()).toBeVisible();
  await expect(page.getByText("Rețetă de serviciu lipsește").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-machines.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-machine-capabilities.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-machine-processes.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Aparat sudură oțel" }).click();
  await expect(page.getByRole("heading", { name: "Aparat sudură oțel" })).toBeVisible();
  await expect(page.getByText("Sudură oțel").first()).toBeVisible();
  await expect(page.getByText("Stație sudură").first()).toBeVisible();
  await expect(page.getByText("Fără proces operațional încă").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-welding-machines.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Capabilități" }).click();
  await page.getByRole("button", { name: "Asamblare manuală" }).click();
  await expect(page.getByRole("heading", { name: "Asamblare manuală" })).toBeVisible();
  await expect(page.getByText("Acoperită").first()).toBeVisible();
  await expect(page.getByText("Masă asamblare 1").first()).toBeVisible();
  await expect(page.getByText("Masă asamblare 2").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-manual-assembly.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-capability-providers.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Debitare CNC" }).click();
  await expect(page.getByText("Acoperită").first()).toBeVisible();
  await expect(page.getByText("CNC 4020").first()).toBeVisible();

  await page.getByRole("button", { name: "Sudură oțel" }).click();
  await expect(page.getByRole("heading", { name: "Sudură oțel" })).toBeVisible();
  await expect(page.getByText("Aparat sudură oțel").first()).toBeVisible();
  await expect(page.getByText("niciun proces încă").first()).toBeVisible();

  await page.getByRole("button", { name: "Acoperire procese" }).click();
  await expect(
    page.getByRole("heading", { name: "Letters — acoperire capabilități" }),
  ).toBeVisible();
  await expect(page.getByText("Asamblare manuală").first()).toBeVisible();
  await expect(page.getByText("Debitare CNC").first()).toBeVisible();
  await expect(page.getByText("Vopsire").first()).toBeVisible();
  await expect(page.getByText("Aceasta este acoperire de catalog, nu pregătire de execuție.")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-process-coverage.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-letters-coverage.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Hartă procese / rețete" }).click();
  await expect(page.getByRole("heading", { name: "Hartă procese / rețete" })).toBeVisible();
  await expect(page.getByText("Aceasta nu este o interfață de preț.")).toBeVisible();
  await expect(page.getByRole("button", { name: "CNC 4020" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-recipe-gaps.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/workcenters");
  await expect(
    page.getByRole("heading", { name: "Utilaje și capacitate", level: 1 }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-narrow.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/admin/processes");
  await page.getByRole("button", { name: "Procese" }).click();
  await page.getByRole("button", { name: "Lipire față-volum" }).click();
  await expect(page.getByRole("heading", { name: "Lipire față-volum" })).toBeVisible();
  await expect(page.getByText("Asamblare manuală").first()).toBeVisible();
  await expect(page.getByText("Acoperită").first()).toBeVisible();
  await expect(page.getByText("Masă asamblare 1").first()).toBeVisible();
  await expect(page.getByText("Masă asamblare 2").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-process-manual.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-processes-regression.png",
    fullPage: true,
  });

  await page.goto("/admin/resources");
  await expect(
    page.getByRole("heading", { name: "Resurse și cost intern" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();

  await page.goto("/components");
  await page.getByRole("button", { name: "Componente de produs" }).click();
  await page.getByRole("button", { name: "Față" }).click();
  await expect(page.getByText("Debitare foaie CNC")).toBeVisible();

  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await expect(page.getByLabel("Utilaj")).toHaveCount(0);
  await expect(page.getByLabel("Masă asamblare")).toHaveCount(0);
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
    page.getByText("Total cost intern estimat (fără iluminare): 320,50 EUR"),
  ).toBeVisible();
  await expect(page.getByText("Preț client")).toHaveCount(0);
  await expect(page.getByText("ExecutionPlan")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-product-regression.png",
    fullPage: true,
  });
});
