import { expect, test } from "./fixtures";

test("owner surfaces use catalog navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();

  await page.getByRole("link", { name: "Catalog" }).click();
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-products-operator.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: "Administrare" }).click();
  await page.getByRole("link", { name: "Module și componente" }).click();
  await expect(page.getByRole("heading", { name: "Module și componente" })).toBeVisible();
  await expect(
    page.getByText("Proiecție de inspecție a sistemului de produs"),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Categorii catalog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Administrare" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Familii" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "Litere și semne volumetrice luminoase" }),
  ).toBeVisible();
  await expect(page.getByText("LIGHTED_VOLUMETRIC_SIGNS")).toBeHidden();
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-foundation-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-families.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-components-initial.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/settings-components-catalog.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Categorii" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Litere volumetrice luminoase cu iluminare față",
    }),
  ).toBeVisible();
  await expect(page.getByText("Poate fi ștearsă")).toBeVisible();
  await expect(
    page.getByText("Ștergere blocată: Categoria este utilizată de 1 produs."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Litere volumetrice luminoase cu iluminare halou" })
    .click();
  await expect(page.getByText("Niciun produs în această categorie.")).toBeVisible();
  await expect(page.getByText("Poate fi ștearsă")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-categories.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Produse", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    }),
  ).toBeVisible();
  await expect(page.getByText("Schemă de configurare legată")).toBeVisible();
  await expect(page.getByText("Față → Plexiglas")).toBeVisible();
  await expect(page.getByText("Iluminare → Iluminare frontală cu module LED")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-product-detail.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Compoziții" }).click();
  await expect(page.getByText("Volum → Aluminiu")).toBeVisible();
  await expect(page.getByText("Spate → Forex")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-product-composition.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Componente de produs" }).click();
  await expect(page.getByRole("button", { name: "Față" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Volum" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Spate" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Iluminare" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Față" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Față" }).click();
  await expect(page.getByText("Tip constructiv").first()).toBeVisible();
  await expect(page.getByText("Opal", { exact: true })).toBeVisible();
  await expect(page.getByText("3 mm", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Identitate / proprietate material").first()).toBeVisible();
  await expect(page.getByText("Calcul independent").first()).toBeVisible();
  await expect(page.getByText("Produse care o folosesc").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/config-face.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/config-model-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-components-face.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Volum" }).click();
  await expect(page.getByRole("heading", { name: "Aluminiu", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toHaveCount(0);
  await expect(page.getByText("0.6 mm", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/config-volume.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Spate" }).click();
  await expect(page.getByRole("heading", { name: "Forex", exact: true })).toBeVisible();
  await expect(page.getByText("10 mm", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/config-back.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Iluminare" }).click();
  await expect(page.getByText("Disponibil: material", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Setări tehnice" })).toBeVisible();
  await expect(page.getByText("Pas module LED")).toBeVisible();
  await expect(page.getByText("100 mm", { exact: true })).toBeVisible();
  await expect(page.getByText("Putere modul LED")).toBeVisible();
  await expect(page.getByText("0.75 W", { exact: true })).toBeVisible();
  await expect(page.getByText("Confirmat de owner").first()).toBeVisible();
  await expect(page.getByText("Configurabil").first()).toBeVisible();
  await expect(page.getByText("Rezervă sursă de alimentare")).toBeVisible();
  await expect(page.getByText("25 %", { exact: true })).toBeVisible();
  await expect(page.getByText("Nesetat")).toHaveCount(0);
  await expect(page.getByText("Necesită decizie owner")).toHaveCount(0);
  await expect(page.getByText("Regula de rezervă PSU nu este stabilită")).toHaveCount(0);
  await expect(page.getByText("Regula de pas LED nu este stabilită")).toHaveCount(0);
  await expect(page.getByText("Intrări tehnice")).toBeVisible();
  await expect(page.getByText("Rezultate calculate")).toBeVisible();
  await expect(
    page.getByText("Cantitatea de module LED nu poate fi calculată", { exact: false }),
  ).toHaveCount(0);
  await expect(page.getByText("Modul LED 12V")).toBeVisible();
  await expect(
    page.getByText("Configurabil înseamnă că valoarea aparține tipului", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Editează" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Salvează" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Retrage" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Șterge" })).toHaveCount(0);
  await expect(page.getByText("RETURN_CANT")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/config-lighting.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-lighting-variant.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/settings-lighting.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-overview.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-calculation.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-gaps.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Setări tehnice" }).click();
  await expect(page.getByText("Pas module LED")).toBeVisible();
  await expect(page.getByText("100 mm", { exact: true })).toBeVisible();
  await expect(page.getByText("Putere modul LED")).toBeVisible();
  await expect(page.getByText("0.75 W", { exact: true })).toBeVisible();
  await expect(page.getByText("Setările tehnice aparțin tipului constructiv, nu produsului.")).toBeVisible();
  await expect(page.getByText("25 %", { exact: true })).toBeVisible();
  await expect(page.getByText("100 mm", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Editează" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-lighting-settings.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-settings.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-calc-settings.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/settings-lighting-technical.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Stare și lifecycle" }).click();
  await page
    .getByRole("navigation", { name: "Elemente catalog" })
    .getByRole("button", { name: "Litere volumetrice luminoase cu iluminare halou" })
    .click();
  await expect(page.getByText("Poate fi ștearsă")).toBeVisible();
  await expect(page.getByText("Poate fi retrasă")).toBeVisible();
  await expect(page.getByRole("button", { name: "Activează" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-lifecycle-readiness.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 720, height: 1100 });
  await expect(page.getByRole("button", { name: "Stare și lifecycle" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/config-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-components-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/settings-lighting-narrow.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-completion-narrow.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.getByRole("link", { name: "Administrare" }).click();
  await page.getByRole("link", { name: "Guvernanța sistemului" }).click();
  await expect(page.getByRole("heading", { name: "Guvernanța sistemului" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Autoritate și adevăr" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "Cine deține adevărul", exact: true, level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cine deține adevărul", exact: true, level: 3 }),
  ).toHaveCount(0);
  await expect(page.getByText("Fără Commercial silent.")).toHaveCount(0);
  await expect(page.getByText("Setări tehnice de componentă")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-governance-initial.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/settings-governance.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-governance-authority.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Limite și protecții" }).click();
  await expect(page.getByRole("button", { name: "Owner gates" })).toBeVisible();
  await page.getByRole("button", { name: "Owner gates" }).click();
  await expect(page.getByText("Fără Commercial silent.")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-governance-limits.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Stare și maturitate" }).click();
  await page.getByRole("button", { name: "Roadmap" }).click();
  await expect(page.getByText("Fundație calcul iluminare")).toBeVisible();
  await expect(page.getByText("Calcul complet iluminare")).toBeVisible();
  await expect(page.getByText("Iluminare calculabilă")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/lighting-alignment-governance.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Freeze" }).click();
  await expect(page.getByText("Nu este activă.")).toBeVisible();
  await expect(page.getByText("Planificat").first()).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-governance-maturity.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "UI și proiecții" }).click();
  await expect(page.getByRole("button", { name: "Reguli UI" })).toBeVisible();

  await page.setViewportSize({ width: 720, height: 1100 });
  await expect(page.getByRole("button", { name: "UI și proiecții" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-governance-narrow.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.getByRole("link", { name: "Catalog" }).click();
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await expect(page.getByLabel("Textul literelor")).toBeVisible();
});
