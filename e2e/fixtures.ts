import { test as base, type Locator, type Page } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { rename, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export { expect } from "@playwright/test";

async function writePngAtomic(dest: string, buffer: Buffer) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const tmp = join(dirname(dest), `.tmp-${randomBytes(4).toString("hex")}.png`);
    try {
      await writeFile(tmp, buffer);
      try {
        await rename(tmp, dest);
      } catch {
        await unlink(dest).catch(() => undefined);
        await rename(tmp, dest);
      }
      return;
    } catch (error) {
      lastError = error;
      await unlink(tmp).catch(() => undefined);
      await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    }
  }
  throw lastError;
}

function wrapScreenshot<T extends Page | Locator>(target: T): T {
  const original = target.screenshot.bind(target);
  target.screenshot = (async (options = {}) => {
    if (!options.path) {
      return original(options);
    }
    const buffer = await original({ ...options, path: undefined });
    await writePngAtomic(options.path, buffer as Buffer);
    return buffer;
  }) as T["screenshot"];
  return target;
}

export const test = base.extend({
  page: async ({ page }, use) => {
    wrapScreenshot(page);
    const originalLocator = page.locator.bind(page);
    page.locator = ((selector, options) =>
      wrapScreenshot(originalLocator(selector, options))) as Page["locator"];
    await use(page);
  },
});
