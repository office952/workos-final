# UI/UX foundation canon

Canonical current law for WorkOS operator/admin presentation.
Runtime wins if this document disagrees.

## UI owns experience, not business truth

React may own layout, hierarchy, interaction, local UI state and responsive behavior.

React must not own product truth, pricing, provider eligibility, executor eligibility, dependencies, task transitions or readiness.

## Shell

Primary navigation stays small so later domains do not accumulate in the top bar:

```text
WorkOS Final  →  /
Lucrări       →  /
Produse       →  /products
Administrare  →  /admin
```

`/` is the operational job overview. It is a read-only projection of commercial Orders and their Release / ExecutionPlan lineage. It does not own job status.

Routes stay stable. Inspection surfaces live under Administrare:

```text
Operațiuni   Persoane
Atelier      Resurse, Stoc, Procese, Utilaje și zone
Sistem       Sistem produs, Module și componente, Guvernanță, Stare sistem
```

Stare sistem lives at `/system`, reached from Administrare. There is no empty Producție page and no Execution top-nav item. After plan creation the overview and the product page hand off with **Deschide execuția** to the generic job workspace `/execution/:planId`.

## Visual primitives

Small token set in `apps/web/src/index.css`. Shared pieces only where reused:

- `PageHeader`
- `StatusChip`
- `Notice`
- `EmptyState`
- `Field`
- button roles: default primary, `button-secondary`, `button-quiet`, `button-danger`

## Action hierarchy

Primary: Pornește, Finalizează, Îngheață oferta, Acceptă oferta, Creează comanda, Eliberează pentru producție, Acceptă pentru producție, Adaugă persoană.
Secondary: Alocă executant, Retrage persoana.
Quiet: Editează nume, filters, Detalii.

## Status presentation

Operator labels stay Romanian. Internal enums stay English.

Chips are sparse: plan/task status, Activ/Retras, Conform planului / Cu abatere.

## Execution reference pattern

Lead with inscription, progress and the next action.

Task row: SEQ + operation, status, echipament/zonă, executant, quantity, action.

Wait reasons stay compact. Plan ID and capability stay in Detalii.

Completed rows recede. Tasks are grouped: Acum / următorul, Blocate, Urmează, Finalizate, then honest atelier gaps only for provider-required operations that have no eligible Machine/Workcenter. Manual operations are not workshop-configuration gaps.

## Admin catalog pattern

Owner inspection catalogs use category → item → detail. Do not flatten every resource, recipe or evidence row into one list.

Rates show value, currency and unit together, from backend evidence. UI does not convert or calculate.

Provenance uses the actual classification/source labels. Development defaults stay visually distinct from owner-confirmed truth. Raw IDs stay under Detalii.

Read-only admin pages say so once. Do not add disabled Edit controls.

Operational process catalogs use category → process → detail. Process, capability and provider stay visually separate: the process is the operation, the capability is what a provider must be able to do, the provider is where it can be done now. Coverage is a live projection, not process truth. Raw process and capability IDs stay under Detalii.

Workcenter catalogs use zone → equipment → detail. A workcenter-only provider is a zone / workstation, not a fake machine. A machine sits in a parent zone and supplies its own capabilities. Coverage is catalog presence, not busy/idle. Missing providers stay honest. Raw workcenter, machine and capability IDs stay under Detalii.

## People admin pattern

Compact rows. Create form uses `Field`. Retired list is secondary.

## Product configuration / result pattern

While editing, the form leads. Construction facts are a compact summary of supplied identity, not editable fields. Readiness is a short problem list from backend missing labels.

Review is a concise operator summary. Confirm is primary. Modify is secondary.

After confirm, the form recedes. Hierarchy: confirmed product → compact internal cost → customer price → quote freeze → quote acceptance → order snapshot → Eliberează pentru producție → Creează planul de execuție → Deschide execuția. Customer price is more prominent than internal cost. PARTIAL commercial must not look like a final offer or allow quote freeze. Quote acceptance is not production acceptance. Creating an order is not production release. Release is not plan creation. After the plan exists, preview is hidden and task work leaves the product page. On a commercial Order the next action is Eliberează pentru producție, then Creează planul de execuție, then Deschide execuția. Acceptă pentru producție remains only the Atelier / test tehnic path when no Order exists.

EIC total stays visible. Rates stay in Detalii. Preview is what production will require. Execution is persisted work.

`?order=` on the product page continues an existing commercial job. It does not recompile or mint a new review.

## Operational job overview

`/` lists commercial jobs as compact rows: inscription, stage, progress, next action.
Filters are Toate / Necesită acțiune / În execuție / Finalizate.
Metrics stay one summary line. No KPI cards, revenue, or capacity.
Stage, progress, blockers and next action come from `GET /api/jobs`.
Pilot / atelier releases are not listed.

## Future migration

New pages prefer these primitives. Existing pages migrate one surface at a time. Next candidate after this build: Product System admin.
