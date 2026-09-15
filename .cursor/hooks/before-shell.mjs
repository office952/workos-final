import {
  classifyShellCommand,
  finalizeHookDecision,
  REFORMULATE_AGENT_MESSAGE,
} from "./lib/classify-shell.mjs";
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
  const safe = finalizeHookDecision(decision);
  process.stdout.write(
    `${JSON.stringify({
      permission: safe.permission,
      agent_message: safe.agentMessage,
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
    // Audit failure must not drop a deny decision.
  }
}

const parsed = parseHookInput(await readStdin());
if (!parsed.ok) {
  const decision = finalizeHookDecision({
    permission: "deny",
    category: "uncertain",
    agentMessage: REFORMULATE_AGENT_MESSAGE,
  });
  emit(decision);
  audit(decision);
  process.exit(0);
}

const reportedCwd =
  typeof parsed.value.cwd === "string" ? parsed.value.cwd.trim() : "";
const decision = finalizeHookDecision(
  classifyShellCommand(
    typeof parsed.value.command === "string" ? parsed.value.command : "",
    {
      cwd: reportedCwd.length > 0 ? reportedCwd : process.cwd(),
    },
  ),
);
emit(decision);
audit(decision);
