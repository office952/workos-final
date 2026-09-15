import type { Page } from "@playwright/test";

export function productChoiceGroup(page: Page, label: string) {
  return page.getByRole("radiogroup", { name: label });
}

export function productChoiceSelect(page: Page, label: string) {
  return page
    .locator(".field-choice")
    .filter({ has: productChoiceGroup(page, label) })
    .locator("select.choice-select-native");
}

export async function selectProductChoice(
  page: Page,
  label: string,
  value: string,
): Promise<void> {
  const resolved =
    label === "Finisaj volum" && value === "none" ? "stock" : value;
  await productChoiceSelect(page, label).selectOption(resolved);
}
