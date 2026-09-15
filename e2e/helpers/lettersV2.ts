import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { selectProductChoice } from "./productChoices";

/** Deterministic FC2B/FC2C catalog fixtures. Keep aligned with domain roll/color ids. */
export const LETTERS_V2_ORACAL_SERIES = "651";
export const LETTERS_V2_COLOR_CODE = "010";
export const LETTERS_V2_COLOR_OPTION = "010 — White";
export const LETTERS_V2_ORACAL_ROLL_ID = "roll:shared:oracal:1260";
export const LETTERS_V2_PRINT_ROLL_ID = "roll:shared:print:1370";
export const LETTERS_V2_RAL_9010_CODE = "9010";
export const LETTERS_V2_RAL_9010_OPTION = "9010 — Pure white";

export async function pickLettersCatalogColor(
  page: Page,
  buttonName: RegExp,
  query: string,
  optionName: string,
): Promise<void> {
  await page.getByRole("button", { name: buttonName }).click();
  await page.getByLabel("Caută culoare după cod sau nume").fill(query);
  await page.getByRole("option", { name: optionName, exact: true }).click();
}

export async function selectLettersFaceNone(page: Page): Promise<void> {
  await selectProductChoice(page, "Finisaj față", "none");
}

export async function selectLettersFaceOracal651(page: Page): Promise<void> {
  await selectProductChoice(page, "Finisaj față", "oracal");
  await selectProductChoice(page, "Serie Oracal", LETTERS_V2_ORACAL_SERIES);
  await pickLettersCatalogColor(page, /Culoare/, LETTERS_V2_COLOR_CODE, LETTERS_V2_COLOR_OPTION);
  await selectProductChoice(page, "Rolă", LETTERS_V2_ORACAL_ROLL_ID);
}

export async function selectLettersVolumeStock(page: Page): Promise<void> {
  await selectProductChoice(page, "Finisaj volum", "stock");
}

export async function selectLettersVolumePaintedRal9010(page: Page): Promise<void> {
  await selectProductChoice(page, "Finisaj volum", "painted");
  await pickLettersCatalogColor(
    page,
    /Culoare RAL/,
    LETTERS_V2_RAL_9010_CODE,
    LETTERS_V2_RAL_9010_OPTION,
  );
}

export async function fillLettersV2NoneStock(
  page: Page,
  options?: { inscription?: string; depthMm?: string },
): Promise<void> {
  await page.getByLabel("Textul literelor").fill(options?.inscription ?? "WORKOS");
  await selectLettersFaceNone(page);
  await page.getByLabel("Suprafață confirmată (mm²)").fill("250000");
  await selectProductChoice(page, "Adâncime volum (mm)", options?.depthMm ?? "60");
  await selectLettersVolumeStock(page);
  await page.getByLabel("Perimetru confirmat (mm)").fill("12500");
}

export async function confirmLettersV2NoneStock(
  page: Page,
  options?: { inscription?: string; depthMm?: string },
): Promise<void> {
  await fillLettersV2NoneStock(page, options);
  await page.getByRole("button", { name: "Verifică configurația" }).click();
  await page.getByRole("button", { name: "Confirmă configurația" }).click();
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
}
