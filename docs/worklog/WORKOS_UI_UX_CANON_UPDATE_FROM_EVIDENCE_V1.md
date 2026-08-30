# WORKOS_UI_UX_CANON_UPDATE_FROM_EVIDENCE_V1

Documentation-only update of the UI/UX direction canon from the accepted OLD + NEW audit. No product UI, no Figma, no plugins, no Cloud root.

```text
VERDICT                              = PASS
UI_UX_CANON_UPDATE_FROM_EVIDENCE     = COMPLETE
FIGMA                                = NOT_STARTED
UI_IMPLEMENTATION                    = NOT_AUTHORIZED
PRODUCT_CODE_DIFF                    = NONE
```

## A. Identity

```text
REPO     = office952/workos-final
WORKTREE = C:\Users\offic\workspace\workos-final-ui-ux-canon-update
BRANCH   = docs/ui-ux-canon-update-from-evidence-v1
BASE     = 8e371d511241bfdfc4560ba05bb1e70dcc2993ae
REMOTE   = https://github.com/office952/workos-final.git
COMMIT   = YES_IF_PASS
PUSH     = NO
```

## B. Method

Required sources were read in full: `AGENTS.md`, `README.md`, V1 roadmap, UI/UX direction canon, UI/UX foundation canon, system domain map, accepted audit report, evidence index, source-to-manifest reconciliation, screenshot manifest, and historical Machine Strict provenance.

Read-only lanes inspected the accepted pack, not a recapture:

- navigation and information architecture
- design system and theme
- operator experience and language
- accessibility and responsive
- OLD keep / reject
- NEW keep / change

One writer edited the authorized documents.

`ce-brainstorm` extracted principles from the Owner GO and the pack. `ce-plan` structured the four-class canon. `verify-this` checked worktree identity and the Produse / Product System split against committed screenshots. `ce-doc-review mode:headless` reviews the written canon.

No `docs/plans/` artifact was written. That would have expanded the authorized file set.

## C. Evidence inspected directly

Pack citations are from commit `8e371d5`, not from working-tree memory.

| Surface | Pack file | What the screen shows |
| --- | --- | --- |
| NEW shell / Lucrări | `jobs-overview__after-spine-populated__desktop__full.png` | Five top items; Lucrări active; search + filters + one job card; primary `Deschide execuția` |
| NEW catalog | `product-catalog__populated-catalog__desktop__full.png` | `Produse` + “Alegeți un produs din catalog”; nested FAMILIE / CATEGORIE / PRODUS cards |
| NEW admin | `admin-home__populated__desktop__full.png` | Domain cards; Sistem produs is one card under Sistem |
| NEW Product System | `admin-product-system__populated__desktop__full.png` | Local category + family rails; display label vs technical identity |
| NEW Atelier | `atelier-inbox__session-populated-or-ready__desktop__full.png` | Munca mea; Pot porni / Pregătire / Urmează; blocker “nu din Atelier” |
| NEW Comercial | `quotes-overview__after-spine-populated__desktop__full.png` | Level 2 Cereri / Oferte / Clienți; search + filters + list |
| NEW Execution | `execution-workspace__machine-blocked-or-planned__desktop__full.png` | Task groups Blocate / Urmează; allocate CTA; Detalii disclosure |
| NEW People | `admin-people-list__synthetic-populated__desktop__full.png` | Operational catalog; Activ / Retras; synthetic names only in this pack |
| NEW resources narrow | `admin-resources-catalog-categories__category-walk-narrow__narrow__full.png` | Category + item rails stacked into one column |
| OLD sidebar | `shell-sidebar-drawer__admin-nav__desktop__full.png` | Long domain + DEV sidebar; COMPAT / AUDIT; theme moon; Live DB |
| OLD execution | `execution-dashboard__direct-demo-populated__desktop__full.png` | `Execuție` + `Comenzi în execuție` + `DEMO-ORDER-001` |
| OLD execution detail | `execution-detail__demo-order-001-populated__desktop__full.png` | `Rezultat execuție` + `DEMO-ORDER-001`; canonical WC / MCH codes |

Historical Machine Strict files remain reference-only. They were not used as pack captures.

## D. Classification applied

### Promoted to INVARIANTS

Bounded global nav; three layers; list/detail for large collections; catalog ≠ Product System; hidden backend language; actionable badges; designed states; one primary action; Romanian + role; People names allowed when authorized; Atelier / Execution attention order; responsive foundation with mobile deferred; accessibility from the start; LIGHT + DARK + SYSTEM on one semantic token system; OLD is not a visual blueprint; no implementation from this file alone.

### Recorded as EVIDENCE_SUPPORTED

NEW short work-area set; Comercial as a zone; Product System under Administrare; fail-closed states; NEW keep / change list; OLD keep / do-not-copy list; light-only today vs required tri-mode; current card-wall and rail problems.

### Left as FIGMA_CANDIDATE

Three IA variants; `Produse` / `Catalog` / `Configurează` fork; Level 1 count and order; top vs sidebar vs hybrid; token values; component library; page vs drawer; which pilot screens enter scoped implementation.

### Left DEFERRED

Mobile rewrite, employee-mobile, universal redesign, decorative motion, free theme personalization, universal CRUD / Machine Admin, SVG/DWG, Logo, Analyzer, HR / pontaj / payroll, shop-floor map as inbox replacement, command palette as primary IA.

## E. What this revision does not decide

```text
SIDEBAR_FINAL           = NO
CATALOG_LABEL_FINAL     = NO
VISUAL_STYLE_FINAL      = NO
COMPONENT_LIBRARY_FINAL = NO
LAYOUT_FINAL            = NO
REACT_IMPLEMENTATION    = NO
```

The current five top-nav labels stay in the foundation canon until a later scoped UI GO changes the implemented shell.

Later, on 2026-08-30, Owner accepted V3 as living navigation direction (`UI_UX_NAVIGATION_V3_DESIGN = OWNER_ACCEPTED`). That later accept does not rewrite this 2026-08 evidence revision. Wave 1 implementation is now `IMPLEMENTED_LOCAL_IN_REVIEW`. Evidence pack SHA256: `8cd54c20144d8d1c25c59551f8c1655e163e358fbcee8af0d1d762206166b70e`.

## F. Authorized files

```text
docs/architecture/WORKOS_UI_UX_DIRECTION_CANON.md
docs/roadmap/WORKOS_V1_DELIVERY_ROADMAP.md
docs/worklog/WORKOS_UI_UX_CANON_UPDATE_FROM_EVIDENCE_V1.md
```

Not edited: product code, CSS, components, `.cursor/rules`, `AGENTS.md`, README, evidence pack, screenshots, audit manifests, `UI_UX_FOUNDATION_CANON.md`.

## G. Document review

Headless `ce-doc-review` ran coherence, feasibility, design/accessibility, product, scope-guardian, and adversarial lenses.

Applied only corrections that keep the Owner GO:

- join roadmap `NEXT_STEP` to the numbered Figma process
- keep `Catalog / Configurare` as a work-area hypothesis and `Configurează` as a separate action-label candidate
- bind Product System discoverability to the Administrare door
- state that LIGHT / DARK / SYSTEM does not authorize token implementation now
- reword “designed now” so it cannot start Figma
- distinguish commercial versus admin list/detail jobs

Rejected product-lens proposals that would move Owner-mandated attention order, drop Product System from the Figma demonstration list, or replace the hypothesized `Catalog / Configurare` work area with today’s `Produse`.

```text
DOC_REVIEW = PASS_WITH_GO_SAFE_CORRECTIONS
```

## H. Roadmap sync

After document review PASS:

```text
FULL_OLD_AND_NEW_UI_UX_AUDIT       = COMPLETE
UI_UX_CANON_UPDATE_FROM_EVIDENCE   = COMPLETE
CURRENT_MILESTONE                  = HUB_MEDIA_CLEAN_PILOT
NEXT_STEP                          = FIGMA_ACCESS_AND_INFORMATION_ARCHITECTURE
FIGMA                              = NOT_STARTED
UI_IMPLEMENTATION                  = NOT_AUTHORIZED
```

This worklog does not authorize Figma access or Mobbin installation.

## I. Stop

```text
PRODUCT_CODE_DIFF        = NONE
UI_CODE_DIFF             = NONE
CSS_DIFF                 = NONE
EVIDENCE_PACK_DIFF       = NONE
REAL_CLOUD_ROOT          = UNTOUCHED
FIGMA                    = NOT_STARTED
PLUGIN_INSTALLATION      = NONE
PUSH                     = NO
```
