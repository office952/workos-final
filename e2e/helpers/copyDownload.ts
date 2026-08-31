import { copyFileSync } from "node:fs";
import { expect, type Page } from "@playwright/test";
import { isWorklogEvidencePath, shouldWriteWorklogEvidence } from "./worklogEvidence";

export async function copyDownload(page: Page, source: string | null, dest: string) {
  expect(source).toBeTruthy();
  if (isWorklogEvidencePath(dest) && !shouldWriteWorklogEvidence(dest)) {
    return;
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      copyFileSync(source!, dest);
      return;
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }
      await page.waitForTimeout(150 * (attempt + 1));
    }
  }
}
