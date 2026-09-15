# WorkOS Romanian terminology canon

```text
ROLE                       = AUTHORITY
OWNS                       = OPERATOR_FACING_ROMANIAN_TERMS_FOR_CURRENT_SURFACES
DOES_NOT_OWN               = PRODUCT_FIELDS, READINESS, PRICING, FIGMA_COPY_AS_TRUTH, UI_COPY_CHANGES
SUPERSEDES                 = NONE
SUPERSEDED_BY              = NONE
LIVE_STATE_DEPENDENCY      = YES
LAST_RECONCILIATION_RULE   = RECONCILE_WHEN_OPERATOR_LABELS_OR_CANON_LABELS_CHANGE
```

Operator-facing WorkOS language is Romanian. Internal code and contracts may stay English.

This inventory is taken from current accepted UI source labels and current canons. It does not invent translations. It does not authorize UI copy changes.

## Law

```text
OPERATOR_UI_LANGUAGE       = RO
INTERNAL_CODE_LANGUAGE     = EN_ALLOWED
DO_NOT_CANONIZE_FROM_MEMORY = YES
PRODUCT_UI_CHANGE_IN_THIS_FILE = NO
```

If this file and live UI disagree, live UI is evidence and the conflict must be classified. Do not silently redefine a term to hide the conflict.

## Conflicts and debt

```text
TERMINOLOGY_DEBT           = CONFIGURATOR_PROGRESS_MODULE_COPY
SEVERITY                   = NONBLOCKING
REQUIRES                   = FUTURE_UI_COPY_RECONCILIATION
DO_NOT_FIX_IN_DOCS_ONLY    = YES
```

Canon and `docs/README.md` reserve **module** for system modules. FACE / VOLUME / BACK / LIGHTING are **componente**. Current Configurator status copy still says `N din M module validate` (`apps/web/src/configurator/configuratorView.ts`). That copy is frozen V1 presentation. This debt is recorded, not repaired here.

```text
TERMINOLOGY_DEBT           = VOLUME_LABEL_CANT_VS_VOLUM
SEVERITY                   = NONBLOCKING
REQUIRES                   = FUTURE_UI_OR_CANON_LABEL_RECONCILIATION
```

Product-system canon uses role **VOLUME** and Romanian **Volum**. Frozen Configurator LETTERS Blueprint uses **CANT**. Both exist. Neither is deleted here.

## Inventory

Each row has a unique `CONCEPT`. Duplicate `CONCEPT` values are forbidden.

### CONCEPT = CLIENT

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Client / Clienți |
| INTERNAL_CODE_TERM | Customer / customerId |
| SCOPE | Comercial registry and workspace |
| ALLOWED_VARIANTS | Adaugă client |
| DEPRECATED / AVOIDED TERMS | Customer in operator UI |
| NOTES | Technical domain remains Customer. There is no `/api/clients`. |
| AUTHORITY / EVIDENCE | `docs/architecture/CUSTOMER_IDENTITY_CANON.md`; `navigationRegistry.ts` label `Clienți` |

### CONCEPT = CERERE

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Cerere / Cereri |
| INTERNAL_CODE_TERM | CommercialRequest / Request |
| SCOPE | Comercial intake |
| ALLOWED_VARIANTS | Cerere de ofertă |
| DEPRECATED / AVOIDED TERMS | Ticket, lead |
| NOTES | Operator name in request canon is **Cerere de ofertă**. Nav label is **Cereri**. |
| AUTHORITY / EVIDENCE | `docs/architecture/COMMERCIAL_REQUEST_CANON.md`; `navigationRegistry.ts` |

### CONCEPT = OFERTA

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Ofertă / Oferte |
| INTERNAL_CODE_TERM | Quote / QuoteSnapshot |
| SCOPE | Frozen commercial offer |
| ALLOWED_VARIANTS | none currently required |
| DEPRECATED / AVOIDED TERMS | Quote in operator UI |
| NOTES | Customer PDF is Ofertă. Nav label is **Oferte**. |
| AUTHORITY / EVIDENCE | `docs/architecture/QUOTE_SNAPSHOT_CANON.md`; `QUOTE_DOCUMENT_CANON.md`; `navigationRegistry.ts` |

### CONCEPT = COMANDA

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Comandă |
| INTERNAL_CODE_TERM | Order / OrderSnapshot |
| SCOPE | Accepted commercial job |
| ALLOWED_VARIANTS | Comandă creată |
| DEPRECATED / AVOIDED TERMS | Order in operator UI |
| NOTES | Current confirm workspace heading is **Comandă creată**. |
| AUTHORITY / EVIDENCE | `ProductConfigurationViews.tsx`; `ORDER_SNAPSHOT_CANON.md` |

### CONCEPT = LUCRARE

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Lucrări |
| INTERNAL_CODE_TERM | Job / jobs |
| SCOPE | Production / commercial job overview |
| ALLOWED_VARIANTS | none currently required |
| DEPRECATED / AVOIDED TERMS | Home as a replacement for Lucrări |
| NOTES | `/` stays Lucrări. Acasă is not authorized as root. |
| AUTHORITY / EVIDENCE | `UI_UX_FOUNDATION_CANON.md`; `navigationRegistry.ts` |

### CONCEPT = ATELIER

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Atelier |
| INTERNAL_CODE_TERM | atelier / operator inbox |
| SCOPE | Operator task orientation |
| ALLOWED_VARIANTS | Munca mea as page lead |
| DEPRECATED / AVOIDED TERMS | Using Atelier as a second Product Truth |
| NOTES | Atelier owns no truth. Admin group “Atelier” is workshop configuration, a different meaning. |
| AUTHORITY / EVIDENCE | `OPERATOR_TASK_INBOX_ATELIER_CANON.md`; `navigationRegistry.ts` |

### CONCEPT = EXECUTIE

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Execuție |
| INTERNAL_CODE_TERM | Execution / ExecutionPlan |
| SCOPE | Persisted plan and tasks |
| ALLOWED_VARIANTS | Planul de execuție |
| DEPRECATED / AVOIDED TERMS | none recorded |
| NOTES | Execution workspace page title is **Execuție**. |
| AUTHORITY / EVIDENCE | `ExecutionWorkspacePage.tsx`; execution canons |

### CONCEPT = CONFIGURARE

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Configurare |
| INTERNAL_CODE_TERM | Configurator / ProductConfiguration |
| SCOPE | Product form on `/products/:code` |
| ALLOWED_VARIANTS | Configurare completă; Configurare Panou ACM |
| DEPRECATED / AVOIDED TERMS | none recorded |
| NOTES | Completeness copy is projection over `compileDefinition.readiness`. |
| AUTHORITY / EVIDENCE | `configuratorView.ts`; `CONFIGURATOR_V1_UI_FRAMEWORK.md` |

### CONCEPT = COMPOSITIE

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Compoziție |
| INTERNAL_CODE_TERM | compozitie scope |
| SCOPE | Configurator read-only composition |
| ALLOWED_VARIANTS | COMPOZIȚIE rail label |
| DEPRECATED / AVOIDED TERMS | Invented groups / logo as composition |
| NOTES | Frozen V1 Composition is review of this product only. |
| AUTHORITY / EVIDENCE | `configuratorView.ts`; Configurator framework |

### CONCEPT = FATA

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | FAȚĂ |
| INTERNAL_CODE_TERM | FACE |
| SCOPE | LETTERS Configurator Blueprint / Editor |
| ALLOWED_VARIANTS | Față in documentation |
| DEPRECATED / AVOIDED TERMS | Treating FACE as a system module |
| NOTES | Documentation often writes Față. Frozen LETTERS UI writes FAȚĂ. |
| AUTHORITY / EVIDENCE | `configuratorView.ts` `LETTERS_SECTION_LABEL.FACE`; component configuration canon |

### CONCEPT = VOLUM

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | CANT in Configurator; Volum in product-system docs |
| INTERNAL_CODE_TERM | VOLUME |
| SCOPE | LETTERS volume role |
| ALLOWED_VARIANTS | CANT, Volum |
| DEPRECATED / AVOIDED TERMS | Silently collapsing one term over the other |
| NOTES | See `VOLUME_LABEL_CANT_VS_VOLUM`. |
| AUTHORITY / EVIDENCE | `configuratorView.ts` `VOLUME: "CANT"`; `PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md` |

### CONCEPT = SPATE

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | SPATE |
| INTERNAL_CODE_TERM | BACK |
| SCOPE | LETTERS Configurator Blueprint |
| ALLOWED_VARIANTS | Spate in documentation |
| DEPRECATED / AVOIDED TERMS | Second BACK area owner |
| NOTES | Inherited FACE area may display as Suprafață / Moștenit. |
| AUTHORITY / EVIDENCE | `configuratorView.ts`; FC1 projection |

### CONCEPT = ILUMINARE

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Iluminare |
| INTERNAL_CODE_TERM | LIGHTING |
| SCOPE | LETTERS component; ACM identity fact only |
| ALLOWED_VARIANTS | Fără iluminare |
| DEPRECATED / AVOIDED TERMS | Synthetic ACM LIGHTING component section |
| NOTES | ACM template has no LIGHTING component. Identity **Fără iluminare** remains legitimate. |
| AUTHORITY / EVIDENCE | `acmCassetteNone` identityFacts; Configurator FC1 |

### CONCEPT = COMPONENTA

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | componentă / componente |
| INTERNAL_CODE_TERM | ProductComponent / componentId |
| SCOPE | FACE / VOLUME / BACK / LIGHTING roles |
| ALLOWED_VARIANTS | none currently required |
| DEPRECATED / AVOIDED TERMS | Calling these roles “module” in new copy |
| NOTES | Roles are componente. Constructive types are separate. |
| AUTHORITY / EVIDENCE | `PRODUCT_SYSTEM_COMPONENT_CONFIGURATION_CANON.md`; `docs/README.md` |

### CONCEPT = MODULE_SYSTEM

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | module (system modules only) |
| INTERNAL_CODE_TERM | system module |
| SCOPE | Future system-module language, not product anatomy |
| ALLOWED_VARIANTS | none currently required |
| DEPRECATED / AVOIDED TERMS | FACE/VOLUME/BACK/LIGHTING as modules in new documentation |
| NOTES | Existing Configurator progress copy still says “module validate”. See debt above. |
| AUTHORITY / EVIDENCE | `docs/README.md` terminology note; `configuratorView.ts` status label |

### CONCEPT = COST_INTERN

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Cost intern |
| INTERNAL_CODE_TERM | EIC / internal cost |
| SCOPE | Resources and confirmed product money |
| ALLOWED_VARIANTS | Cost intern estimat; Cost intern produs |
| DEPRECATED / AVOIDED TERMS | Presenting EIC as Preț client |
| NOTES | Rates live only in Resources/Cost. |
| AUTHORITY / EVIDENCE | `ProductConfigurationViews.tsx`; `RESOURCES_AND_COST_CANON.md` |

### CONCEPT = PRET_COMERCIAL

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Preț client |
| INTERNAL_CODE_TERM | CommercialPrice / grossPrice |
| SCOPE | Customer commercial money |
| ALLOWED_VARIANTS | Preț final client; Preț client neconfirmat |
| DEPRECATED / AVOIDED TERMS | Mixing with Cost intern |
| NOTES | Customer price is more prominent than internal cost after confirm. |
| AUTHORITY / EVIDENCE | `ProductConfigurationViews.tsx`; Foundation canon |

### CONCEPT = OPERATOR

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | operator |
| INTERNAL_CODE_TERM | operator / person |
| SCOPE | People and Atelier execution |
| ALLOWED_VARIANTS | none currently required |
| DEPRECATED / AVOIDED TERMS | Exposing account email as the shop-floor operator identity |
| NOTES | Organization ≠ authenticated account ≠ operational operator. |
| AUTHORITY / EVIDENCE | `PEOPLE_OPERATIONAL_IDENTITY_CANON.md`; Configurator framework identity law |

### CONCEPT = UTILAJ

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Utilaje |
| INTERNAL_CODE_TERM | Machine |
| SCOPE | Workshop equipment |
| ALLOWED_VARIANTS | none currently required |
| DEPRECATED / AVOIDED TERMS | none recorded |
| NOTES | Nav destination label is **Utilaje**. |
| AUTHORITY / EVIDENCE | `navigationRegistry.ts` |

### CONCEPT = WORKCENTER

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Utilaje și zone |
| INTERNAL_CODE_TERM | Workcenter |
| SCOPE | Capability-provider zones |
| ALLOWED_VARIANTS | zonă; Identitate zonă |
| DEPRECATED / AVOIDED TERMS | Invented capacity as Product Truth |
| NOTES | Admin page title is **Utilaje și zone**. |
| AUTHORITY / EVIDENCE | `WorkcentersAdminPage.tsx`; `WORKCENTERS_AND_MACHINES_CANON.md` |

### CONCEPT = RESURSA

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Resurse / Resurse și costuri |
| INTERNAL_CODE_TERM | Resource |
| SCOPE | Rate and cost-evidence administration |
| ALLOWED_VARIANTS | Costuri interne as a resources surface label in tests/UI |
| DEPRECATED / AVOIDED TERMS | A second rate store in Intake |
| NOTES | Nav label is **Resurse și costuri**. |
| AUTHORITY / EVIDENCE | `navigationRegistry.ts`; Resources canon |

### CONCEPT = PROCES

| Field | Value |
|---|---|
| PREFERRED_ROMANIAN_UI_TERM | Procese |
| INTERNAL_CODE_TERM | OperationalProcess |
| SCOPE | Shop-floor process catalog |
| ALLOWED_VARIANTS | none currently required |
| DEPRECATED / AVOIDED TERMS | none recorded |
| NOTES | How work is performed belongs to processes, not calculation contracts. |
| AUTHORITY / EVIDENCE | `OPERATIONAL_PROCESSES_CANON.md`; admin navigation |
