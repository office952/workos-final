import { expect, test } from "./fixtures";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

test("resources admin inspects material family specification and cost", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sistem produs" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Resurse și cost intern" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Oameni" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-admin-home.png",
    fullPage: true,
  });

  await page.screenshot({
    path: "docs/worklog/screenshots/ui-resources-admin-nav.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Resurse și cost intern" }).click();
  await expect(
    page.getByRole("heading", { name: "Resurse și cost intern" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Familie\s+Plexiglas/ }).click();
  await expect(page.getByText(/Materiale \d+ · Servicii \d+ · Manoperă \d+ · Dovezi de cost \d+/)).toBeVisible();
  await expect(
    page.getByText(
      /Valorile implicite de platformă nu sunt cost confirmat/,
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Materiale" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByRole("button", { name: "Servicii" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Manoperă" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Dovezi de cost" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas 3 mm opal" })).toBeVisible();
  await expect(page.getByText("Opal", { exact: true })).toBeVisible();
  await expect(page.getByText("3 mm", { exact: true })).toBeVisible();
  await expect(page.getByText("16,00 EUR / m²")).toBeVisible();
  await expect(page.getByText("Confirmat de owner").first()).toBeVisible();
  await expect(page.getByText("Folosit de")).toBeVisible();
  await expect(page.getByText(/Față \/ Plexiglas/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirmă tarif" })).toHaveCount(0);
  await expect(page.getByText("plexiglas_3mm_opal")).not.toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-home.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-resources-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-resources.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-materials.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-resources-materials.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-plexiglas.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-where-used.png",
    fullPage: true,
  });
  await page.getByText("Detalii").click();
  await expect(page.getByText("plexiglas_3mm_opal")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-resources-material-detail.png",
    fullPage: true,
  });
  await page.getByText("Detalii").click();
  await expect(page.getByText("plexiglas_3mm_opal")).not.toBeVisible();

  await page.getByRole("button", { name: "Forex" }).click();
  await expect(page.getByRole("heading", { name: "Forex", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Forex 10 mm" })).toBeVisible();
  await expect(page.getByText("10 mm", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-forex.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Aluminiu" }).click();
  await expect(page.getByRole("heading", { name: "Aluminiu", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Profil aluminiu 0,6 mm" })).toBeVisible();
  await expect(page.getByText("0.6 mm", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-aluminium.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Iluminare LED" }).click();
  await expect(page.getByRole("heading", { name: "Iluminare LED", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Modul LED 12V" })).toBeVisible();
  await expect(page.getByText("0,50 EUR / buc")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sursă LED 12V 60W" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sursă LED 12V 100W" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sursă LED 12V 160W" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sursă LED 12V 200W" })).toBeVisible();
  await expect(page.getByText("150 W")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-led-resource.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-psu-resources.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Folie / colant" }).click();
  await expect(page.getByRole("heading", { name: "Folie / colant", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Folie Oracal 651" })).toBeVisible();
  await expect(page.getByText("9,00 EUR / m²")).toBeVisible();

  await page.getByRole("button", { name: "Servicii" }).click();
  await page.getByRole("button", { name: /Formare profil aluminiu/ }).click();
  await expect(
    page.getByRole("heading", { name: "Formare profil aluminiu" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Rețetă serviciu").first()).toBeVisible();
  await expect(page.getByText("5,00 EUR / m").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Formare profil aluminiu/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Debitare CNC față/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Debitare CNC spate/ })).toBeVisible();
  await expect(page.getByText("Configurată").first()).toBeVisible();
  await expect(page.getByText("Perimetru volum (m)").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-service.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-resources-services.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-service-recipes.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-forming-recipe.png",
    fullPage: true,
  });

  await expect(page.getByRole("button", { name: /Îmbinare sudură oțel/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Printare format mare/ })).toBeVisible();
  await page.getByRole("button", { name: /Îmbinare sudură oțel/ }).click();
  await expect(page.getByRole("heading", { name: "Îmbinare sudură oțel" })).toBeVisible();
  await expect(page.getByText("Lipsă").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-weld-missing-recipe.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: /Debitare CNC față/ }).click();
  await expect(page.getByRole("heading", { name: "Debitare CNC față" })).toBeVisible();
  await expect(page.getByText("Configurată").first()).toBeVisible();
  await expect(page.getByText("3,00 EUR / m").first()).toBeVisible();
  await expect(page.getByText("Nu inventăm tarif pe oră sau pe utilaj.")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-cnc-recipe.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-admin-service-recipes.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Manoperă" }).click();
  await page.getByRole("button", { name: /Aplicare folie față/ }).click();
  await expect(page.getByRole("heading", { name: "Aplicare folie față" }).first()).toBeVisible();
  await expect(page.getByText("Rețetă manoperă").first()).toBeVisible();
  await expect(page.getByText("Default de dezvoltare").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Lipire față-volum/ })).toBeVisible();
  await page.getByRole("button", { name: /Lipire față-volum/ }).click();
  await expect(page.getByRole("heading", { name: "Lipire față-volum" })).toBeVisible();
  await expect(page.getByText("Configurată").first()).toBeVisible();
  await expect(page.getByText("5,00 EUR / m").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-labor-recipes.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-resources-labor.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-admin-labor-recipes.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-assembly-missing-labor.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Dovezi de cost" }).click();
  await page.getByRole("button", { name: /Plexiglas 3 mm opal/ }).click();
  await expect(page.getByText("Dovadă de cost intern").first()).toBeVisible();
  await expect(page.getByText("3,00 EUR / m · adâncime 60 mm").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirmă tarif" })).toBeVisible();
  await expect(page.getByText("16,00 EUR / m²").first()).toBeVisible();
  await expect(page.getByText("Achiziție confirmată de owner").first()).toBeVisible();
  await expect(page.getByText("Confirmat de owner").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-cost-evidence.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-resources-provenance.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/resources?selected=family:PLEXIGLAS");
  await expect(
    page.getByRole("heading", { name: "Resurse și cost intern" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Secțiuni" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Alege elementul" })).toBeVisible();
  await expect(page.getByText("16,00 EUR / m²")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-resources-narrow.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/components");
  await page.getByRole("button", { name: "Componente de produs" }).click();
  await page.getByRole("button", { name: "Față" }).click();
  await expect(page.getByText("Plexiglas 3 mm opal")).toBeVisible();
  await expect(page.getByText("plexiglas_face_3mm")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-components-face.png",
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
  await revealSecondaryProductSurfaces(page);
  await expect(
    page.getByText("Total cost intern estimat: 382,50 EUR"),
  ).toBeVisible();
  await expect(page.getByText("Plexiglas 3 mm opal: 0,25 m²", { exact: true })).toBeVisible();
  await expect(page.getByText("Preț final client: 624,82 EUR")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/resources-product-regression.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-eic-product-regression.png",
    fullPage: true,
  });
});
