import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const AUDIT_DIR = join(process.cwd(), ".tmp", "cursor-hooks-audit");

export function createAuditRecord(input) {
  const record = {
    timestamp:
      typeof input.timestamp === "string"
        ? input.timestamp
        : new Date().toISOString(),
    event: String(input.event ?? "unknown"),
    permission: input.permission ?? null,
    category: input.category ?? null,
  };
  if (typeof input.subagent_type === "string" && input.subagent_type.length > 0) {
    record.subagent_type = input.subagent_type;
  }
  if (typeof input.status === "string" && input.status.length > 0) {
    record.status = input.status;
  }
  return record;
}

export function writeHookAudit(input) {
  mkdirSync(AUDIT_DIR, { recursive: true });
  const record = createAuditRecord(input);
  appendFileSync(join(AUDIT_DIR, "audit.jsonl"), `${JSON.stringify(record)}\n`);
  return record;
}
