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
Produse       →  /products
Administrare  →  /admin
```

Routes stay stable. Inspection surfaces live under Administrare:

```text
Operațiuni   Persoane
Atelier      Resurse, Stoc, Procese, Utilaje și zone
Sistem       Sistem produs, Module și componente, Guvernanță, Stare sistem
```

There is no empty Producție page. Execution lives on the confirmed product path.

## Visual primitives

Small token set in `apps/web/src/index.css`. Shared pieces only where reused:

- `PageHeader`
- `StatusChip`
- `Notice`
- `EmptyState`
- `Field`
- button roles: default primary, `button-secondary`, `button-quiet`, `button-danger`

## Action hierarchy

Primary: Pornește, Finalizează, Îngheață oferta, Acceptă oferta, Creează comanda, Acceptă pentru producție, Adaugă persoană.
Secondary: Alocă executant, Retrage persoana.
Quiet: Editează nume, filters, Detalii.

## Status presentation

Operator labels stay Romanian. Internal enums stay English.

Chips are sparse: plan/task status, Activ/Retras, Conform planului / Cu abatere.

## Execution reference pattern

Lead with inscription, progress and the next action.

Task row: SEQ + operation, status, echipament/zonă, executant, quantity, action.

Wait reasons stay compact. Plan ID and capability stay in Detalii.

Completed rows recede. Simple local filter: Toate / De făcut / În lucru / Finalizate.

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

After confirm, the form recedes. Hierarchy: confirmed product → compact internal cost → customer price → quote freeze → quote acceptance → order snapshot → production preview → accept for production → persisted execution. Customer price is more prominent than internal cost. PARTIAL commercial must not look like a final offer or allow quote freeze. Quote acceptance is not production acceptance. Creating an order is not production release. The workshop action Acceptă pentru producție remains a separate pilot path.

EIC total stays visible. Rates stay in Detalii. Preview is what production will require. Execution is persisted work.

## Future migration

New pages prefer these primitives. Existing pages migrate one surface at a time. Next candidate after this build: Product System admin.
