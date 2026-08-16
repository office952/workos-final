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
Atelier      Resurse, Procese, Utilaje și capacitate
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

Primary: Pornește, Finalizează, Acceptă pentru producție, Adaugă persoană.
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

## People admin pattern

Compact rows. Create form uses `Field`. Retired list is secondary.

## Product configuration / result pattern

While editing, the form leads. Construction facts are a compact summary of supplied identity, not editable fields. Readiness is a short problem list from backend missing labels.

Review is a concise operator summary. Confirm is primary. Modify is secondary.

After confirm, the form recedes. Hierarchy: confirmed product → compact internal cost → production preview → accept → persisted execution.

EIC total stays visible. Rates stay in Detalii. Preview is what production will require. Execution is persisted work.

## Future migration

New pages prefer these primitives. Existing pages migrate one surface at a time. Next candidate after this build: Operational Processes.
