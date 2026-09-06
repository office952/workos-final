import { expect, test } from "./fixtures";
import { createNamedCustomer, createNamedRequest } from "./helpers/requests";

test("request resolution field and config composition stay on real contract truth", async ({
  page,
  request,
}) => {
  const customer = await createNamedCustomer(request, "Client RW2 Lens");
  expect(customer.ok).toBeTruthy();
  const created = await createNamedRequest(request, {
    customerId: customer.customerId!,
    title: "Cerere RW2 instrument",
    description: "Text scurt pentru litere, fără adevăr de produs în cerere.",
  });
  expect(created.ok).toBeTruthy();

  await page.goto(`/requests/${encodeURIComponent(created.requestId!)}`);
  await expect(page.getByRole("heading", { name: "Cerere RW2 instrument" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cunoscut" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nerezolvat" })).toBeVisible();
  await expect(page.getByText("Produsul nu este ales")).toBeVisible();
  await expect(page.getByRole("link", { name: "Alege produs" })).toBeVisible();
  await expect(page.getByText("16,00")).toHaveCount(0);
  await expect(page.getByText("Product Truth")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveJSProperty("scrollWidth", 99999);

  await page.setViewportSize({ width: 768, height: 1100 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow).toBe(false);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("link", { name: "Alege produs" }).click();
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .click();
  await expect(page.getByRole("tablist", { name: "Compoziție constructivă" })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Produs/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tab", { name: /Față/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Volum/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Spate/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Iluminare/ })).toBeVisible();
  await page.getByRole("tab", { name: /Produs/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Față/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Finisaj față")).toBeVisible();
  await expect(page.getByText("16,00 EUR")).toHaveCount(0);
  await page.getByRole("tab", { name: /Spate/ }).click();
  await expect(page.getByText("Nicio configurație de operator pe acest rol.")).toBeVisible();
  await page.setViewportSize({ width: 768, height: 1100 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    ),
  ).toBe(false);
  await expect(page.getByRole("tablist", { name: "Compoziție constructivă" })).toBeVisible();

  await page.goto("/products/PRD-ACM-CASSETTE-NONE");
  await expect(page.getByRole("tablist", { name: "Compoziție constructivă" })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Corp casetă ACM/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Cadru intern/ })).toBeVisible();
  await expect(page.getByRole("tab", { name: /Volum/ })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /Iluminare/ })).toHaveCount(0);
});
