import { expect, test } from "./fixtures";
import { setTheme } from "./helpers/account";
import { createCommercialOrder, uniqueJobInscription } from "./helpers/jobs";
import { createCommercialQuote, uniqueQuoteInscription } from "./helpers/quotes";
import {
  CANONICAL_LETTERS_PRODUCT_CODE,
  confirmCanonicalLettersOnPage,
  uniqueRequestToken,
} from "./helpers/requests";

const shot = (name: string) => `docs/worklog/screenshots/hf-wave2-${name}.png`;

test("commercial catalog configurator reaches a stable job", async ({ page, request }) => {
  const token = uniqueRequestToken("HN");
  const customerName = `Hotel Nord ${token}`;
  const title = `Litere volumetrice ${token}`;
  const inscription = `HN${token.slice(-4)}`;
  const financialKeys = ["internalCost", "markupPercent", "marginAmount", "eicTotal"];

  await page.goto("/clients");
  await expect(page.getByRole("heading", { name: "Clienți" })).toBeVisible();
  await page.getByRole("button", { name: "Client nou" }).click();
  await expect(page.getByRole("dialog", { name: "Client nou" })).toBeVisible();
  await page.screenshot({ path: shot("client-new-drawer"), fullPage: true });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Client nou" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Client nou" })).toBeFocused();
  await page.getByRole("button", { name: "Client nou" }).click();
  await expect(page.getByRole("dialog", { name: "Client nou" })).toBeVisible();
  const createForm = page.locator("form.people-create");
  await createForm.getByLabel("Nume").fill(customerName);
  await createForm.getByRole("button", { name: "Salvează clientul" }).click();
  await expect(page.getByRole("heading", { name: customerName })).toBeVisible();
  await page.screenshot({ path: shot("client-workspace"), fullPage: true });

  await page.getByRole("link", { name: "Cerere nouă" }).click();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  const requestForm = page.locator("form.people-create");
  await requestForm.getByLabel("Titlu").fill(title);
  await requestForm.getByLabel("Descriere").fill("Litere volumetrice pentru Hotel Nord, poveste sintetică.");
  await requestForm.getByRole("button", { name: "Creează cererea" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  const requestUrl = page.url();
  const requestId = decodeURIComponent(new URL(requestUrl).pathname.split("/").pop() ?? "");
  await page.screenshot({ path: shot("request-detail"), fullPage: true });

  await page.goto(`/products?request=${encodeURIComponent(requestId)}`);
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Panou ACM casetat" })).toBeVisible();
  await page.screenshot({ path: shot("catalog"), fullPage: true });
  await page
    .getByRole("link", {
      name: "Litere volumetrice luminoase — față plexiglas, volum aluminiu 0,6 mm",
    })
    .focus();
  await page.locator(".catalog-product-detail").getByRole("link", { name: "Configurează" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/products/${CANONICAL_LETTERS_PRODUCT_CODE}\\?request=`),
  );

  await expect(page.getByRole("heading", { name: /Litere volumetrice luminoase/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rezumat" })).toBeVisible();
  await expect(page.getByText("Preț client neconfirmat.")).toBeVisible();
  await page.screenshot({ path: shot("configurator"), fullPage: true });
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "Rezumat" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Rezumat" })).toBeVisible();
  await confirmCanonicalLettersOnPage(page, inscription);
  await expect(page.getByRole("heading", { name: "Configurație confirmată" })).toBeVisible();
  await page.locator(".quote-section").getByRole("button", { name: "Creează oferta" }).click();
  await expect(page.getByRole("heading", { name: "Ofertă creată" })).toBeVisible();
  await page.getByRole("link", { name: "Inspectează oferta" }).click();
  await expect(page).toHaveURL(/\/quotes\//);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();
  await page.screenshot({ path: shot("quote-inspection"), fullPage: true });
  await page.getByRole("button", { name: "Marchează acceptată" }).click();
  await expect(page.getByText("Acceptată", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Creează comanda" }).click();
  await expect(page).toHaveURL(/\/jobs\//);
  await expect(page.getByRole("heading", { name: inscription })).toBeVisible();
  await page.screenshot({ path: shot("job-result"), fullPage: true });

  await page.goto("/quotes");
  await expect(page.getByRole("heading", { name: "Oferte" })).toBeVisible();
  await expect(page.locator(".jobs-list li").filter({ hasText: inscription })).toContainText(/OF-/);
  await page.screenshot({ path: shot("quotes-list"), fullPage: true });
  await page.goto("/requests");
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await page.screenshot({ path: shot("requests-list"), fullPage: true });
  await page.goto("/clients");
  await expect(page.getByRole("heading", { name: "Clienți" })).toBeVisible();
  await page.screenshot({ path: shot("clients-list"), fullPage: true });

  const quotePayload = await request.get("/api/quotes");
  const quoteBody = (await quotePayload.json()) as { overview?: { quotes?: unknown[] } };
  expect(JSON.stringify(quoteBody.overview?.quotes ?? [])).not.toMatch(/contentHash|TRUTH_COMPILER/);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/clients");
  await expect(page.getByRole("heading", { name: "Clienți" })).toBeVisible();
  await page.screenshot({ path: shot("1440-clients"), fullPage: true });
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await page.screenshot({ path: shot("1440-catalog"), fullPage: true });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/quotes");
  await expect(page.getByRole("heading", { name: "Oferte" })).toBeVisible({ timeout: 15_000 });
  await page.screenshot({ path: shot("1280-quotes"), fullPage: true });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/requests");
  await expect(page.getByRole("navigation", { name: "Navigare comercială" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cereri de ofertă" })).toBeVisible();
  await page.screenshot({ path: shot("768-commercial"), fullPage: true });
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Panou ACM casetat" })).toBeVisible();
  await page.screenshot({ path: shot("768-catalog"), fullPage: true });
  await page.goto(`/products/${CANONICAL_LETTERS_PRODUCT_CODE}`);
  await expect(page.getByRole("button", { name: "Verifică configurația" })).toBeVisible();
  await page.screenshot({ path: shot("768-configurator"), fullPage: true });

  await page.setViewportSize({ width: 1280, height: 900 });
  await setTheme(page, "Întunecată");
  await page.goto("/quotes");
  await expect(page.getByRole("heading", { name: "Oferte" })).toBeVisible();
  await page.screenshot({ path: shot("dark-commercial"), fullPage: true });
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "Catalog" })).toBeVisible();
  await page.screenshot({ path: shot("dark-catalog"), fullPage: true });
  await page.goto(`/products/${CANONICAL_LETTERS_PRODUCT_CODE}`);
  await expect(page.getByRole("heading", { name: "Rezumat" })).toBeVisible();
  await page.screenshot({ path: shot("dark-configurator"), fullPage: true });
  await setTheme(page, "Deschisă");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await setTheme(page, "Sistem");
  await expect(page.locator("html")).toHaveAttribute("data-theme-choice", "system");

  const leaked = await page.evaluate((keys) => {
    const text = document.body.innerText;
    return keys.filter((key) => text.includes(key));
  }, financialKeys);
  expect(leaked).toEqual([]);
});

test("wave 1 job and quote routes still refresh", async ({ page, request }) => {
  const quote = await createCommercialQuote(request, uniqueQuoteInscription("W2Q"));
  const job = await createCommercialOrder(request, uniqueJobInscription("W2J"));
  await page.goto(`/quotes/${encodeURIComponent(quote.quoteSnapshotId)}`);
  await expect(page.getByRole("heading", { name: quote.inscription })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: quote.inscription })).toBeVisible();
  await page.goto(`/jobs/${encodeURIComponent(job.orderSnapshotId)}`);
  await expect(page.getByRole("heading", { name: job.inscription })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: job.inscription })).toBeVisible();
});
