import { expect, test } from "@playwright/test";

test("processes admin inspects capability-bound operational processes", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sistem produs" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Resurse și cost intern" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Procese operaționale" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Persoane" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Utilaje și capacitate" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-admin-home.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Procese operaționale" }).click();
  await expect(
    page.getByRole("heading", { name: "Procese operaționale" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Categorii" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByRole("heading", { name: "Debitare", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Debitare foaie CNC" })).toBeVisible();
  await expect(page.getByText("Debitare CNC", { exact: true }).first()).toBeVisible();
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
    path: "docs/worklog/screenshots/processes-cnc.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Procese" }).click();
  await page.getByRole("button", { name: "Formare profil aluminiu" }).click();
  await expect(
    page.getByRole("heading", { name: "Formare profil aluminiu" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Formare profil", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Folosit de")).toBeVisible();
  await expect(page.getByText(/Volum \/ Aluminiu/)).toBeVisible();
  await expect(page.getByText("Resurse / Cost rămâne autoritatea monetară")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-forming.png",
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

  await page.getByRole("button", { name: "Lipire față-volum" }).click();
  await expect(page.getByRole("heading", { name: "Lipire față-volum" })).toBeVisible();
  await expect(page.getByText("Îndemânare umană").first()).toBeVisible();
  await expect(page.getByText("nicio referință de cost")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-manual.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Capabilități necesare" }).click();
  await expect(page.getByRole("heading", { name: "Debitare CNC", exact: true })).toBeVisible();
  await expect(page.getByText("Utilaj / stație de mașină")).toBeVisible();
  await expect(
    page.getByText("Furnizorii se inspectează în Utilaje și capacitate"),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-capability.png",
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
    page.getByText("Total cost intern estimat (fără iluminare): 320,50 EUR"),
  ).toBeVisible();
  await expect(page.getByText("Preț client")).toHaveCount(0);
  await expect(page.getByText("ExecutionPlan")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/processes-product-regression.png",
    fullPage: true,
  });
});
