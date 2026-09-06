import { expect, test } from "./fixtures";
import {
  brandLink,
  clickPrimaryDestination,
  destinationLink,
  expectUi20DesktopShell,
  openMobileMenu,
  openMorePanel,
  primaryNav,
  primaryNavLink,
} from "./helpers/navigation";

const shot = (name: string) => `docs/worklog/screenshots/ui20-rw1-nav-${name}.png`;

test("ui20 quiet top shell projects L1 and nested destinations without fake pages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/clients");
  await expect(page.getByRole("heading", { name: "Clienți" })).toBeVisible();
  await expectUi20DesktopShell(page);
  await expect(await destinationLink(page, "Clienți")).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: shot("1440-clients"), fullPage: true });

  await clickPrimaryDestination(page, "Cereri");
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await expect(primaryNavLink(page, "Cereri")).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: shot("1440-requests"), fullPage: true });

  await clickPrimaryDestination(page, "Lucrări");
  await expect(page).toHaveURL(/\/jobs$/);
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(primaryNavLink(page, "Lucrări")).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: shot("1440-jobs"), fullPage: true });

  await clickPrimaryDestination(page, "Stoc");
  await expect(page).toHaveURL(/\/admin\/stock$/);
  await expect(page.getByRole("heading", { name: "Stoc", exact: true })).toBeVisible();
  await expect(await destinationLink(page, "Stoc")).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: shot("1440-stock"), fullPage: true });

  await page.goto("/governance");
  await expect(page.getByRole("heading", { name: "Guvernanța sistemului" })).toBeVisible();
  await expectUi20DesktopShell(page);
  await page.getByRole("button", { name: "Cont" }).click();
  await expect(page.getByRole("link", { name: "Administrare" })).toBeVisible();
  await page.screenshot({ path: shot("1440-governance-cont"), fullPage: true });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(primaryNavLink(page, "Lucrări")).toHaveAttribute("aria-current", "page");
  await expect(primaryNav(page).getByRole("link", { name: "Acasă" })).toHaveCount(0);
  await page.goto("/home");
  await expect(page).not.toHaveURL(/\/home$/);
  await page.goto("/commercial");
  await expect(page).toHaveURL(/\/requests$/);
  await expect(primaryNavLink(page, "Cereri")).toHaveAttribute("aria-current", "page");
  await page.goto("/jobs/ord:missing");
  await expect(page.getByText("Lucrarea nu a fost găsită.")).toBeVisible();
  await expect(primaryNavLink(page, "Lucrări")).toHaveAttribute("aria-current", "page");

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/clients");
  await expectUi20DesktopShell(page);
  await page.screenshot({ path: shot("1280-clients"), fullPage: true });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/clients");
  await expect(page.getByRole("button", { name: "Meniu" })).toBeVisible();
  await expect(primaryNav(page)).toBeHidden();
  await page.screenshot({ path: shot("768-clients-closed"), fullPage: true });

  const clientsMenu = await openMobileMenu(page);
  // RW1 opens nested Comercial when the active route already belongs there.
  await expect(clientsMenu.getByRole("link", { name: "Clienți" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.screenshot({ path: shot("768-clients-comercial"), fullPage: true });
  await page.keyboard.press("Escape");
  await expect(page.locator(".app-nav-drawer-panel[role='dialog']")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Meniu" })).toBeFocused();

  await page.goto("/admin/resources");
  const resourcesMenu = await openMobileMenu(page);
  await expect(resourcesMenu.getByRole("link", { name: "Resurse și costuri" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.screenshot({ path: shot("768-resources-mai-multe"), fullPage: true });
  const scrim = page.locator(".app-nav-drawer-scrim");
  const scrimBox = await scrim.boundingBox();
  expect(scrimBox).toBeTruthy();
  await page.mouse.click((scrimBox?.x ?? 0) + (scrimBox?.width ?? 768) - 24, (scrimBox?.y ?? 0) + 80);
  await expect(page.locator(".app-nav-drawer-panel[role='dialog']")).toHaveCount(0);
});

test("Mai multe siblings stay reachable without inventing destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/admin/stock");
  await expect(page.getByRole("heading", { name: "Stoc", exact: true })).toBeVisible();
  await expect(await destinationLink(page, "Stoc")).toHaveAttribute("aria-current", "page");

  await clickPrimaryDestination(page, "Utilaje");
  await expect(page).toHaveURL(/\/admin\/workcenters$/);
  await expect(page.getByRole("heading", { name: "Utilaje și zone" })).toBeVisible();

  await clickPrimaryDestination(page, "Resurse și costuri");
  await expect(page).toHaveURL(/\/admin\/resources$/);
  await expect(page.getByRole("heading", { name: "Resurse și costuri" })).toBeVisible();

  const more = await openMorePanel(page);
  await expect(more.getByRole("link", { name: "Furnizori" })).toHaveCount(0);
  await expect(more.getByRole("link", { name: "Pontaj" })).toHaveCount(0);
  await expect(more.getByRole("link", { name: "Acasă" })).toHaveCount(0);
});

test("unknown paths fall back to Lucrări with quiet top shell intact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/admin/stock");
  await expectUi20DesktopShell(page);

  await page.goto("/suppliers");
  await expect(page.getByRole("heading", { name: "Lucrări", level: 1 })).toBeVisible();
  await expect(primaryNavLink(page, "Lucrări")).toHaveAttribute("aria-current", "page");
  await expect(primaryNav(page).locator("a[aria-current='page']")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Navigare comercială" })).toHaveCount(0);
  await expect(brandLink(page)).toBeVisible();
});
