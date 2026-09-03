import { expect, test } from "./fixtures";
import { primaryNavLink } from "./helpers/navigation";
import { ensureTestExecutor } from "./helpers/people";
import {
  completeCanonicalLettersPlan,
  createCommercialOrder,
  createCommercialPlan,
  releaseCommercialOrder,
  startFirstExecutableTask,
  uniqueJobInscription,
} from "./helpers/jobs";

function jobRow(page: import("@playwright/test").Page, inscription: string) {
  return page.locator(".requests-list li").filter({ hasText: inscription });
}

test("operator can scan commercial jobs and open the correct workspace", async ({
  page,
  request,
}) => {
  const executor = await ensureTestExecutor(request);
  const orderOnly = await createCommercialOrder(request, uniqueJobInscription("JOA"));
  const released = await releaseCommercialOrder(
    request,
    await createCommercialOrder(request, uniqueJobInscription("JOB")),
  );
  const planned = await createCommercialPlan(
    request,
    await releaseCommercialOrder(
      request,
      await createCommercialOrder(request, uniqueJobInscription("JOC")),
    ),
  );
  const active = await createCommercialPlan(
    request,
    await releaseCommercialOrder(
      request,
      await createCommercialOrder(request, uniqueJobInscription("JOD")),
    ),
  );
  await startFirstExecutableTask(request, active, executor.personId);
  const completed = await createCommercialPlan(
    request,
    await releaseCommercialOrder(
      request,
      await createCommercialOrder(request, uniqueJobInscription("JOE")),
    ),
  );
  await completeCanonicalLettersPlan(request, completed, executor.personId);

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lucrări" })).toBeVisible();
  await expect(jobRow(page, orderOnly.inscription)).toBeVisible();
  await expect(jobRow(page, orderOnly.inscription)).toContainText(
    `Client: Client ${orderOnly.inscription}`,
  );
  await expect(jobRow(page, orderOnly.inscription)).toContainText("Comandă creată");
  await expect(jobRow(page, orderOnly.inscription)).toContainText("Eliberează pentru producție");
  await expect(jobRow(page, released.inscription)).toContainText("Eliberată pentru producție");
  await expect(jobRow(page, planned.inscription)).toContainText("0 / 12 finalizate");
  await expect(jobRow(page, active.inscription)).toContainText("În lucru");
  await expect(jobRow(page, completed.inscription)).toContainText("12 / 12 finalizate");
  await expect(page.getByText("contentHash")).toHaveCount(0);
  await expect(page.getByText("ExecutionPlanId")).toHaveCount(0);
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-jobs-overview-desktop.png",
    fullPage: true,
  });
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-jobs-needs-action.png",
    fullPage: true,
  });
  await page.locator(".requests-list li", { hasText: released.inscription }).screenshot({
    path: "docs/worklog/screenshots/letters-jobs-released.png",
  });
  await page.locator(".requests-list li", { hasText: active.inscription }).screenshot({
    path: "docs/worklog/screenshots/letters-jobs-in-progress.png",
  });
  await page.locator(".requests-list li", { hasText: completed.inscription }).screenshot({
    path: "docs/worklog/screenshots/letters-jobs-completed.png",
  });
  await page.locator(".requests-list li", { hasText: orderOnly.inscription }).screenshot({
    path: "docs/worklog/screenshots/letters-jobs-attention.png",
  });

  await jobRow(page, orderOnly.inscription).getByRole("link", {
    name: "Eliberează pentru producție",
  }).click();
  await expect(page).toHaveURL(new RegExp(`/jobs/${encodeURIComponent(orderOnly.orderSnapshotId)}`));
  await page.locator(".client-object-actions").getByRole("link", { name: "Eliberează pentru producție" }).click();
  await expect(page).toHaveURL(new RegExp(`/products/${orderOnly.productCode}\\?order=`));
  await expect(page.getByText(`${orderOnly.inscription} — continuare lucrare comercială.`)).toBeVisible();
  await expect(page.getByRole("button", { name: "Eliberează pentru producție" })).toBeVisible();
  await page.getByRole("button", { name: "Eliberează pentru producție" }).click();
  await expect(page.getByRole("heading", { name: /eliberată pentru producție/i })).toBeVisible();
  await primaryNavLink(page, "Lucrări").click();
  await expect(jobRow(page, orderOnly.inscription)).toContainText("Eliberată pentru producție");
  await expect(jobRow(page, orderOnly.inscription)).toContainText("Creează planul de execuție");

  await jobRow(page, planned.inscription).getByRole("link", { name: "Deschide execuția" }).click();
  await expect(page).toHaveURL(new RegExp(`/jobs/${encodeURIComponent(planned.orderSnapshotId)}`));
  await page.locator(".client-object-actions").getByRole("link", { name: "Deschide execuția" }).click();
  await expect(page).toHaveURL(/\/execution\/exp:/);
  await expect(page.getByRole("heading", { name: "Plan de execuție" })).toBeVisible();
  await primaryNavLink(page, "Lucrări").click();
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(jobRow(page, planned.inscription)).toContainText("0 / 12 finalizate");

  await page.getByRole("button", { name: "Finalizate" }).click();
  await expect(jobRow(page, completed.inscription)).toBeVisible();
  await expect(jobRow(page, active.inscription)).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toate" }).click();
  await expect(page.getByRole("heading", { name: "Lucrări" })).toBeVisible();
  await expect(jobRow(page, active.inscription).getByRole("link", { name: "Continuă execuția" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-jobs-narrow.png",
    fullPage: true,
  });
});

test("empty commercial overview stays honest when no jobs exist yet", async ({ page, request }) => {
  const listed = await request.get("/api/jobs");
  const body = (await listed.json()) as { overview?: { jobs?: unknown[] } };
  test.skip((body.overview?.jobs?.length ?? 0) > 0, "commercial jobs already exist in the shared e2e store");
  await page.goto("/");
  await expect(page.getByText("Nu există încă lucrări comerciale.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Deschide catalogul" })).toBeVisible();
  await page.screenshot({
    path: "docs/worklog/screenshots/letters-jobs-empty.png",
    fullPage: true,
  });
});
