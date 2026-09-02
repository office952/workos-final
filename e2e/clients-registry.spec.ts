import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "./fixtures";
import { createCustomer } from "./helpers/customers";
import { createRequestNeedingAction, uniqueRequestToken } from "./helpers/requests";

const EVIDENCE_DIR = join(
  process.cwd(),
  "docs",
  "worklog",
  "screenshots",
  "clients-final-candidate",
);

function card(page: import("@playwright/test").Page, name: string) {
  return page.locator(".clients-overview .registry-row").filter({ hasText: name }).first();
}

async function registryScrollY(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const column = document.querySelector(".app-shell-column");
    if (column instanceof HTMLElement && column.scrollTop > 0) {
      return column.scrollTop;
    }
    return document.scrollingElement instanceof HTMLElement
      ? document.scrollingElement.scrollTop || window.scrollY
      : window.scrollY;
  });
}

async function clearRegistryScroll(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const keys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith("workos.clients.registry.scroll"),
    );
    for (const key of keys) {
      sessionStorage.removeItem(key);
    }
  });
}

async function createRequestForCustomer(
  request: import("@playwright/test").APIRequestContext,
  customerId: string,
  title: string,
) {
  const created = await createRequestNeedingAction(
    request,
    customerId,
    title,
    "Cerere sintetică pentru filtrul de atenție.",
  );
  expect(created.ok).toBeTruthy();
}

test("clients registry matches the accepted Figma interaction contract", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("CLR");
  const alpha = await createCustomer(request, `Alpha ${token}`);
  const mid = await createCustomer(request, `Mid ${token}`);
  const zulu = await createCustomer(request, `Zulu ${token}`);
  const retired = await createCustomer(request, `Retras ${token}`);
  await request.patch(`/api/customers/${retired.customerId}`, { data: { status: "RETIRED" } });
  await createRequestForCustomer(request, mid.customerId, `Cerere Mid ${token}`);
  await createRequestForCustomer(request, zulu.customerId, `Cerere Zulu ${token}`);
  for (let index = 0; index < 14; index += 1) {
    const filler = await createCustomer(
      request,
      `Lorem ${token} ${String(index).padStart(2, "0")}`,
    );
    await createRequestForCustomer(request, filler.customerId, `Cerere Lorem ${token} ${index}`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/clients");
  await clearRegistryScroll(page);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "WorkOS", exact: true })).toBeVisible();
  await expect(page.getByText("WorkOS Final", { exact: true })).toHaveCount(0);
  await expect(page.locator(".app-context-title")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Identifică-te" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Cont" })).toBeVisible();
  await expect(page.locator(".registry-pagination")).toHaveCount(0);

  const names = await page.locator(".clients-overview .registry-row-name").allTextContents();
  const owned = names.filter((name) =>
    [`Alpha ${token}`, `Mid ${token}`, `Retras ${token}`, `Zulu ${token}`].includes(name),
  );
  expect(owned).toEqual([`Alpha ${token}`, `Mid ${token}`, `Retras ${token}`, `Zulu ${token}`]);

  const midCard = card(page, `Mid ${token}`);
  await expect(midCard).toHaveClass(/is-attention/);
  await expect(card(page, `Alpha ${token}`)).not.toHaveClass(/is-attention/);

  await midCard.scrollIntoViewIfNeeded();
  const midBox = await midCard.boundingBox();
  expect(midBox).not.toBeNull();
  await midCard.click({
    position: { x: Math.floor(midBox!.width / 2), y: Math.floor(midBox!.height / 2) },
  });
  await expect(page).toHaveURL(new RegExp(`/clients/${encodeURIComponent(mid.customerId)}`));
  await expect(page.getByRole("heading", { name: `Mid ${token}` })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();

  const alphaCard = card(page, `Alpha ${token}`);
  await expect(alphaCard).toHaveAttribute("href", new RegExp(encodeURIComponent(alpha.customerId)));
  expect(await alphaCard.evaluate((element) => element.tagName)).toBe("A");
  expect(await alphaCard.evaluate((element) => (element as HTMLElement).tabIndex)).toBeGreaterThanOrEqual(
    0,
  );
  await alphaCard.focus();
  await expect(alphaCard).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`/clients/${encodeURIComponent(alpha.customerId)}`));
  await page.goBack();

  const hoverCard = card(page, `Alpha ${token}`);
  const beforeHover = await hoverCard.boundingBox();
  await hoverCard.hover();
  const afterHover = await hoverCard.boundingBox();
  const hoverCss = await hoverCard.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      transform: style.transform,
      cursor: style.cursor,
    };
  });
  expect(hoverCss.transform).toBe("none");
  expect(hoverCss.cursor).toBe("pointer");
  expect(afterHover?.width).toBe(beforeHover?.width);
  expect(afterHover?.height).toBe(beforeHover?.height);

  const listTop = async () =>
    page.locator(".clients-overview .registry-toolbar").evaluate((element) => {
      const box = element.getBoundingClientRect();
      return box.top + window.scrollY + box.height;
    });
  const toolbarHeight = async () =>
    page
      .locator(".clients-overview .registry-toolbar")
      .evaluate((element) => element.getBoundingClientRect().height);
  const baselineTop = await listTop();
  const baselineToolbar = await toolbarHeight();
  for (const name of ["Activi", "Retrași", "Toți", "Necesită atenție"]) {
    await page.getByRole("button", { name }).click();
    expect(Math.abs((await listTop()) - baselineTop)).toBeLessThan(2);
    expect(Math.abs((await toolbarHeight()) - baselineToolbar)).toBeLessThan(2);
  }
  await page.getByRole("button", { name: "Activi" }).click();
  expect(await page.getByRole("button", { name: "Necesită atenție" }).getAttribute("aria-pressed")).toBe(
    "true",
  );
  expect(Math.abs((await listTop()) - baselineTop)).toBeLessThan(2);

  await page.goto(`/clients?q=${encodeURIComponent(token)}&status=active&attention=1`);
  await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/status=active/);
  await expect(page).toHaveURL(/attention=1/);
  await expect(page).toHaveURL(new RegExp(`q=${token}`, "i"));
  await expect(page.getByLabel("Caută client")).toHaveValue(token);
  await expect(page.getByRole("button", { name: "Activi" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Necesită atenție" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator(".clients-overview .registry-row").last().scrollIntoViewIfNeeded();
  const scrolled = await registryScrollY(page);
  expect(scrolled).toBeGreaterThan(40);
  await card(page, `Mid ${token}`).click();
  await expect(page.getByRole("heading", { name: `Mid ${token}` })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/status=active/);
  await expect(page).toHaveURL(/attention=1/);
  await expect(page).toHaveURL(new RegExp(`q=${token}`, "i"));
  await expect(page.getByLabel("Caută client")).toHaveValue(token);
  await expect(page.getByRole("button", { name: "Activi" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Necesită atenție" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect.poll(async () => registryScrollY(page)).toBeGreaterThan(40);
});

test("a fresh Clients sidebar visit does not restore a previous scroll", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("CLN");
  for (let index = 0; index < 16; index += 1) {
    await createCustomer(request, `Scroll ${token} ${String(index).padStart(2, "0")}`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/clients");
  await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();
  await page.locator(".clients-overview .registry-row").last().scrollIntoViewIfNeeded();
  expect(await registryScrollY(page)).toBeGreaterThan(40);

  await page
    .getByRole("navigation", { name: "Navigare principală" })
    .getByRole("link", { name: "Cereri" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page
    .getByRole("navigation", { name: "Navigare principală" })
    .getByRole("link", { name: "Clienți" })
    .click();
  await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();
  await expect.poll(async () => registryScrollY(page)).toBeLessThan(20);
});

test("clients runtime viewports and sibling shell stay fluid", async ({ page, request }) => {
  const token = uniqueRequestToken("CLV");
  await createCustomer(request, `Visual ${token}`);
  const shots: Array<{ width: number; height: number; theme: "light" | "dark"; name: string }> = [
    { width: 1920, height: 1080, theme: "light", name: "1920_light" },
    { width: 1920, height: 1080, theme: "dark", name: "1920_dark" },
    { width: 1440, height: 900, theme: "light", name: "1440_light" },
    { width: 1440, height: 900, theme: "dark", name: "1440_dark" },
    { width: 1280, height: 800, theme: "light", name: "1280" },
    { width: 768, height: 1024, theme: "light", name: "768" },
  ];
  await mkdir(EVIDENCE_DIR, { recursive: true });
  await page.goto("/clients");

  for (const shot of shots) {
    await page.evaluate((theme) => {
      window.localStorage.setItem("workos.theme", theme);
    }, shot.theme);
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.reload();
    await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow).toBe(false);
    if (shot.width === 768) {
      const columns = await page
        .locator(".clients-overview .metric-band")
        .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
      expect(columns).toBe(2);
    }
    await page.screenshot({
      path: join(EVIDENCE_DIR, `clients_${shot.name}.png`),
      fullPage: false,
      animations: "disabled",
    });
  }

  await page.evaluate(() => {
    window.localStorage.setItem("workos.theme", "light");
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const path of ["/requests", "/quotes", "/", "/atelier", "/admin"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "WorkOS", exact: true })).toBeVisible();
    await expect(page.getByText("WorkOS Final", { exact: true })).toHaveCount(0);
    await expect(page.locator(".app-context-title")).toHaveCount(0);
    if (path === "/atelier") {
      await expect(page.getByRole("button", { name: "Identifică-te" })).toBeVisible();
    } else {
      await expect(page.getByRole("button", { name: "Identifică-te" })).toHaveCount(0);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow).toBe(false);
    const slug = path === "/" ? "jobs" : path.replace(/^\//, "").replaceAll("/", "-");
    await page.screenshot({
      path: join(EVIDENCE_DIR, `shell_${slug}_1440.png`),
      fullPage: true,
    });
  }
});
