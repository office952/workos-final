import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const password = process.env.WORKOS_WAVE1_CLOUD_PASSWORD ?? "OwnerPass12";
const cloudRoot =
  process.env.WORKOS_WAVE1_CLOUD_ROOT ??
  join(process.cwd(), ".tmp", "architecture-c-ui-wave1-review", "cloud");

export default async function globalSetup(): Promise<void> {
  mkdirSync(cloudRoot, { recursive: true });
  writeFileSync(join(cloudRoot, ".password"), password, { encoding: "utf8" });
  if (!existsSync(join(cloudRoot, "wave1-provisioned.json"))) {
    execSync(
      "pnpm --filter @workos-final/api exec tsx scripts/architecture-c-ui-wave1-synthetic-cloud.ts",
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          WORKOS_WAVE1_CLOUD_ROOT: cloudRoot,
          WORKOS_WAVE1_CLOUD_PASSWORD: password,
        },
        stdio: "pipe",
        shell: true,
      },
    );
  }
  process.env.WORKOS_WAVE1_CLOUD_PASSWORD = password;
  process.env.WORKOS_CLOUD_ROOT = cloudRoot;
}
