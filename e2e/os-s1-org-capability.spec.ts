import { expect, test } from "./fixtures";
import { CANONICAL_LETTERS_PRODUCT_CODE, uniqueRequestToken } from "./helpers/requests";

test("OS-S1 hides new installation when disabled and locks after a linked quote", async ({
  page,
  request,
}) => {
  const token = uniqueRequestToken("OS1");
  const disabled = await request.patch("/api/operational-services/SITE_INSTALLATION", {
    data: { offerMode: "SERVICE_DISABLED" },
  });
  expect(disabled.ok()).toBeTruthy();

  const customer = await request.post("/api/customers", {
    data: { displayName: `Client ${token}` },
  });
  expect(customer.ok()).toBeTruthy();
  const customerId = ((await customer.json()) as { customer: { customerId: string } })
    .customer.customerId;

  const hiddenCreated = await request.post("/api/requests", {
    data: {
      customerId,
      title: `Litere fără ofertă ${token}`,
      description: "Cerere pentru org dezactivată.",
    },
  });
  expect(hiddenCreated.ok()).toBeTruthy();
  const hiddenId = ((await hiddenCreated.json()) as { request: { requestId: string } })
    .request.requestId;
  await page.goto(`/requests/${encodeURIComponent(hiddenId)}`);
  await page.getByRole("button", { name: "Montaj" }).click();
  await expect(page.getByRole("checkbox", { name: /Montaj la locație/ })).toHaveCount(0);

  const enabled = await request.patch("/api/operational-services/SITE_INSTALLATION", {
    data: { offerMode: "INTERNAL" },
  });
  expect(enabled.ok()).toBeTruthy();

  const lockedCreated = await request.post("/api/requests", {
    data: {
      customerId,
      title: `Litere lock ${token}`,
      description: "Cerere pentru lock după ofertă.",
    },
  });
  expect(lockedCreated.ok()).toBeTruthy();
  const lockedId = ((await lockedCreated.json()) as { request: { requestId: string } })
    .request.requestId;

  const compile = await request.post(`/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/compile`, {
    data: {
      values: {
        "root.inscription": token.slice(0, 8),
        "face.finish": "none",
        "face.confirmedAreaMm2": 250000,
        "volume.depthMm": "60",
        "volume.finish": "none",
        "volume.confirmedPerimeterMm": 12500,
      },
    },
  });
  expect(compile.ok()).toBeTruthy();
  const compiled = (await compile.json()) as { definition: unknown; reviewId: string };
  const freeze = await request.post(
    `/api/products/${CANONICAL_LETTERS_PRODUCT_CODE}/quote-snapshots`,
    {
      data: {
        definition: compiled.definition,
        reviewId: compiled.reviewId,
        customerId,
        requestId: lockedId,
      },
    },
  );
  expect(freeze.ok()).toBeTruthy();

  await page.goto(`/requests/${encodeURIComponent(lockedId)}`);
  await page.getByRole("button", { name: "Montaj" }).click();
  const checkbox = page.getByRole("checkbox", { name: /Montaj la locație/ });
  await expect(checkbox).toBeVisible();
  await expect(checkbox).toBeDisabled();
  await expect(
    page.getByText("Selecția și modul sunt blocate după prima ofertă legată."),
  ).toBeVisible();
});
