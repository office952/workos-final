# WorkOS Cloud Foundation V1 — Slice 4

Status: PASS on `feat/workos-cloud-foundation-v1`. Owner GO authorized TEST COMPANY, two-organization hostile isolation, browser E2E, adopt fingerprint symmetry, and Foundation documentation closure. Real HUB MEDIA adoption, first real Cloud owner, main merge, and PR remain later.

```text
SLICE_4 = PASS
FULL_CLOUD_FOUNDATION_V1 = PASS
TWO_ORGANIZATION_RUNTIME_ISOLATION = PASS
HOSTILE_CROSS_ORG_READ_MATRIX = PASS
HOSTILE_CROSS_ORG_WRITE_MATRIX = PASS
CUSTOMER_ISOLATION = PASS
REQUEST_ISOLATION = PASS
ATTACHMENT_BYTE_ISOLATION = PASS
QUOTE_ISOLATION = PASS
ORDER_RELEASE_ISOLATION = PASS
EXECUTION_ISOLATION = PASS
PEOPLE_PIN_ISOLATION = PASS
SELLER_ISOLATION = PASS
COST_EVIDENCE_ISOLATION = PASS
INVENTORY_ISOLATION = PASS
PRODUCT_METADATA_ISOLATION = PASS
PROVIDER_ISOLATION = PASS
OPERATORSESSION_SWITCH_ISOLATION = PASS
ACTIVE_ORG_SERVER_AUTHORITY = PASS
PLANE_IDENTITY_FINAL_CLOSURE = PASS
ADOPT_SOURCE_FINGERPRINT_SYMMETRIC = YES
ADOPT_DRY_RUN_ZERO_WRITE = PASS
ADOPT_FAILURE_ROLLBACK = PASS
REAL_HUB_MEDIA_ADOPTION = NOT_EXECUTED
CANONICAL_HUB_MEDIA_PILOT_DATASET = NOT_CONFIRMED
FIRST_REAL_CLOUD_OWNER = NOT_CREATED
FOUNDATION_READY_FOR_CANONICAL_INTEGRATION = YES
CUSTOMER_NEEDS_CURSOR_FOR_NORMAL_CONFIGURATION = NO_AS_DESTINATION
ORG_EQUIPMENT_SELF_CONFIGURATION = LATER
COMMERCIAL_POLICY_SELF_CONFIGURATION = LATER
SUPPLIERS = LATER
HR = LATER
OVERHEAD = LATER
PRODUCT_MODULE_ACTIVATION = LATER
FOUNDATION_SCOPE_EXPLODED = NO
```

## What was proven

Two synthetic Organizations share one Cloud process and cannot read, mutate, execute, or inherit each other's private operational truth.

Isolation is the verified Operational Plane (separate SQLite, documents root, request-scoped runtime). It is not `organization_id` on business tables and not UI hiding.

Hostile API attacks use known foreign IDs. Missing foreign resources return 404. Unauthorized Organization switch returns 403. Responses do not leak the foreign customer, person, seller, plane id, or filesystem path.

## TEST COMPANY fixture

Created only inside isolated Cloud test/QA roots.

- Organization B display name: `TEST COMPANY`
- Bootstrap: `SYNTHETIC_TEST`
- Provider registry: `EMPTY_FOUNDATION`
- Distinct plexi amount: `11.5` (`PLATFORM_DEFAULT` / `DEVELOPMENT_DEFAULT`)
- Seller, person, customer, request, attachment, inventory, display label seeded through existing owner APIs
- No HUB MEDIA legal data, people, OWNER_CONFIRMED seed rates, or `MCH-CNC-4020`

Organization A is synthetic Atelier Alpha via `ADOPT_EXISTING` of a synthetic source. Its provider registry is `HUB_MEDIA_PILOT_COMPATIBILITY` for the first-pilot stand-in only.

Users: A (Alpha only), B (TEST COMPANY only), C (both, switcher proof), plus members for 403 writes.

## Hostile matrix summary

Table-driven A→B and B→A attacks in `apps/api/tests/cloud-isolation.test.ts`:

| Category | Read | Write |
|---|---|---|
| CUSTOMER | 404 | PATCH 404 |
| REQUEST | 404 | PATCH / quote-link 404 |
| ATTACHMENT | metadata + download 404; own bytes distinct | traversal rejected |
| QUOTE / PDF / accept / order | 404 | 404 |
| ORDER / RELEASE | 404 | 404 |
| EXECUTION_PLAN / TASK | 404 | provider / start 404 |
| PEOPLE / PIN | 404 | PATCH / PIN 404 |
| COST_EVIDENCE | amounts differ; A unchanged after B edit | foreign row 404; member 403 |
| INVENTORY | same Resource ID, different balances | A adjustment stays on A |
| SELLER | distinct legal names | member 403 |
| PRODUCT_SYSTEM_DISPLAY_METADATA | Familie Alpha vs Familie Test | — |
| WORKCENTER / PROVIDER | B has no `MCH-CNC-4020`; assign 422 `ineligible_provider` | — |

Active Organization authority: `X-Organization-Id` and `?organizationId=` do not override `platform_sessions.active_organization_id`. User A cannot switch to B (403, session stays A).

OperatorSession: User C identifies as PERSON_A, switches to B, operator cookie cleared, replay of the old A cookie while B is active returns `operator: null`. Identifying as PERSON_A inside B is 404.

## Adopt machinery verdict

Source fingerprint comparison is now complete and symmetric: SQLite path/hash/size plus WAL/SHM hash, including appear/disappear. `null → some hash` is a mutation.

Dry-run writes 0 Control Plane changes, 0 destination files, 0 backup files, 0 source changes.

Execute on a synthetic stand-in keeps the source fingerprint unchanged, binds identity on the destination only, and preserves IDs / hashes.

Injected failure after backup or after staging copy: source unchanged, staging gone, destination absent, plane row removed so the incomplete plane is not served.

Precondition text: source writers must be stopped or the source must be a known-consistent snapshot. Adopt is not online live migration.

`ADOPT_EXISTING` → HUB workcenter registry is named `HUB_MEDIA_PILOT_COMPATIBILITY`. It is not universal onboarding law.

## Known LATER domains

Equipment self-configuration, commercial policy admin, suppliers, HR, overhead, product module activation, Hub, billing, public signup, SSO, Postgres.

TEST COMPANY quote/order rows used for isolation GET/write attacks are locator fixtures. A complete owner-confirmed commercial policy is not claimed for TEST COMPANY. Cross-org quote isolation still returns 404.

## Real HUB MEDIA

Untouched. `CANONICAL_HUB_MEDIA_PILOT_DATASET = NOT_CONFIRMED`. `REAL_HUB_MEDIA_ADOPTION = NOT_EXECUTED`. `FIRST_REAL_CLOUD_OWNER = NOT_CREATED`.

## Security verdict

Independent READ-ONLY review of the Slice 4 diff found no unresolved P1/P2 on the Foundation attack surface:

- cross-org IDs → 404, no existence oracle
- organization header / query spoof ignored
- plane identity mismatch fail-closed before migrations
- provider spoof → 422 `ineligible_provider`
- operator-session replay after switch rejected
- member owner-writes 403
- document download stays inside the active plane
- adopt source mutation and partial failure do not serve a broken ACTIVE plane
- no HUB seller / people / OWNER_CONFIRMED cost leak into SYNTHETIC_TEST

`failAt` is a test-only adopt seam. Production CLI does not set it. Adopt is not an HTTP import path.

## Foundation closure status

```text
WORKOS CLOUD FOUNDATION V1 = IMPLEMENTED_CURRENT / BASIC
REAL HUB MEDIA CLOUD PILOT = NOT_STARTED
MULTI-ORG HOSTILE ISOLATION = VERIFIED_SYNTHETIC
SELF-SERVICE ONBOARDING = NOT_IMPLEMENTED
```

This is Foundation complete on the feature branch. It is not WorkOS SaaS complete.

`FOUNDATION_READY_FOR_CANONICAL_INTEGRATION = YES`. Next authorized step, not started here: `WORKOS_CLOUD_FOUNDATION_V1_CANONICAL_INTEGRATION`.

## Tests / QA

- Targeted Slice 4: `cloud-isolation`, `cloud-adopt`, `cloud-bootstrap-policy`, `cloud-plane-identity`, `cloud-auth`, `cloud-provider-isolation`.
- Full suites: API 33 files / 161 passed. Web 30 files / 88 passed. Domain 61 files / 360 passed. API, web, and domain typecheck passed.
- Isolated QA: synthetic Cloud root under `%TEMP%\workos-cloud-*`, API `127.0.0.1:8804`, web `127.0.0.1:5186`. Users A/B/C, private customers, TEST COMPANY plexi 11,50 EUR platform default, workcenters Zone 0 / Utilaje 0 / no `MCH-CNC-4020`. Shutdown proof: `startWorkosApi` `close()` then health refused on the same port.
- Playwright `e2e/cloud-isolation.spec.ts` is skipped unless `WORKOS_CLOUD_E2E=1` so the existing single-plane Playwright webServer is not used as Cloud proof.
- React Doctor on changed web files: 76/100. Findings are pre-existing (`LoginPage`, `OperatorSessionContext`, `PersonAdminPage`). No new Slice 4 React defect.

## Screenshots

Synthetic data only. No real owner information.

1. `docs/worklog/screenshots/slice4-user-a.png` — USER_A, Organizație Atelier Alpha, no switcher, Client Alpha only
2. `docs/worklog/screenshots/slice4-user-b.png` — USER_B, Organizație TEST COMPANY, no switcher, Client Test only
3. `docs/worklog/screenshots/slice4-switch-a.png` — USER_C on Alpha, switcher visible, Client Alpha, Identifică-te
4. `docs/worklog/screenshots/slice4-switch-b.png` — USER_C after switch to TEST COMPANY, Client Test, operator identity cleared
5. `docs/worklog/screenshots/slice4-test-company-resources.png` — Plexiglas 3 mm opal 11,50 EUR / m², Default de dezvoltare + Valoare implicită de platformă
6. `docs/worklog/screenshots/slice4-test-company-workcenters.png` — Zone 0 · Utilaje 0 · Fără furnizor 17, no `MCH-CNC-4020`
7. `docs/worklog/screenshots/slice4-mobile.png` — 390 px, org chip + switcher + resources

## METODA DE LUCRU SI LOGICA ABORDARII

Hostile two-organization testing was the correct final proof because Slice 3 already showed routing, bootstrap honesty, and provider seams. The remaining question was whether two Organizations can share one Cloud process without inheriting private operational truth. UI labels and different routes cannot answer that.

Read-only attack research stayed on Control Plane, documents, execution, adopt, and frontend switching before the writer changed contracts. One implementation writer owned bootstrap, adopt fingerprint, isolation fixture, and docs so those contracts did not fork.

Fixtures stayed synthetic: Atelier Alpha is an adopted stand-in, TEST COMPANY is `SYNTHETIC_TEST`. No owner credential and no real HUB MEDIA dataset entered the Cloud root.

Separate verified planes stayed simpler than spraying `organization_id` across historical tables. Isolation is Organization + plane context. Hash-derived technical IDs may collide; the tests therefore use distinguishable inscriptions/locators and still treat a foreign id as absent in the active plane.

Provider, data, document, and operator isolation were tested independently: empty vs HUB_MEDIA_PILOT_COMPATIBILITY registries, same Resource ID with different amounts, distinct attachment bytes and documents roots, and OperatorSession revoke/replay on switch.

The adopt fingerprint was hardened before any real dataset is in range, because WAL/SHM appearance was previously treated as unchanged.

No HR, supplier, module, or Machine Admin work was added. Those remain later on purpose.
