# WORKOS_FINAL_OPERATIONAL_ATTENTION_AND_ATELIER_HYGIENE_V1

**Status:** IMPLEMENTED — runtime verified  
**HEAD baseline:** `b69ff69f7fcc44d1953d9e30490a746394baf3ad`  
**Branch:** `fix/operational-attention-atelier-hygiene`  
**Owner decisions:** locked addendum (Executant nealocat retired; IN_PROGRESS not attention; Atelier hierarchy A; no provider-from-Atelier; no stuck/SLA)

## What changed

### Lucrări — `deriveJobAttention`
- Removed **Executant nealocat** (PLANNED + null executor is normal under Claim-on-Start).
- Removed **Task în lucru** (IN_PROGRESS alone is normal progress).
- Provider attention only when **current** blocker: PLANNED + deps done + provider required + missing/invalid → **Lipsă echipament**.
- Kept: ORDER_CREATED → release; RELEASED → plan.

### Atelier hierarchy
1. În lucru la mine  
2. Pot porni acum (`availableReady` only + Pornește)  
3. Necesită pregătire atelier (N) — collapsed when N > 2  
4. Urmează  

No provider assignment in Atelier.

## Runtime proof (dirty local DB)

| Signal | Before | After |
|---|---|---|
| Attention labels | Executant nealocat / Task în lucru flooding | Only: Lipsă echipament / Urmează eliberarea / Urmează planul |
| Jobs summary (this DB) | 128/128 false-ish Christmas tree | 128 still “needs attention” but **truthful** backlog: 51 provider + 49 release + 28 plan |
| Atelier | Merged Disponibile with ~231 needs-provider | **Pot porni acum** with 2× Pornește; **Necesită pregătire atelier (231)** collapsed |

Screenshots:
- `docs/worklog/screenshots/hygiene-lucrari-attention.png`
- `docs/worklog/screenshots/hygiene-atelier-desktop.png`
- `docs/worklog/screenshots/hygiene-atelier-narrow.png`

## Tests
- `packages/domain/src/jobs/overview.test.ts` — Claim-on-Start attention matrix
- `apps/web/src/AtelierPage.test.tsx` — hierarchy + collapsed prep
- `apps/web/src/JobsOverviewPage.test.tsx` — fixture labels updated

## Out of scope (honored)
Documents, Pontaj, RBAC, ACM, provider picker in Atelier, stuck detection, eligibility-zero attention.

## Closure

### Impact Harta sistemelor
**NO OWNERSHIP CHANGE.**  
Lucrări and Atelier remain projections over existing Order / ExecutionTask / People / Provider truth. Attention owns no business state; Atelier owns no task authority.

### Impact Guvernanța sistemului
**NO OWNERSHIP CHANGE.**  
Attention is a derived signal only. Atelier does not invent scheduling, priority, or a second execution engine.

### Roadmap
Operational Attention + Atelier Hygiene = **DONE** after merge to `main`.

### Independent code review
**PASS** on implementation (`ec68a84`).

### Explicit non-goals kept
- No DB migration  
- No new mutation endpoint  
- No scheduling / priority / dispatch  
- No Provider workflow added in Atelier  
- Claim-on-Start and Execution lifecycle unchanged
