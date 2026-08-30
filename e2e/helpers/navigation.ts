import type { Page } from "@playwright/test";

export function primaryNav(page: Page) {
  return page.getByRole("navigation", { name: "Navigare principală" });
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
  return page.getByRole("dialog", { name: "Meniu" });
}
