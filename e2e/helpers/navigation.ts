import { expect, type Page } from "@playwright/test";

const COMMERCIAL_LABELS = new Set(["Clienți", "Oferte", "Catalog"]);
const MORE_LABELS = new Set([
  "Resurse și costuri",
  "Stoc",
  "Utilaje",
  "Angajați",
]);

export function primaryNav(page: Page) {
  return page.getByRole("navigation", { name: "Navigare principală" });
}

export function brandLink(page: Page) {
  return page.getByRole("link", { name: "WorkOS", exact: true });
}

export function primaryNavLink(page: Page, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return primaryNav(page).getByRole("link", {
    name: new RegExp(`(?:^|— )${escaped}$`),
  });
}

export function pageMain(page: Page) {
  return page.getByRole("main");
}

export function adminHomeLink(page: Page, name: string) {
  return pageMain(page).getByRole("link", { name, exact: true });
}

export async function openMobileMenu(page: Page) {
  await page.getByRole("button", { name: "Meniu" }).click();
  return page.locator(".app-nav-drawer-panel[role='dialog']");
}

export async function openCommercialPanel(page: Page) {
  const trigger = primaryNav(page).getByRole("button", { name: "Comercial" });
  if ((await trigger.getAttribute("aria-expanded")) !== "true") {
    await trigger.click();
  }
  return page.getByRole("region", { name: "Comercial" });
}

export async function openMorePanel(page: Page) {
  const trigger = primaryNav(page).getByRole("button", { name: "Mai multe" });
  if ((await trigger.getAttribute("aria-expanded")) !== "true") {
    await trigger.click();
  }
  return page.getByRole("region", { name: "Mai multe" });
}

export async function openContMenu(page: Page) {
  const trigger = page.getByRole("button", { name: "Cont" });
  if ((await trigger.getAttribute("aria-expanded")) !== "true") {
    await trigger.click();
  }
  return trigger;
}

/** Resolve a destination link in the UI20 shell (L1, Comercial L2, or Mai multe). */
export async function destinationLink(page: Page, name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const linkName = new RegExp(`^${escaped}$`);

  if (COMMERCIAL_LABELS.has(name)) {
    const panel = await openCommercialPanel(page);
    return panel.getByRole("link", { name: linkName });
  }
  if (MORE_LABELS.has(name)) {
    const panel = await openMorePanel(page);
    return panel.getByRole("link", { name: linkName });
  }
  return primaryNavLink(page, name);
}

export async function clickPrimaryDestination(page: Page, name: string) {
  await (await destinationLink(page, name)).click();
}

export async function expectUi20DesktopShell(page: Page) {
  await expectShellTop(page);
  await expect(primaryNav(page).getByRole("link", { name: "Cereri" })).toBeVisible();
  await expect(primaryNav(page).getByRole("button", { name: "Comercial" })).toBeVisible();
  await expect(primaryNav(page).getByRole("link", { name: "Lucrări" })).toBeVisible();
  await expect(primaryNav(page).getByRole("link", { name: "Atelier" })).toBeVisible();
  await expect(primaryNav(page).getByRole("button", { name: "Mai multe" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cont" })).toBeVisible();
  await expect(primaryNav(page).getByRole("link", { name: "Acasă" })).toHaveCount(0);
  await expect(page.locator(".app-sidebar-desktop")).toHaveCount(0);
}

async function expectShellTop(page: Page) {
  await expect(page.locator(".app-shell")).toHaveClass(/is-ui20-top/);
  await expect(brandLink(page)).toBeVisible();
}
