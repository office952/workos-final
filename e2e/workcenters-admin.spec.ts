import { expect, test } from "@playwright/test";

test("workcenters admin inspects capability providers without inventing machines", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sistem produs" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Resurse și cost intern" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Procese operaționale" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Utilaje și capacitate" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Persoane" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-admin-home.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Utilaje și capacitate" }).click();
  await expect(
    page.getByRole("heading", { name: "Utilaje și capacitate", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Prezentare" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(
    page.getByText("Planificarea de capacitate nu este implementată. Acest catalog nu spune dacă un job poate rula acum."),
  ).toBeVisible();
  await expect(page.getByText("Nu inventăm utilaje")).toBeVisible();
  await expect(page.getByRole("button", { name: "Editează" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-overview.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Zone / Workcenters" }).click();
  await expect(page.getByRole("heading", { name: "Nicio zonă confirmată" })).toBeVisible();
  await expect(
    page.getByText("Un workcenter este o zonă sau o stație, nu un alt nume pentru utilaj."),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-zones.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-zone-empty.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Utilaje", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Niciun utilaj confirmat" })).toBeVisible();
  await expect(
    page.getByText("Nu creăm utilaje fictive pentru munca manuală."),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-machines.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Capabilități" }).click();
  await page.getByRole("button", { name: "Debitare CNC" }).click();
  await expect(page.getByRole("heading", { name: "Debitare CNC" })).toBeVisible();
  await expect(page.getByText("Fără furnizor").first()).toBeVisible();
  await expect(page.getByText("niciun furnizor confirmat")).toBeVisible();
  await expect(page.getByText("Debitare foaie CNC")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-capabilities.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-capability-providers.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Acoperire procese" }).click();
  await expect(
    page.getByRole("heading", { name: "Letters — acoperire capabilități" }),
  ).toBeVisible();
  await expect(page.getByText("Debitare CNC").first()).toBeVisible();
  await expect(page.getByText("Aceasta este acoperire de catalog, nu pregătire de execuție.")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-process-coverage.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-missing-provider.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Fără finisaj" }).click();
  await expect(page.getByText("Debitare foaie CNC")).toBeVisible();
  await expect(page.getByText("niciun furnizor").first()).toBeVisible();

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
  await expect(
    page.getByRole("heading", { name: "Procese operaționale" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Procese" }).click();
  await page.getByRole("button", { name: "Debitare foaie CNC" }).click();
  await expect(page.getByText("Debitare CNC", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Fără furnizor").first()).toBeVisible();
  await expect(page.getByText("Utilaje și capacitate").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/workcenters-processes-regression.png",
    fullPage: true,
  });

  await page.goto("/admin/resources");
  await expect(
    page.getByRole("heading", { name: "Resurse și cost intern" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
  await expect(page.getByText("CNC-01")).toHaveCount(0);

  await page.goto("/components");
  await page.getByRole("button", { name: "Componente de produs" }).click();
  await page.getByRole("button", { name: "Față" }).click();
  await expect(page.getByText("Debitare foaie CNC")).toBeVisible();
  await expect(page.getByText("Plexiglas 3 mm opal")).toBeVisible();

  await page.goto("/products");
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await expect(page.getByLabel("Utilaj")).toHaveCount(0);
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
