# Development Operator Mode

Local convenience only. Not product authentication. Not production auth.

## What it is

When enabled, the web app can obtain a **normal** OperatorSession for one configured
Person without typing a PIN. Claim-on-Start, Complete, Atelier, and eligibility stay
on the same production path: cookie → session → Person → domain.

## Enable (local only)

API (process environment — this API does not auto-load dotenv):

```powershell
$env:WORKOS_DEV_OPERATOR_BYPASS = "1"
$env:WORKOS_DEV_OPERATOR_PERSON_ID = "per:legacy:florin-cnc"
pnpm --filter @workos-final/api dev
```

Safe example file: `apps/api/.env.example` (copy values into your shell; do not commit secrets).

Web (`apps/web/.env.local`, never commit secrets):

```text
VITE_WORKOS_DEV_AUTO_OPERATOR=1
```

Then:

```text
pnpm --filter @workos-final/api dev
pnpm --filter @workos-final/web dev
```

Open `http://127.0.0.1:5173` — AppShell should show `DEV · Operator: …` without PIN entry.

## Pick a personId

Use a stable `personId`, never displayName.

1. Open People admin, or
2. `GET http://127.0.0.1:8787/api/people` and copy `personId`.

Example trusted bootstrap id: `per:legacy:florin-cnc` (only if that Person exists in your DB).

No default Person. If the id is missing/unknown/RETIRED, auto-identity fails and the UI stays unidentified.

## Disable

Set flags to `0` / empty, or remove them. Reload a fresh browser session.
PIN identification behaves exactly as production.

## Safety

- Requires **non-production** runtime (`NODE_ENV !== production`) **and** `WORKOS_DEV_OPERATOR_BYPASS=1`.
- `NODE_ENV=production` + bypass=1 → API **refuses to start**.
- `POST /api/dev/operator-session` returns 404 when bypass is off.
- No second session type. Same HttpOnly cookie and token-hash persistence.
- Start/Complete never read `personId` from the client as actor.

## Test the real PIN path

Leave bypass off (default). Use Identifică-te in AppShell.
