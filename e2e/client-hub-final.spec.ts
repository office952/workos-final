import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { expect, test } from "./fixtures";
import { createCustomer } from "./helpers/customers";
import {
  acceptCommercialQuote,
  createCommercialQuote,
  createOrderFromQuote,
  uniqueQuoteInscription,
} from "./helpers/quotes";
import { uniqueRequestToken } from "./helpers/requests";
import { setTheme } from "./helpers/account";

const EVIDENCE_DIR = join(process.cwd(), ".tmp", "client-hub-final-evidence");
const LONG_NAME =
  "Societatea Comerciala Alpha Constructii Metalice Publicitate Bucuresti S.R.L.";

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

async function hasHorizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
}

async function createRequestForCustomer(
  request: import("@playwright/test").APIRequestContext,
  customerId: string,
  title: string,
) {
  const created = await request.post("/api/requests", {
    data: {
      customerId,
      title,
      description: "Cerere sintetică pentru Client Hub.",
    },
  });
  expect(created.ok()).toBeTruthy();
}

async function createProfiledCustomer(
  request: import("@playwright/test").APIRequestContext,
  displayName: string,
) {
  const created = await request.post("/api/customers", {
    data: {
      displayName,
      cui: "RO12345678",
      contactName: "Ana Pop",
      phone: "0722000000",
      email: "ana@hub.ro",
      address: "Str. Exemplu 12",
      city: "București",
      notes: "Client de atelier pentru litere volumetrice.",
    },
  });
  expect(created.ok()).toBeTruthy();
  const body = (await created.json()) as { customer: { customerId: string; displayName: string } };
  return body.customer;
}

async function findCustomerId(
  request: import("@playwright/test").APIRequestContext,
  displayName: string,
) {
  const listed = await request.get("/api/customers");
  const body = (await listed.json()) as {
    customers: Array<{ customerId: string; displayName: string }>;
  };
  const found = body.customers.find((item) => item.displayName === displayName);
  expect(found).toBeTruthy();
  return found!.customerId;
}

test("registry filters and scroll return through ← Clienți", async ({ page, request }) => {
  const token = uniqueRequestToken("CHB");
  const target = await createCustomer(request, `Hub Mid ${token}`);
  await createRequestForCustomer(request, target.customerId, `Cerere Hub ${token}`);
  for (let index = 0; index < 14; index += 1) {
    const filler = await createCustomer(
      request,
      `Hub Lorem ${token} ${String(index).padStart(2, "0")}`,
    );
    await createRequestForCustomer(request, filler.customerId, `Cerere Hub Lorem ${token} ${index}`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/clients?q=${encodeURIComponent(token)}&status=active&attention=1`);
  await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();
  await page.locator(".clients-overview .registry-row").last().scrollIntoViewIfNeeded();
  const scrolled = await registryScrollY(page);
  expect(scrolled).toBeGreaterThan(40);

  await card(page, `Hub Mid ${token}`).click();
  await expect(page.getByRole("heading", { name: `Hub Mid ${token}` })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Clienți" })).toBeVisible();
  await page.getByRole("navigation", { name: "Secțiuni client" }).getByRole("link", { name: "Oferte" }).click();
  await expect(page).toHaveURL(/section=oferte/);

  await page.getByRole("link", { name: "Înapoi la Clienți" }).click();
  await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/status=active/);
  await expect(page).toHaveURL(/attention=1/);
  await expect(page).toHaveURL(new RegExp(`q=${token}`, "i"));
  await expect(page.getByLabel("Caută client")).toHaveValue(token);
  await expect.poll(async () => registryScrollY(page)).toBeGreaterThan(40);
});

test("a deep-linked Client Workspace falls back to a fresh Clients visit", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("CHD");
  const customer = await createCustomer(request, `Hub Deep ${token}`);
  for (let index = 0; index < 16; index += 1) {
    await createCustomer(request, `Hub Scroll ${token} ${String(index).padStart(2, "0")}`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/clients");
  await page.locator(".clients-overview .registry-row").last().scrollIntoViewIfNeeded();
  expect(await registryScrollY(page)).toBeGreaterThan(40);

  await page.goto(`/clients/${encodeURIComponent(customer.customerId)}`);
  await expect(page.getByRole("heading", { name: `Hub Deep ${token}` })).toBeVisible();
  await page.getByRole("link", { name: "Înapoi la Clienți" }).click();
  await expect(page.getByRole("heading", { name: "Clienți", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/clients$/);
  await expect.poll(async () => registryScrollY(page)).toBeLessThan(20);
});

test("edit drawer cancel and save stay on Oferte", async ({ page, request }) => {
  const token = uniqueRequestToken("CHE");
  const customer = await createCustomer(request, `Hub Edit ${token}`);
  await page.goto(`/clients/${encodeURIComponent(customer.customerId)}?section=oferte`);
  await expect(page.getByRole("heading", { name: `Hub Edit ${token}` })).toBeVisible();
  const localNav = page.getByRole("navigation", { name: "Secțiuni client" });
  await expect(localNav.getByRole("link", { name: "Oferte" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.getByRole("button", { name: "Editează datele" }).click();
  await expect(page.getByRole("heading", { name: "Editează clientul" })).toBeVisible();
  await page.getByRole("button", { name: "Anulează" }).click();
  await expect(page.getByRole("heading", { name: "Editează clientul" })).toHaveCount(0);
  await expect(page).toHaveURL(/section=oferte/);
  await expect(localNav.getByRole("link", { name: "Oferte" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.getByRole("button", { name: "Editează datele" }).click();
  const name = page.getByLabel("Nume");
  await name.fill(`Hub Edit SRL ${token}`);
  await page.getByRole("button", { name: "Salvează" }).click();
  await expect(page.getByRole("heading", { name: `Hub Edit SRL ${token}` })).toBeVisible();
  await expect(page).toHaveURL(/section=oferte/);
  await expect(localNav.getByRole("link", { name: "Oferte" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("retired client hides Cerere nouă", async ({ page, request }) => {
  const token = uniqueRequestToken("CHR");
  const customer = await createCustomer(request, `Hub Retras ${token}`);
  await request.patch(`/api/customers/${customer.customerId}`, { data: { status: "RETIRED" } });
  await page.goto(`/clients/${encodeURIComponent(customer.customerId)}`);
  await expect(page.getByText("Retras · Istoricul rămâne vizibil.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Cerere nouă" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Editează datele" })).toBeVisible();
});

test("attention appears before profile and is absent for an empty active client", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("CHA");
  const attention = await createCustomer(request, `Hub Atenție ${token}`);
  await createRequestForCustomer(request, attention.customerId, `Cerere Atenție ${token}`);
  const empty = await createCustomer(request, `Hub Gol ${token}`);

  await page.goto(`/clients/${encodeURIComponent(attention.customerId)}`);
  await expect(page.getByRole("heading", { name: `Hub Atenție ${token}` })).toBeVisible();
  const attentionLink = page.getByRole("link", { name: /Necesită atenție/ });
  const profile = page.getByRole("heading", { name: "Date client" });
  await expect(attentionLink).toBeVisible();
  const attentionBox = await attentionLink.boundingBox();
  const profileBox = await profile.boundingBox();
  expect(attentionBox).not.toBeNull();
  expect(profileBox).not.toBeNull();
  expect(attentionBox!.y).toBeLessThan(profileBox!.y);

  await page.goto(`/clients/${encodeURIComponent(empty.customerId)}`);
  await expect(page.getByText("Clientul nu are încă activitate comercială.")).toBeVisible();
  await expect(page.getByText("Nicio activitate înregistrată.")).toBeVisible();
  await expect(page.getByText("Necesită atenție")).toHaveCount(0);
  await expect(page.getByText("Creează o cerere de ofertă")).toHaveCount(0);
});

test("768 two-line legal name does not overflow", async ({ page, request }) => {
  const customer = await createProfiledCustomer(request, LONG_NAME);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`/clients/${encodeURIComponent(customer.customerId)}`);
  const heading = page.getByRole("heading", { name: LONG_NAME });
  await expect(heading).toBeVisible();
  const metrics = await heading.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(style.lineHeight),
    };
  });
  expect(metrics.height).toBeGreaterThan(metrics.lineHeight * 1.4);
  expect(await hasHorizontalOverflow(page)).toBe(false);
});

test("dark Client Hub has no white islands", async ({ page, request }) => {
  const token = uniqueRequestToken("CHK");
  const customer = await createProfiledCustomer(request, `Hub Dark ${token}`);
  await createRequestForCustomer(request, customer.customerId, `Cerere Dark ${token}`);
  await page.goto(`/clients/${encodeURIComponent(customer.customerId)}`);
  await setTheme(page, "Întunecată");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const whiteIslands = await page.evaluate(() => {
    const root = document.querySelector(".client-workspace");
    if (!(root instanceof HTMLElement)) {
      return ["missing-workspace"];
    }
    return [root, ...root.querySelectorAll("*")].flatMap((node) => {
      if (!(node instanceof HTMLElement)) {
        return [];
      }
      const bg = getComputedStyle(node).backgroundColor;
      return bg === "rgb(255, 255, 255)" ? [node.className || node.tagName] : [];
    });
  });
  expect(whiteIslands).toEqual([]);
  await setTheme(page, "Deschisă");
});

test("global commercial routes keep current page content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [path, heading] of [
    ["/clients", "Clienți"],
    ["/requests", "Cereri de ofertă"],
    ["/quotes", "Oferte"],
    ["/jobs", "Lucrări"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    await expect(page.locator(".client-summary-rail")).toHaveCount(0);
    await expect(page.locator(".client-local-nav")).toHaveCount(0);
    await expect(page.getByText("Client Hub")).toHaveCount(0);
  }
  await page.goto("/clients");
  await expect(page.locator(".clients-overview .metric-band")).toHaveCount(1);
});

test("runtime visual evidence matches the accepted Client Hub floorplan", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("CHV");
  const active = await createProfiledCustomer(request, `Hub Visual ${token}`);
  await createRequestForCustomer(request, active.customerId, `Cerere Visual ${token}`);
  const empty = await createCustomer(request, `Hub Empty ${token}`);
  const retired = await createCustomer(request, `Hub Retired ${token}`);
  await request.patch(`/api/customers/${retired.customerId}`, { data: { status: "RETIRED" } });
  const long = await createProfiledCustomer(request, LONG_NAME);
  const quote = await createCommercialQuote(request, uniqueQuoteInscription("CHQ"));
  const quoteCustomerId = await findCustomerId(request, `Client ${quote.inscription}`);
  const jobQuote = await createCommercialQuote(request, uniqueQuoteInscription("CHJ"));
  const accepted = await acceptCommercialQuote(request, jobQuote);
  await createOrderFromQuote(request, accepted);
  const jobCustomerId = await findCustomerId(request, `Client ${jobQuote.inscription}`);

  await mkdir(EVIDENCE_DIR, { recursive: true });
  const shots: Array<{
    width: number;
    height: number;
    theme: "light" | "dark";
    path: string;
    name: string;
  }> = [
    { width: 1920, height: 1080, theme: "light", path: `/clients/${encodeURIComponent(active.customerId)}`, name: "1920_light_active" },
    { width: 1920, height: 1080, theme: "dark", path: `/clients/${encodeURIComponent(active.customerId)}`, name: "1920_dark_active" },
    { width: 1440, height: 900, theme: "light", path: `/clients/${encodeURIComponent(active.customerId)}`, name: "1440_light_active" },
    { width: 1440, height: 900, theme: "dark", path: `/clients/${encodeURIComponent(active.customerId)}`, name: "1440_dark_active" },
    { width: 1280, height: 800, theme: "light", path: `/clients/${encodeURIComponent(active.customerId)}`, name: "1280_light_active" },
    { width: 768, height: 1024, theme: "light", path: `/clients/${encodeURIComponent(active.customerId)}`, name: "768_light_active" },
    { width: 768, height: 1024, theme: "dark", path: `/clients/${encodeURIComponent(active.customerId)}`, name: "768_dark_active" },
    { width: 1440, height: 900, theme: "light", path: `/clients/${encodeURIComponent(active.customerId)}`, name: "attention" },
    { width: 1440, height: 900, theme: "light", path: `/clients/${encodeURIComponent(retired.customerId)}`, name: "retired" },
    { width: 1440, height: 900, theme: "light", path: `/clients/${encodeURIComponent(empty.customerId)}`, name: "empty" },
    { width: 1440, height: 900, theme: "light", path: `/clients/${encodeURIComponent(active.customerId)}?section=cereri`, name: "cereri" },
    { width: 1440, height: 900, theme: "light", path: `/clients/${encodeURIComponent(quoteCustomerId)}?section=oferte`, name: "oferte" },
    { width: 1440, height: 900, theme: "light", path: `/clients/${encodeURIComponent(jobCustomerId)}?section=lucrari`, name: "lucrari" },
    { width: 768, height: 1024, theme: "light", path: `/clients/${encodeURIComponent(long.customerId)}`, name: "768_long_name" },
  ];

  for (const shot of shots) {
    await page.addInitScript((theme) => {
      window.localStorage.setItem("workos.theme", theme);
    }, shot.theme);
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await page.goto(shot.path, { waitUntil: "networkidle" });
    await expect(page.getByText("Se încarcă clientul…")).toHaveCount(0);
    await expect(page.locator(".client-workspace h1")).toBeVisible();
    expect(await hasHorizontalOverflow(page)).toBe(false);
    if (shot.name === "attention") {
      await expect(page.getByRole("link", { name: /Necesită atenție/ })).toBeVisible();
    }
    if (shot.name === "retired") {
      await expect(page.getByText("Retras · Istoricul rămâne vizibil.")).toBeVisible();
    }
    if (shot.name === "empty") {
      await expect(page.getByText("Clientul nu are încă activitate comercială.")).toBeVisible();
    }
    if (shot.name === "cereri") {
      await expect(page.getByText(`Cerere Visual ${token}`)).toBeVisible();
    }
    if (shot.name === "oferte") {
      await expect(page.locator(".client-quote-row")).toContainText(quote.inscription);
      await expect(page.getByText(/624,82 EUR/)).toBeVisible();
    }
    if (shot.name === "lucrari") {
      await expect(page.locator(".client-job-row")).toContainText(jobQuote.inscription);
    }
    await page.screenshot({
      path: join(EVIDENCE_DIR, `${shot.name}.png`),
      fullPage: false,
      animations: "disabled",
    });
  }

  await page.addInitScript(() => {
    window.localStorage.setItem("workos.theme", "light");
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/clients/${encodeURIComponent(quoteCustomerId)}?section=oferte`);
  await page.getByRole("button", { name: "Editează datele" }).click();
  await expect(page.getByRole("heading", { name: "Editează clientul" })).toBeVisible();
  await page.screenshot({
    path: join(EVIDENCE_DIR, "edit_drawer_oferte.png"),
    fullPage: false,
    animations: "disabled",
  });
});
