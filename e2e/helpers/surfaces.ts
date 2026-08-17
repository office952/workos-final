import type { Page } from "@playwright/test";

export async function revealSecondaryProductSurfaces(page: Page) {
  const details = page.locator("details.secondary-details, details.atelier-details");
  const count = await details.count();
  for (let index = 0; index < count; index += 1) {
    const item = details.nth(index);
    const open = await item.evaluate((el) => (el as HTMLDetailsElement).open);
    if (!open) {
      await item.locator(":scope > summary").click();
    }
  }
}
