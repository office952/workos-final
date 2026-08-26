import { expect, test } from "./fixtures";

test("platform shell shows real health and no fake business menu", async ({
  page,
}) => {
  const fatalErrors: string[] = [];

  page.on("pageerror", (error) => {
    fatalErrors.push(error.message);
  });

  await page.goto("/");

  await expect(page.getByText("WorkOS Final", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navigare principală" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lucrări" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Comercial" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Catalog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Administrare" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Cereri" }),
  ).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/ui-shell.png",
    fullPage: true,
  });
  await expect(page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Module și componente" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Comenzi" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Rapoarte" })).toHaveCount(0);

  await page.getByRole("link", { name: "WorkOS Final" }).click();
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();

  await page.goto("/system");
  await expect(page.getByRole("heading", { name: "Stare sistem" })).toBeVisible();
  await expect(page.getByText("Verificarea conexiunii cu sistemul.")).toBeVisible();
  await expect(page.getByText("Backend conectat")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("navigation", { name: "Navigare principală" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stare sistem" })).toBeVisible();
  await expect(page.getByText("Backend conectat")).toBeVisible();

  expect(fatalErrors).toEqual([]);
});
