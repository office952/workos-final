# OLD /execution source proof

Read-only. Isolated demo DB copy under `.tmp/ui-ux-audit-v1/old-runtime`. No writes.

## Router

`C:/w/psiso/frontend/src/App.tsx`:

- `/execution` → `ExecutionDashboard`
- `/execution/reality-review`, `/execution/ops-graph`, `/execution/machine-runs` are more specific siblings
- `/execution/:order_id` → `ExecutionDetail`

`ExecutionDetail` parses `order_id` with `Number.parseInt`. A non-positive or non-integer path (for example `/execution/DEMO-ORDER-001`) sets `validOrderId=false` and shows `ID-ul comenzii este invalid.` It does not invent a populated workspace.

## Runtime fixture (GET only)

Isolated `GET /api/v1/execution/dashboard` returned:

```text
order_id=1
order_code=DEMO-ORDER-001
plan_status=present
reality_status=present
```

`GET /api/v1/execution/observability/1` returned `has_order=true`, `has_plan=true`, `has_reality=true`.

That is enough to open `/execution/1` without `POST /plan/from-order` or any Start/Stop write.

`GET /api/v1/execution/observability/99999` returns `has_order=false` / `order_missing`. A populated detail cannot be manufactured from an empty order without writing demo data. The isolated copy already has `DEMO-ORDER-001`, so the empty path was not required.

## Captures

| Screen | URL | Visible assertion |
| --- | --- | --- |
| `execution-dashboard` | `/execution` | `Execuție` + `Comenzi în execuție` + `DEMO-ORDER-001` |
| `execution-detail` | `/execution/1` | `Rezultat execuție` + `DEMO-ORDER-001` |
