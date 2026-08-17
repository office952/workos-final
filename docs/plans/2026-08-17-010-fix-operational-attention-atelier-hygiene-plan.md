---
title: "fix: Operational attention and Atelier hygiene"
date: 2026-08-17
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
product_contract_source: ce-plan-bootstrap
origin: OWNER GO WORKOS_FINAL_OPERATIONAL_ATTENTION_AND_ATELIER_HYGIENE_V1 + locked Owner Decisions addendum
---

# fix: Operational attention and Atelier hygiene

## Goal Capsule

After Claim-on-Start, Lucrări and Atelier still scream false operational attention. Retire “Executant nealocat” and “Task în lucru” as attention. Keep only true current blockers. Split Atelier into clear hierarchy so ready work is not buried under provider-needed flood. No provider assignment in Atelier; no stuck/SLA concepts.

## Product Contract (locked)

- PLANNED + executor null = normal → not attention
- IN_PROGRESS alone = normal → not attention
- Waiting dependencies = normal DAG → not attention
- Current provider blocker only: PLANNED + deps done + provider required + missing/invalid → attention “Lipsă echipament”
- Atelier hierarchy: În lucru → Pot porni acum (ready only) → Necesită pregătire atelier (N, collapsible) → Urmează
- No provider picker in Atelier; Deschide lucrarea only
- No STUCK / timeout / scheduler / alert entity

## Key Technical Decisions

1. Fix projection in `deriveJobAttention` only — no new task status.
2. Provider attention uses task fields (`waitingFor`, `requiresProvider`, `assignedProvider`), not aggregate `progress.noProvider` (which counts future gaps).
3. Atelier UI-only lane split; domain inbox already separates `availableReady` / `availableNeedsProvider`.
4. Collapse “Necesită pregătire atelier” by default when N > 2.

## Implementation Units

### U1. Lucrări attention truth

**Goal:** Align `needsAttention` with Claim-on-Start law.  
**Files:** `packages/domain/src/jobs/overview.ts`, `packages/domain/src/jobs/overview.test.ts`  
**Approach:** Remove executor-null and IN_PROGRESS branches. Attention = ORDER_CREATED | RELEASED | current provider blocker on task list.  
**Tests:** unclaimed PLANNED → not attention; IN_PROGRESS → not attention; deps-waiting provider gap → not attention; deps-done missing provider → Lipsă echipament; release/order stages unchanged.

### U2. Atelier hierarchy UX

**Goal:** First viewport shows working + startable work.  
**Files:** `apps/web/src/AtelierPage.tsx`, `apps/web/src/AtelierPage.test.tsx`, `apps/web/src/index.css`  
**Approach:** Rename/split lanes; collapsible details for needs-provider; Pornește only on ready lane.  
**Tests:** separate headings; ready shows Pornește; needs-provider has no Pornește and shows Deschide lucrarea; collapsed when many.

### U3. Runtime proof + docs

**Goal:** Prove Lucrări attention count drops and Florin sees Pot porni first.  
**Files:** worklog + screenshots under `docs/worklog/`  
**Verification:** API jobs summary; browser Lucrări + Atelier desktop/390px.

## Scope Boundaries

**Out:** Documents, Pontaj, RBAC, ACM, provider-from-Atelier, stuck detection, eligibility-zero attention (unsafe without new diagnostic), scheduling.

## Verification Contract

- Domain unit tests green for attention matrix
- Atelier unit tests green for hierarchy
- Runtime: needsAttention ≪ active jobs on dirty DB; Atelier shows “Pot porni acum” before collapsed provider section
- No new task authority; Claim-on-Start unchanged

## Definition of Done

Owner decisions 1–11 satisfied; screenshots; commit on feature branch; no roadmap edit unless Owner asks.
