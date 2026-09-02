import { expect, test } from "./fixtures";
import {
  configureCanonicalLettersForRequest,
  confirmCanonicalLettersOnPage,
  uniqueRequestToken,
} from "./helpers/requests";

function clientRow(page: import("@playwright/test").Page, name: string) {
  return page.locator(".clients-list li").filter({ hasText: name });
}

test("office can open one client and see requests, offers and works", async ({
  page,
  request,
}) => {
  const fatalErrors: string[] = [];
  const writes: string[] = [];

  page.on("pageerror", (error) => {
    fatalErrors.push(error.message);
  });
  page.on("request", (item) => {
    if (item.method() !== "GET" && item.url().includes("/api/")) {
      writes.push(`${item.method()} ${new URL(item.url()).pathname}`);
    }
  });

  const token = uniqueRequestToken("CLW");
  const customerName = `Client Alpha ${token}`;
  const renamed = `Client Alpha SRL ${token}`;
  const title = `Litere fațadă ${token}`;
  const inscription = `LT${token.slice(-4)}`;

  await page.goto("/clients");
  await expect(page.getByRole("heading", { name: "Clienți" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Clienți" }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Navigare comercială" }),
  ).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/clients-overview-desktop.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/commercial-navigation.png",
  });

  await page.getByRole("button", { name: "Client nou" }).click();
  const createForm = page.locator("form.people-create");
  await createForm.getByLabel("Nume").fill(customerName);
  await createForm.getByLabel("CUI").fill("RO12345678");
  await createForm.getByLabel("Persoană de contact").fill("Ana Pop");
  await createForm.getByLabel("Telefon").fill("0722000000");
  await createForm.getByLabel("Email").fill("ana@hub.ro");
  await createForm.getByLabel("Adresă").fill("Str. Exemplu 1");
  await createForm.getByLabel("Oraș").fill("București");
  await createForm.getByRole("button", { name: "Salvează clientul" }).click();

  await expect(page.getByRole("heading", { name: customerName })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Date client" })).toBeVisible();
  await expect(page.getByText("RO12345678", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Ana Pop").first()).toBeVisible();
  const workspaceUrl = page.url();
  expect(workspaceUrl).toMatch(/\/clients\/cus/);
  await page.screenshot({
    path: "docs/worklog/screenshots/client-workspace-overview.png",
    fullPage: true,
  });

  const workspaceGetsBefore = writes.length;
  await page.reload();
  await expect(page.getByRole("heading", { name: customerName })).toBeVisible();
  const afterReload = writes.slice(workspaceGetsBefore);
  expect(afterReload.filter((item) => item.startsWith("POST") || item.startsWith("PATCH"))).toEqual(
    [],
  );

  await page.getByRole("link", { name: "Cerere nouă" }).click();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  const requestForm = page.locator("form.people-create");
  await expect(requestForm.getByRole("combobox", { name: "Client" })).not.toHaveValue("");
  await requestForm.getByLabel("Titlu").fill(title);
  await requestForm.getByLabel("Descriere").fill(
    "Clientul sună pentru litere luminoase pe fațadă, text scurt, adâncime 60 mm.",
  );
  await expect(requestForm.getByRole("button", { name: "Clientul nu e în listă" })).toHaveCount(0);
  await requestForm.getByRole("button", { name: "Creează cererea" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  const requestUrl = page.url();
  await expect(page.getByRole("link", { name: `Înapoi la ${customerName}` })).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la Cereri" })).toHaveCount(0);
  await page.getByRole("link", { name: `Înapoi la ${customerName}` }).click();
  await expect(page).toHaveURL(/\/clients\/cus.*[?&]section=cereri/);
  await expect(page.getByRole("heading", { name: customerName })).toBeVisible();

  await page.goto(workspaceUrl);
  await page.getByRole("navigation", { name: "Secțiuni client" }).getByRole("link", { name: "Cereri" }).click();
  await expect(page.getByText(/CER-[0-9A-F]{8}/).first()).toBeVisible();
  await expect(page.getByText(title)).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/client-workspace-requests.png",
    fullPage: true,
  });

  await page.getByRole("link", { name: title }).click();
  await expect(page).toHaveURL(requestUrl);
  const requestId = decodeURIComponent(new URL(requestUrl).pathname.split("/").pop() ?? "");
  await configureCanonicalLettersForRequest(page, requestId);
  await confirmCanonicalLettersOnPage(page, inscription);
  const quote = page.locator(".quote-section");
  await quote.getByRole("button", { name: "Creează oferta" }).click();
  await expect(quote.getByRole("heading", { name: /Ofertă creată|Ofertă acceptată/ })).toBeVisible();
  await expect(quote.getByText(`Client: ${customerName}`)).toBeVisible();
  await expect(quote.getByText("624,82 EUR")).toBeVisible();

  await page.goto(`${workspaceUrl}?section=oferte`);
  await expect(page.getByText(/OF-[0-9A-F]{8}/)).toBeVisible();
  await expect(page.getByText(/624,82 EUR/)).toBeVisible();
  await expect(page.getByText(`Client la înghețare: ${customerName}`)).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/client-workspace-quotes.png",
    fullPage: true,
  });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Descarcă oferta PDF" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/oferta|pdf/i);

  await page.getByRole("link", { name: "Marchează acceptată" }).click();
  await expect(page).toHaveURL(/\/quotes\//);
  await page.getByRole("button", { name: "Marchează acceptată" }).click();
  await expect(page.getByRole("button", { name: "Creează comanda" })).toBeVisible();
  await page.getByRole("button", { name: "Creează comanda" }).click();
  await expect(page).toHaveURL(/\/jobs\//);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();

  await page.goto(`${workspaceUrl}?section=lucrari`);
  await expect(page.getByRole("link", { name: inscription })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/client-workspace-jobs.png",
    fullPage: true,
  });

  await page.goto(workspaceUrl);
  await page.getByRole("button", { name: "Editează datele" }).click();
  const name = page.getByLabel("Nume");
  await name.fill(renamed);
  await page.getByRole("button", { name: "Salvează" }).click();
  await expect(page.getByRole("heading", { name: renamed })).toBeVisible();
  expect(page.url()).toMatch(/\/clients\/cus/);
  await page.getByRole("navigation", { name: "Secțiuni client" }).getByRole("link", { name: "Cereri" }).click();
  await expect(page.getByText(title)).toBeVisible();
  await page.getByRole("navigation", { name: "Secțiuni client" }).getByRole("link", { name: "Oferte" }).click();
  await expect(page.getByText(`Client la înghețare: ${customerName}`)).toBeVisible();
  await expect(page.getByText(`Client la înghețare: ${renamed}`)).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/client-workspace-renamed-history.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(workspaceUrl);
  await expect(page.getByRole("heading", { name: renamed })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > 390);
  expect(overflow).toBe(false);
  await page.screenshot({
    path: "docs/worklog/screenshots/client-workspace-narrow.png",
    fullPage: true,
  });

  const otherName = `Client Beta ${token}`;
  const otherCreated = await request.post("/api/customers", {
    data: { displayName: otherName },
  });
  const other = (await otherCreated.json()) as { customer: { customerId: string } };
  await request.post("/api/requests", {
    data: {
      customerId: other.customer.customerId,
      title: `Cerere Beta ${token}`,
      description: "Cerere a celuilalt client.",
    },
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(workspaceUrl);
  await page.getByRole("navigation", { name: "Secțiuni client" }).getByRole("link", { name: "Cereri" }).click();
  await expect(page.getByText(`Cerere Beta ${token}`)).toHaveCount(0);
  await expect(page.getByText(title)).toBeVisible();

  const listed = await request.get("/api/customers");
  const registry = (await listed.json()) as {
    customers: Array<{ customerId: string; displayName: string }>;
  };
  const alpha = registry.customers.find((item) => item.displayName === renamed);
  expect(alpha).toBeTruthy();
  await request.patch(`/api/customers/${alpha?.customerId}`, {
    data: { status: "RETIRED" },
  });
  await page.goto(workspaceUrl);
  await expect(page.getByText("Retras · Istoricul rămâne vizibil.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Cerere nouă" })).toHaveCount(0);
  await page.getByRole("navigation", { name: "Secțiuni client" }).getByRole("link", { name: "Cereri" }).click();
  await expect(page.getByText(title)).toBeVisible();

  await page.goto("/clients");
  await expect(clientRow(page, renamed)).toBeVisible();
  await expect(page.getByRole("link", { name: new RegExp(renamed) })).toBeVisible();
  await expect(page.getByRole("link", { name: "Deschide clientul" })).toHaveCount(0);

  expect(fatalErrors).toEqual([]);
});
