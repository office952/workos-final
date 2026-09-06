import { expect, test } from "./fixtures";
import { brandLink, openCommercialPanel, primaryNav } from "./helpers/navigation";

test("platform shell shows real health and no fake business menu", async ({
  page,
}) => {
  const fatalErrors: string[] = [];

  page.on("pageerror", (error) => {
    fatalErrors.push(error.message);
  });

  await page.goto("/");

  await expect(brandLink(page)).toBeVisible();
  await expect(page.getByText("WorkOS Final", { exact: true })).toHaveCount(0);
  await expect(primaryNav(page)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(primaryNav(page).getByRole("link", { name: "Lucrări" })).toBeVisible();
  await expect(primaryNav(page).getByRole("link", { name: "Cereri" })).toBeVisible();
  await expect(primaryNav(page).getByRole("button", { name: "Comercial" })).toBeVisible();
  await expect(primaryNav(page).getByRole("button", { name: "Mai multe" })).toBeVisible();
  await expect(primaryNav(page).getByRole("link", { name: "Acasă" })).toHaveCount(0);
  await expect(page.locator(".app-sidebar-desktop")).toHaveCount(0);

  const commercial = await openCommercialPanel(page);
  await expect(commercial.getByRole("link", { name: "Catalog", exact: true })).toBeVisible();
  await expect(commercial.getByRole("link", { name: "Cereri" })).toHaveCount(0);
  await expect(primaryNav(page).getByRole("link", { name: "Administrare", exact: true })).toHaveCount(0);

  await page.screenshot({
    path: "docs/worklog/screenshots/ui-shell.png",
    fullPage: true,
  });
  await expect(primaryNav(page).getByRole("link", { name: "Module și componente" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Comenzi" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Rapoarte" })).toHaveCount(0);

  await brandLink(page).click();
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();

  await page.goto("/system");
  await expect(page.getByRole("heading", { name: "Stare sistem" })).toBeVisible();
  await expect(page.getByText("Verificarea conexiunii cu sistemul.")).toBeVisible();
  await expect(page.getByText("Backend conectat")).toBeVisible();

  await page.reload();
  await expect(primaryNav(page)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stare sistem" })).toBeVisible();
  await expect(page.getByText("Backend conectat")).toBeVisible();

  expect(fatalErrors).toEqual([]);
});
