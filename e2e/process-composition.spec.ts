import { expect, test } from "@playwright/test";

test("letters process composition inspects technological order without execution", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
  await page.getByRole("link", { name: "Procese operaționale" }).click();
  await expect(
    page.getByRole("heading", { name: "Procese operaționale" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Compoziții produse" })).toBeVisible();

  await page.getByRole("button", { name: "Compoziții produse" }).click();
  await expect(page.getByRole("button", { name: "Fără finisaj" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByRole("heading", { name: "Stare" })).toBeVisible();
  await expect(page.getByText("Blocat", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ordine derivată" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Față", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Volum", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Spate", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Iluminare", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Corp", exact: true })).toBeVisible();
  await expect(page.getByText("Debitare foaie CNC").first()).toBeVisible();
  await expect(page.getByText("Formare profil aluminiu").first()).toBeVisible();
  await expect(page.getByText("Lipire față-volum").first()).toBeVisible();
  await expect(page.getByText("Montare module LED").first()).toBeVisible();
  await expect(page.getByText("Necesar, blocat").first()).toBeVisible();
  await expect(page.getByText("Aplicare folie")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-face.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-volume.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-back.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-lighting.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-order.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-readiness.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Colantat față și volum" }).click();
  await expect(page.getByText("Finisaj față: Colantat").first()).toBeVisible();
  await expect(page.getByText("Finisaj volum: Colantat").first()).toBeVisible();
  await expect(page.getByText("Aplicare folie").first()).toBeVisible();
  await expect(page.getByText("Depinde de").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-finish.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Volum vopsit" }).click();
  await expect(page.getByText("Vopsire volum").first()).toBeVisible();
  await expect(page.getByText("Decizie owner").first()).toBeVisible();
  await expect(page.getByText("Finisaj volum: Colantat")).toHaveCount(0);
  await expect(page.getByText("Finisaj față: Colantat")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/processes");
  await page.getByRole("button", { name: "Compoziții produse" }).click();
  await expect(page.getByRole("button", { name: "Fără finisaj" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-narrow.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/admin/processes");
  await expect(page.getByRole("button", { name: "Categorii" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Debitare foaie CNC" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-processes-regression.png",
    fullPage: true,
  });

  await page.goto("/admin/resources");
  await expect(
    page.getByRole("heading", { name: "Resurse și cost intern" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-resources-regression.png",
    fullPage: true,
  });

  await page.goto("/components");
  await page.getByRole("button", { name: "Componente de produs" }).click();
  await page.getByRole("button", { name: "Față" }).click();
  await expect(page.getByRole("heading", { name: "Procese necesare" })).toBeVisible();
  await expect(page.getByText("Debitare foaie CNC")).toBeVisible();
  await expect(page.getByText("Aplicare folie (Finisaj față: Colantat)")).toBeVisible();
  await expect(page.getByText("Lipire față-volum")).toHaveCount(0);

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
  await expect(page.getByText("ExecutionPlan")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/process-composition-product-regression.png",
    fullPage: true,
  });
});
