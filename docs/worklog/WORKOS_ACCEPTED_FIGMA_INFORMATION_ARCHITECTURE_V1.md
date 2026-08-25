# WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1

Documentation and Figma-consistency record of the Owner-accepted information architecture. No product UI, no high-fidelity drawing, no design-system build, no Cloud root.

```text
VERDICT                              = PASS
OWNER_IA_DECISION                    = ACCEPTED_WITH_AMENDMENTS
OWNER_IA_GATE                        = CLOSED
INFORMATION_ARCHITECTURE             = OWNER_ACCEPTED
HIGH_FIDELITY                        = NOT_STARTED
UI_IMPLEMENTATION                    = NOT_AUTHORIZED
PRODUCT_CODE_DIFF                    = NONE
```

## A. Identity

```text
REPO     = office952/workos-final
WORKTREE = C:\Users\offic\workspace\workos-final-accepted-figma-ia-sync
BRANCH   = docs/accepted-figma-ia-sync-v1
BASE     = cf678813fe07e450e484b0f72f5a0a6a8d9b27b2
REMOTE   = https://github.com/office952/workos-final.git
COMMIT   = YES_IF_PASS
PUSH     = NO
```

This task resumed from a new chat in the already prepared worktree after a mid-turn worktree migration failed. No second worktree was created.

## B. Sources consulted

Read in full before writing:

- `docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md`
- `docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md`
- `docs/architecture/UI_UX_FOUNDATION_CANON.md`
- `docs/worklog/WORKOS_UI_UX_CANON_UPDATE_FROM_EVIDENCE_V1.md`

Inspected Figma file:

```text
NAME     = WorkOS V1 — Information Architecture
FILE_KEY = 7elwvIscvMPDiEHrX4f6kQ
URL      = https://www.figma.com/design/7elwvIscvMPDiEHrX4f6kQ
```

```text
ROADMAP_READ       = YES
UI_UX_CANON_READ   = YES
DIRECTION_CONFLICT = NO
```

No direction conflict: invariants stay; the previous revision left navigation structure and the `Produse` / `Catalog` / `Configurează` fork as Figma candidates; Owner has now accepted those IA forks. The implemented shell in the foundation canon still records today’s `Produse` label until a later scoped UI GO.

## C. Candidates A / B / C and kept scores

Figma page 03 compared three navigation candidates. Page 07 recorded the evidence scores. Those scores were not rewritten after the Owner decision.

| Candidate | Structure | Evidence total / 100 | Owner result |
| --- | --- | ---: | --- |
| A | Top navigation | 85 | Accepted for the next design stage |
| B | Compact / collapsible sidebar | 76 | Evaluated, not selected |
| C | Hybrid | 77 | Evaluated, not selected |

Kept criterion scores from page 07:

| Criterion | Weight | A | B | C |
| --- | ---: | ---: | ---: | ---: |
| Informational scalability | 20 | 17 | 18 | 16 |
| Operator clarity | 20 | 18 | 15 | 14 |
| Operational speed | 15 | 13 | 11 | 12 |
| Domain separation | 15 | 12 | 13 | 14 |
| Useful density | 10 | 9 | 6 | 7 |
| Responsive foundation | 10 | 8 | 6 | 8 |
| Accessibility | 10 | 8 | 7 | 6 |
| Total | 100 | 85 | 76 | 77 |

A was recommended for one navigation landmark and density on Lucrări / Atelier. B keeps domains visible but spends width and degrades when names collapse to initials. C separates local jobs, but two chrome bands can be read as a second global menu. No candidate was styled as a visual winner.

## D. Owner decision

```text
OWNER_IA_DECISION       = ACCEPTED_WITH_AMENDMENTS
GLOBAL_NAVIGATION       = A_TOP_NAV
LEVEL_1                 = Lucrări | Atelier | Comercial | Catalog | Administrare
LEVEL_2                 = CONTEXTUAL_ONLY_WHEN_NEEDED
CATALOG                 = LEVEL_1_DOMAIN
CONFIGUREAZĂ            = CONTEXTUAL_ACTION
PRODUCT_SYSTEM          = ADMINISTRARE
DENSITY                 = INTERMEDIATE
PRIMARY_ENTITY_DETAIL   = STABLE_PAGE
ADMIN_COLLECTIONS       = SPLIT_LIST_DETAIL
SHORT_ACTIONS           = DRAWER_OR_DIALOG
FINAL_VISUAL_STYLE      = NOT_SELECTED
HIGH_FIDELITY           = NOT_STARTED
IA_GATE                 = CLOSED
NEXT                    = PILOT_HIGH_FIDELITY_SCOPE_DEFINITION
```

Level 2 appears only when the selected Level 1 domain needs it. Cereri / Oferte / Clienți stay inside Comercial. Execution stays reachable from Lucrări, not as a sixth global domain.

## E. Catalog versus Product System

```text
/products             = catalog + configurator comercial
/admin/product-system = Product System
```

`Catalog` is the accepted Level 1 label for the sellable catalog. `Configurează` opens configuration from that catalog or from a selected sellable product. Product System remains an Administrare inspection / administration surface. URLs do not change. Business language that really means a product, a product page, or Sistem produs was not renamed.

## F. Accepted interaction patterns

```text
PRIMARY_DETAIL_PATTERN    = STABLE_PAGE
ADMIN_COLLECTION_PATTERN  = SPLIT_LIST_DETAIL
SHORT_ACTION_PATTERN      = DRAWER_OR_DIALOG
INFORMATION_DENSITY       = INTERMEDIATE
```

A primary entity keeps a stable page and URL. Large admin collections use split list/detail. Short actions may use a drawer or dialog; that is not the only way to reopen a record.

## G. Proposed 12-screen high-fidelity set

Proposed on Figma page 08. Owner scope approval is still required. This list does not authorize drawing.

1. Lucrări — list / empty / populated
2. Detaliu lucrare
3. Comercial — Cereri
4. Detaliu cerere
5. Comercial — Oferte
6. Clienți — representative list/detail
7. Catalog
8. Configurator produs
9. Atelier
10. Execuție lucrare
11. Administrare — Resurse list/detail
12. Administrare — Sistem produs

## H. Still unselected

- final visual style
- palette
- token values
- final components
- shadcn or another UI kit
- high-fidelity layouts
- full responsive implementation
- mobile rewrite
- Mobbin research
- which of the twelve proposed screens enter the next scoped drawing GO

## I. Figma consistency work

One writer. Authorized page edits only:

- `00 — Read Me & Evidence` — replaced stale `OWNER_DECISION = REQUIRED` with the accepted status block. Kept `INFORMATION_ARCHITECTURE = ACCEPTED`, `HIGH_FIDELITY = NOT_STARTED`, `IMPLEMENTATION = NOT_AUTHORIZED`.
- `02 — Domain Architecture` — Level 1 `Produse*` became `Catalog`. `/products` and `/admin/product-system` stayed distinct. Product System stayed in Administrare.
- `05 — Screen Architecture` — global-domain labels `Produse` became `Catalog`. `Configurează` stayed a contextual action. Sistem produs and business “produs” copy were not renamed.

Read-only inspection: pages 03, 07, and 08 already recorded A as selected, Catalog as the Level 1 label, and the Owner signature. Historical B/C frames and the page-07 evidence notes were left as candidate history.

```text
FIGMA_PAGES_UPDATED            = 00, 02, 05
FIGMA_STALE_OWNER_DECISION     = NONE
CATALOG_VS_PRODUCT_SYSTEM      = CLEAR
HIGH_FIDELITY                  = NOT_STARTED
```

## J. Authorized repo files

```text
docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md
docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md
docs/worklog/WORKOS_ACCEPTED_FIGMA_INFORMATION_ARCHITECTURE_V1.md
```

Not edited: product code, CSS, components, foundation canon, evidence pack, Cloud root, other Figma pages.

## K. Stop

```text
PRODUCT_CODE_DIFF        = NONE
UI_CODE_DIFF             = NONE
CSS_DIFF                 = NONE
HIGH_FIDELITY            = NOT_STARTED
DESIGN_SYSTEM            = NOT_STARTED
REAL_CLOUD_ROOT          = UNTOUCHED
PLUGIN_INSTALLATION      = NONE
PUSH                     = NO
```
