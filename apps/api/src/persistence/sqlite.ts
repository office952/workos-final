import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

export type SqliteDatabase = InstanceType<typeof Database>;

const MIGRATIONS_DIR = fileURLToPath(new URL("./migrations", import.meta.url));

/**
 * Canonical WorkOS application data root.
 * SQLite and document bytes both live under this boundary (unless SQLITE_PATH overrides DB).
 */
export function resolveWorkosDataDir(): string {
  if (process.env.WORKOS_DATA_DIR) {
    const dataDir = process.env.WORKOS_DATA_DIR;
    mkdirSync(dataDir, { recursive: true });
    return dataDir;
  }
  const dataDir = join(process.cwd(), "data");
  mkdirSync(dataDir, { recursive: true });
  return dataDir;
}

export function resolveProductSystemSqlitePath(): string {
  if (process.env.VITEST) {
    return ":memory:";
  }
  if (process.env.WORKOS_SQLITE_PATH) {
    return process.env.WORKOS_SQLITE_PATH;
  }
  return join(resolveWorkosDataDir(), "product-system.sqlite");
}

export function openSqliteDatabase(filePath: string): SqliteDatabase {
  if (filePath !== ":memory:") {
    mkdirSync(dirname(filePath), { recursive: true });
  }
  const db = new Database(filePath);
  db.pragma("foreign_keys = ON");
  if (filePath !== ":memory:") {
    db.pragma("journal_mode = WAL");
  }
  applyMigrations(db);
  return db;
}

export function applyMigrations(db: SqliteDatabase): void {
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

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    db.exec(sql);
    db.prepare(
      "INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)",
    ).run(file, new Date().toISOString());
  }
}
