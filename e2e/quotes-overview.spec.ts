import { expect, test } from "./fixtures";
import {
  acceptCommercialQuote,
  createCommercialQuote,
  createOrderFromQuote,
  uniqueQuoteInscription,
} from "./helpers/quotes";

function quoteRow(page: import("@playwright/test").Page, inscription: string) {
  return page.locator(".jobs-list li").filter({ hasText: inscription });
}

test("operator can find frozen quotes and continue the commercial path", async ({
  page,
  request,
}) => {
  const created = await createCommercialQuote(request, uniqueQuoteInscription("QOA"));
  const accepted = await acceptCommercialQuote(
    request,
    await createCommercialQuote(request, uniqueQuoteInscription("QOB")),
  );
  const ordered = await createOrderFromQuote(
    request,
    await acceptCommercialQuote(
      request,
      await createCommercialQuote(request, uniqueQuoteInscription("QOC")),
    ),
  );

  await page.goto("/quotes");
  await expect(page.getByRole("heading", { name: "Oferte" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Oferte" })).toBeVisible();
  await expect(quoteRow(page, created.inscription)).toBeVisible();
  await expect(quoteRow(page, created.inscription)).toContainText(
    `Client: Client ${created.inscription}`,
  );
  await expect(quoteRow(page, created.inscription)).toContainText("Creată");
  await expect(quoteRow(page, created.inscription)).toContainText("624,82 EUR");
  await expect(quoteRow(page, created.inscription)).toContainText("Marchează acceptată");
  await expect(quoteRow(page, accepted.inscription)).toContainText("Acceptată");
  await expect(quoteRow(page, accepted.inscription)).toContainText("Creează comanda");
  await expect(quoteRow(page, ordered.inscription)).toContainText("Cu comandă");
  await expect(quoteRow(page, ordered.inscription)).toContainText("Deschide comanda");
  await expect(page.getByText("contentHash")).toHaveCount(0);
  await expect(page.getByText("SENT")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-quotes-overview-desktop.png",
    fullPage: true,
  });

  await quoteRow(page, created.inscription)
    .getByRole("link", { name: "Marchează acceptată" })
    .click();
  await expect(page).toHaveURL(new RegExp(`/quotes/${encodeURIComponent(created.quoteSnapshotId)}`));
  await expect(page.getByRole("heading", { name: created.inscription })).toBeVisible();
  await expect(page.getByRole("button", { name: "Marchează acceptată" })).toBeVisible();
  await page.getByRole("button", { name: "Marchează acceptată" }).click();
  await expect(page.getByText("Acceptată", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Creează comanda" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-quotes-continue.png",
    fullPage: true,
  });

  await page.getByRole("navigation", { name: "Navigare comercială" }).getByRole("link", { name: "Oferte" }).click();
  await expect(quoteRow(page, created.inscription)).toContainText("Acceptată");
  await expect(quoteRow(page, created.inscription)).toContainText("Creează comanda");

  await quoteRow(page, ordered.inscription)
    .getByRole("link", { name: "Deschide comanda" })
    .click();
  await expect(page).toHaveURL(/\/quotes\//);
  await page.getByRole("link", { name: "Deschide lucrarea" }).click();
  await expect(page).toHaveURL(/\/jobs\//);

  await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Comercial" }).click();
  await page.getByRole("navigation", { name: "Navigare comercială" }).getByRole("link", { name: "Oferte" }).click();
  await page.getByRole("button", { name: "Cu comandă" }).click();
  await expect(quoteRow(page, ordered.inscription)).toBeVisible();
  await expect(quoteRow(page, created.inscription)).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toate" }).click();
  await expect(page.getByRole("heading", { name: "Oferte" })).toBeVisible();
  await expect(
    quoteRow(page, accepted.inscription).getByRole("link", { name: "Creează comanda" }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-quotes-narrow.png",
    fullPage: true,
  });
});
