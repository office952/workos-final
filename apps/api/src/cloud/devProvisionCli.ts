import { createInterface } from "node:readline";
import { stdin, stderr } from "node:process";
import { fileURLToPath } from "node:url";
import {
  openProvisionedControlPlane,
  provisionCloudUser,
  provisionMembership,
  provisionOrganizationWithPlane,
} from "./provision.js";

export function assertDevProvisionSafe(env: NodeJS.ProcessEnv = process.env): void {
  if (env.NODE_ENV === "production") {
    throw new Error(
      "devProvisionCli is a local Cloud setup helper and must not bootstrap production accounts.",
    );
  }
}

export function rejectArgvPassword(argv: readonly string[]): void {
  if (argv.includes("--password")) {
    throw new Error(
      "Passwords must not be passed as --password. Use a TTY prompt or --password-stdin.",
    );
  }
}

function readArg(argv: readonly string[], name: string): string {
  const index = argv.indexOf(`--${name}`);
  const value = index >= 0 ? argv[index + 1] : undefined;
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing --${name}`);
  }
  return value;
}

export async function readProvisionPassword(
  argv: readonly string[],
  input: NodeJS.ReadableStream = stdin,
): Promise<string> {
  if (argv.includes("--password-stdin")) {
    const chunks: Buffer[] = [];
    for await (const chunk of input) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
  }
  if (!("isTTY" in input) || !input.isTTY) {
    throw new Error("Password required via TTY prompt or --password-stdin.");
  }
  return promptHiddenPassword("Cloud password: ");
}

function promptHiddenPassword(label: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY) {
      reject(new Error("Password required via TTY prompt or --password-stdin."));
      return;
    }
    stderr.write(label);
    stdin.setRawMode?.(true);
    stdin.resume();
    const rl = createInterface({ input: stdin, terminal: true });
    let value = "";
    const onData = (chunk: Buffer | string) => {
      const text = chunk.toString("utf8");
      if (text === "\u0003") {
        cleanup();
        reject(new Error("cancelled"));
        return;
      }
      if (text === "\n" || text === "\r") {
        cleanup();
        stderr.write("\n");
        resolve(value);
        return;
      }
      if (text === "\u0008" || text === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      if (text.length === 1 && text >= " ") {
        value += text;
      }
    };
    function cleanup(): void {
      stdin.off("data", onData);
      stdin.setRawMode?.(false);
      rl.close();
    }
    stdin.on("data", onData);
  });
}

export async function runDevProvisionCli(
  argv: readonly string[] = process.argv,
  env: NodeJS.ProcessEnv = process.env,
  input: NodeJS.ReadableStream = stdin,
): Promise<void> {
  assertDevProvisionSafe(env);
  rejectArgvPassword(argv);
  const cloudRoot = readArg(argv, "root");
  const displayName = readArg(argv, "org");
  const email = readArg(argv, "email");
  const password = await readProvisionPassword(argv, input);
  const controlPlane = openProvisionedControlPlane(cloudRoot);
  const { organization, paths } = await provisionOrganizationWithPlane(controlPlane, {
    displayName,
    bootstrapPolicy: "NEW_ORGANIZATION",
  });
  const user = await provisionCloudUser(controlPlane, { email, password });
  provisionMembership(controlPlane, {
    userId: user.userId,
    organizationId: organization.organizationId,
    role: "owner",
  });
  controlPlane.close();
  console.log("dev-helper: local Cloud setup only. Not Slice 3 adopt/production bootstrap.");
  console.log(`organization: ${organization.displayName}`);
  console.log(`user: ${user.email}`);
  console.log(`plane: ${paths.sqlitePath}`);
}

const invokedDirectly = process.argv[1]
  ? fileURLToPath(import.meta.url) === process.argv[1] ||
    process.argv[1].replaceAll("\\", "/").endsWith("devProvisionCli.ts")
  : false;

if (invokedDirectly) {
  await runDevProvisionCli();
}
