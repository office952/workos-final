# UI/UX audit V1 — evidence index

Independent review should start here, then open the source reconciliation, then walk screenshots page by page.

This is the **corrected** pack. The first archive sidecar `b7343825…` is withdrawn.

## Pack

| Item | Path |
| --- | --- |
| Report | `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1.md` |
| Screenshot manifest | `docs/worklog/ui-ux-audit-v1/screenshot-manifest.csv` |
| Source route inventory | `docs/worklog/ui-ux-audit-v1/source-route-inventory.csv` |
| Source-to-manifest reconciliation | `docs/worklog/ui-ux-audit-v1/source-to-manifest-reconciliation.md` |
| OLD /execution source proof | `docs/worklog/ui-ux-audit-v1/old-execution-source-proof.md` |
| Historical Machine Strict provenance | `docs/worklog/ui-ux-audit-v1/historical-machine-strict-provenance.md` |
| Capture harness | `docs/worklog/ui-ux-audit-v1/harness/` |
| OLD screenshots | `docs/worklog/screenshots/ui-ux-audit-v1/old/` |
| NEW screenshots | `docs/worklog/screenshots/ui-ux-audit-v1/new/` |
| Archive | `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1_EVIDENCE.zip` |
| Archive SHA-256 | external sidecar only: `docs/worklog/WORKOS_FULL_OLD_NEW_UI_UX_AUDIT_V1_EVIDENCE.zip.sha256` |

```text
CAPTURED_ROWS          = 283
NEW_PNG                = 157
OLD_PNG                = 126
UNEXPLAINED_ROUTE_GAPS = 0
INDEPENDENT_REVIEW     = PASS
EVIDENCE_PACK          = ACCEPTED
DYNAMIC_EMPLOYEE_MOBILE_ROUTES =
EXPLICITLY_DEFERRED_OUTSIDE_DESKTOP_V1_AUDIT
HISTORICAL_MACHINE_STRICT_PIXELS =
REFERENCE_ONLY_NOT_PART_OF_ACCEPTED_283_PNG_PACK
```

Superseded first-pack files (do not use for coverage claims): `route-manifest.csv`, `route-inventory-reconciliation.txt`.

## How to read a screenshot row

`screenshot-manifest.csv` columns: app, route, screen_id, state, role, runtime_fixture, viewport, region, file, sha256, visible_assertion, route_assertion, problems, status.

Filename pattern: `{screen_id}__{state}__{viewport}__{region}.png` (portable ASCII).

Long pages also have `__top`, `__mid`, `__bottom` crops.

## Suggested review order

1. NEW shell: `jobs-overview`, `atelier-inbox` (empty and session-populated), `requests-overview`, `quotes-overview`, `clients-overview`, `product-catalog`, `admin-home`.
2. NEW Product System question: `product-catalog` vs `admin-product-system` vs `components-inspection` vs `product-config-letters-edit`.
3. NEW commercial spine: letters/ACM edit → confirmed → quote → order → execution.
4. NEW cloud gate: `cloud-login__empty-form`, `cloud-login__invalid-credentials`.
5. NEW people (synthetic in this pack only; authorized production People UI may show real staff): `admin-people-list__synthetic-populated`, `admin-person-detail__synthetic-populated`, `admin-seller__synthetic-legal-name-only`, `admin-skills__synthetic-populated`.
6. NEW operator states: invalid PIN, eligible session, machine-blocked execution, ineligible operator, narrow resources rail.
7. OLD execution: `execution-dashboard__direct-demo-populated`, `execution-detail__demo-order-001-populated`.
8. OLD shell/IA: `atelier-overview`, `product-system-catalog`, `cereri-list`, `oferte-detail`, `angajati-registry`.
9. OLD Product System: studio local tabs, structure pages, Intake V6 workspace / standalone operator.
10. Compare NEW `/products` with OLD nav **Produse** (`/product-system/products`).

## Do not treat as visual blueprint

OLD screenshots are operational evidence. Do not copy the sidebar, COMPAT/AUDIT badges, or mega-settings page into WorkOS Final.

## Withdrawn files

Do not restore first-pack seller/people/skills leaks, LoginGate duplicates, or diacritic filenames.

## Duplicate hashes

1. NEW Product System vs Components category-walk bottoms — same long-page tail, different routes.
2. NEW execution ineligible vs machine-blocked bottoms — same task-list tail.
3. NEW execution ineligible vs machine-blocked mids — same mid-list crop.
