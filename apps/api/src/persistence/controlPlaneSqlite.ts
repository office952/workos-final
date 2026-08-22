import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import type { SqliteDatabase } from "./sqlite.js";

const CONTROL_PLANE_MIGRATIONS_DIR = fileURLToPath(
  new URL("./control-plane-migrations", import.meta.url),
);

export function resolveControlPlaneSqlitePath(cloudRoot: string): string {
  return join(cloudRoot, "control", "control-plane.sqlite");
}

export function openControlPlaneDatabase(filePath: string): SqliteDatabase {
  if (filePath !== ":memory:") {
    mkdirSync(dirname(filePath), { recursive: true });
  }
  const db = new Database(filePath);
  db.pragma("foreign_keys = ON");
  if (filePath !== ":memory:") {
    db.pragma("journal_mode = WAL");
  }
  applyControlPlaneMigrations(db);
  return db;
}

export function applyControlPlaneMigrations(db: SqliteDatabase): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = new Set(
    db
      .prepare("SELECT id FROM schema_migrations")
      .all()
      .map((row) => (row as { id: string }).id),
  );

  const files = readdirSync(CONTROL_PLANE_MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }
    const sql = readFileSync(join(CONTROL_PLANE_MIGRATIONS_DIR, file), "utf8");
    db.transaction(() => {
      db.exec(sql);
      db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)").run(
        file,
        new Date().toISOString(),
      );
    })();
  }
}
