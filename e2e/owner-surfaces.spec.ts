import { expect, test } from "@playwright/test";

test("owner surfaces use catalog navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Stare sistem" })).toBeVisible();

  await page.getByRole("link", { name: "Produse" }).click();
  await expect(page.getByRole("heading", { name: "Produse" })).toBeVisible();

  await page.getByRole("link", { name: "Module și componente" }).click();
  await expect(page.getByRole("heading", { name: "Module și componente" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Categorii catalog" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Componente de produs" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(page.getByRole("button", { name: "Față" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Volum" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Spate" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Iluminare" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Față" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas 3 mm" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Volum" })).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-components-initial.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Față" }).click();
  await expect(page.getByText("Calcul independent")).toBeVisible();
  await expect(page.getByText("Folosită de")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-components-face.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Volum" }).click();
  await expect(page.getByRole("heading", { name: "Aluminiu 0,6 mm" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plexiglas 3 mm" })).toHaveCount(0);

  await page.getByRole("button", { name: "Iluminare" }).click();
  await expect(page.getByText("Indisponibil", { exact: true })).toBeVisible();
  await expect(page.getByText("Regula de pas LED nu este stabilită")).toBeVisible();
  await expect(page.getByText("RETURN_CANT")).toHaveCount(0);

  await page.setViewportSize({ width: 720, height: 1100 });
  await expect(page.getByRole("button", { name: "Componente de produs" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-components-narrow.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 900 });

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
  await page.screenshot({
    path: "docs/worklog/screenshots/ia-governance-initial.png",
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

  await page.getByRole("link", { name: "Produse" }).click();
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await expect(page.getByLabel("Textul literelor")).toBeVisible();
});
