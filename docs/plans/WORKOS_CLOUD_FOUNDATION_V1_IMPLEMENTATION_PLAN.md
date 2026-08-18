# WorkOS Cloud Foundation V1 — Implementation Plan

Status: **PASS_FOR_IMPLEMENTATION_OWNER_GO**
Mode: implementation plan only. **Does not authorize product code.**
Date: 2026-08-18
Source architecture: `docs/worklog/WORKOS_CLOUD_ORGANIZATION_READINESS_MASTER_AUDIT_V1.md` @ `453ec788eb8b2c136e5fd994b76d2a1b95b7f686`
Product baseline: `main` @ `8b3ac3566b517b29622120a31790bf0b27d83b57`

```text
CLOUD_MODEL = CONTROL_PLANE_PLUS_VERIFIED_OPERATIONAL_PLANES
FOUNDATION_STORAGE = SQLITE_OPERATIONAL_PLANE_PER_ORGANIZATION_FOR_PILOT
CONTROL_PLANE_STORAGE = SEPARATE_SQLITE_FILE
PLANE_IDENTITY_IMPLEMENTATION = SINGLETON_TABLE_IN_OPERATIONAL_DB
RUNTIME_ROUTING_PATTERN = HONO_REQUEST_CONTEXT_PLUS_RUNTIME_REGISTRY
AUTH_MECHANISM = EMAIL_PASSWORD_SCRYPT_EXPLICIT_PARAMS
SESSION_MECHANISM = OPAQUE_HTTPONLY_COOKIE
ACTIVE_ORG_MECHANISM = SERVER_SIDE_ON_PLATFORM_SESSION
MEMBERSHIP_ROLES = owner / member
ADMIN_AUTHORIZATION_POLICY = OWNER_ONLY_FOR_ADMINISTRATION_WRITES
OPERATOR_SESSION_ON_ORG_SWITCH = REVOKE_AND_CLEAR
NEW_ORG_COST_EVIDENCE_BOOTSTRAP = NO_OWNER_CONFIRMED_INHERITANCE
NEW_ORG_SELLER_BOOTSTRAP = UNCONFIGURED_UNTIL_OWNER_PROVIDES
NEW_ORG_WORKFORCE_BOOTSTRAP = EMPTY_NO_HUB_MEDIA_NAMES
PROVIDER_ISOLATION_MECHANISM = RUNTIME_INJECTED_WORKCENTER_REGISTRY
HUB_MEDIA_ADOPTION_MODE = OWNER_SELECTED_DATASET_COPY_THEN_BIND
TEST_COMPANY_BOOTSTRAP = SYNTHETIC_FIXTURE_PLANE
SQLITE_PER_ORG_PERMANENT = NO
POSTGRES_REQUIRED_NOW = NO
HUB_INCLUDED = NO
BILLING_INCLUDED = NO
SELF_SERVICE_SIGNUP_INCLUDED = NO
CLOUD_IMPLEMENTATION_AUTHORIZED = NO
```

Before any Cloud product-code implementation is integrated to `main`, this plan and the approved audit must already be in canonical repository history. Implementation must not outrun accepted architecture records.

---

## A. Verdict

**PASS_FOR_IMPLEMENTATION_OWNER_GO**

The Foundation can be built as four independently verifiable slices on one feature branch. The accepted hybrid law stays closed: Organization → verified Operational Plane. SQLite-per-org is the pilot implementation, not the permanent law.

A PASS does **not** authorize code, migrations, auth runtime, or UI.

---

## B. Baseline / audit input

Verified before planning:

- `origin/main` = `8b3ac3566b517b29622120a31790bf0b27d83b57`
- Audit branch `docs/audit/workos-cloud-organization-readiness-v1` = `453ec788eb8b2c136e5fd994b76d2a1b95b7f686`
- Parent of audit = `8b3ac35`
- Diff vs main = one file: `docs/worklog/WORKOS_CLOUD_ORGANIZATION_READINESS_MASTER_AUDIT_V1.md`

This plan is written from that committed audit, not from chat memory. Architecture choices that the audit already locked are not reopened.

---

## C. Foundation V1 final scope

**In**

- Control Plane: Organization, User, Membership, PlatformSession, OperationalPlane descriptor
- Operational Plane: trusted locator, documents root, immutable plane identity, existing operational schema
- Cloud email/password authentication + HttpOnly session
- Request-scoped `ProductSystemRuntime` from verified plane
- `owner` / `member` authorization
- AppShell login + organization name + multi-membership switcher
- OperatorSession remains workshop overlay; cleared on org switch
- Owner-provisioned HUB MEDIA + TEST COMPANY
- Organization-scoped provider/workcenter/machine registry (projection **and** assignment validation)
- Honest bootstrap policies (no HUB MEDIA seller / people / OWNER_CONFIRMED rates on a new org)
- Hostile isolation API + browser proof
- Reversible adoption of an Owner-selected HUB MEDIA dataset

**Out**

- Self-service signup, billing, invitations, SSO, email-verification product
- Postgres / vendor hosting / Kubernetes
- Hub tables or cross-org execution
- Commercial Policy Admin, Machine Admin, technical-settings write
- Product/resource/process CRUD
- `organization_id` on existing operational tables
- Device-account product
- Personal identity hardcoded as first Cloud User

---

## D. Control Plane schema

Separate SQLite database. Do not put Users/Memberships into operational DBs.

### `organizations`

| Field | Type | Rules |
|---|---|---|
| `organization_id` | TEXT PK | `org:{uuid}` |
| `slug` | TEXT UNIQUE | server-generated `[a-z0-9-]{3,48}` |
| `display_name` | TEXT | operator-visible |
| `status` | TEXT | `ACTIVE` \| `DISABLED` |
| `created_at` / `updated_at` | TEXT ISO | |

Disabled organization: membership may still exist; every org-bound API returns `403 organization_disabled`.

### `users`

| Field | Type | Rules |
|---|---|---|
| `user_id` | TEXT PK | `usr:{uuid}` |
| `email` | TEXT UNIQUE | lowercase trimmed |
| `password_hash` / `password_salt` | BLOB | never logged |
| `kdf` | TEXT | e.g. `scrypt:N=32768,r=8,p=1` |
| `status` | TEXT | `ACTIVE` \| `DISABLED` |
| `created_at` / `updated_at` | TEXT | |

Email is the globally unique login identifier. No username.

### `organization_memberships`

| Field | Type | Rules |
|---|---|---|
| `membership_id` | TEXT PK | `mem:{uuid}` |
| `user_id` | TEXT | FK users |
| `organization_id` | TEXT | FK organizations |
| `role` | TEXT | `owner` \| `member` |
| `status` | TEXT | `ACTIVE` \| `REVOKED` |
| unique | `(user_id, organization_id)` | one membership row per pair |

### `platform_sessions`

| Field | Type | Rules |
|---|---|---|
| `session_id` | TEXT PK | `ses:{uuid}` |
| `user_id` | TEXT | |
| `token_hash` | BLOB UNIQUE | SHA-256 of raw cookie |
| `active_organization_id` | TEXT NOT NULL | must be an ACTIVE membership of that user |
| `created_at` / `expires_at` | TEXT | TTL 12h |
| `revoked_at` | TEXT NULL | logout / org-switch hygiene / admin revoke |
| `last_seen_at` | TEXT | optional sliding is not required in V1 |

**Active organization** lives on the session row, not in a client header and not in localStorage as authority.

Login: if the user has exactly one ACTIVE membership, set that organization. If several, require an explicit organization id in the login body **or** default to the last used membership and force the switcher — prefer: require explicit org when count > 1, otherwise fail closed with `organization_selection_required` plus the membership list (ids + display names + roles only).

Switch: `POST /api/cloud/active-organization` updates `active_organization_id` after membership check, then **revokes the current OperatorSession cookie** and deletes that operator session row in the **previous** plane (best effort) and never copies it to the next plane.

### `operational_planes` (descriptor, Control Plane)

| Field | Type | Rules |
|---|---|---|
| `plane_id` | TEXT PK | `pln:{uuid}` |
| `organization_id` | TEXT UNIQUE | one plane per org in V1 |
| `storage_kind` | TEXT | `SQLITE_DIR` only in Foundation |
| `plane_key` | TEXT UNIQUE | opaque `[a-z0-9]{16,32}`, **not a path** |
| `bootstrap_policy` | TEXT | see section O |
| `status` | TEXT | `ACTIVE` \| `RETIRED` |
| `created_at` | TEXT | |

Locator is **derived**, never stored as a free-form filesystem string from a client:

```text
{WORKOS_CLOUD_ROOT}/organizations/{plane_key}/product-system.sqlite
{WORKOS_CLOUD_ROOT}/organizations/{plane_key}/documents/
```

`plane_key` is generated by the provisioner. Reject any key that is not the exact stored token. No `..`, no slashes, no client-supplied roots.

### Global uniqueness

- Email: global (Control Plane)
- Organization id / slug: global
- Membership: unique pair
- Session token hash: global
- Plane id / plane_key: global
- Operational entity ids (`cus:`, `qts:`, …): unique **inside a plane only**

---

## E. Operational Plane contract

```text
OperationalPlaneDescriptor
  planeId
  organizationId
  storageKind = SQLITE_DIR
  planeKey
  bootstrapPolicy
```

Resolved only from Control Plane after membership check.

`ProductSystemRuntime` gains, at construction:

- existing `sqlitePath`, `documentsRoot`
- `organizationId`, `planeId`
- `bootstrapPolicy`
- `providerRegistry: WorkcenterRegistry`

Client input must never include sqlite path, documents path, or `WORKOS_DATA_DIR`.

---

## F. Plane identity guard

**MANDATORY.** New operational migration (conceptual `023_operational_plane_identity.sql`) in the **existing operational** migration series:

```text
operational_plane_identity
  id TEXT PRIMARY KEY CHECK (id = 'current')
  plane_id TEXT NOT NULL
  organization_id TEXT NOT NULL
  bound_at TEXT NOT NULL
```

Exactly one row. Insert once at bind/adopt. Never UPDATE organization_id/plane_id.

Opening sequence:

1. Authenticated platform session
2. Active organization + ACTIVE membership + org ACTIVE
3. Load descriptor from Control Plane
4. Derive locator from `WORKOS_CLOUD_ROOT` + `plane_key`
5. Open SQLite
6. Read `operational_plane_identity`
7. If missing → fail closed `plane_identity_missing` (except the provisioner bind transaction that writes it)
8. If `organization_id` or `plane_id` ≠ descriptor → fail closed `plane_identity_mismatch`
9. Only then cache/serve `ProductSystemRuntime`

HTTP: **503** with a generic operator message; log the mismatch as P1. Never serve the wrong plane's rows “to be helpful”. Tests prove Org B configured to A's file is refused.

---

## G. Runtime routing architecture

Today `createApp` closes one `ProductSystemRuntime` into 11 route modules (~69 handlers). No Hono `Variables`. `close()` exists and is used in tests.

**Pattern:** typed `ApiEnv` + middleware + in-process registry. No global `currentOrganization` / `currentRuntime`.

```text
CORS
→ public routes (health, login, cloud session read)
→ requireCloudSession
→ requireActiveOrganization
→ bindVerifiedOperationalRuntime
→ existing register*Routes
```

Hono context keys:

- `cloudUser`
- `membership` (`role`, `organizationId`)
- `organization`
- `planeDescriptor`
- `productSystem`

`getProductSystem(c)` throws if missing (fail closed).

**Registry:** `Map<organizationId, ProductSystemRuntime>` owned by the API process. Open on first use after identity assert. Reuse for later requests. `close()` all on process shutdown. Foundation limit: in-memory map; two orgs need two runtimes. Soft cap (e.g. 32) with LRU close is optional and not required for HUB MEDIA + TEST.

**Tests:** `createCloudApp({ controlPlane, planes })` injects Control Plane + pre-bound runtimes. Existing `createApp({ productSystem })` remains a **test helper** for single-plane domain/API tests that do not claim Cloud isolation. Production `apps/api/src/index.ts` must not create an anonymous single-company runtime once Foundation is complete.

---

## H. Authentication model

Real Cloud authentication. Not DEV Operator PIN.

- Identifier: email
- Secret: password (min length + basic complexity; no PIN reuse)
- Hash: **Node `crypto.scrypt` with explicit params stored in `users.kdf`** (`N=32768,r=8,p=1`, keylen 64, 16-byte salt, `timingSafeEqual`)
- Why not a new library: Node 22 is already the CI/runtime; operator crypto already uses `scrypt` / `randomBytes` / SHA-256 token hashing. Cloud passwords use a **separate module** (`apps/api/src/cloud/password.ts`) with explicit params, not `operator/crypto.ts`.
- Why not Argon2id in V1: extra native dependency on Windows CI without enough gain for a two-user pilot. Upgrade path remains open.
- Session token: 32 random bytes, base64url cookie, SHA-256 stored — same shape as operator tokens, **different cookie and table**
- Cookie name: `workos_cloud_session`
- Logout: revoke row + delete cookie
- Rate limit: in-memory per normalized email, 5 failures / 60s → 429 (same class as PIN guard). Document as process-local.
- No plaintext passwords in logs, fixtures, or the repository
- No default password
- First real owner credentials: Owner gate at provision time

---

## I. Session / cookie / CSRF model

| Cookie | Purpose |
|---|---|
| `workos_cloud_session` | Cloud User + active org |
| `workos_operator_session` | Person in current plane |

Attributes for Cloud cookie:

- `HttpOnly`
- `Path=/`
- `SameSite=Lax`
- `Secure` when `NODE_ENV=production`
- `Max-Age` = 12h, aligned with `expires_at`

Dev: Vite proxies `/api` → API, so the browser stays same-origin. Keep `credentials: "include"` on a single web fetch helper.

CORS stays allowlist `http://127.0.0.1:5173` and `http://localhost:5173` with `credentials: true` for local Vite. Production same-origin: do not widen CORS.

CSRF: SameSite=Lax + same-origin JSON from the SPA is the Foundation policy. No CSRF-token framework. Write endpoints fail closed without a valid Cloud session (except public login). Do not accept `X-Organization-Id` as authority.

---

## J. Membership / authorization model

Two roles only.

**Public**

- `GET /api/health`
- `POST /api/cloud/login`
- `GET /api/cloud/session` (returns `{ user: null }` without cookie; not a data leak)
- `POST /api/cloud/logout` (idempotent)

**Authenticated + membership** (all organization WorkOS data)

Every current `/api/*` domain route except health/login.

**Owner-only writes** (see L)

Administration of system truth.

**Member**

Commercial and product workflow reads/writes; Atelier after OperatorSession overlay.

**Operator overlay**

`POST start` / `POST complete` still require OperatorSession **and** Cloud membership. PIN identify (`POST /api/operator-session`) requires Cloud session first so candidates come from the active plane only.

`GET /api/operator-candidates` today lists all people with no auth — it becomes Cloud-authenticated and plane-scoped.

---

## K. User / Person / OperatorSession model

- Cloud User = platform principal
- Person = operational employee in one plane
- OperatorSession = PIN/DEV workshop identity over an already selected Organization
- Person may exist without User
- User may exist without Person
- Person without User **never** gets anonymous protected API access
- HUB MEDIA pilot: a shared workshop browser stays on one Cloud account; PIN identifies the Person
- No device-account product in Foundation
- DEV Operator Mode stays Person bypass only (`WORKOS_DEV_OPERATOR_*`), fail-closed in production, and **does not** mint a Cloud session

---

## L. API migration map

### Authorization matrix

**Owner-only**

- `PATCH /api/resources-admin/cost-evidence/:evidenceRowId`
- `PATCH /api/admin/product-system/entities/:entityKind/:entityId/display-label`
- `PATCH /api/seller`
- `POST/PATCH /api/people`, `POST/PATCH /api/people/skills`, person skill assign/retire
- `PUT /api/people/:personId/operator-pin`
- `POST /api/inventory/:resourceId/adjustments`
- `POST /api/execution-tasks/:taskId/provider`
- `POST /api/execution-tasks/:taskId/executor` (compatibility; still owner)

**Member (also allowed for owner)**

- Customers, requests, attachments, quote links
- Product compile / confirm
- Quote freeze, acceptance, order, production release, execution-plan materialize
- Reads of jobs, quotes, requests, execution, inventory, resources, processes, workcenters, governance projections

**Cloud + OperatorSession**

- `POST /api/execution-tasks/:taskId/start`
- `POST /api/execution-tasks/:taskId/complete`

**Cloud session required to create OperatorSession**

- `POST /api/operator-session`
- `POST /api/dev/operator-session` (still also DEV-gated)

**Public**

- health, cloud login/session/logout

### Mechanical runtime migration

Every `register*Routes(app, runtime)` drops the runtime argument and reads `getProductSystem(c)`:

- `apps/api/src/app.ts`
- `apps/api/src/index.ts`
- `apps/api/src/product.ts`
- `apps/api/src/jobs/routes.ts`
- `apps/api/src/quotes/routes.ts`
- `apps/api/src/requests/routes.ts`
- `apps/api/src/people/routes.ts`
- `apps/api/src/operator/routes.ts`
- `apps/api/src/customers/routes.ts`
- `apps/api/src/seller/routes.ts`
- `apps/api/src/inventory/routes.ts`
- `apps/api/src/system.ts`
- `apps/api/src/productSystem/routes.ts`

New:

- `apps/api/src/cloud/context.ts`
- `apps/api/src/cloud/middleware.ts`
- `apps/api/src/cloud/routes.ts`
- `apps/api/src/cloud/controlPlane.ts`
- `apps/api/src/cloud/runtimeRegistry.ts`
- `apps/api/src/cloud/password.ts`
- `apps/api/src/cloud/provision.ts` (CLI)

One canonical authenticated path after Foundation. No second anonymous production runtime.

---

## M. UI / login / AppShell plan

Smallest chrome. Romanian. No nav redesign, no marketing, no billing, no Hub.

New:

- `apps/web/src/cloudSessionApi.ts` — login, session, logout, switch org; always `credentials: "include"`
- `apps/web/src/CloudSessionContext.tsx`
- `apps/web/src/LoginPage.tsx` — email, password, optional org picker when API returns `organization_selection_required`
- `apps/web/src/apiClient.ts` (or equivalent) — wrap remaining clients so authenticated calls send cookies

Modify:

- `App.tsx` — unauthenticated → Login; authenticated boot spinner; then existing routes
- `AppShell.tsx` — organization display name; switcher **only if** `memberships.length > 1`; Cloud logout; keep operator chip separate
- `OperatorSessionContext.tsx` — on org switch / Cloud logout, clear operator state and call operator logout
- `systemApi.ts`, `peopleApi.ts`, `customerApi.ts`, `sellerApi.ts`, `inventoryApi.ts`, `requestsApi.ts`, `productApi.ts` — credentials

Switch contract:

1. `POST /api/cloud/active-organization`
2. API revokes operator cookie
3. Frontend drops operator context and plane-specific caches
4. Reload organization-bound queries

Single-membership users never see a switcher.

---

## N. HUB MEDIA canonical dataset adoption

**Owner gate. Not known in this plan.**

Do not treat as canonical: current worktree DB, ports 5173/5178, Documents worktree, QA isolation files, or “whatever `product-system.sqlite` is in cwd”.

Preflight (provisioner `--adopt-hub-media`):

1. Owner supplies `--sqlite` and `--documents` (absolute paths) after explicit confirmation
2. Refuse if paths are inside `WORKOS_CLOUD_ROOT` already, or are not files/dirs
3. Stop writers if a live API is using that file (document: adopt from a copy while API is down, or copy while read-only)
4. Backup: copy source sqlite (+ `-wal`/`-shm` if present) and documents tree to `{WORKOS_CLOUD_ROOT}/backups/hub-media-{utc}/`
5. Record source path, mtime, size, optional SHA-256 of sqlite
6. Copy into `{CLOUD_ROOT}/organizations/{plane_key}/`
7. Open copy, apply operational migrations (identity table)
8. Insert `operational_plane_identity` for HUB MEDIA
9. Verify counts: customers, quotes, orders, people, cost-evidence active rows, attachments on disk
10. Verify a known frozen quote id still exists with the same `content_hash`
11. Never delete or move the Owner source
12. Dry-run prints the plan and exits 0 without copy

Rollback: leave source untouched; discard the plane directory; Control Plane rows for that org/plane can be deleted in the same rollback command. Original single-plane app can still start against the untouched source with pre-Foundation `WORKOS_SQLITE_PATH`.

Do not recreate quotes, recompile, rehash, reseed people, reset Cost Evidence, or regenerate documents.

---

## O. Bootstrap policy matrix

Typed policy on `operational_planes.bootstrap_policy` and passed into `createProductSystemRuntime`.

| Policy | When | Display labels | Cost Evidence | Seller | Workforce | Provider registry |
|---|---|---|---|---|---|---|
| `ADOPT_EXISTING` | HUB MEDIA | keep | keep exact | keep | keep; do not re-run trusted seed | HUB MEDIA curated registry |
| `NEW_ORGANIZATION` | future real company | platform defaults `INSERT OR IGNORE` | **no** OWNER_CONFIRMED inheritance; start empty or DEVELOPMENT_DEFAULT platform amounts — see P | unconfigured; no HUB MEDIA legal seed | no HUB MEDIA people; optional platform skill vocabulary without assignments | empty until org equipment exists |
| `SYNTHETIC_TEST` | TEST COMPANY | platform defaults | explicit fixture, not HUB MEDIA confirmed rates | explicit synthetic seller | synthetic/empty people only | empty or synthetic non-HUB-MEDIA ids |

`ensureTrustedWorkforce` must not run from `createProductSystemRuntime` for every plane. Gate on policy. `VITEST` skip remains for unit tests that do not opt in.

`getSellerProfile` must not lazy-insert `OWNER_CONFIRMED_SELLER` unless policy is `ADOPT_EXISTING` **and** the row is already the adopted truth (prefer: never lazy-insert; adopted DB already has the row).

---

## P. Cost Evidence new-org provenance

Current seed copies 17 `OWNER_CONFIRMED` HUB MEDIA rows. That is a lie for any other company.

| Plane | Rule |
|---|---|
| HUB MEDIA adopt | Do not touch rows, markers, or classifications |
| TEST COMPANY | Load `apps/api/src/cloud/fixtures/test-company-cost-evidence.ts` (or equivalent). Plexi rate **differs**. Classification must **not** be `OWNER_CONFIRMED`. Use `DEVELOPMENT_DEFAULT` / `AI_DECISION` only |
| Future real org | Do **not** call today's `ensureCostEvidence()` unchanged. Either no active rows (EIC PARTIAL until owner saves) or copy **identities** with classification rewritten to `DEVELOPMENT_DEFAULT` and source that is not owner-confirmed. Prefer **empty** if compile is not required at provision |

Do not add a second Cost Evidence engine. Resource identity stays curated. Active amount stays plane truth. Snapshot rates stay frozen.

---

## Q. Seller bootstrap

Remove single-company lazy seed as the default.

- HUB MEDIA: adopted row remains HUB MEDIA PRODUCTION S.R.L.
- TEST COMPANY: provision writes a synthetic seller (different legal name / CUI)
- NEW_ORGANIZATION: no row, or a structured `seller_unconfigured` projection. Quote freeze returns 422 until an owner PATCHes Date firmă
- `OWNER_CONFIRMED_SELLER` constant remains historical/adopt seed material, not “every empty plane”

---

## R. People / skills bootstrap

Split:

- **Platform vocabulary:** capability classes; optional default `capability_skill_requirements` mapping by skill **code**
- **Organization truth:** people, PIN, assignments, availability

HUB MEDIA: do not rematerialize `trustedWorkforce.ts` if marker/people already exist.

TEST COMPANY: one or two synthetic people + pins from a fixture, **not** Florin CNC / Calin Cimpean / `per:legacy:*`.

NEW_ORGANIZATION: empty people. Do not insert HUB MEDIA names. May insert empty skill **definitions** by code so a later owner can assign, without copying persons.

---

## S. Machine / workcenter provider isolation

**Foundation correctness.** UI hiding is insufficient.

Today `GET /api/workcenters` always projects `workcenterRegistry`. Worse: `liveEligibleProviders()` in `packages/domain/src/execution/plan.ts` calls `providersForCapability` **without** a registry argument, so `assignProviderToTask` will accept `MCH-CNC-4020` even for TEST COMPANY.

Required domain seam (smallest):

- Thread `WorkcenterRegistry` through `liveEligibleProviders`, `assignedProviderStillValid`, `assignProviderToTask`, and plan projection eligibility
- Default in **unit tests** may remain the HUB MEDIA catalog so existing golden-path tests stay stable
- Runtime carries `providerRegistry`
- API assignment and `GET /api/workcenters` use `runtime.providerRegistry` only

Foundation registries:

- HUB MEDIA: current `workcenters` / `machines` arrays (curated HUB MEDIA definitions)
- TEST COMPANY: `createWorkcenterRegistry([], [])` or a fixture whose ids/labels are **not** HUB MEDIA equipment
- Future: persisted org-owned equipment, Layer D

No Machine Admin, capacity, or scheduling.

---

## T. Product / catalog extension seams

Do not implement catalog CRUD.

Keep the audit taxonomy:

- Kernel: compiler, freeze law, roles, units
- Curated: LETTERS/ACM templates, current resources, recipes, processes
- Org config: labels, rates, seller, activation later
- Org extensions: reserved. A future company may add a template/resource/process without forking. Foundation only avoids baking “HUB MEDIA catalog = the only possible catalog” into Control Plane types.

`createProductSystemRuntime` must not assume one global product registry is an organization boundary. Product compile stays domain-global curated definitions in V1; isolation is data, not formula forks.

---

## U. Commercial policy boundary

HUB MEDIA keeps `DEFAULT_COMMERCIAL_POLICY` (35% / 21% / EUR) as today's code-owned current-company policy.

TEST COMPANY must **not** be read as having owner-confirmed that policy. Foundation does **not** add Commercial Policy Admin.

Positive-path Foundation proof for TEST COMPANY does **not** require a complete quote freeze. Required: hostile cross-org quote/PDF/order access fails. Optional synthetic compile in TEST may use the code default **only if tests label it as platform default, not TEST owner policy**.

---

## V. Document isolation

`documentsRoot` = derived plane documents directory. Attachment routes already take `documentsRoot` from runtime (`runtime.ts` → `attachmentStorage.ts`). After routing, Org A ids simply do not exist in Org B's DB → **404**. Bytes are not on B's disk. Do not add S3. Keep the current relative key shape so object storage can later prefix by `plane_key`.

---

## W. Snapshot / ID law

No historical hash rewrite. No `organizationId` in old content hashes.

Control Plane references, if needed, are compound locators **outside** snapshot content: `{ organizationId, localId }`. Two planes may share a technical `qts:…` string. That is acceptable.

---

## X. TEST COMPANY design

Provisioned with `SYNTHETIC_TEST`:

- Own `plane_id` / identity row
- Synthetic seller
- Synthetic customer
- Synthetic person (+ PIN fixture)
- Distinct Cost Evidence plexi rate, non-OWNER_CONFIRMED
- At least one inventory movement
- At least one request attachment byte
- Empty/synthetic provider registry

No HUB MEDIA private truth imported.

Users:

- User A: HUB MEDIA only
- User B: TEST COMPANY only
- User C (optional, required for switcher E2E): both memberships

---

## Y. Hostile isolation matrix

For each resource, User A presents User B's ids (and reverse). Expect 404 in the wrong plane or 403 for Control Plane forbids. Never the other org's payload.

- customer list/get/update
- request list/get/update
- attachment metadata + download
- quote get + PDF
- order, production release
- execution plan/task
- people, skills, PIN
- Cost Evidence
- inventory
- seller
- persisted Product System display metadata
- `GET /api/workcenters` / provider assignment of `MCH-CNC-4020` from TEST context

UI hiding is not proof.

---

## Z. Test architecture

| Layer | What | Auth |
|---|---|---|
| Domain unit | catalogs, freeze, EIC, lifecycle | none; inject registry where needed |
| Single-plane API | existing `createApp({ productSystem })` | may stay unauthenticated **only** as a helper until those tests are moved; new Cloud tests must not teach production bypass |
| Cloud API | temp Control Plane + two temp planes | real login cookies |
| Isolation | section Y | real sessions |
| Browser E2E | login, chrome, datasets, switcher, logout, direct URL | real stack |

Do **not** add a production auth bypass to keep tests green. Test helper: `loginCloud(app, email, password)` that hits `POST /api/cloud/login`.

Existing tests that call `createApp()` per assertion with a fresh `:memory:` DB stay valid as single-plane contract tests. Isolation tests are **new** and required for Foundation PASS.

No real HUB MEDIA sqlite, real PINs, or real owner emails in tests. Temp dirs only. Clean up in `afterEach` / `close()`.

New test files (expected):

- `apps/api/tests/cloud-control-plane.test.ts`
- `apps/api/tests/cloud-auth.test.ts`
- `apps/api/tests/cloud-plane-identity.test.ts`
- `apps/api/tests/cloud-bootstrap-policy.test.ts`
- `apps/api/tests/cloud-isolation.test.ts`
- `packages/domain/src/execution/provider-registry.test.ts`
- `apps/web/src/LoginPage.test.tsx`, `CloudSessionContext.test.tsx`, AppShell org chrome tests
- `e2e/cloud-login.spec.ts`, `e2e/cloud-isolation.spec.ts`

---

## AA. Local DEV architecture

New env **`WORKOS_CLOUD_ROOT`**. Do not silently reinterpret `WORKOS_DATA_DIR` / `WORKOS_SQLITE_PATH` as Cloud authority.

```text
{WORKOS_CLOUD_ROOT}/
  control/control-plane.sqlite
  organizations/{plane_key}/product-system.sqlite
  organizations/{plane_key}/documents/
  backups/...
```

Default local root: `{cwd}/data/cloud` when Cloud mode is on.

Compatibility:

- If `WORKOS_CLOUD_ROOT` is set, production/dev API **must** use Control Plane routing
- `WORKOS_SQLITE_PATH` / `WORKOS_DATA_DIR` remain for pre-Foundation single-plane tools and existing tests
- If both Cloud root and sqlite path are set in Cloud mode, **fail closed** (ambiguous authority)
- DEV operator flags unchanged and still fail in production

Local Cloud users: provisioned explicitly via CLI into the Control Plane. No hardcoded production credentials. A documented `pnpm` script may create **synthetic** local users only when `NODE_ENV !== production`.

---

## AB. Provisioning

Owner-only CLI, e.g. `apps/api/src/cloud/provision.ts` invoked via package script.

Commands (conceptual):

- `provision organization --name --slug --policy`
- `provision user --email` (password via prompt / TTY; never argv logged)
- `provision membership --user --org --role`
- `provision adopt-hub-media --sqlite --documents --organization` (Owner gate)
- `provision test-company`
- `--dry-run` on all

No hidden production account. No password in git. Stop and wait for Owner email/password when provisioning the first HUB MEDIA owner (`OWNER_SELECTED_AT_IMPLEMENTATION_TIME`).

---

## AC. Backup / rollback

| Artifact | Backup |
|---|---|
| Control Plane sqlite | copy before provision/migrate |
| HUB MEDIA source | section N backup dir |
| Adopted plane | the copy itself; source remains |
| Auth | Control Plane sessions/users live only in Control Plane file |

Rollback of a failed Foundation attempt:

1. Stop API
2. Keep Owner source sqlite/documents untouched
3. Delete `{CLOUD_ROOT}/organizations/{plane_key}` if incomplete
4. Restore Control Plane from backup or drop the failed org/plane rows
5. Start pre-Foundation process against the original source if needed

No destructive cutover. Pilot must be reversible.

---

## AD. Exact file map

### New

| File | Responsibility | Must not own |
|---|---|---|
| `apps/api/src/persistence/controlPlaneSqlite.ts` | open/migrate Control Plane DB | operational stores |
| `apps/api/src/persistence/control-plane-migrations/*.sql` | Control Plane DDL | operational tables |
| `apps/api/src/persistence/migrations/023_operational_plane_identity.sql` | singleton identity | org_id on other tables |
| `apps/api/src/cloud/controlPlane.ts` | orgs, users, memberships, sessions, plane descriptors | EIC, quotes |
| `apps/api/src/cloud/password.ts` | Cloud password KDF | operator PIN |
| `apps/api/src/cloud/middleware.ts` | session + membership + runtime bind | business writes |
| `apps/api/src/cloud/context.ts` | `ApiEnv`, getters | |
| `apps/api/src/cloud/runtimeRegistry.ts` | open/assert/cache/close | path from request body |
| `apps/api/src/cloud/bootstrapPolicy.ts` | policy dispatch | HUB MEDIA constants as default |
| `apps/api/src/cloud/fixtures/test-company-*.ts` | TEST seller/people/cost/inventory | production seeds |
| `apps/api/src/cloud/provision.ts` | CLI | HTTP surface for public signup |
| `apps/api/src/cloud/routes.ts` | login/session/logout/switch | |
| `apps/web/src/cloudSessionApi.ts` | Cloud HTTP | operator PIN |
| `apps/web/src/CloudSessionContext.tsx` | Cloud state | Person identity |
| `apps/web/src/LoginPage.tsx` | login UX | catalog |
| tests and e2e listed in Z | | |

### Modified

| File | Change | Must not |
|---|---|---|
| `apps/api/src/app.ts` | middleware; stop default anonymous runtime in Cloud mode | keep open admin writes |
| `apps/api/src/index.ts` | boot Control Plane + registry | log secrets |
| `apps/api/src/productSystem/runtime.ts` | policy-gated bootstrap; providerRegistry; identity assert hook | always seed trusted workforce |
| `apps/api/src/resources/store.ts` | policy-aware ensureCostEvidence | change supersede law |
| `apps/api/src/seller/store.ts` | stop universal HUB MEDIA lazy seed | rewrite adopted seller |
| `apps/api/src/people/store.ts` | policy-gated workforce | |
| `apps/api/src/system.ts` | workcenters from runtime registry | import module singleton as authority |
| `apps/api/src/product.ts` | context runtime; Cloud+PIN start/complete | freeze-hash changes |
| all `register*Routes` | `getProductSystem(c)` | second runtime path |
| `packages/domain/src/execution/plan.ts` | `liveEligibleProviders(capabilityId, registry)` | keep implicit HUB MEDIA registry in production API |
| `packages/domain/src/execution/lifecycle.ts` | pass registry into assign/validate | |
| `apps/web/src/App.tsx`, `AppShell.tsx`, `OperatorSessionContext.tsx`, API clients | login/org chrome, credentials | nav redesign |
| `apps/api/.env.example`, `apps/web/.env.example` | `WORKOS_CLOUD_ROOT` | real passwords |

### Docs (after runtime exists — not this task)

Roadmap, domain map, governance projection, `/modules`, `/governance`, `DEV_OPERATOR_MODE.md`. Do not edit them while planning.

---

## AE. Migration map

| Migration | DB | Purpose |
|---|---|---|
| `control-plane-migrations/001_organizations_users_sessions.sql` (name may split) | Control Plane | orgs, users, memberships, sessions, planes |
| operational `023_operational_plane_identity.sql` | every operational plane | singleton identity |

No `organization_id` columns on customers, quotes, people, cost evidence, inventory, or execution.

Existing 001–022 stay as-is. Adopted HUB MEDIA copy applies 023 once.

---

## AF. Phased implementation route

Four slices on `feat/workos-cloud-foundation-v1`. Do not merge to `main` until Slice 4 PASS + security review. Each slice that touches UI/runtime includes real stack, browser, network/console, screenshots, tests, commit, report.

### Slice 1 — Control Plane + plane identity + runtime routing

- **Objective:** two temp planes; request context binds the correct runtime; mismatch fails closed
- **Systems:** Control Plane sqlite, identity table, registry, route migration to `c.get`
- **DB:** new Control Plane; operational 023
- **Runtime:** no anonymous production fallback in Cloud mode; tests may inject
- **Tests:** control-plane CRUD, identity mismatch, registry isolation without pretending full auth productization — use test-issued sessions **only if** Slice 2 lands immediately after; prefer to keep Slice 1 unreleased and pair with Slice 2 before any shared environment
- **Rollback:** delete `WORKOS_CLOUD_ROOT`
- **Owner gate:** none beyond this plan
- **PASS:** opening Org B with Org A's file → `plane_identity_mismatch`; handlers no longer close over one startup runtime

Practical sequencing note: **do not deploy Slice 1 alone**. Land 1+2 on the feature branch before any shared API process.

### Slice 2 — Cloud auth + membership + authorization + login chrome

- **Objective:** email/password, cookies, owner/member gates, Login + org name
- **Systems:** password module, cloud routes, middleware, AppShell, fetch credentials
- **DB:** users/sessions already in Control Plane
- **Tests:** auth, rate limit, Secure/HttpOnly, owner vs member, no anonymous admin write
- **QA:** login/logout screenshots, 390px login, console clean
- **Owner gate:** none for synthetic users
- **PASS:** Cost Evidence / seller / people writes 401 anonymous and 403 as member

### Slice 3 — Bootstrap policies + provider isolation + HUB MEDIA adopt machinery

- **Objective:** policy dispatch; registry injection through execution; adopt CLI ready
- **Systems:** runtime bootstrap, seller/cost/people gates, `liveEligibleProviders` registry param, provision adopt
- **DB:** no new business tables
- **Owner gate:** `CANONICAL_HUB_MEDIA_PILOT_DATASET` before a real adopt is executed
- **PASS:** NEW/TEST policies never seed HUB MEDIA seller/people/OWNER_CONFIRMED rates; TEST assignment of `MCH-CNC-4020` fails; adopt dry-run works without source delete
- **QA:** HUB MEDIA adopt only after Owner paths; until then use a **copy of a synthetic stand-in** in CI, not a worktree guess

### Slice 4 — TEST COMPANY + isolation + switcher acceptance

- **Objective:** Organization #2 fixture + User A/B/(C) + hostile matrix + E2E
- **Tests:** section Y + browser
- **Owner gate:** first real Cloud owner credentials if this slice also provisions HUB MEDIA live; otherwise synthetic users suffice for isolation PASS
- **PASS:** datasets differ; switcher only for User C; operator session cleared; workcenters for TEST are not HUB MEDIA; rollback still possible

---

## AG. Security review plan

Independent read-only review before Foundation acceptance. Attack:

- session fixation / stolen cookie
- org switch without membership
- arbitrary plane path / `WORKOS_SQLITE_PATH` override in Cloud mode
- plane identity mismatch
- cross-org ids (section Y)
- attachment path escape
- OperatorSession surviving org switch
- member performing owner writes
- anonymous writes
- DEV Cloud or operator bypass in production
- trusted workforce leak
- seller leak
- Cost Evidence OWNER_CONFIRMED leak
- provider catalog leak (projection **and** assign)

P1/P2 blocks closure.

---

## AH. Runtime QA plan (future implementation slices)

Every UI/runtime slice:

1. Isolated `WORKOS_CLOUD_ROOT`
2. Real API + Vite
3. Browser login, org chrome, target flow
4. Network + console
5. Screenshots (desktop + 390px where the slice changes UI)
6. Targeted tests + affected regression
7. Commit + report

Do not split “code now, QA later”.

---

## AI. Documentation / modules / governance impact

After runtime actually changes (not now):

- `docs/roadmap/WORKOS_FINAL_ROADMAP_V1.md` — add Cloud Foundation; fix stale Cost Evidence sentence
- `docs/architecture/WORKOS_FINAL_SYSTEM_DOMAIN_AND_ADMINISTRATION_MAP.md` — Organization / User vs Person
- `docs/architecture/PRODUCT_SYSTEM_PERSISTENCE_CANON.md` — authorization becomes implemented
- `docs/development/DEV_OPERATOR_MODE.md` — Cloud login vs PIN
- `AGENTS.md` current position
- `/modules` and `/governance` projections only when Cloud is honest runtime truth

Promote audit + this plan into `main` **before** or **together with** the first Foundation product merge, never after silent implementation.

---

## AJ. Owner gates

Not blockers for Slice 1–2 planning/coding of synthetic worlds:

1. **CANONICAL_HUB_MEDIA_PILOT_DATASET** — sqlite path + documents root + backup confirmation, immediately before real adopt
2. **INITIAL_HUB_MEDIA_CLOUD_OWNER** — email + password at provision time; not stored in this plan
3. **Organization provisioning** — already decided: Owner-provisioned only

No other Owner technical questions.

---

## AK. Risks / blockers

- Shipping Slice 1 Cloud mode without Slice 2 auth (mitigate: one feature branch, no main until 2)
- `liveEligibleProviders` implicit global registry (must change in domain)
- Seller lazy seed on first quote freeze
- Cost Evidence marker copying OWNER_CONFIRMED
- Auto-picking a worktree sqlite
- `WORKOS_SQLITE_PATH` accidentally winning over Cloud root
- E2E suite size — add focused Cloud specs; do not rewrite every existing e2e in Slice 2

No architecture blocker.

---

## AL. Rejected / premature

`organization_id` spray; Postgres now; Hub; billing; SSO; Argon2 dependency for two users; device accounts; Machine Admin; Commercial Policy Admin; catalog CRUD; snapshot hash rewrite; production auth bypass for tests; self-service signup; hardcoded personal Cloud owner.

---

## AM. Metodă de lucru și logica abordării

Read-only tracks covered routing (11 registrars, closure-only handlers), operator cookie/crypto (reuse shape, new cookie), bootstrap honesty (17 OWNER_CONFIRMED cost rows, HUB MEDIA seller, trusted 8 people), and provider leak (`liveEligibleProviders` ignores injection).

The plan keeps the audit hybrid model and makes it implementable: separate Control Plane sqlite, derived locators, singleton plane identity, Hono request context, scrypt passwords without new packages, policy-gated bootstrap, and registry-threaded execution. Scope stays a HUB MEDIA pilot plus one synthetic org — not a SaaS platform.

---

## AN. Roadmap awareness checkpoint

- **ROADMAP_AWARENESS_SCORE = 8/10**
- **CURRENT_POSITION** = Cost Evidence in main; Cloud Foundation planned, not built
- **CAT_SUNT_IN_DIRECTIA_STABILITA = 90/100**
- **NEXT** = Owner/advisor review of this plan; then a **separate** GO for Slice 1+2 on a feature branch
- Audit + this plan must enter canonical history before product implementation is merged to `main`

---

## Scorecard

- PLAN_IMPLEMENTATION_READINESS = 8/10
- DATA_MIGRATION_SAFETY = 8/10
- AUTH_SECURITY_DESIGN = 8/10
- ORG_ISOLATION_DESIGN = 9/10
- CURRENT_RUNTIME_REUSE = 9/10
- OVERENGINEERING_RISK = LOW
- OWNER_DECISIONS_REMAINING = 2 (canonical dataset path; first Cloud owner credentials)
- IMPLEMENTATION_CAN_START_AFTER_OWNER_REVIEW = YES
- RECOMMENDED_FIRST_IMPLEMENTATION_SLICE = **Slice 1+2 together: Control Plane routing + Cloud auth** (do not run Cloud mode in a shared process without auth)
- ROADMAP_AWARENESS_SCORE = 8/10
- CAT_SUNT_IN_DIRECTIA_STABILITA = 90/100
