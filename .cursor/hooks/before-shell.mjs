import { classifyShellCommand } from "./lib/classify-shell.mjs";
import { parseHookInput } from "./lib/parse-hook-input.mjs";
import { writeHookAudit } from "./lib/audit-write.mjs";

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function emit(decision) {
  process.stdout.write(
    `${JSON.stringify({
      permission: decision.permission,
      agent_message: decision.agentMessage,
    })}\n`,
  );
}

function audit(decision) {
  try {
    writeHookAudit({
      event: "beforeShellExecution",
      permission: decision.permission,
      category: decision.category,
    });
  } catch {
    // Audit failure must not drop a deny/ask decision.
  }
}

const parsed = parseHookInput(await readStdin());
if (!parsed.ok) {
  const decision = {
    permission: "deny",
    category: "uncertain",
    agentMessage:
      "Shell command could not be parsed safely. Reformulate as a direct supported command.",
  };
  emit(decision);
  audit(decision);
  process.exit(0);
}

const reportedCwd =
  typeof parsed.value.cwd === "string" ? parsed.value.cwd.trim() : "";
const decision = classifyShellCommand(
  typeof parsed.value.command === "string" ? parsed.value.command : "",
  {
    cwd: reportedCwd.length > 0 ? reportedCwd : process.cwd(),
  },
);
emit(decision);
audit(decision);
