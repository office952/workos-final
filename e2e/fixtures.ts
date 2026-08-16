import { test as base, type Page } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { rename, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export { expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    const original = page.screenshot.bind(page);
    page.screenshot = (async (options = {}) => {
      if (!options.path) {
        return original(options);
      }
      const dest = options.path;
      const buffer = await original({ ...options, path: undefined });
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
          return buffer;
        } catch (error) {
          lastError = error;
          await unlink(tmp).catch(() => undefined);
          await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
        }
      }
      throw lastError;
    }) as Page["screenshot"];
    await use(page);
  },
});
