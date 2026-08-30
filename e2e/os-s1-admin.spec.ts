import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { APIRequestContext } from "@playwright/test";
import { expect, test } from "./fixtures";

const SHOT_DIR = join(".tmp", "os-s1-ui");

type CapabilityView = {
  capabilityId: string;
  configured: boolean;
  offerMode: string | null;
};

test("OS-S1 admin sits in Admin L2 and saves organization offer mode", async ({
  page,
  request,
}) => {
  await mkdir(SHOT_DIR, { recursive: true });
  const before = await readInstallation(request);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/admin/operational-services");
  await expect(page.getByRole("heading", { name: "Servicii operaționale" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Context" })).toContainText(
    "Administrare",
  );
  const sidebar = page.getByRole("navigation", { name: "Navigare principală" });
  await expect(sidebar.getByRole("link", { name: "Servicii operaționale" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(sidebar.getByRole("link", { name: "Angajați" })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Resurse și costuri" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Alege elementul" })).toHaveCount(0);
  await expect(page.getByLabel("Caută")).toHaveCount(0);

  if (!before.configured) {
    await expect(page.getByText("Neconfigurat")).toBeVisible();
    await expect(page.getByText(/Nu există o configurație salvată/)).toBeVisible();
    await expect(page.getByText(/Configurația este salvată/)).toHaveCount(0);
    await page.screenshot({
      path: join(SHOT_DIR, "owner-unconfigured-1440.png"),
      fullPage: true,
    });
  }

  await page.getByLabel("Montaj la locație").selectOption("INTERNAL");
  await page.getByRole("button", { name: "Salvează configurația serviciului" }).click();
  await expect(page.getByText("Configurația serviciului a fost salvată.")).toBeVisible();
  await expect(page.getByText(/Organizația oferă montaj cu echipă internă/)).toBeVisible();
  await page.screenshot({
    path: join(SHOT_DIR, "owner-internal-1440.png"),
    fullPage: true,
  });

  const disabled = await request.patch("/api/operational-services/SITE_INSTALLATION", {
    data: { offerMode: "SERVICE_DISABLED" },
  });
  expect(disabled.ok()).toBeTruthy();
  await page.reload();
  await expect(page.getByText(/Configurația este salvată/)).toBeVisible();
  await expect(page.getByText(/Nu există o configurație salvată/)).toHaveCount(0);
  await expect(page.getByLabel("Montaj la locație")).toHaveValue("SERVICE_DISABLED");

  const restored = await request.patch("/api/operational-services/SITE_INSTALLATION", {
    data: { offerMode: "INTERNAL" },
  });
  expect(restored.ok()).toBeTruthy();

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/admin/operational-services");
  await expect(page.getByRole("heading", { name: "Servicii operaționale" })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Servicii operaționale" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.screenshot({
    path: join(SHOT_DIR, "owner-internal-1280.png"),
    fullPage: true,
  });

  await page.setViewportSize({ width: 768, height: 900 });
  await expect(page.getByRole("heading", { name: "Servicii operaționale" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Meniu" })).toBeVisible();
  await page.getByRole("button", { name: "Meniu" }).click();
  const drawer = page.getByRole("dialog", { name: "Meniu" });
  await expect(drawer).toBeVisible();
  await expect(
    drawer.getByRole("link", { name: "Servicii operaționale" }),
  ).toHaveAttribute("aria-current", "page");
  await page.screenshot({
    path: join(SHOT_DIR, "owner-internal-768.png"),
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Meniu" })).toHaveCount(0);
});

async function readInstallation(request: APIRequestContext): Promise<CapabilityView> {
  const response = await request.get("/api/operational-services");
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { services: { capabilities: CapabilityView[] } };
  const installation = body.services.capabilities.find(
    (item) => item.capabilityId === "SITE_INSTALLATION",
  );
  expect(installation).toBeTruthy();
  return installation as CapabilityView;
}
