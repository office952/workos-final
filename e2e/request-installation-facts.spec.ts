import { mkdir } from "node:fs/promises";
import { expect, test } from "./fixtures";
import {
  CANONICAL_LETTERS_PRODUCT_CODE,
  confirmCanonicalLettersOnPage,
  uniqueRequestToken,
} from "./helpers/requests";

test("OS-S2 typed installation facts stay on Cerere and leave Configurator unchanged", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("OS2");
  await mkdir(".tmp/os-s2-evidence", { recursive: true });
  const enable = await request.patch("/api/operational-services/SITE_INSTALLATION", {
    data: { offerMode: "INTERNAL" },
  });
  expect(enable.ok()).toBeTruthy();
  const customer = await request.post("/api/customers", {
    data: { displayName: `Client ${token}` },
  });
  expect(customer.ok()).toBeTruthy();
  const customerId = ((await customer.json()) as { customer: { customerId: string } }).customer
    .customerId;
  const created = await request.post("/api/requests", {
    data: {
      customerId,
      title: `Litere fapte ${token}`,
      description: "Cerere izolată pentru fapte de montaj.",
    },
  });
  expect(created.ok()).toBeTruthy();
  const requestId = ((await created.json()) as { request: { requestId: string } }).request
    .requestId;

  await page.goto("/requests");
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Salvează datele de montaj" })).toHaveCount(0);
  await expect(page.getByLabel("Stradă")).toHaveCount(0);

  await page.goto(`/requests/${encodeURIComponent(requestId)}`);
  await expect(page.getByRole("checkbox", { name: /Montaj la locație/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Salvează datele de montaj" })).toHaveCount(0);

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "PATCH" &&
        /\/api\/requests\/[^/]+$/.test(new URL(response.url()).pathname),
    ),
    page.getByRole("checkbox", { name: /Montaj la locație/ }).click(),
  ]);
  await expect(page.getByRole("button", { name: "Salvează datele de montaj" })).toBeVisible();
  await expect(page.getByText("Adresa locului de execuție este incompletă.")).toBeVisible();
  await expect(page.getByText("Evidența de cost pentru montaj lipsește.")).toBeVisible();

  await page.getByLabel("Stradă").fill("Strada Fabricii 10");
  await page.getByLabel("Localitate").fill("București");
  await page.getByLabel("Stare măsurători").selectOption("OFFICE_MEASURED");
  await page.getByLabel("Fațadă").selectOption("CONCRETE");
  await page.getByLabel("Prindere").selectOption("MECHANICAL_ANCHOR");
  await page.getByLabel("Electric de șantier").selectOption("NOT_APPLICABLE");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "PATCH" &&
        response.url().includes("/installation-facts"),
    ),
    page.getByRole("button", { name: "Salvează datele de montaj" }).click(),
  ]);
  await expect(page.getByText("Datele de montaj au fost salvate.")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Stradă")).toHaveValue("Strada Fabricii 10");
  await expect(page.getByLabel("Localitate")).toHaveValue("București");
  await expect(page.getByText("Evidența de cost pentru montaj lipsește.")).toBeVisible();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: ".tmp/os-s2-evidence/cerere-facts-1440.png", fullPage: true });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: ".tmp/os-s2-evidence/cerere-facts-1280.png", fullPage: true });
  await page.setViewportSize({ width: 768, height: 900 });
  await page.screenshot({ path: ".tmp/os-s2-evidence/cerere-facts-768.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.getByLabel("Stradă").focus();
  await expect(page.getByLabel("Stradă")).toBeFocused();

  await page
    .locator(`a[href*="${CANONICAL_LETTERS_PRODUCT_CODE}"]`)
    .filter({ hasText: "Configurează" })
    .click();
  await confirmCanonicalLettersOnPage(page, token.slice(0, 8));
  await expect(page.getByRole("heading", { name: "Montaj la locație" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Salvează datele de montaj" })).toHaveCount(0);
  await expect(page.getByLabel("Stradă")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Creează oferta" })).toBeDisabled();

  await page.goto(`/requests/${encodeURIComponent(requestId)}`);
  await page.getByRole("checkbox", { name: /Montaj la locație/ }).click();
  await expect(page.getByRole("dialog", { name: "Renunți la montaj?" })).toBeVisible();
  await page.getByRole("button", { name: "Anulează" }).click();
  await expect(page.getByRole("dialog", { name: "Renunți la montaj?" })).toHaveCount(0);
  await expect(page.getByLabel("Stradă")).toHaveValue("Strada Fabricii 10");

  await page.getByRole("checkbox", { name: /Montaj la locație/ }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "PATCH" &&
        /\/api\/requests\/[^/]+$/.test(new URL(response.url()).pathname),
    ),
    page.getByRole("button", { name: "Șterge datele de montaj" }).click(),
  ]);
  await expect(page.getByRole("button", { name: "Salvează datele de montaj" })).toHaveCount(0);
  await expect(page.getByRole("checkbox", { name: /Montaj la locație/ })).not.toBeChecked();

  const lockedCreated = await request.post("/api/requests", {
    data: {
      customerId,
      title: `Litere lock ${token}`,
      description: "Cerere pentru lock după ofertă.",
    },
  });
  const lockedId = ((await lockedCreated.json()) as { request: { requestId: string } }).request
    .requestId;
  const compile = await request.post(`/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/compile`, {
    data: {
      values: {
        "root.inscription": token.slice(0, 4),
        "face.finish": "none",
        "face.confirmedAreaMm2": 250000,
        "volume.depthMm": "60",
        "volume.finish": "none",
        "volume.confirmedPerimeterMm": 12500,
      },
    },
  });
  const compiled = (await compile.json()) as { definition: unknown; reviewId: string };
  const freeze = await request.post(
    `/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/quote-snapshots`,
    {
      data: {
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        customerId,
        requestId: lockedId,
      },
    },
  );
  expect(freeze.ok()).toBeTruthy();
  await page.goto(`/requests/${encodeURIComponent(lockedId)}`);
  await expect(page.getByRole("checkbox", { name: /Montaj la locație/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Salvează datele de montaj" })).toHaveCount(0);
});
