# WORKOS_FINAL_TECHNICAL_RESOURCE_EIC_SPINE_V1

TASK = First technical quantity + resource demand + internal cost vertical for LETTERS RETURN_CANT

BASELINE = 7a5df1fc5f8f57b6d6ceb7d0b23ceb01fec63dfb

FEATURE COMMITS =
- c5b3aab feat(domain): add RETURN_CANT quantity, resources, and EIC
- 5e1958e feat(product): confirm reviewed definition and project partial EIC

## Baseline

LETTERS configuration spine was already proven:

```text
ProductTemplate → FormSchema → Draft → ProductDefinition
→ explicit confirm → ProductTruth → ProductAggregate
```

Known warning at baseline: `/confirm` recompiled the current draft instead of confirming the reviewed definition.

## Component selection

Chosen pilot: **RETURN_CANT** (Cant).

Why:

- modular required component with a natural linear quantity basis;
- operator can confirm perimeter without fake Analyzer geometry;
- formula belongs to the component, not the root template;
- demand (aluminium profile + forming) is separable from cost and from commercial price.

Rejected for this build:

- FACE / BACK — need area; Analyzer remains unavailable;
- LIGHTING — needs LED counts and a larger catalog;
- finish/vinyl/paint as cost lines — not required to prove the spine;
- ACM / Logo — out of GO.

## Legacy evidence

Read-only via GitHub `office952/workos-vscode` (no local clone, no writes).

Kept conceptually:

- component-owned quantity (RETURN_CANT = linear length / perimeter);
- resource demand ≠ purchase/internal cost ≠ EIC ≠ customer price;
- RESOURCES_COST owns catalogs, evidence, and EIC;
- FACE / BACK / LIGHTING stay silent until they have real measurement truth.

Rejected:

- CostEngine / QuoteOrchestrator / unified Pricing UI;
- wholesale Product System / inventory / workcenter admin;
- legacy TPL-VOLUM-ALUMINIU catalog rates as authority (null / commercial_documented / MISSING_CATALOG_RATE);
- hours × hourly rate fallback;
- customer price, markup, quote freeze.

`NO WHOLESALE CODE COPY`

## Confirmation warning resolution

```text
draft
→ compile
→ reviewed ProductDefinition + reviewId
→ confirm EXACT reviewed definition + same reviewId
→ ProductTruth
→ ProductAggregate
→ EIC
```

`reviewId` is a deterministic FNV-1a digest of the reviewed definition (template, selected components, values, measurements). It is not a security hash and not a quote freeze.

Mismatch → 409. Not ready → 422. Confirm no longer recompiles a later draft.

## Technical truth

- Operator enters **Perimetru confirmat (mm)**.
- Provenance: `OPERATOR_MANUAL`, `confirmed = true`.
- This is measurement input, not WorkOS geometry and not Analyzer output.
- Canonical technical quantity unit is **meters**.
- Conversion happens in one place: `returnCantLinearMeters(mm) = mm / 1000`.
- `ml` is not used as an internal geometric unit.

Owner visual values: 12500 mm → 12.5 m.

## Resource ownership

ProductTemplate, ProductTruth, and ProductAggregate do not own rates.

Pilot catalog (typed in-code, EUR only, `PILOT_INTERNAL_EVIDENCE` / `AI_DECISION`):

| Resource | id | rate |
|---|---|---|
| Profil aluminiu cant | aluminium_return_profile | 10 EUR/m |
| Formare cant | return_cant_forming | 15 EUR/m |

These are internal evidence for the EIC pilot, not customer prices and not claimed legacy authority.

## EIC architecture

```text
confirmed perimeter
→ RETURN_CANT linear quantity (component-owned)
→ ResourceRequirement (demand)
→ catalog rate (Resources/Cost)
→ compileEic (single path)
```

12500 mm → 12.5 m

- Profil aluminiu cant: 12.5 × 10 = 125.00 EUR
- Formare cant: 12.5 × 15 = 187.50 EUR
- Total internal: 312.50 EUR
- Completeness: PARTIAL
- Excluded: Față, Spate, Iluminare

No customer price. No zero-cost placeholders for uncalculated components.

## API

Same three endpoints. Confirm now accepts `{ definition, reviewId }` and returns `{ truth, aggregate, eic }`.

No Pricing admin. No extra cost CRUD.

## UI owner check

- URL: `http://127.0.0.1:5173/products/letters`
- Nav: Stare sistem, Produse. No Prețuri / Pricing.
- Fill LETTERS, perimeter 12500 mm, verify, confirm.
- Expected: Lungime cant 12,5 m; two resource lines; total 312,50 EUR; partial product cost; Față/Spate/Iluminare not included.

## Tests

- Domain: measurement required, exact review invariant, quantity from truth, rate ownership, EIC math, unknown resource.
- API: confirm reviewed definition, reject mismatch/not-ready, return partial EIC.
- E2E: browser → API → truth → aggregate → resources → EIC.

## Runtime

BUSINESS_DB = NO. Typed in-code catalog only.

## Roadmap impact

- PHASE 6 = PILOT_VALIDATED (technical quantity for RETURN_CANT only)
- PHASE 7 = PILOT_VALIDATED (minimum RETURN_CANT catalog)
- PHASE 8 = PILOT_VALIDATED (partial EIC for RETURN_CANT)
- COMMERCIAL = NOT_COMPLETE

## Limitations

- One component calculated.
- Rates are pilot internal evidence, not confirmed purchase truth.
- Analyzer runtime is not integrated.
- Confirmation is runtime-only, not persisted.
- No resource admin UI.

## Next direction

Do not start automatically. Evaluate later: deeper LETTERS technical coverage vs second-component proof, then LETTERS Golden Path, then ACM generalization.
