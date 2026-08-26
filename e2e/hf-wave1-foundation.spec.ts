import { expect, test } from "./fixtures";
import { createCommercialOrder, createCommercialPlan, releaseCommercialOrder, uniqueJobInscription } from "./helpers/jobs";
import { createCommercialQuote, uniqueQuoteInscription } from "./helpers/quotes";

const shot = (name: string) => `docs/worklog/screenshots/hf-wave1-${name}.png`;

test("stable job and quote routes refresh, theme and responsive shell", async ({
  page,
  request,
}) => {
  const quote = await createCommercialQuote(request, uniqueQuoteInscription("HFQ"));
  const job = await createCommercialOrder(request, uniqueJobInscription("HFJ"));
  const planned = await createCommercialPlan(
    request,
    await releaseCommercialOrder(
      request,
      await createCommercialOrder(request, uniqueJobInscription("HFP")),
    ),
  );

  await page.goto(`/quotes/${encodeURIComponent(quote.quoteSnapshotId)}`);
  await expect(page.getByRole("heading", { name: quote.inscription })).toBeVisible();
  await expect(page.getByText(/Brut: .* EUR/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: quote.inscription })).toBeVisible();
  await expect(page.getByRole("link", { name: "Catalog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sari la conținut" })).toHaveAttribute(
    "href",
    "#continut-principal",
  );

  await page.goto(`/jobs/${encodeURIComponent(job.orderSnapshotId)}`);
  await expect(page.getByRole("heading", { name: job.inscription })).toBeVisible();
  await expect(page.getByText("Fără plan de execuție încă.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: job.inscription })).toBeVisible();

  await page.goto(`/jobs/${encodeURIComponent(planned.orderSnapshotId)}`);
  await expect(page.getByRole("link", { name: "Deschide execuția" })).toBeVisible();
  await expect(page.getByText(/Cost intern:/)).toBeVisible();
  await expect(page.getByText(/Adaos:/)).toBeVisible();
  await page.getByRole("link", { name: "Deschide execuția" }).click();
  await expect(page).toHaveURL(/\/execution\/exp:/);
  await expect(page.getByText(/Cost intern (planificat|real)/)).toHaveCount(0);
  await expect(page.getByText(/Brut:/)).toHaveCount(0);

  await page.goto("/jobs/ord:missing");
  await expect(page.getByText("Lucrarea nu a fost găsită.")).toBeVisible();
  await page.goto("/quotes/qts:missing");
  await expect(page.getByText("Oferta nu a fost găsită.")).toBeVisible();

  await page.goto(`/jobs/${encodeURIComponent(job.orderSnapshotId)}`);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: shot("job-1440-light"), fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: shot("job-1280-light"), fullPage: true });
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.getByRole("group", { name: "Utilitare" })).toBeVisible();
  await expect(page.getByLabel("Cont", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Administrare" })).toBeVisible();
  await page.screenshot({ path: shot("job-768-light"), fullPage: true });

  await page.getByRole("button", { name: "Întunecată" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: shot("job-1440-dark"), fullPage: true });

  await page.goto(`/quotes/${encodeURIComponent(quote.quoteSnapshotId)}`);
  await page.screenshot({ path: shot("quote-1440-dark"), fullPage: true });
  await page.getByRole("button", { name: "Deschisă" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.screenshot({ path: shot("quote-1440-light"), fullPage: true });
  await page.getByRole("button", { name: "Sistem" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme-choice", "system");

  await page.getByRole("link", { name: "WorkOS Final" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#continut-principal")).toBeFocused();
});
