import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";

const authPath = resolve(process.cwd(), ".tmp/hf-wave3-review/cloud/owner-auth.txt");
const evidenceDir = resolve(process.cwd(), ".tmp/hf-wave4-owner-review-evidence");

function readOwnerAuth(): { email: string; password: string } {
  const text = readFileSync(authPath, "utf8");
  const values: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const cut = line.indexOf("=");
    if (cut <= 0 || line.startsWith("#")) {
      continue;
    }
    values[line.slice(0, cut).trim()] = line.slice(cut + 1);
  }
  if (!values.email || !values.password) {
    throw new Error("owner_auth_incomplete");
  }
  return { email: values.email, password: values.password };
}

function shot(name: string): string {
  mkdirSync(evidenceDir, { recursive: true });
  return resolve(evidenceDir, `${name}.png`);
}

async function loginOwner(page: Page): Promise<void> {
  const auth = readOwnerAuth();
  await page.goto("/admin/resources");
  await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
  await page.getByLabel("Email").fill(auth.email);
  await page.getByLabel("Parolă").fill(auth.password);
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
}

async function measurePage(page: Page): Promise<{
  under44: Array<{ name: string; width: number; height: number }>;
  overflow: boolean;
  clipped: number;
}> {
  return page.evaluate(() => {
    const selectors = "a, button, [role='button'], input, select, textarea, summary";
    const nodes = [...document.querySelectorAll(selectors)] as HTMLElement[];
    const visible = nodes.filter((el) => {
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return (
        box.width > 0 &&
        box.height > 0 &&
        style.visibility !== "hidden" &&
        style.display !== "none"
      );
    });
    const under44 = visible
      .filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width < 44 || box.height < 44;
      })
      .map((el) => {
        const box = el.getBoundingClientRect();
        return {
          name: (
            el.getAttribute("aria-label") ||
            el.getAttribute("placeholder") ||
            el.id ||
            el.textContent ||
            el.tagName
          )
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 80),
          width: Math.round(box.width),
          height: Math.round(box.height),
        };
      });
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    const clipped = [...document.querySelectorAll("h1, h2, p, dd, .page-lead")].filter((node) => {
      const el = node as HTMLElement;
      return el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === "hidden";
    }).length;
    return { under44, overflow, clipped };
  });
}

test.describe("Wave 4 resources and admin reuse", () => {
  test.skip(!existsSync(authPath), "synthetic Owner review auth missing");

  test("rejects invalid credentials and keeps a valid Cloud session after reload", async ({
    page,
  }) => {
    const auth = readOwnerAuth();
    await page.goto("/admin/resources");
    await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
    await page.getByLabel("Email").fill(auth.email);
    await page.getByLabel("Parolă").fill("WrongPass12");
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("alert")).toHaveText("Email sau parolă greșită.");
    await expect(page.getByText("WrongPass12")).toHaveCount(0);

    await page.getByLabel("Parolă").fill(auth.password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();

    await page.getByRole("button", { name: "Ieși din cont" }).click();
    await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/resources/);

    await page.getByLabel("Email").fill(auth.email);
    await page.getByLabel("Parolă").fill(auth.password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
  });

  test("shows domain-aware resources and workcenters without commercial pricing", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await loginOwner(page);
    await expect(page.getByText("nu este preț client", { exact: false })).toBeVisible();
    const domains = page.getByRole("navigation", { name: "Domenii administrative" });
    await expect(domains).toBeVisible();
    await expect(domains.getByRole("link", { name: "Administrare" })).toBeVisible();
    await expect(page.getByLabel("Caută")).toBeVisible();
    await expect(page.getByLabel("Preț client")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Preț client" })).toHaveCount(0);
    await expect(page.getByLabel("Salariu")).toHaveCount(0);
    await expect(page.getByLabel("PIN")).toHaveCount(0);
    await page.screenshot({ path: shot("resources-populated"), fullPage: true });

    await page.getByRole("button", { name: "Deschisă" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.screenshot({ path: shot("resources-light"), fullPage: true });
    const light = await measurePage(page);
    expect(light.under44, JSON.stringify(light.under44)).toEqual([]);
    expect(light.overflow).toBeFalsy();
    expect(light.clipped).toBe(0);

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: shot("resources-1280"), fullPage: true });
    const mid = await measurePage(page);
    expect(mid.under44, JSON.stringify(mid.under44)).toEqual([]);
    expect(mid.overflow).toBeFalsy();

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: shot("resources-1440"), fullPage: true });

    await page.getByRole("link", { name: "Utilaje și zone" }).click();
    await expect(page.getByRole("heading", { name: "Utilaje și zone" })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Domenii administrative" }).getByRole("link", { name: "Administrare" }),
    ).toBeVisible();
    await expect(page.getByText("Utilajul obligatoriu blochează startul.")).toBeVisible();
    await expect(page.getByText("Zona manuală nu.")).toBeVisible();
    await page.screenshot({ path: shot("manual-area-flexibility"), fullPage: true });
    await page.getByRole("button", { name: /^CNC$/ }).click();
    await page.getByRole("button", { name: /CNC Router 4050 x 2050/ }).click();
    await expect(page.getByRole("heading", { name: "CNC Router 4050 x 2050" })).toBeVisible();
    await expect(page.getByText("Obligatoriu la start").first()).toBeVisible();
    await expect(page.getByText("Debitare CNC").first()).toBeVisible();
    await page.screenshot({ path: shot("machine-eligible"), fullPage: true });

    await page.getByRole("button", { name: /^Formare$/ }).click();
    await page.getByRole("button", { name: /CNC formare cant litere/ }).click();
    await expect(page.getByRole("heading", { name: "CNC formare cant litere" })).toBeVisible();
    await expect(page.getByText("Formare profil").first()).toBeVisible();
    await expect(page.getByText("Debitare CNC")).toHaveCount(0);
    await page.screenshot({ path: shot("machine-ineligible"), fullPage: true });

    await page.getByRole("button", { name: "Fără furnizor" }).click();
    await expect(page.getByText("Fără furnizor").first()).toBeVisible();
    await page.screenshot({ path: shot("admin-reuse-backlink"), fullPage: true });

    await page.getByRole("link", { name: "Oameni" }).click();
    await expect(page.getByRole("heading", { name: "Oameni" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Calificări" })).toBeVisible();
    await expect(page.getByLabel("Salariu")).toHaveCount(0);
    await expect(page.getByText("Operator eligibil")).toBeVisible();
    await expect(page.getByText("Operator neeligibil")).toBeVisible();
    await page.screenshot({ path: shot("operator-eligible"), fullPage: true });

    await page.getByRole("link", { name: "Calificări" }).click();
    await expect(page.getByRole("heading", { name: "Calificări" })).toBeVisible();
    await page.getByRole("button", { name: "Arată eligibilii" }).click();
    await expect(page.locator(".people-skill-list")).toContainText("Operator eligibil");
    await expect(page.locator(".people-skill-list")).not.toContainText("Operator neeligibil");
    await page.screenshot({ path: shot("operator-ineligible"), fullPage: true });

    await page.getByRole("link", { name: "Resurse" }).click();
    await page.getByRole("button", { name: "Întunecată" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.screenshot({ path: shot("resources-dark"), fullPage: true });
    const dark = await measurePage(page);
    expect(dark.under44, JSON.stringify(dark.under44)).toEqual([]);
    expect(dark.overflow).toBeFalsy();

    await page.getByRole("button", { name: "Sistem" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme-choice", "system");

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.getByRole("button", { name: "Deschisă" }).click();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
    await page.screenshot({ path: shot("resources-768"), fullPage: true });
    const narrow = await measurePage(page);
    expect(narrow.under44, JSON.stringify(narrow.under44)).toEqual([]);
    expect(narrow.overflow).toBeFalsy();
    expect(narrow.clipped).toBe(0);

    await page.goto("/admin/resources");
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#continut-principal")).toBeFocused();

    await page.goto("/atelier");
    await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
    const pin = page.getByRole("textbox", { name: "PIN" });
    await expect(pin).toHaveAttribute("type", "password");
    await expect(pin).toHaveValue("");
    await expect(page.getByRole("button", { name: "Ieși din cont" })).toBeVisible();
  });

  test("shows a resources error state without product scenario controls", async ({ page }) => {
    await loginOwner(page);
    await page.route("**/api/resources-admin", async (route) => {
      await route.fulfill({ status: 500, body: "error" });
    });
    await page.reload();
    await expect(page.getByText("Nu s-a putut încărca catalogul de resurse.")).toBeVisible();
    await page.screenshot({ path: shot("resources-error"), fullPage: true });
  });
});
