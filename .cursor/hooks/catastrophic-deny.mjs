import { writeHookAudit } from "./lib/audit-write.mjs";

try {
  writeHookAudit({
    event: "beforeShellExecution",
    permission: "deny",
    category: "catastrophic",
  });
} catch {
  // Audit failure must not prevent the hard deny.
}

process.stdout.write(
  `${JSON.stringify({
    permission: "deny",
    agent_message: "Catastrophic shell operation blocked by WorkOS Harness.",
  })}\n`,
);
