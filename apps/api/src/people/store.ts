import {
  createPerson,
  personFromRow,
  renamePerson,
  retirePerson,
  type Person,
  type PersonMutationResult,
} from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";

type PersonRow = {
  person_id: string;
  display_name: string;
  status: string;
  created_at: string;
  retired_at: string | null;
};

export function listPeople(db: SqliteDatabase): Person[] {
  const rows = db
    .prepare(
      `
      SELECT person_id, display_name, status, created_at, retired_at
      FROM people
      ORDER BY display_name COLLATE NOCASE
    `,
    )
    .all() as PersonRow[];
  return rows.flatMap((row) => {
    const person = personFromRow(
      row.person_id,
      row.display_name,
      row.status,
      row.created_at,
      row.retired_at,
    );
    return person ? [person] : [];
  });
}

export function persistCreatedPerson(
  db: SqliteDatabase,
  displayName: string,
): PersonMutationResult {
  const created = createPerson(displayName);
  if (!created.ok) {
    return created;
  }
  db.prepare(
    `
    INSERT INTO people (person_id, display_name, status, created_at, retired_at)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(
    created.person.personId,
    created.person.displayName,
    created.person.status,
    created.person.createdAt,
    created.person.retiredAt,
  );
  return created;
}

export function persistRenamedPerson(
  db: SqliteDatabase,
  personId: string,
  displayName: string,
): PersonMutationResult {
  const current = getPerson(db, personId);
  if (!current) {
    return { ok: false, error: "not_found" };
  }
  const renamed = renamePerson(current, displayName);
  if (!renamed.ok || renamed.alreadyApplied) {
    return renamed;
  }
  db.prepare(
    `
    UPDATE people
    SET display_name = ?
    WHERE person_id = ?
  `,
  ).run(renamed.person.displayName, personId);
  return renamed;
}

export function persistRetiredPerson(
  db: SqliteDatabase,
  personId: string,
  retiredAt: string,
): PersonMutationResult {
  const current = getPerson(db, personId);
  if (!current) {
    return { ok: false, error: "not_found" };
  }
  const retired = retirePerson(current, retiredAt);
  if (!retired.ok || retired.alreadyApplied) {
    return retired;
  }
  db.prepare(
    `
    UPDATE people
    SET status = ?, retired_at = ?
    WHERE person_id = ?
  `,
  ).run(retired.person.status, retired.person.retiredAt, personId);
  return retired;
}

function getPerson(db: SqliteDatabase, personId: string): Person | null {
  const row = db
    .prepare(
      `
      SELECT person_id, display_name, status, created_at, retired_at
      FROM people
      WHERE person_id = ?
    `,
    )
    .get(personId) as PersonRow | undefined;
  if (!row) {
    return null;
  }
  return personFromRow(
    row.person_id,
    row.display_name,
    row.status,
    row.created_at,
    row.retired_at,
  );
}
