/**
 * Vitest must never inherit a developer WORKOS_SQLITE_PATH that points at a
 * real DEV database. Force in-memory SQLite for the default createApp() path.
 */
delete process.env.WORKOS_SQLITE_PATH;

if (!process.env.VITEST) {
  process.env.VITEST = "true";
}
