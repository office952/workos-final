import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const password = process.env.WORKOS_WAVE3_CLOUD_PASSWORD ?? "OwnerPass12";
const cloudRoot =
  process.env.WORKOS_WAVE3_CLOUD_ROOT ??
  join(process.cwd(), ".tmp", "hf-wave3-cloud-e2e");

export default async function globalSetup(): Promise<void> {
  mkdirSync(cloudRoot, { recursive: true });
  writeFileSync(join(cloudRoot, ".password"), password, { encoding: "utf8" });
  if (!existsSync(join(cloudRoot, "wave3-provisioned.json"))) {
    execSync("pnpm --filter @workos-final/api exec tsx scripts/hf-wave3-synthetic-cloud.ts", {
      cwd: process.cwd(),
      env: {
        ...process.env,
        WORKOS_WAVE3_CLOUD_ROOT: cloudRoot,
        WORKOS_WAVE3_CLOUD_PASSWORD: password,
        WORKOS_WAVE3_OPERATOR_PIN: process.env.WORKOS_WAVE3_OPERATOR_PIN ?? "",
      },
      stdio: "pipe",
      shell: true,
    });
  }
  process.env.WORKOS_WAVE3_CLOUD_PASSWORD = password;
  process.env.WORKOS_CLOUD_ROOT = cloudRoot;
}
