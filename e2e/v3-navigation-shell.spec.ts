import { expect, test } from "./fixtures";
import { openMobileMenu, primaryNav, primaryNavLink } from "./helpers/navigation";

const shot = (name: string) => `docs/worklog/screenshots/v3-nav-${name}.png`;

const VISIBLE_LABELS = [
  "Clienți",
  "Cereri",
  "Oferte",
  "Catalog",
  "Lucrări",
  "Atelier",
  "Resurse și costuri",
  "Stoc",
  "Utilaje",
  "Angajați",
  "Firmă",
  "Servicii operaționale",
  "Sistem produs",
  "Guvernanță",
];

async function expectStableMenu(page: import("@playwright/test").Page) {
  await expect(primaryNav(page).getByRole("link")).toHaveText(VISIBLE_LABELS);
  await expect(primaryNav(page).getByRole("link", { name: "Acasă" })).toHaveCount(0);
  await expect(primaryNav(page).getByRole("link", { name: "Furnizori" })).toHaveCount(0);
  await expect(primaryNav(page).getByRole("link", { name: "Pontaj" })).toHaveCount(0);
  await expect(primaryNav(page).getByRole("link", { name: "Plăți și avansuri" })).toHaveCount(0);
  await expect(primaryNav(page).getByRole("link", { name: "Politici" })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Navigare comercială" })).toHaveCount(0);
}

async function expectActiveVisiblePage(
  page: import("@playwright/test").Page,
  label: string,
  heading: string,
  headingExact = false,
) {
  await expectStableMenu(page);
  await expect(primaryNavLink(page, label)).toHaveAttribute("aria-current", "page");
  await expect(primaryNav(page).locator("a[aria-current='page']")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: heading, exact: headingExact, level: 1 }),
  ).toBeVisible();
}

test("v3 stable sidebar projects existing routes without fake pages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/clients");
  await expect(page.getByRole("heading", { name: "Clienți" })).toBeVisible();
  await expect(primaryNavLink(page, "Clienți")).toHaveAttribute("aria-current", "page");
  await expectStableMenu(page);
  await page.screenshot({ path: shot("1440-clients-expanded"), fullPage: true });

  await primaryNavLink(page, "Cereri").click();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await expectStableMenu(page);
  await page.screenshot({ path: shot("1440-requests-expanded"), fullPage: true });

  await primaryNavLink(page, "Lucrări").click();
  await expect(page).toHaveURL(/\/jobs$/);
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expectStableMenu(page);
  await page.screenshot({ path: shot("1440-jobs-expanded"), fullPage: true });

  await primaryNavLink(page, "Stoc").click();
  await expectActiveVisiblePage(page, "Stoc", "Stoc", true);
  await page.screenshot({ path: shot("1440-stock-expanded"), fullPage: true });

  await primaryNavLink(page, "Guvernanță").click();
  await expect(page.getByRole("heading", { name: "Guvernanța sistemului" })).toBeVisible();
  await expect(primaryNavLink(page, "Guvernanță")).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: shot("1440-governance-expanded"), fullPage: true });

  await page.getByRole("button", { name: "Restrânge meniul" }).click();
  await expect(page.locator(".app-shell")).toHaveClass(/is-sidebar-collapsed/);
  await page.reload();
  await expect(page.locator(".app-shell")).toHaveClass(/is-sidebar-collapsed/);
  await expect(primaryNavLink(page, "Guvernanță")).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: shot("1440-governance-collapsed"), fullPage: true });

  await page.goto("/clients");
  await page.screenshot({ path: shot("1440-clients-collapsed"), fullPage: true });
  await page.goto("/requests");
  await page.screenshot({ path: shot("1440-requests-collapsed"), fullPage: true });
  await page.goto("/jobs");
  await page.screenshot({ path: shot("1440-jobs-collapsed"), fullPage: true });
  await page.goto("/admin/stock");
  await page.screenshot({ path: shot("1440-stock-collapsed"), fullPage: true });

  await page.getByRole("button", { name: "Extinde meniul" }).click();

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/clients");
  await expectStableMenu(page);
  await page.screenshot({ path: shot("1280-clients-expanded"), fullPage: true });
  await page.getByRole("button", { name: "Restrânge meniul" }).click();
  await page.screenshot({ path: shot("1280-clients-collapsed"), fullPage: true });
  await page.getByRole("button", { name: "Extinde meniul" }).click();
  await page.goto("/governance");
  await page.screenshot({ path: shot("1280-governance-expanded"), fullPage: true });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(primaryNavLink(page, "Lucrări")).toHaveAttribute("aria-current", "page");
  await page.goto("/commercial");
  await expect(page).toHaveURL(/\/requests$/);
  await expect(primaryNavLink(page, "Cereri")).toHaveAttribute("aria-current", "page");
  await page.goto("/jobs/ord:missing");
  await expect(page.getByText("Lucrarea nu a fost găsită.")).toBeVisible();
  await expect(primaryNavLink(page, "Lucrări")).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: shot("1280-jobs-missing"), fullPage: true });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/clients");
  await expect(page.getByRole("button", { name: "Meniu" })).toBeVisible();
  await expect(primaryNav(page)).toBeHidden();
  await page.screenshot({ path: shot("768-clients-closed"), fullPage: true });

  const clientsMenu = await openMobileMenu(page);
  const clientsBox = await clientsMenu.boundingBox();
  expect(clientsBox?.width ?? 0).toBeLessThanOrEqual(384);
  expect(clientsBox?.width ?? 0).toBeGreaterThan(200);
  await expect(clientsMenu.getByRole("link", { name: "Clienți" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(clientsMenu.getByRole("link", { name: "Clienți" })).toBeFocused();
  await page.screenshot({ path: shot("768-clients-open"), fullPage: true });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Meniu" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Meniu" })).toBeFocused();

  await page.goto("/governance");
  const governanceMenu = await openMobileMenu(page);
  await expect(governanceMenu.getByRole("link", { name: "Guvernanță" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(governanceMenu.getByRole("link", { name: "Guvernanță" })).toBeFocused();
  await page.screenshot({ path: shot("768-governance-open"), fullPage: true });
  const scrim = page.locator(".app-nav-drawer-scrim");
  const scrimBox = await scrim.boundingBox();
  expect(scrimBox).toBeTruthy();
  await page.mouse.click((scrimBox?.x ?? 0) + (scrimBox?.width ?? 768) - 24, (scrimBox?.y ?? 0) + 80);
  await expect(page.getByRole("dialog", { name: "Meniu" })).toHaveCount(0);
  await page.screenshot({ path: shot("768-governance-closed-after-scrim"), fullPage: true });
});

test("visible sibling pages keep the same menu from Stoc to Utilaje and Resurse", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/admin/stock");
  await expectActiveVisiblePage(page, "Stoc", "Stoc", true);

  await primaryNavLink(page, "Utilaje").click();
  await expect(page).toHaveURL(/\/admin\/workcenters$/);
  await expectActiveVisiblePage(page, "Utilaje", "Utilaje și zone");

  await primaryNavLink(page, "Resurse și costuri").click();
  await expect(page).toHaveURL(/\/admin\/resources$/);
  await expectActiveVisiblePage(page, "Resurse și costuri", "Resurse și cost intern");

  await primaryNavLink(page, "Stoc").click();
  await expect(page).toHaveURL(/\/admin\/stock$/);
  await expectActiveVisiblePage(page, "Stoc", "Stoc", true);
});

test("unknown paths keep the same visible menu and fall back to Lucrări", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/admin/stock");
  await expectActiveVisiblePage(page, "Stoc", "Stoc", true);
  const menu = await primaryNav(page).getByRole("link").allTextContents();

  await page.goto("/suppliers");
  await expect(page.getByRole("heading", { name: "Lucrări", level: 1 })).toBeVisible();
  await expect(primaryNavLink(page, "Lucrări")).toHaveAttribute("aria-current", "page");
  await expect(primaryNav(page).locator("a[aria-current='page']")).toHaveCount(1);
  await expect(primaryNav(page).getByRole("link")).toHaveText(menu);
  await expect(page.getByRole("navigation", { name: "Navigare comercială" })).toHaveCount(0);
});
