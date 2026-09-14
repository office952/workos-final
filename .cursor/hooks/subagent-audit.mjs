import { parseHookInput } from "./lib/parse-hook-input.mjs";
import { writeHookAudit } from "./lib/audit-write.mjs";

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const parsed = parseHookInput(await readStdin());
const event =
  parsed.ok && typeof parsed.value.hook_event_name === "string"
    ? parsed.value.hook_event_name
    : "subagent";
const subagentType =
  parsed.ok && typeof parsed.value.subagent_type === "string"
    ? parsed.value.subagent_type
    : undefined;
const status =
  parsed.ok && typeof parsed.value.status === "string"
    ? parsed.value.status
    : event === "subagentStop"
      ? "stopped"
      : "started";

writeHookAudit({
  event,
  permission: "allow",
  category: "subagent",
  subagent_type: subagentType,
  status,
});

if (event === "subagentStart") {
  process.stdout.write(`${JSON.stringify({ permission: "allow" })}\n`);
}
