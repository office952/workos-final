# WorkOS Cloud Foundation V1 — Slice 1+2

Status: PASS on `feat/workos-cloud-foundation-v1`. Owner GO authorized Control Plane + verified operational planes + email/password membership. HUB MEDIA adopt and TEST COMPANY isolation stay later slices.

## What shipped

- Control Plane SQLite under `{CLOUD_ROOT}/control/control-plane.sqlite`: Organization, User, Membership (`owner` / `member`), PlatformSession, OperationalPlane descriptor.
- Operational migration 023: singleton `operational_plane_identity`. Request open asserts identity; missing or mismatch → HTTP 503. Provision binds once. Open does not re-stamp a missing row.
- Dual mode: `createApp()` stays single-plane and does not require Cloud cookies. `createApp({ cloud })` or process `WORKOS_CLOUD_ROOT` is Cloud-only. `WORKOS_CLOUD_ROOT` + `WORKOS_SQLITE_PATH` fail closed.
- Email/password Cloud auth, scrypt with explicit params, HttpOnly `workos_cloud_session`. Active organization lives on the platform session. `X-Organization-Id` is ignored.
- Owner writes gated in Cloud mode only: cost evidence, display-label, seller, people/skills/PIN, inventory adjust, execution provider/executor. Single-plane owner checks stay allow.
- OperatorSession remains. Org switch and Cloud logout revoke/clear the PIN cookie. DEV Operator Mode still cannot mint a Cloud session.
- Login wall when `mode === "cloud"` and there is no user. AppShell shows the organization name, a switcher only for multiple memberships, and **Ieși din cont**.
- Provision helper/CLI: `pnpm --filter @workos-final/api cloud:provision -- --root <dir> --org "…" --email … --password …`

## Proofs

- API 130 and web 83 tests green, including new Control Plane, auth, and plane-identity tests.
- Anonymous Cloud `/api/resources-admin` → 401 `invalid_session`. Member cost-evidence PATCH → 403. Owner PATCH → 200. Client org header does not change the session org.
- Plane identity mismatch / missing → 503. Failed open closes the SQLite handle.
- Isolated QA on API `8799` / web `5181` with `WORKOS_CLOUD_ROOT=%TEMP%\workos-cloud-foundation-qa-s12`. Synthetic owner logged in; shell showed **Atelier Alpha**. Browser console clean.

## Screenshots

1. Login desktop: `docs/worklog/screenshots/cloud-foundation-login.png`
2. Login 390 px: `docs/worklog/screenshots/cloud-foundation-login-390.png`
3. After login: `docs/worklog/screenshots/cloud-foundation-logged-in.png`

## Out of scope

HUB MEDIA dataset adopt, official TEST COMPANY fixture / hostile isolation matrix, bootstrap-policy honesty (seller / people / OWNER_CONFIRMED), WorkcenterRegistry through `liveEligibleProviders`, Postgres, Hub, billing, signup, SSO, merge to `main`.
