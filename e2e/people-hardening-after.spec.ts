import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "./fixtures";

const HARDENING_PERSON_PATH = join(process.cwd(), ".tmp", "hardening-person.json");

test("removed skill stays removed after a new API boot", async ({ page }) => {
  if (!existsSync(HARDENING_PERSON_PATH)) {
    test.skip(true, "run people-hardening.spec.ts first");
    return;
  }
  const saved = JSON.parse(readFileSync(HARDENING_PERSON_PATH, "utf8")) as {
    href: string;
    name: string;
  };
  await page.goto(saved.href);
  await expect(page.getByRole("heading", { name: saved.name })).toBeVisible();
  await expect(page.locator(".people-skill-list").getByText("CNC")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/people-skill-removal-after-restart.png",
    fullPage: true,
  });
});
