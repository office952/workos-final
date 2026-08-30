import { type APIRequestContext, type Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { adminHomeLink, primaryNavLink } from "./helpers/navigation";
import { revealSecondaryProductSurfaces } from "./helpers/surfaces";

const FAMILY_ID = "LIGHTED_VOLUMETRIC_SIGNS";
const CATEGORY_ID = "HALO_LIT_VOLUMETRIC_LETTERS";
const PRODUCT_CODE = "PRD-LETTERS-FRONTLIT-PLEXI-AL06";
const TYPE_ID = "PLEXIGLAS_FACE";

const ORIGINAL = {
  family: "Litere și semne volumetrice luminoase",
  category: "Litere volumetrice luminoase cu iluminare halou",
  product: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
  type: "Plexiglas",
};

const RENAMED = {
  family: "Familie de test administrare",
  category: "Categorie de test administrare",
  product: "Produs de test administrare",
  type: "Plexiglas administrat",
};

test("admin display-label write persists and propagates", async ({
  page,
  request,
}) => {
  try {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
    await expect(adminHomeLink(page, "Sistem produs")).toBeVisible();
    await expect(adminHomeLink(page, "Resurse și cost intern")).toBeVisible();
    await expect(adminHomeLink(page, "Procese operaționale")).toBeVisible();
    await expect(adminHomeLink(page, "Utilaje și zone")).toBeVisible();
    await expect(adminHomeLink(page, "Oameni")).toBeVisible();
    await expect(adminHomeLink(page, "Clienți")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Operațiuni" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Comercial" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sistem", exact: true })).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-home.png",
      fullPage: true,
    });
    await page.screenshot({
      path: "docs/worklog/screenshots/ui-admin-home.png",
      fullPage: true,
    });

    await adminHomeLink(page, "Sistem produs").click();
    await expect(page.getByRole("heading", { name: "Sistem produs" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Familii" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await selectCatalogItem(page, ORIGINAL.family);
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-families-write.png",
      fullPage: true,
    });

    await page.getByRole("button", { name: "Editează" }).click();
    await expect(
      page.locator(".display-label-editor").getByText(FAMILY_ID),
    ).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-family-edit.png",
      fullPage: true,
    });
    await page.getByLabel("Etichetă afișată").fill(RENAMED.family);
    await page.getByRole("button", { name: "Salvează" }).click();
    await expectSelectedCatalogLabel(page, RENAMED.family);
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-family-saved.png",
      fullPage: true,
    });

    await page.reload();
    await selectCatalogItem(page, RENAMED.family);
    const afterReload = (await (await request.get("/api/product-system-admin")).json()) as {
      families: Array<{ id: string; label: string }>;
    };
    expect(afterReload.families.find((item) => item.id === FAMILY_ID)?.label).toBe(
      RENAMED.family,
    );

    await page.getByRole("button", { name: "Categorii" }).click();
    await selectCatalogItem(page, ORIGINAL.category);
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-categories-write.png",
      fullPage: true,
    });
    await renameCurrent(page, RENAMED.category);

    await page.getByRole("button", { name: "Produse", exact: true }).click();
    await selectCatalogItem(page, ORIGINAL.product);
    await page.getByRole("button", { name: "Editează" }).click();
    await expect(
      page.locator(".display-label-editor").getByText(PRODUCT_CODE),
    ).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-product-edit.png",
      fullPage: true,
    });
    await page.getByLabel("Etichetă afișată").fill(RENAMED.product);
    await page.getByRole("button", { name: "Salvează" }).click();
    await expectSelectedCatalogLabel(page, RENAMED.product);

    await page.getByRole("button", { name: "Tipuri constructive" }).click();
    await selectCatalogItem(page, ORIGINAL.type);
    await page.getByRole("button", { name: "Editează" }).click();
    await expect(
      page.locator(".display-label-editor").getByText(TYPE_ID),
    ).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-type-edit.png",
      fullPage: true,
    });
    await page.getByLabel("Etichetă afișată").fill(RENAMED.type);
    await page.getByRole("button", { name: "Salvează" }).click();
    await expectSelectedCatalogLabel(page, RENAMED.type);

    await primaryNavLink(page, "Catalog").click();
    await expect(page.getByRole("link", { name: RENAMED.product })).toBeVisible();
    await expect(page.getByRole("heading", { name: RENAMED.family })).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-products-propagated.png",
      fullPage: true,
    });

    await page.goto("/components");
    await expect(page.getByRole("heading", { name: "Module și componente" })).toBeVisible();
    await page.getByRole("button", { name: "Familii" }).click();
    await selectCatalogItem(page, RENAMED.family);
    await page.getByRole("button", { name: "Componente de produs" }).click();
    await selectCatalogItem(page, "Față");
    await expect(
      catalogDetail(page).getByRole("heading", { name: RENAMED.type, exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/admin-components-propagated.png",
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
    await page.screenshot({
      path: "docs/worklog/screenshots/persist-admin-narrow.png",
      fullPage: true,
    });
  } finally {
    await restoreOriginalLabels(request);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/products");
  await page.getByRole("link", { name: ORIGINAL.product }).click();
  await page.getByLabel("Textul literelor").fill("WORKOS");
  await page.getByLabel("Finisaj față").selectOption("none");
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await page.getByLabel("Adâncime volum (mm)").selectOption("60");
  await page.getByLabel("Finisaj volum").selectOption("none");
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-product-configure.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație pregătită pentru confirmare" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-product-review.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await revealSecondaryProductSurfaces(page);
  await expect(page.getByText("Total cost intern estimat: 382,50 EUR")).toBeVisible();
  await expect(page.getByText("Cost intern curent: 382,50 EUR (complet)")).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/admin-product-confirm.png",
    fullPage: true,
  });
});

function catalogDetail(page: Page) {
  return page.locator("article.owner-catalog-detail");
}

async function expectSelectedCatalogLabel(page: Page, label: string): Promise<void> {
  await expect(
    catalogDetail(page).getByRole("heading", { name: label, exact: true }),
  ).toBeVisible();
}

async function selectCatalogItem(page: Page, label: string): Promise<void> {
  await page
    .getByRole("navigation", { name: "Elemente catalog" })
    .locator("button.owner-catalog-item")
    .filter({
      has: page
        .locator("span.owner-catalog-item-label > span:not(.owner-catalog-item-kind)")
        .getByText(label, { exact: true }),
    })
    .click();
  await expectSelectedCatalogLabel(page, label);
}

async function renameCurrent(page: Page, label: string): Promise<void> {
  await page.getByRole("button", { name: "Editează" }).click();
  await page.getByLabel("Etichetă afișată").fill(label);
  await page.getByRole("button", { name: "Salvează" }).click();
  await expectSelectedCatalogLabel(page, label);
}

async function restoreOriginalLabels(request: APIRequestContext): Promise<void> {
  const admin = (await (await request.get("/api/product-system-admin")).json()) as {
    families: Array<{ id: string; displayRevision: number }>;
    categories: Array<{ id: string; displayRevision: number }>;
    products: Array<{ code: string; displayRevision: number }>;
    types: Array<{ typeId: string; displayRevision: number }>;
  };
  await patchLabel(
    request,
    "PRODUCT_FAMILY",
    FAMILY_ID,
    ORIGINAL.family,
    admin.families.find((item) => item.id === FAMILY_ID)?.displayRevision ?? 1,
  );
  await patchLabel(
    request,
    "PRODUCT_CATEGORY",
    CATEGORY_ID,
    ORIGINAL.category,
    admin.categories.find((item) => item.id === CATEGORY_ID)?.displayRevision ?? 1,
  );
  await patchLabel(
    request,
    "PRODUCT_TEMPLATE",
    PRODUCT_CODE,
    ORIGINAL.product,
    admin.products.find((item) => item.code === PRODUCT_CODE)?.displayRevision ?? 1,
  );
  await patchLabel(
    request,
    "COMPONENT_TYPE",
    TYPE_ID,
    ORIGINAL.type,
    admin.types.find((item) => item.typeId === TYPE_ID)?.displayRevision ?? 1,
  );
}

async function patchLabel(
  request: APIRequestContext,
  kind: string,
  id: string,
  displayLabel: string,
  revision: number,
): Promise<void> {
  const response = await request.patch(
    `/api/admin/product-system/entities/${kind}/${id}/display-label`,
    { data: { displayLabel, revision } },
  );
  expect(response.ok()).toBeTruthy();
}
