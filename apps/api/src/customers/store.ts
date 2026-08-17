import {
  createCustomer,
  customerFromRow,
  renameCustomer,
  retireCustomer,
  type Customer,
  type CustomerMutationResult,
} from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";

type CustomerRow = {
  customer_id: string;
  display_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  retired_at: string | null;
};

export function listCustomers(db: SqliteDatabase): Customer[] {
  const rows = db
    .prepare(
      `
      SELECT customer_id, display_name, status, created_at, updated_at, retired_at
      FROM customers
      ORDER BY display_name COLLATE NOCASE
    `,
    )
    .all() as CustomerRow[];
  return rows.flatMap((row) => {
    const customer = customerFromRow(
      row.customer_id,
      row.display_name,
      row.status,
      row.created_at,
      row.updated_at,
      row.retired_at,
    );
    return customer ? [customer] : [];
  });
}

export function getCustomer(db: SqliteDatabase, customerId: string): Customer | null {
  const row = db
    .prepare(
      `
      SELECT customer_id, display_name, status, created_at, updated_at, retired_at
      FROM customers
      WHERE customer_id = ?
    `,
    )
    .get(customerId) as CustomerRow | undefined;
  if (!row) {
    return null;
  }
  return customerFromRow(
    row.customer_id,
    row.display_name,
    row.status,
    row.created_at,
    row.updated_at,
    row.retired_at,
  );
}

export function persistCreatedCustomer(
  db: SqliteDatabase,
  displayName: string,
): CustomerMutationResult {
  const created = createCustomer(displayName);
  if (!created.ok) {
    return created;
  }
  db.prepare(
    `
    INSERT INTO customers (
      customer_id, display_name, status, created_at, updated_at, retired_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  ).run(
    created.customer.customerId,
    created.customer.displayName,
    created.customer.status,
    created.customer.createdAt,
    created.customer.updatedAt,
    created.customer.retiredAt,
  );
  return created;
}

export function persistRenamedCustomer(
  db: SqliteDatabase,
  customerId: string,
  displayName: string,
): CustomerMutationResult {
  const current = getCustomer(db, customerId);
  if (!current) {
    return { ok: false, error: "not_found" };
  }
  const renamed = renameCustomer(current, displayName);
  if (!renamed.ok || renamed.alreadyApplied) {
    return renamed;
  }
  db.prepare(
    `
    UPDATE customers
    SET display_name = ?, updated_at = ?
    WHERE customer_id = ?
  `,
  ).run(renamed.customer.displayName, renamed.customer.updatedAt, customerId);
  return renamed;
}

export function persistRetiredCustomer(
  db: SqliteDatabase,
  customerId: string,
  retiredAt: string,
): CustomerMutationResult {
  const current = getCustomer(db, customerId);
  if (!current) {
    return { ok: false, error: "not_found" };
  }
  const retired = retireCustomer(current, retiredAt);
  if (!retired.ok || retired.alreadyApplied) {
    return retired;
  }
  db.prepare(
    `
    UPDATE customers
    SET status = ?, updated_at = ?, retired_at = ?
    WHERE customer_id = ?
  `,
  ).run(
    retired.customer.status,
    retired.customer.updatedAt,
    retired.customer.retiredAt,
    customerId,
  );
  return retired;
}
