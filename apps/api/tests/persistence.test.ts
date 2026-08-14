import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { seedDisplayLabelRecords } from "@workos-final/domain";
import { applyMigrations, openSqliteDatabase } from "../src/persistence/sqlite.js";
import { createProductSystemRuntime } from "../src/productSystem/runtime.js";

const temps: string[] = [];

afterEach(() => {
  for (const dir of temps.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function tempSqlitePath(): string {
  const dir = mkdtempSync(join(tmpdir(), "workos-ps-"));
  temps.push(dir);
  return join(dir, "product-system.sqlite");
}

describe("product system persistence", () => {
  it("bootstraps seeds on an empty store and does not overwrite edits on reopen", () => {
    const sqlitePath = tempSqlitePath();
    const first = createProductSystemRuntime(sqlitePath);
    expect(first.present().admin.families[0]?.label).toBe(
      seedDisplayLabelRecords().find((item) => item.entityKind === "PRODUCT_FAMILY")
        ?.displayLabel,
    );
    const written = first.updateDisplayLabel(
      "PRODUCT_FAMILY",
      "LIGHTED_VOLUMETRIC_SIGNS",
      "Familie persistată",
      1,
    );
    expect(written.ok).toBe(true);
    first.close();

    const second = createProductSystemRuntime(sqlitePath);
    expect(second.present().admin.families[0]?.label).toBe("Familie persistată");
    expect(second.present().admin.families[0]?.id).toBe("LIGHTED_VOLUMETRIC_SIGNS");
    expect(second.present().admin.families[0]?.displayRevision).toBe(2);
    second.close();
  });

  it("applies migrations from empty and again without drift", () => {
    const sqlitePath = tempSqlitePath();
    const first = openSqliteDatabase(sqlitePath);
    applyMigrations(first);
    const count = first
      .prepare("SELECT COUNT(*) AS count FROM schema_migrations")
      .get() as { count: number };
    expect(count.count).toBe(1);
    first.close();

    const second = openSqliteDatabase(sqlitePath);
    applyMigrations(second);
    const again = second
      .prepare("SELECT COUNT(*) AS count FROM schema_migrations")
      .get() as { count: number };
    expect(again.count).toBe(1);
    second.close();
  });
});
