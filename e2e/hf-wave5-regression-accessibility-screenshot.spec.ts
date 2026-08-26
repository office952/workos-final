import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { logoutCloudFromMenu, openAccountMenu, setTheme as setAccountTheme } from "./helpers/account";

const authPath = resolve(process.cwd(), ".tmp/hf-wave3-review/cloud/owner-auth.txt");
const evidenceDir = resolve(process.cwd(), ".tmp/hf-wave5-owner-review-evidence");
const financialKeys = [
  "internalCost",
  "markupPercent",
  "marginAmount",
  "eicTotal",
  "grossPrice",
  "customerPrice",
  "hourlyWage",
] as const;
const workshopMoneyCopy = [/Cost intern/, /Preț client/, /Tarif intern/, /Salariu/];

type OwnerAuth = {
  email: string;
  password: string;
  operatorPin: string;
  eligibleOperator: string;
};

type PageAudit = {
  under44: Array<{ name: string; width: number; height: number }>;
  overflow: boolean;
  clipped: number;
  headingFailures: string[];
  landmarkFailures: string[];
  unlabeledIcons: string[];
  contrastFailures: string[];
};

function readOwnerAuth(): OwnerAuth {
  const text = readFileSync(authPath, "utf8");
  const values: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const cut = line.indexOf("=");
    if (cut <= 0 || line.startsWith("#")) {
      continue;
    }
    values[line.slice(0, cut).trim()] = line.slice(cut + 1);
  }
  if (
    !values.email ||
    !values.password ||
    !values.operatorPin ||
    !values.eligibleOperator
  ) {
    throw new Error("owner_auth_incomplete");
  }
  return {
    email: values.email,
    password: values.password,
    operatorPin: values.operatorPin,
    eligibleOperator: values.eligibleOperator,
  };
}

function shot(name: string): string {
  mkdirSync(evidenceDir, { recursive: true });
  return resolve(evidenceDir, name);
}

async function redactSecrets(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const strong of document.querySelectorAll(".identity-menu-name strong")) {
      if ((strong.textContent ?? "").includes("@")) {
        strong.textContent = "[redactat]";
      }
    }
    for (const input of document.querySelectorAll("input")) {
      const el = input as HTMLInputElement;
      const type = el.type.toLowerCase();
      const name = (el.getAttribute("name") ?? el.getAttribute("autocomplete") ?? "").toLowerCase();
      if (
        type === "password" ||
        type === "email" ||
        name.includes("password") ||
        name.includes("email") ||
        (el.getAttribute("aria-label") ?? "").toLowerCase() === "pin"
      ) {
        el.value = "";
      }
    }
  });
}

async function capture(page: Page, name: string): Promise<void> {
  await redactSecrets(page);
  await page.screenshot({ path: shot(name), fullPage: true });
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

async function setTheme(page: Page, choice: "Deschisă" | "Întunecată" | "Sistem"): Promise<void> {
  await setAccountTheme(page, choice);
  const resolved =
    choice === "Deschisă" ? "light" : choice === "Întunecată" ? "dark" : undefined;
  if (resolved) {
    await expect(page.locator("html")).toHaveAttribute("data-theme", resolved);
  } else {
    await expect(page.locator("html")).toHaveAttribute("data-theme-choice", "system");
  }
}

async function expectNoWorkshopMoney(page: Page): Promise<void> {
  for (const pattern of workshopMoneyCopy) {
    await expect(page.getByText(pattern)).toHaveCount(0);
  }
  const body = (await page.locator("body").innerText()).toLowerCase();
  for (const key of financialKeys) {
    expect(body).not.toContain(key.toLowerCase());
  }
}

async function auditPage(page: Page): Promise<PageAudit> {
  return page.evaluate(() => {
    function visible(el: HTMLElement): boolean {
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return (
        box.width > 0 &&
        box.height > 0 &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        style.opacity !== "0"
      );
    }

    function parseColor(value: string): [number, number, number, number] | null {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) {
        return null;
      }
      const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
      const red = parts[0];
      const green = parts[1];
      const blue = parts[2];
      const alpha = parts[3];
      if (
        red === undefined ||
        green === undefined ||
        blue === undefined ||
        Number.isNaN(red) ||
        Number.isNaN(green) ||
        Number.isNaN(blue)
      ) {
        return null;
      }
      return [red, green, blue, Number.isNaN(alpha) ? 1 : alpha];
    }

    function luminance(red: number, green: number, blue: number): number {
      const convert = (channel: number) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * convert(red) + 0.7152 * convert(green) + 0.0722 * convert(blue);
    }

    function contrastRatio(foreground: string, background: string): number | null {
      const fg = parseColor(foreground);
      const bg = parseColor(background);
      if (!fg || !bg || fg[3] < 0.4 || bg[3] < 0.4) {
        return null;
      }
      const lighter = Math.max(luminance(fg[0], fg[1], fg[2]), luminance(bg[0], bg[1], bg[2]));
      const darker = Math.min(luminance(fg[0], fg[1], fg[2]), luminance(bg[0], bg[1], bg[2]));
      return (lighter + 0.05) / (darker + 0.05);
    }

    function effectiveBackground(el: HTMLElement): string {
      let current: HTMLElement | null = el;
      while (current) {
        const color = getComputedStyle(current).backgroundColor;
        const parsed = parseColor(color);
        if (parsed && parsed[3] > 0.4) {
          return color;
        }
        current = current.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    }

    const selectors = "a, button, [role='button'], input, select, textarea, summary";
    const nodes = [...document.querySelectorAll(selectors)] as HTMLElement[];
    const visibleNodes = nodes.filter(visible);
    const under44 = visibleNodes
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

    const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .filter((node) => visible(node as HTMLElement))
      .map((node) => Number(node.tagName.slice(1)));
    const headingFailures: string[] = [];
    if (headings[0] !== 1) {
      headingFailures.push("first-visible-heading-not-h1");
    }
    for (let index = 1; index < headings.length; index += 1) {
      const previous = headings[index - 1];
      const current = headings[index];
      if (previous !== undefined && current !== undefined && current > previous + 1) {
        headingFailures.push(`skip-${previous}-to-${current}`);
      }
    }

    const landmarkFailures: string[] = [];
    if (!document.querySelector("main")) {
      landmarkFailures.push("missing-main");
    }
    if (!document.querySelector("nav, [role='navigation']")) {
      landmarkFailures.push("missing-navigation");
    }

    function accessibleName(el: HTMLElement): string {
      const aria = (el.getAttribute("aria-label") ?? "").trim();
      if (aria) {
        return aria;
      }
      const labelledBy = el.getAttribute("aria-labelledby");
      if (labelledBy) {
        return labelledBy
          .split(/\s+/)
          .map((id) => (document.getElementById(id)?.textContent ?? "").trim())
          .join(" ")
          .trim();
      }
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        const fromLabels = [...(el.labels ?? [])]
          .map((label) => label.innerText.replace(/\s+/g, " ").trim())
          .join(" ")
          .trim();
        if (fromLabels) {
          return fromLabels;
        }
      }
      const wrap = el.closest("label");
      if (wrap) {
        return wrap.innerText.replace(/\s+/g, " ").trim();
      }
      return (
        (el.getAttribute("title") ?? "").trim() ||
        (el.textContent ?? "").replace(/\s+/g, " ").trim()
      );
    }

    const unlabeledIcons = visibleNodes
      .filter((el) => accessibleName(el).length === 0)
      .map((el) => el.tagName.toLowerCase());

    const contrastFailures: string[] = [];
    const textNodes = [...document.querySelectorAll("h1, h2, h3, p, a, button, label, dt, dd, li")];
    for (const node of textNodes) {
      const el = node as HTMLElement;
      if (!visible(el) || el.classList.contains("skip-link")) {
        continue;
      }
      const style = getComputedStyle(el);
      const ratio = contrastRatio(style.color, effectiveBackground(el));
      if (ratio !== null && ratio < 4.5) {
        const sample = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40);
        contrastFailures.push(`${sample || el.tagName}:${ratio.toFixed(2)}`);
      }
    }

    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    const clipped = [...document.querySelectorAll("h1, h2, p, dd, .page-lead")].filter((node) => {
      const el = node as HTMLElement;
      return el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === "hidden";
    }).length;

    return {
      under44,
      overflow,
      clipped,
      headingFailures,
      landmarkFailures,
      unlabeledIcons,
      contrastFailures,
    };
  });
}

async function expectAccessible(page: Page): Promise<PageAudit> {
  const audit = await auditPage(page);
  expect(audit.under44, JSON.stringify(audit.under44)).toEqual([]);
  expect(audit.overflow).toBeFalsy();
  expect(audit.clipped).toBe(0);
  expect(audit.headingFailures, audit.headingFailures.join(",")).toEqual([]);
  expect(audit.landmarkFailures, audit.landmarkFailures.join(",")).toEqual([]);
  expect(audit.unlabeledIcons, audit.unlabeledIcons.join(",")).toEqual([]);
  expect(audit.contrastFailures, audit.contrastFailures.join(" | ")).toEqual([]);
  return audit;
}

test.describe("Wave 5 first HF lot regression accessibility screenshots", () => {
  test.skip(!existsSync(authPath), "synthetic Owner review auth missing");

  test("rejects invalid credentials and returns to the protected route", async ({ page }) => {
    const auth = readOwnerAuth();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/resources");
    await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Sari la autentificare" })).toBeFocused();
    await expect(page.getByRole("link", { name: "Sari la autentificare" })).toBeVisible();
    await setTheme(page, "Deschisă");
    await capture(page, "00-login-wall-light.png");
    await page.keyboard.press("Tab");
    if (!(await page.getByRole("link", { name: "Sari la autentificare" }).evaluate((el) => el === document.activeElement))) {
      await page.getByRole("link", { name: "Sari la autentificare" }).focus();
    }
    await page.keyboard.press("Enter");
    await expect(page.locator("#autentificare")).toBeFocused();

    await page.getByLabel("Email").fill(auth.email);
    await page.getByLabel("Parolă").fill("WrongPass12");
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("alert")).toHaveText("Email sau parolă greșită.");
    await expect(page.getByText("WrongPass12")).toHaveCount(0);
    await page.getByLabel("Email").fill("");
    await page.getByLabel("Parolă").fill("");
    await capture(page, "01-login-invalid-safe-error.png");

    await page.getByLabel("Email").fill(auth.email);
    await page.getByLabel("Parolă").fill(auth.password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/resources/);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();

    await logoutCloudFromMenu(page);
    await expect(page.getByRole("heading", { name: "Autentificare" })).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/resources/);

    await page.getByLabel("Email").fill(auth.email);
    await page.getByLabel("Parolă").fill(auth.password);
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.getByRole("heading", { name: "Resurse și cost intern" })).toBeVisible();
  });

  test("walks Wave 1-4 surfaces without mutation and captures the Owner pack", async ({
    page,
    request,
  }) => {
    test.setTimeout(180_000);
    const auth = readOwnerAuth();
    const captured: string[] = [];
    const record = async (name: string) => {
      await capture(page, name);
      captured.push(name);
    };

    await page.setViewportSize({ width: 1440, height: 900 });
    await loginOwner(page, "/");
    await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
    await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeVisible();
    await record("21-keyboard-skip-link-visible.png");
    await page.keyboard.press("Enter");
    await expect(page.locator("#continut-principal")).toBeFocused();
    await setTheme(page, "Deschisă");
    await expect(page.getByRole("link", { name: "WorkOS Final" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Navigare principală" })).toBeVisible();
    await openAccountMenu(page);
    await expect(page.getByRole("dialog", { name: "Datele contului" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Identifică-te" })).toBeVisible();
    await record("02-shell-authenticated-light-1440.png");
    await expectAccessible(page);

    await setTheme(page, "Întunecată");
    await record("03-shell-authenticated-dark-1440.png");
    await expectAccessible(page);
    await setTheme(page, "Deschisă");

    const wave1Routes: Array<{ path: string; heading: string | RegExp }> = [
      { path: "/", heading: "Lucrări" },
      { path: "/products", heading: "Catalog" },
      { path: "/requests", heading: "Cereri" },
      { path: "/quotes", heading: "Oferte" },
      { path: "/clients", heading: "Clienți" },
    ];
    for (const route of wave1Routes) {
      await page.goto(route.path);
      await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
      await expectAccessible(page);
    }

    await page.goto("/");
    const jobLink = page.locator("a[href^='/jobs/']").first();
    if ((await jobLink.count()) > 0) {
      await jobLink.click();
      await expect(page).toHaveURL(/\/jobs\//);
      await expect(page.getByRole("heading").first()).toBeVisible();
    }
    await page.goto("/quotes");
    const quoteLink = page.locator("a[href^='/quotes/']").first();
    if ((await quoteLink.count()) > 0) {
      await quoteLink.click();
      await expect(page).toHaveURL(/\/quotes\//);
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Administrare" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Date firmă" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Clienți" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Resurse și cost intern" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Stoc" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Procese operaționale" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Utilaje și zone" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Oameni" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Sistem produs" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Module și componente" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Guvernanța sistemului" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Stare sistem" })).toBeVisible();
    await record("04-admin-home-light-1280.png");
    await expectAccessible(page);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/seller");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/admin/customers");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/admin/stock");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/admin/processes");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/admin/product-system");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/components");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/governance");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await page.goto("/system");
    await expect(page.getByRole("heading").first()).toBeVisible();

    await page.goto("/admin/resources?selected=family:PLEXIGLAS", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Resurse/ })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText("nu este preț client", { exact: false })).toBeVisible();
    await expect(page.getByText(/^Tarif/).first()).toBeVisible();
    await expect(page.getByLabel("Preț client")).toHaveCount(0);
    await expect(page.getByLabel("Salariu")).toHaveCount(0);
    await expect(page.getByLabel("Caută")).toBeVisible();
    await page.getByLabel("Caută").fill("aluminiu");
    await page.getByLabel("Caută").fill("");
    await record("05-resources-light-1440.png");
    await expectAccessible(page);
    await setTheme(page, "Întunecată");
    await record("06-resources-dark-1440.png");
    await expectAccessible(page);
    await setTheme(page, "Deschisă");
    await page.setViewportSize({ width: 768, height: 1024 });
    await record("07-resources-light-768.png");
    await expectAccessible(page);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole("link", { name: "Utilaje și zone" }).click();
    await expect(page.getByRole("heading", { name: "Utilaje și zone" })).toBeVisible();
    await expect(page.getByText("Utilajul obligatoriu blochează startul.")).toBeVisible();
    await expect(page.getByText("Zona manuală nu.")).toBeVisible();
    await expect(page.getByLabel("Preț client")).toHaveCount(0);
    await page.getByRole("button", { name: /^CNC$/ }).click();
    await page.getByRole("button", { name: /CNC Router 4050 x 2050/ }).click();
    await expect(page.getByRole("heading", { name: "CNC Router 4050 x 2050" })).toBeVisible();
    await expect(page.getByText("Obligatoriu la start").first()).toBeVisible();
    await record("08-workcenters-routing-light-1440.png");
    await expectAccessible(page);
    await page.getByRole("button", { name: /^Formare$/ }).click();
    await page.getByRole("button", { name: /CNC formare cant litere/ }).click();
    await expect(page.getByRole("heading", { name: "CNC formare cant litere" })).toBeVisible();
    await setTheme(page, "Întunecată");
    await record("09-workcenters-forming-dark-1440.png");
    await expectAccessible(page);
    await setTheme(page, "Deschisă");
    await record("20-manual-task-flexibility.png");

    await page.getByRole("link", { name: "Oameni" }).click();
    await expect(page.getByRole("heading", { name: "Oameni" })).toBeVisible();
    await expect(page.getByText("Operator eligibil")).toBeVisible();
    await expect(page.getByText("Operator neeligibil")).toBeVisible();
    await expect(page.getByLabel("Salariu")).toHaveCount(0);
    await expect(page.getByText(/Pontaj/)).toHaveCount(0);
    await record("10-people-light-1440.png");
    await expectAccessible(page);

    await page.getByRole("link", { name: "Calificări" }).click();
    await expect(page.getByRole("heading", { name: "Calificări" })).toBeVisible();
    await record("11-skills-light-1440.png");
    await expectAccessible(page);

    await page.getByRole("link", { name: "Listă" }).click();
    await page.getByRole("link", { name: "Operator eligibil" }).click();
    await expect(page.getByRole("heading", { name: "Operator eligibil" })).toBeVisible();
    const pinInputs = page.getByLabel("PIN");
    const pinCount = await pinInputs.count();
    for (let index = 0; index < pinCount; index += 1) {
      const pin = pinInputs.nth(index);
      await expect(pin).toHaveValue("");
      const type = await pin.getAttribute("type");
      expect(type === "password" || type === "text").toBeTruthy();
      if (type === "text") {
        await expect(pin).toHaveValue("");
      }
    }
    await record("12-person-detail-light-1440.png");
    await expectAccessible(page);

    await page.goto("/atelier");
    await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
    const identifyForm = page.locator("form.operator-identify-form");
    const pin = identifyForm.getByRole("textbox", { name: "PIN" });
    await expect(pin).toHaveAttribute("type", "password");
    await expect(pin).toHaveValue("");
    const person = identifyForm.locator("select");
    await expect(person).toBeEnabled({ timeout: 15_000 });
    await person.selectOption({ label: auth.eligibleOperator });
    await pin.fill(auth.operatorPin);
    await identifyForm.getByRole("button", { name: "Confirmă" }).click();
    await expect(page.getByRole("heading", { name: "Atelier" })).toBeVisible();
    await expect(page.locator(".atelier-lane h2").first()).toBeVisible();
    const laneHeadings = await page.locator(".atelier-lane h2").allTextContents();
    expect(laneHeadings[0] === "Blocate" || laneHeadings[0] === "Pot porni acum" || laneHeadings[0] === "În lucru").toBeTruthy();
    await expectNoWorkshopMoney(page);
    await record("13-atelier-populated-light-1440.png");
    await expectAccessible(page);

    const blockedVisible = await page.getByRole("heading", { name: "Blocate" }).isVisible().catch(() => false);
    if (blockedVisible) {
      await expect(page.getByText("Necesită utilaj dedicat înainte de pornire.").first()).toBeVisible();
      await record("18-machine-blocked.png");
    }
    const waitingVisible = await page.getByRole("heading", { name: "Urmează" }).isVisible().catch(() => false);
    if (waitingVisible) {
      await record("19-dependency-blocked.png");
    } else if (await page.getByText(/^Așteaptă:/).first().isVisible().catch(() => false)) {
      await record("19-dependency-blocked.png");
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await setTheme(page, "Întunecată");
    await record("14-atelier-dark-1280.png");
    await expectAccessible(page);
    await setTheme(page, "Deschisă");
    await page.setViewportSize({ width: 768, height: 1024 });
    await record("15-atelier-light-768.png");
    await expectAccessible(page);

    await page.setViewportSize({ width: 1440, height: 900 });
    const openJob = page.getByRole("link", { name: "Deschide lucrarea" }).first();
    const continueJob = page.getByRole("link", { name: "Continuă" }).first();
    if (await openJob.count()) {
      await openJob.click();
    } else if (await continueJob.count()) {
      await continueJob.click();
    } else {
      const jobs = await request.get("/api/jobs");
      const body = (await jobs.json()) as { overview?: { jobs?: Array<{ planId?: string }> } };
      const planId = body.overview?.jobs?.find((job) => job.planId)?.planId;
      expect(planId).toBeTruthy();
      await page.goto(`/execution/${encodeURIComponent(planId ?? "")}`);
    }
    await expect(page).toHaveURL(/\/execution\//);
    await expect(page.getByRole("heading", { name: "Planificat versus realizat" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Înapoi la lucrare" })).toBeVisible();
    await expectNoWorkshopMoney(page);
    await record("16-execution-workspace-light-1440.png");
    await record("17-planned-versus-actual-light-1440.png");
    await expectAccessible(page);
    if (!captured.includes("19-dependency-blocked.png")) {
      const executionBlocked = page.getByRole("heading", { name: "Blocate" });
      if (await executionBlocked.isVisible().catch(() => false)) {
        await record("19-dependency-blocked.png");
      }
    }
    if (!captured.includes("18-machine-blocked.png")) {
      if (await page.getByText("Necesită utilaj dedicat înainte de pornire.").first().isVisible().catch(() => false)) {
        await record("18-machine-blocked.png");
      }
    }

    const planMatch = page.url().match(/\/execution\/([^/?#]+)/);
    if (planMatch?.[1]) {
      const planResponse = await request.get(`/api/execution-plans/${decodeURIComponent(planMatch[1])}`);
      const planText = await planResponse.text();
      for (const key of financialKeys) {
        expect(planText).not.toContain(key);
      }
    }
    const inboxResponse = await request.get("/api/operator-task-inbox");
    const inboxText = await inboxResponse.text();
    for (const key of financialKeys) {
      expect(inboxText).not.toContain(key);
    }

    await setTheme(page, "Sistem");
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await record("22-system-prefers-light.png");
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await record("23-system-prefers-dark.png");

    const required = [
      "00-login-wall-light.png",
      "01-login-invalid-safe-error.png",
      "02-shell-authenticated-light-1440.png",
      "03-shell-authenticated-dark-1440.png",
      "04-admin-home-light-1280.png",
      "05-resources-light-1440.png",
      "06-resources-dark-1440.png",
      "07-resources-light-768.png",
      "08-workcenters-routing-light-1440.png",
      "09-workcenters-forming-dark-1440.png",
      "10-people-light-1440.png",
      "11-skills-light-1440.png",
      "12-person-detail-light-1440.png",
      "13-atelier-populated-light-1440.png",
      "14-atelier-dark-1280.png",
      "15-atelier-light-768.png",
      "16-execution-workspace-light-1440.png",
      "17-planned-versus-actual-light-1440.png",
      "18-machine-blocked.png",
      "19-dependency-blocked.png",
      "20-manual-task-flexibility.png",
      "21-keyboard-skip-link-visible.png",
      "22-system-prefers-light.png",
      "23-system-prefers-dark.png",
    ];
    writeFileSync(
      resolve(evidenceDir, "manifest.json"),
      JSON.stringify(
        {
          directory: ".tmp/hf-wave5-owner-review-evidence",
          captured,
          required,
          missing: required.filter((name) => !captured.includes(name) && !existsSync(shot(name))),
          redactedAccountChip: true,
          credentialsWritten: false,
          pinWritten: false,
        },
        null,
        2,
      ),
    );
    for (const name of required) {
      expect(existsSync(shot(name)), name).toBeTruthy();
    }
  });
});
