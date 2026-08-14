# WORKOS_FINAL_PRODUCT_SYSTEM_ADMIN_FOUNDATION_V1

TASK = Read-only Product System administration foundation

BASELINE = ded76c233d2bda430290565d0745179f74fa2278

## Method

One orchestrator. Existing Product System registries remain the only authority. Administration is a derived projection, not a second catalog.

No business DB. No fake CRUD. No global Administrare nav.

## Surface

`/components` hosts the foundation. Primary nav stays four items.

Taxonomy:

- Familii
- Categorii
- Produse
- Componente de produs
- Setări tehnice
- Compoziții
- Stare și lifecycle

Operator `/products` is unchanged.

## Canonical sources

| Admin view | Source |
|---|---|
| Families / categories | `productFamilies`, `productCategories` |
| Products / composition / form | `productTemplates`, `getFormSchema` |
| Variants / settings / used-by | `listComponentContracts`, `projectComponentArchitecture` |
| Resource references | contract `resourceIds` + Resources catalog |

No hardcoded `adminProducts`, products-using arrays, or admin settings registry.

## Lifecycle / delete

Projected as ACTIVE. No Activate / Retire / Delete buttons.

Empty categories (halou, integral aluminiu) are eligible to retire or delete because nothing references them.

Used family, used category, used variant, and the canonical product are not deletable. Product may later be retired; it is not deletable while it is the live catalog + form + composition record. No invented Order / snapshot blockers.

## Admin readiness

| Example | Class |
|---|---|
| Display labels | DISPLAY_EDITABLE |
| Category placement / product composition | STRUCTURE_EDITABLE |
| LED pitch | TECHNICAL_SETTING_EDITABLE |
| Formulas, reviewId | CODE_CONTRACT_ONLY |
| Retire / delete eligibility | LIFECYCLE_MANAGED |

Stable identity stays under Tehnic. Rename should change the display label.

## Persistence requirements (not implemented)

| Entity | Persist | Stable key | Version | Referential integrity | Soft retire | Historical refs |
|---|---|---|---|---|---|---|
| Family / category display | yes, for rename | family/category id | no | children / products | yes | later, if snapshots appear |
| Product display | yes, for rename | product code | no | composition / form | yes | later ProductTruth |
| Product composition | yes, later | product code + role | yes | variant must exist | yes | yes, after confirm |
| Component variant display | yes, for rename | variant id | no | products using it | yes | later |
| Technical setting value | yes | variant + setting id | yes | consumers of active version | n/a | yes, after snapshots |
| Lifecycle state | yes, with first write | entity id | no | blockers from live refs | yes | no current frozen records |

Do not select a database architecture in this build.

## Recommended first real write path

**Display-label rename** for family / category / product / variant.

Why: lowest referential risk, proves stable ID vs label, useful immediately, does not require settings versioning.

LED pitch update is the second candidate: high architecture proof, but needs versioned settings before any frozen record exists.

Do not implement either write path here.

## Cross-system reuse

Later Resources / People / Machines can copy the same principles:

catalog navigation → stable identity → display metadata → owned settings → relationships → lifecycle → retire/delete from real refs → admin readiness.

Schemas stay domain-specific. No universal admin framework was added.

## Governance

Roadmap item `Fundație administrare Product System` = IMPLEMENTED.

Write path, persistence, and global Administrare remain unimplemented.

## Cleanup audit

| Gate | Result |
|---|---|
| DUPLICATE_CATALOG_TRUTH | none found |
| DUPLICATE_RELATIONSHIP_TRUTH | none found; used-by derived from templates |
| DUPLICATE_TECH_SETTINGS | none found; settings from canonical registry |
| STALE_PRODUCT_SYSTEM_PROJECTION | `/components` now uses the admin projection |
| DEAD_ADMIN_CODE | unused web `/api/components` client removed; API kept |
| STALE_CANONICAL_DOCS | map, settings canon, roadmap, AGENTS updated |

## Limitations

No persistence. No editing. LIGHTING still UNAVAILABLE. PSU reserve still unresolved.

## Later correction

Component IDs `FACE_PLEXIGLAS_3MM`, `VOLUME_ALUMINIUM_06`, and `BACK_FOREX_10MM` were later migrated to constructive types. See `docs/worklog/WORKOS_FINAL_COMPONENT_CONFIGURATION_MODEL_REALIGNMENT_AND_CLEANUP_V1.md`.

## Next

Owner chooses the first real write path, then persistence. Not another theoretical audit.
