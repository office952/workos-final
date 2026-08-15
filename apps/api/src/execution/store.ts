import {
  assignProviderToTask,
  assignedProviderFromRow,
  completeExecutionTask,
  startExecutionTask,
  type ExecutionPlan,
  type ExecutionPlanRecord,
  type ExecutionTask,
  type TaskMutationResult,
} from "@workos-final/domain";
import type { SqliteDatabase } from "../persistence/sqlite.js";

type PlanRow = {
  plan_id: string;
  source_snapshot_id: string;
  source_snapshot_hash: string;
  product_code: string;
  product_label: string;
  inscription: string;
  created_at: string;
  status: ExecutionPlan["status"];
  schema_version: number;
  task_count: number;
  eic_total: number;
  eic_currency: "EUR";
  eic_completeness: ExecutionPlan["eicCompleteness"];
};

type TaskRow = {
  task_id: string;
  plan_id: string;
  source_operation_id: string;
  process_id: string;
  process_label: string;
  scope: string;
  scope_label: string;
  seq: number;
  seq_label: string;
  required_capability_id: string;
  required_capability_label: string;
  status: ExecutionTask["status"];
  created_at: string;
  quantities_json: string;
  resources_json: string;
  assigned_provider_id: string | null;
  assigned_provider_kind: string | null;
  assigned_provider_label: string | null;
  started_at: string | null;
  completed_at: string | null;
};

type DependencyRow = {
  task_id: string;
  depends_on_task_id: string;
};

export function insertExecutionPlanRecord(
  db: SqliteDatabase,
  record: ExecutionPlanRecord,
): { created: boolean; record: ExecutionPlanRecord } {
  const existing = getExecutionPlanBySnapshotId(db, record.plan.sourceSnapshotId);
  if (existing) {
    return { created: false, record: existing };
  }

  const persist = db.transaction(() => {
    db.prepare(
      `
      INSERT INTO execution_plans (
        plan_id,
        source_snapshot_id,
        source_snapshot_hash,
        product_code,
        product_label,
        inscription,
        created_at,
        status,
        schema_version,
        task_count,
        eic_total,
        eic_currency,
        eic_completeness
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      record.plan.planId,
      record.plan.sourceSnapshotId,
      record.plan.sourceSnapshotHash,
      record.plan.productCode,
      record.plan.productLabel,
      record.plan.inscription,
      record.plan.createdAt,
      record.plan.status,
      record.plan.schemaVersion,
      record.plan.taskCount,
      record.plan.eicTotal,
      record.plan.eicCurrency,
      record.plan.eicCompleteness,
    );

    const insertTask = db.prepare(
      `
      INSERT INTO execution_tasks (
        task_id,
        plan_id,
        source_operation_id,
        process_id,
        process_label,
        scope,
        scope_label,
        seq,
        seq_label,
        required_capability_id,
        required_capability_label,
        status,
        created_at,
        quantities_json,
        resources_json,
        assigned_provider_id,
        assigned_provider_kind,
        assigned_provider_label,
        started_at,
        completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    );
    const insertDependency = db.prepare(
      `
      INSERT INTO execution_task_dependencies (
        plan_id,
        task_id,
        depends_on_task_id
      ) VALUES (?, ?, ?)
    `,
    );

    for (const task of record.tasks) {
      insertTask.run(
        task.taskId,
        task.executionPlanId,
        task.sourceOperationId,
        task.processId,
        task.processLabel,
        task.scope,
        task.scopeLabel,
        task.seq,
        task.seqLabel,
        task.requiredCapabilityId,
        task.requiredCapabilityLabel,
        task.status,
        task.createdAt,
        JSON.stringify(task.quantities),
        JSON.stringify(task.resourceDemands),
        task.assignedProvider?.id ?? null,
        task.assignedProvider?.kind ?? null,
        task.assignedProvider?.label ?? null,
        task.startedAt,
        task.completedAt,
      );
      for (const dependencyId of task.dependsOnTaskIds) {
        insertDependency.run(record.plan.planId, task.taskId, dependencyId);
      }
    }
  });
  persist();

  return { created: true, record };
}

export function getExecutionPlanRecord(
  db: SqliteDatabase,
  planId: string,
): ExecutionPlanRecord | null {
  const planRow = db
    .prepare(
      `
      SELECT *
      FROM execution_plans
      WHERE plan_id = ?
    `,
    )
    .get(planId) as PlanRow | undefined;
  if (!planRow) {
    return null;
  }
  return hydrateRecord(db, planRow);
}

export function getExecutionPlanBySnapshotId(
  db: SqliteDatabase,
  snapshotId: string,
): ExecutionPlanRecord | null {
  const planRow = db
    .prepare(
      `
      SELECT *
      FROM execution_plans
      WHERE source_snapshot_id = ?
    `,
    )
    .get(snapshotId) as PlanRow | undefined;
  if (!planRow) {
    return null;
  }
  return hydrateRecord(db, planRow);
}

export function getExecutionPlanByTaskId(
  db: SqliteDatabase,
  taskId: string,
): ExecutionPlanRecord | null {
  const row = db
    .prepare(
      `
      SELECT plan_id
      FROM execution_tasks
      WHERE task_id = ?
    `,
    )
    .get(taskId) as { plan_id: string } | undefined;
  if (!row) {
    return null;
  }
  return getExecutionPlanRecord(db, row.plan_id);
}

export function persistAssignedProvider(
  db: SqliteDatabase,
  taskId: string,
  providerId: string,
): TaskMutationResult {
  return applyMutation(db, taskId, (record) =>
    assignProviderToTask(record, taskId, providerId),
  );
}

export function persistTaskStart(
  db: SqliteDatabase,
  taskId: string,
  startedAt: string,
): TaskMutationResult {
  return applyMutation(db, taskId, (record) =>
    startExecutionTask(record, taskId, startedAt),
  );
}

export function persistTaskComplete(
  db: SqliteDatabase,
  taskId: string,
  completedAt: string,
): TaskMutationResult {
  return applyMutation(db, taskId, (record) =>
    completeExecutionTask(record, taskId, completedAt),
  );
}

function applyMutation(
  db: SqliteDatabase,
  taskId: string,
  mutate: (record: ExecutionPlanRecord) => TaskMutationResult,
): TaskMutationResult {
  const run = db.transaction((): TaskMutationResult => {
    const record = getExecutionPlanByTaskId(db, taskId);
    if (!record) {
      return { ok: false, error: "not_found" };
    }
    const result = mutate(record);
    if (!result.ok || result.alreadyApplied) {
      return result;
    }
    const next = result.record.tasks.find((task) => task.taskId === taskId);
    if (!next) {
      return { ok: false, error: "not_found" };
    }
    const written = writeTaskOperationalState(db, next, record.tasks.find((task) => task.taskId === taskId));
    if (!written) {
      const current = getExecutionPlanByTaskId(db, taskId);
      if (!current) {
        return { ok: false, error: "not_found" };
      }
      return mutate(current);
    }
    const stored = getExecutionPlanByTaskId(db, taskId);
    if (!stored) {
      return { ok: false, error: "not_found" };
    }
    return { ok: true, alreadyApplied: false, record: stored };
  });
  return run();
}

function writeTaskOperationalState(
  db: SqliteDatabase,
  next: ExecutionTask,
  previous: ExecutionTask | undefined,
): boolean {
  const result = db
    .prepare(
      `
      UPDATE execution_tasks
      SET
        assigned_provider_id = ?,
        assigned_provider_kind = ?,
        assigned_provider_label = ?,
        status = ?,
        started_at = ?,
        completed_at = ?
      WHERE task_id = ?
        AND status = ?
        AND IFNULL(assigned_provider_id, '') = ?
        AND IFNULL(started_at, '') = ?
        AND IFNULL(completed_at, '') = ?
    `,
    )
    .run(
      next.assignedProvider?.id ?? null,
      next.assignedProvider?.kind ?? null,
      next.assignedProvider?.label ?? null,
      next.status,
      next.startedAt,
      next.completedAt,
      next.taskId,
      previous?.status ?? next.status,
      previous?.assignedProvider?.id ?? "",
      previous?.startedAt ?? "",
      previous?.completedAt ?? "",
    );
  return result.changes === 1;
}

function hydrateRecord(db: SqliteDatabase, planRow: PlanRow): ExecutionPlanRecord {
  const taskRows = db
    .prepare(
      `
      SELECT *
      FROM execution_tasks
      WHERE plan_id = ?
      ORDER BY seq
    `,
    )
    .all(planRow.plan_id) as TaskRow[];
  const dependencyRows = db
    .prepare(
      `
      SELECT task_id, depends_on_task_id
      FROM execution_task_dependencies
      WHERE plan_id = ?
    `,
    )
    .all(planRow.plan_id) as DependencyRow[];
  const dependencies = new Map<string, string[]>();
  for (const row of dependencyRows) {
    const current = dependencies.get(row.task_id) ?? [];
    current.push(row.depends_on_task_id);
    dependencies.set(row.task_id, current);
  }

  return {
    plan: {
      planId: planRow.plan_id,
      sourceSnapshotId: planRow.source_snapshot_id,
      sourceSnapshotHash: planRow.source_snapshot_hash,
      productCode: planRow.product_code,
      productLabel: planRow.product_label,
      inscription: planRow.inscription,
      createdAt: planRow.created_at,
      status: planRow.status,
      taskCount: planRow.task_count,
      schemaVersion: 1 as const,
      eicTotal: planRow.eic_total,
      eicCurrency: planRow.eic_currency,
      eicCompleteness: planRow.eic_completeness,
    },
    tasks: taskRows.map((row) => ({
      taskId: row.task_id,
      executionPlanId: row.plan_id,
      sourceOperationId: row.source_operation_id,
      processId: row.process_id,
      processLabel: row.process_label,
      scope: row.scope,
      scopeLabel: row.scope_label,
      seq: row.seq,
      seqLabel: row.seq_label,
      dependsOnTaskIds: dependencies.get(row.task_id) ?? [],
      requiredCapabilityId: row.required_capability_id,
      requiredCapabilityLabel: row.required_capability_label,
      status: row.status,
      quantities: JSON.parse(row.quantities_json) as ExecutionTask["quantities"],
      resourceDemands: JSON.parse(row.resources_json) as ExecutionTask["resourceDemands"],
      assignedProvider: assignedProviderFromRow(
        row.assigned_provider_id,
        row.assigned_provider_kind,
        row.assigned_provider_label,
      ),
      startedAt: row.started_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
    })),
  };
}
