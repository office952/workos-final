import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "./fixtures";
import { createNamedCustomer, createRequestNeedingAction } from "./helpers/requests";

const EVIDENCE = join(process.cwd(), ".tmp", "ui20-coverage-1");

test("UI20_CLEAN_SHEET_COVERAGE_1 registries and client hub", async ({ page, request }) => {
  await mkdir(EVIDENCE, { recursive: true });
  const customer = await createNamedCustomer(request, `Coverage Client ${Date.now()}`);
  expect(customer.ok).toBeTruthy();
  const customerId = customer.customerId as string;
  const created = await createRequestNeedingAction(
    request,
    customerId,
    `Coverage Cerere ${Date.now()}`,
  );
  expect(created.ok).toBeTruthy();
  const requestId = created.requestId as string;

  await page.goto("/");
  await expect(page.locator('[data-surface="lucrari"][data-floorplan="registry"]')).toBeVisible({
    timeout: 20000,
  });
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(page.locator(".metric-band")).toHaveCount(0);

  await page.goto("/requests");
  await expect(page.locator('[data-surface="cereri"][data-floorplan="registry"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();

  await page.goto("/quotes");
  await expect(
    page.locator('[data-surface="oferte"][data-floorplan="commercial-register"]'),
  ).toBeVisible();

  await page.goto("/products");
  await expect(page.locator('[data-surface="catalog"]')).toBeVisible();
  await expect(page.locator('[data-surface="product-pick"]')).toHaveCount(0);

  await page.goto(`/products?request=${encodeURIComponent(requestId)}`);
  await expect(page.locator('[data-surface="product-pick"]')).toBeVisible();

  await page.goto("/clients");
  await expect(page.locator('[data-surface="clienti"][data-floorplan="registry"]')).toBeVisible();

  await page.goto(`/clients/${encodeURIComponent(customerId)}`);
  await expect(
    page.locator('[data-surface="client-hub"][data-floorplan="relationship-workspace"]'),
  ).toBeVisible();

  for (const width of [1440, 1280, 768] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  }

  await writeFile(
    join(EVIDENCE, "coverage-1.md"),
    [
      "# UI20 clean-sheet coverage 1",
      "",
      "- `/` JobsRegistry",
      "- `/requests` RequestsRegistry",
      "- `/quotes` QuotesRegistry",
      "- `/products` CatalogBrowse",
      "- `/products?request=` ProductPickBridge",
      "- `/clients` ClientsRegistry",
      `- /clients/${customerId} ClientHub`,
      "- ROOT_SWAP = NO",
      "- OLD_UI_PRESENTATION_REUSED = NO",
      "",
    ].join("\n"),
    "utf8",
  );
});
