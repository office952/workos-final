# WorkOS Cloud Foundation V1 — Slice 3

Status: PASS on `feat/workos-cloud-foundation-v1`. Owner GO authorized bootstrap-policy honesty, organization-scoped provider isolation, generic ADOPT_EXISTING machinery, and one residual Slice 1+2 HTTP shutdown close. Real HUB MEDIA adoption and TEST COMPANY full isolation stay later.

```text
SLICE_3 = PASS
SHUTDOWN_SERVER_CLOSE = PASS
BOOTSTRAP_POLICY_RUNTIME_AUTHORITY = YES
ADOPT_EXISTING_RESEEDS_BUSINESS_TRUTH = NO
NEW_ORG_HUB_SELLER_LEAK = NO
NEW_ORG_HUB_PEOPLE_LEAK = NO
NEW_ORG_OWNER_CONFIRMED_COST_LEAK = NO
NEW_ORG_COST_EDITABLE_WITHOUT_CURSOR = YES
NEW_ORG_SELLER_CONFIGURABLE_WITHOUT_CURSOR = YES
NEW_ORG_PEOPLE_CONFIGURABLE_WITHOUT_CURSOR = YES
NEW_ORG_HUB_PROVIDER_LEAK = NO
RUNTIME_PROVIDER_REGISTRY_EXPLICIT = YES
HUB_MACHINE_ASSIGNABLE_FROM_NEW_ORG = NO
ADOPT_DRY_RUN_WRITES = 0
SYNTHETIC_ADOPT_SOURCE_MUTATIONS = 0
SYNTHETIC_ADOPT_PRESERVES_IDS_AND_FROZEN_HASHES = YES
REAL_HUB_MEDIA_ADOPTION = NOT_EXECUTED
CANONICAL_HUB_MEDIA_PILOT_DATASET = NOT_CONFIRMED
TEST_COMPANY_FULL_PROOF = NOT_STARTED
FULL_CLOUD_FOUNDATION = NOT_YET
FULL_ORGANIZATION_ISOLATION = NOT_YET
CUSTOMER_NEEDS_CURSOR_FOR_NORMAL_CONFIGURATION = NO_AS_DESTINATION
ORG_EQUIPMENT_SELF_CONFIGURATION = LATER
COMMERCIAL_POLICY_SELF_CONFIGURATION = LATER
SUPPLIERS = LATER
HR = LATER
OVERHEAD = LATER
PRODUCT_MODULE_ACTIVATION = LATER
FOUNDATION_SCOPE_EXPLODED = NO
```

## What shipped

- Residual Slice 1+2: `serve()` server is captured. SIGINT/SIGTERM and `started.close()` stop the HTTP listener first, then close RuntimeRegistry + Control Plane (or single-plane runtime) exactly once.
- `OperationalPlaneDescriptor.bootstrapPolicy` is runtime authority in Cloud mode. It is never read from client input. Single-plane remains explicit `LEGACY_SINGLE_PLANE` / missing policy, not Cloud authority.
- `ADOPT_EXISTING`: no cost/people/seller reseed on open. Provider registry is the current curated HUB MEDIA stand-in, resolved from policy, not organization name.
- `NEW_ORGANIZATION`: empty People, unconfigured seller, platform-curated cost rows as `PLATFORM_DEFAULT` / `DEVELOPMENT_DEFAULT`, empty workcenter registry. Owner can configure Date firmă, edit a cost, and add a Person through existing admin surfaces.
- `SYNTHETIC_TEST`: explicit synthetic / empty truth only. No HUB seller, people, OWNER_CONFIRMED rates, or HUB equipment ids.
- Seller GET is read-only. Lazy HUB MEDIA seed is single-plane only (`lazyHubSeed: true`). Quote freeze before seller configuration returns 422 `seller_unconfigured`.
- First owner cost edit still appends + supersedes; the new row is `OWNER_CONFIRMED` with purchase/workshop source in that Organization only.
- `ProductSystemRuntime.providerRegistry` is required on Cloud request open. `GET /api/workcenters`, eligibility, assignment, and plan projection use the same registry.
- Generic `ADOPT_EXISTING` machinery (`cloud:adopt`): CLI only, absolute source paths, reject Cloud-root / relative / non-ADOPT planes. Dry-run writes 0. Execute: backup → stage → SQLite backup API from readonly source → migrate + bind destination only → verify → promote. Failed pre-promote adopt removes staging and the plane row.
- Synthetic adopt proof only. Real HUB MEDIA dataset remains unconfirmed and was not opened.

## Shutdown proof

- `apps/api/tests/api-shutdown.test.ts`: start → `close()` → listener refuses; SIGTERM handler order HTTP then resources once; child self-emits SIGTERM and exits 0. Windows `child.kill("SIGTERM")` is TerminateProcess and is not used as proof.
- Isolated QA proof `.tmp/qa-slice3-shutdown-proof.mts`: `startWorkosApi({ installSignals: false })` on port `50158`, health 200, `close()`, subsequent fetch refused.

## Screenshots

Synthetic `NEW_ORGANIZATION` planes only (`Firma Goala QA` unconfigured, `Firma Noua QA` after owner writes). Routes under `/admin/*`.

1. Date firmă unconfigured desktop: `docs/worklog/screenshots/slice3-seller-unconfigured.png` — `/admin/seller`, empty fields, lead „Datele firmei nu sunt configurate…”
2. Date firmă unconfigured 390 px: `docs/worklog/screenshots/slice3-seller-unconfigured-390.png`
3. Date firmă after owner first save: `docs/worklog/screenshots/slice3-seller-after-save.png` — `/admin/seller`, „Vânzător curent: Atelier QA SRL”
4. Resources platform-default desktop: `docs/worklog/screenshots/slice3-resources-platform-default.png` — `/admin/resources`, Plexiglas 3 mm opal 16,00 EUR / m², chips „Default de dezvoltare” + „Valoare implicită de platformă”
5. Resources after owner confirm: `docs/worklog/screenshots/slice3-resources-owner-confirmed.png` — same route, 19,50 EUR / m², „Confirmat de owner” / „Achiziție confirmată de owner”
6. Resources 390 px: `docs/worklog/screenshots/slice3-resources-390.png`
7. People empty: `docs/worklog/screenshots/slice3-people-empty.png` — `/admin/people`, Activi 0
8. People after first add: `docs/worklog/screenshots/slice3-people-first-person.png` — Ana Noua
9. Workcenters empty: `docs/worklog/screenshots/slice3-workcenters-empty.png` — `/admin/workcenters`, Zone 0 · Utilaje 0, no `MCH-CNC-4020`

UI opinion: Date firmă and Resources communicate unconfigured / default-vs-confirmed truth clearly in Romanian without exposing hashes or DTO names. Workcenters honestly show capability vocabulary without inventing HUB machines. Equipment self-configuration remains later.

## Tests / QA

- Targeted Slice 3: `cloud-bootstrap-policy`, `cloud-adopt`, `cloud-provider-isolation`, `api-shutdown`.
- API suite 32 files / 156 passed. Web suite 30 files / 87 passed. Domain provider / lifecycle / seller / people / resources aligned. Domain, API, web typecheck passed.
- Isolated QA: `WORKOS_CLOUD_ROOT=%TEMP%\workos-cloud-foundation-qa-s3`, API `127.0.0.1:8803`, web `127.0.0.1:5185`. Owner login, seller unconfigured → first save, platform default → owner-confirmed plexi, empty People → Ana Noua, workcenters without HUB equipment, logout to Autentificare. Console: favicon 404 only. Residual assign of `MCH-CNC-4020` on NEW org is 422 `ineligible_provider` in the provider-isolation test.
- React Doctor on changed web files: 76/100. Findings are pre-existing (`LoginPage`, `OperatorSessionContext`, `PersonAdminPage`). No Slice 3 React cleanup.

## Security review

Independent READ-ONLY after implementation. No new P1/P2 introduced by this Slice.

| Attack | Result |
| --- | --- |
| Bootstrap policy spoofing | Policy lives on Control Plane descriptor. HTTP has no bootstrap field. Cloud request open fails closed without trusted policy + registry. |
| NEW org HUB seller / people / OWNER_CONFIRMED | GET seller does not write. Trusted workforce gated to missing/single-plane policy. Cost seed rewrites source/classification. Tests prove it. |
| TEST/NEW `MCH-CNC-4020` + manual payload | Empty registry. Assignment 422 `ineligible_provider`. Projection has no HUB id. |
| Global workcenter fallback | Cloud production path always injects runtime registry. Domain default remains test/legacy seam only. |
| Adopt relative / Cloud-root / source mutation | Rejected. Source hash unchanged. Identity bound on destination only. |
| Partial adopt left ACTIVE | Pre-promote failure deletes staging/dest and `removePlane`. |
| Dry-run writes | No backup, no dest, no CP mutation. |
| Shutdown regression | Listener closes before SQLite/runtime close. |

Residual Foundation limits (not defects): `ADOPT_EXISTING` maps to the current HUB registry by policy, not by org name; Machine Admin is not authorized; leftover adopt backups are not ACTIVE planes.

## Dead pieces

| Piece | Class |
| --- | --- |
| Universal seller lazy HUB seed | LEGACY_SINGLE_PLANE (Cloud never) |
| Trusted workforce in `createProductSystemRuntime` | LEGACY_SINGLE_PLANE / gated |
| Implicit global `GET /api/workcenters` | replaced by runtime registry |
| `--password` argv | DEAD (Slice 1+2) |
| Shutdown that discarded `serve()` | replaced |
| HUB MEDIA cost/people constants | HISTORICAL_EVIDENCE / single-plane catalog |

## Out of scope

Real HUB MEDIA dataset adopt, TEST COMPANY hostile matrix / Slice 4, first real HUB MEDIA Cloud account, main merge, PR, Postgres, Hub, billing, signup, HR/salary/leave/Pontaj, overhead, suppliers, Purchasing, Product Module Engine, Business Cards, Exhibition Stands, Machine Admin, Commercial Policy Admin.

## METODA DE LUCRU SI LOGICA ABORDARII

Research tracks were read-only and split: bootstrap/store truth, provider registry/execution, adopt/data safety, shutdown/runtime lifecycle, and tests/security. One orchestrator reconciled those findings. One implementation writer owned ProductSystemRuntime, bootstrap policy, the execution provider contract, provision/adopt, and this worklog. No subagent commits.

Bootstrap policy was the correct authority seam because the Control Plane already carried `ADOPT_EXISTING` / `NEW_ORGANIZATION` / `SYNTHETIC_TEST` as trusted plane metadata. Making that descriptor runtime law avoided a second settings engine and kept client input out of bootstrap.

Provider registry belongs on the runtime because eligibility, assignment, workcenter projection, and inbox blockers must share one Organization truth. Capability classes stay platform vocabulary. Empty NEW/SYNTHETIC registries make HUB machines unassignable without Machine Admin.

The adopt engine stayed generic: owner/CLI absolute paths plus trusted Control Plane state. No HUB MEDIA legal identity in the copy path. Source writers must be stopped; copy uses SQLite backup from a readonly handle. Identity and migrations happen on the staged destination only. Source hash/size stayed unchanged on synthetic proof.

NEW_ORGANIZATION costs are configurable `PLATFORM_DEFAULT` / `DEVELOPMENT_DEFAULT` rows, not fake `OWNER_CONFIRMED` truth, so a normal owner can enter the first cost through existing admin write without Cursor or SQL. That advances `CUSTOMER_NEEDS_CURSOR_FOR_NORMAL_CONFIGURATION = NO` as destination without Resource CRUD.

Slice 4 was not started: TEST COMPANY full hostile isolation, real HUB MEDIA adopt, PR, and main merge remain forbidden by this GO.
