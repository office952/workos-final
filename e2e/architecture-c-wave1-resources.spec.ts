import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import {
  expectAccountOrganization,
  logoutCloudFromMenu,
  openAccountMenu,
  setTheme,
} from "./helpers/account";

const authPath = resolve(
  process.cwd(),
  ".tmp/architecture-c-ui-wave1-review/cloud/owner-auth.txt",
);
const evidenceDir = resolve(
  process.cwd(),
  ".tmp/workos-architecture-c-ui-wave1-targeted-closure/captures",
);
const LONG_LEGAL_NAME =
  "Societatea Comercială Demonstrativă pentru Nume Legal Foarte Lung S.R.L.";
const PLEXI_FAMILY = "family:PLEXIGLAS";
const financialKeys = [
  "internalCost",
  "markupPercent",
  "marginAmount",
  "eicTotal",
  "grossPrice",
  "customerPrice",
  "hourlyWage",
];

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

async function redactAccountEmail(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const strong of document.querySelectorAll(".identity-menu-name strong")) {
      if ((strong.textContent ?? "").includes("@")) {
        strong.textContent = "[redactat]";
      }
    }
  });
}

async function loginOwner(page: Page, path = "/admin/resources"): Promise<void> {
  const auth = readOwnerAuth();
  await page.goto(path);
  await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
  await page.getByLabel("Email").fill(auth.email);
  await page.getByLabel("Parolă").fill(auth.password);
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page.getByRole("heading", { name: "Autentificare" })).toHaveCount(0);
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
        box.bottom > 0 &&
        box.top < window.innerHeight &&
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
    const clipped = [...document.querySelectorAll("h1, h2, p, dd, .page-lead, .identity-menu-name")].filter(
      (node) => {
        const el = node as HTMLElement;
        return el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === "hidden";
      },
    ).length;
    return { under44, overflow, clipped };
  });
}

async function expectNoForbiddenCopy(page: Page): Promise<void> {
  const body = await page.locator("body").innerText();
  expect(body).not.toContain("4,25 EUR/m");
  expect(body).not.toContain("4.25 EUR/m");
  await expect(page.getByLabel("Preț client")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Preț client" })).toHaveCount(0);
  const leaked = financialKeys.filter((key) => body.includes(key));
  expect(leaked).toEqual([]);
}

test.describe("Architecture C UI Wave 1", () => {
  test.skip(!existsSync(authPath), "synthetic Wave 1 Owner auth missing");

  test("logs in, keeps the session, and projects live resources", async ({ page }) => {
    test.setTimeout(120_000);
    const auth = readOwnerAuth();
    await page.goto("/admin/resources");
    await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Sari la autentificare" })).toBeFocused();
    await page.screenshot({ path: shot("skiplink-login"), fullPage: false });
    await page.keyboard.press("Enter");
    await expect(page.locator("#autentificare")).toBeFocused();

    await page.getByLabel("Email").fill(auth.email);
    await page.getByLabel("Parolă").fill("WrongPass12");
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("alert")).toHaveText("Email sau parolă greșită.");
    await expect(page.getByText("WrongPass12")).toHaveCount(0);

    await page.getByLabel("Parolă").fill(auth.password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
    await expect(page.getByText("Alege un element")).toBeVisible();
    await page.screenshot({ path: shot("empty-selection"), fullPage: true });

    await page.reload();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
    await page.screenshot({ path: shot("skiplink-focus"), fullPage: false });
    await page.keyboard.press("Enter");
    await expect(page.locator("#continut-principal")).toBeFocused();
    await expectAccountOrganization(page, "Atelier Demo");

    await expect(page.getByRole("link", { name: "WorkOS Final" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Catalog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Produse", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Identifică-te" })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Secțiuni administrative" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Categorii catalog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Atelier — execuție" })).toHaveCount(0);
    await expectNoForbiddenCopy(page);

    await logoutCloudFromMenu(page);
    await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
  });

  test("selects resources by URL and keeps live rates", async ({ page }) => {
    test.setTimeout(120_000);
    await loginOwner(page, "/admin/resources");
    await expect(page.getByText("Alege un element")).toBeVisible();
    await page.getByRole("button", { name: /Familie\s+Plexiglas/ }).click();
    await expect(page).toHaveURL(/[?&]selected=family(?::|%3A)PLEXIGLAS/);
    await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
    await expect(page.getByText("16,00 EUR / m²").first()).toBeVisible();
    await page.screenshot({ path: shot("query-selection"), fullPage: true });

    await page.getByRole("button", { name: /Familie\s+Forex/ }).click();
    await expect(page).toHaveURL(/[?&]selected=family(?::|%3A)FOREX/);
    await expect(page.getByRole("heading", { name: "Forex", exact: true })).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
    await page.goForward();
    await expect(page.getByRole("heading", { name: "Forex", exact: true })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Forex", exact: true })).toBeVisible();

    await page.goto("/admin/resources?selected=nu-exista");
    await expect(page.getByText("Element inexistent")).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirmă tarif" })).toHaveCount(0);
    await page.screenshot({ path: shot("invalid-selection"), fullPage: true });

    await page.goto(`/admin/resources?selected=${encodeURIComponent(PLEXI_FAMILY)}`);
    await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
    await page.getByLabel("Caută").fill("nu-exista-filtru");
    await expect(page.getByText("Nicio potrivire pentru căutare.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
    await expectNoForbiddenCopy(page);
  });

  test("covers 1440 1280 768 themes drawers and Cont", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginOwner(page, `/admin/resources?selected=${encodeURIComponent(PLEXI_FAMILY)}`);
    await setTheme(page, "Deschisă");
    await expect(page.locator("html")).toHaveAttribute("data-theme-choice", "light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("navigation", { name: "Secțiuni administrative" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Categorii catalog" })).toBeVisible();
    await page.screenshot({ path: shot("1440-light"), fullPage: true });
    const light = await measurePage(page);
    expect(light.under44, JSON.stringify(light.under44)).toEqual([]);
    expect(light.overflow).toBeFalsy();
    expect(light.clipped).toBe(0);

    await setTheme(page, "Întunecată");
    await expect(page.locator("html")).toHaveAttribute("data-theme-choice", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).not.toHaveCSS("background-color", "rgb(255, 255, 255)");
    await page.screenshot({ path: shot("1440-dark"), fullPage: true });
    const dark = await measurePage(page);
    expect(dark.under44, JSON.stringify(dark.under44)).toEqual([]);
    expect(dark.overflow).toBeFalsy();

    await setTheme(page, "Sistem");
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveAttribute("data-theme-choice", "system");
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute("data-theme-choice", "system");
    await setTheme(page, "Deschisă");

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: shot("1280-light"), fullPage: true });
    const mid = await measurePage(page);
    expect(mid.under44, JSON.stringify(mid.under44)).toEqual([]);
    expect(mid.overflow).toBeFalsy();

    await page.keyboard.press("Escape");
    const cont = page.getByRole("button", { name: "Cont", exact: true });
    const box = await cont.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    await openAccountMenu(page);
    await expect(page.getByText(LONG_LEGAL_NAME)).toBeVisible();
    await redactAccountEmail(page);
    await page.screenshot({ path: shot("cont-long-name"), fullPage: false });
    const account = await measurePage(page);
    expect(account.clipped).toBe(0);
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole("button", { name: "Meniu" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Navigare principală" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Secțiuni" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Alege elementul" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
    await page.screenshot({ path: shot("768-light-base"), fullPage: true });

    await setTheme(page, "Întunecată");
    await page.screenshot({ path: shot("768-dark"), fullPage: true });
    await setTheme(page, "Deschisă");

    const sections = page.getByRole("button", { name: "Secțiuni" });
    await sections.click();
    await expect(page.getByRole("dialog", { name: "Secțiuni" })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Alege elementul" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Meniu" })).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await page.screenshot({ path: shot("768-drawer-sections"), fullPage: true });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Secțiuni" })).toHaveCount(0);
    await expect(sections).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");

    const picker = page.getByRole("button", { name: "Alege elementul" });
    await picker.click();
    const pickerDialog = page.getByRole("dialog", { name: "Alege elementul" });
    await expect(pickerDialog).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Secțiuni" })).toHaveCount(0);
    await page.screenshot({ path: shot("768-drawer-picker"), fullPage: true });
    await page.keyboard.press("Tab");
    expect(
      await pickerDialog.evaluate((dialog) => dialog.contains(document.activeElement)),
    ).toBeTruthy();
    await page.getByRole("button", { name: "Închide" }).last().click();
    await expect(pickerDialog).toHaveCount(0);
    await expect(picker).toBeFocused();

    await picker.click();
    await expect(page.getByRole("dialog", { name: "Alege elementul" })).toBeVisible();
    await page.mouse.click(16, 80);
    await expect(page.getByRole("dialog", { name: "Alege elementul" })).toHaveCount(0);

    await page.getByRole("button", { name: "Meniu" }).click();
    await expect(page.getByRole("dialog", { name: "Meniu" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Catalog" })).toBeVisible();
    await page.keyboard.press("Escape");

    const narrow = await measurePage(page);
    expect(narrow.under44, JSON.stringify(narrow.under44)).toEqual([]);
    expect(narrow.overflow).toBeFalsy();
    expect(narrow.clipped).toBe(0);
    await expectNoForbiddenCopy(page);
  });

  test("projects loading error retry and ignores nav query fixtures", async ({ page }) => {
    test.setTimeout(90_000);
    const selectedPath = `/admin/resources?selected=${encodeURIComponent(PLEXI_FAMILY)}`;
    await loginOwner(page, selectedPath);
    await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();

    let releaseLoading: (() => void) | undefined;
    const holdLoading = new Promise<void>((resolve) => {
      releaseLoading = resolve;
    });
    await page.route("**/api/resources-admin", async (route) => {
      await holdLoading;
      await route.continue();
    });
    const loading = page.goto(selectedPath);
    const loadingStatus = page.getByRole("status");
    await expect(loadingStatus).toHaveText("Se încarcă catalogul de resurse…");
    await expect(loadingStatus).toHaveAttribute("aria-live", "polite");
    await page.screenshot({ path: shot("loading"), fullPage: true });
    releaseLoading?.();
    await loading;
    await page.unroute("**/api/resources-admin");
    await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();

    await page.route("**/api/resources-admin", async (route) => {
      await route.fulfill({ status: 500, body: "error" });
    });
    await page.reload();
    const errorAlert = page.getByRole("alert");
    await expect(errorAlert).toHaveText("Nu s-a putut încărca catalogul de resurse.");
    await expect(page.getByRole("button", { name: "Reîncearcă" })).toBeVisible();
    await expect(page).toHaveURL(/selected=family(?::|%3A)PLEXIGLAS/);
    await page.screenshot({ path: shot("error"), fullPage: true });

    let releaseRetry: (() => void) | undefined;
    const holdRetry = new Promise<void>((resolve) => {
      releaseRetry = resolve;
    });
    await page.unroute("**/api/resources-admin");
    await page.route("**/api/resources-admin", async (route) => {
      await holdRetry;
      await route.continue();
    });
    await page.getByRole("button", { name: "Reîncearcă" }).click();
    await expect(page.getByRole("status")).toHaveAttribute("aria-live", "polite");
    await expect(page).toHaveURL(/selected=family(?::|%3A)PLEXIGLAS/);
    await page.screenshot({ path: shot("retry-loading"), fullPage: true });
    releaseRetry?.();
    await expect(page.getByRole("heading", { name: "Plexiglas", exact: true })).toBeVisible();
    await expect(page).toHaveURL(/selected=family(?::|%3A)PLEXIGLAS/);
    await page.unroute("**/api/resources-admin");
    await page.screenshot({ path: shot("retry-recovered"), fullPage: true });

    await page.goto("/admin/resources?nav=basic");
    await expect(
      page.getByRole("navigation", { name: "Secțiuni administrative" }).getByRole("link"),
    ).toHaveText([
      "Resurse și cost intern",
      "Utilaje și zone",
      "Oameni",
      "Procese",
      "Guvernanță",
    ]);
    await expect(page.getByRole("link", { name: "Stoc" })).toHaveCount(0);
    await page.screenshot({ path: shot("nav-basic"), fullPage: true });

    await page.goto("/admin/resources");
    await expect(
      page.getByRole("navigation", { name: "Secțiuni administrative" }).getByRole("link"),
    ).toHaveText([
      "Resurse și cost intern",
      "Utilaje și zone",
      "Oameni",
      "Procese",
      "Guvernanță",
    ]);
    await page.screenshot({ path: shot("nav-default"), fullPage: true });
  });
});
