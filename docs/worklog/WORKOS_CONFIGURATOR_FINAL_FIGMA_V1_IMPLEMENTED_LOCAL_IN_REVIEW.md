# Configurator final Figma 219:3 — implemented local in review

```text
STATUS                         = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                 = NO
BRANCH                         = feat/configurator-final-figma-v1
FIGMA_FILE_KEY                 = hu6gJrm0KM2NPkaIpQ8Kfo
FIGMA_PAGE                     = Configurator / 0:1
FIGMA_CANONICAL_SECTION        = 219:3
FIGMA_ARCHIVE                  = 219:2  (not implemented)
IMPLEMENTATION                 = PRESENTATION_ONLY
CONFIGURATOR_CURRENT_CONTRACT_PRESENTATION_V1 = IMPLEMENTED_LOCAL_IN_REVIEW
PRODUCT_LOGIC_CHANGED          = NO
BACKEND_CHANGED                = NO
API_CHANGED                    = NO
DB_CHANGED                     = NO
CLOUD_WRITE                    = NO
PUSH                           = NO
MERGE_MAIN                     = NO
NEXT_GATE                      = CHATGPT FINAL LOCAL IMPLEMENTATION REVIEW
```

## Authority

Owner GO authorized React implementation from accepted Configurator Final Figma.
Only section `219:3` is implementation authority. Archive `219:2` and historical
`80:*` studies were not used as layout sources.

Roadmap and UI canons were read. This file does not rewrite them.

## Scope reconciliation

```text
VISUAL_AUTHORITY                 = Figma hu6gJrm0KM2NPkaIpQ8Kfo / section 219:3
CURRENT_RUNTIME_PRODUCT_AUTHORITY = existing ProductTemplates / FormSchemas / ProductDefinition
FUTURE_COMPOSITE_CAPABILITIES    = NOT_IMPLEMENTED_BY_THIS_WAVE
FIGMA_VISUAL_CONFLICT            = NO
FIGMA_SYNTHETIC_SEMANTIC_GAP     = YES
CURRENT_DOMAIN_CONFLICT          = NO_AFTER_SCOPE_RECONCILIATION
```

Section `219:3` is visual and interaction grammar authority: rail, two-column
bench, Blueprint / Editor, composition review, hit targets, and incomplete
wording. It is not a license to persist Figma's synthetic composite facts.

Current domain is runtime Product Truth authority. The application renders
fewer scopes than the Figma fixture rather than inventing unsupported groups,
assembly, joints, Logo contract, or ACM + LETTERS persistence.

These future composite capabilities are **not** silently implemented:

- COMUN / group / layer persistence
- LOGO execution contract
- ACM + LETTERS composite persistence
- Assembly Interface persistence
- segmented-panel persistence
- Joint relation contract

No synthetic Figma fixture value (`CER-1042`, Atelier Nova, GRĂDINIȚA,
PRICHINDEL, 1600 / 3200 split, Easy Fix, Joint, Mai multe bucăți) became
production truth. Those strings exist only in tests, presentation fixtures,
or unrelated historical docs / legitimate vinyl resource identity.

COMPOZIȚIE means a read-only summary of **this** ProductDefinition /
ProductAggregate. It does not mean an ACM + LETTERS assembly exists.

The previous STOP on material Figma/domain conflict is reconciled by this
classification: visual grammar may follow 219:3; product facts stay on the
current templates.

## Domain contradiction (not hardcoded around)

Figma fixture is one assembly: „Ansamblu ACM + litere volumetrice” with four
scopes, letter groups, multi-piece ACM, and Ansamblare Direct / Joint.

`origin/main` Product System has two separate templates and no composition,
group override, or inter-product assembly contract.

```text
LETTERS  → scopes LITERE + COMPOZIȚIE
ACM      → scopes PANOU ACM + COMPOZIȚIE
ANSAMBLARE = hidden until a real relation contract exists
title    = template.label
targets  = none unless domain exposes groups/layers
```

B / D / E / F Figma states are covered by presentation fixtures plus projector
tests that current products do **not** emit those scopes or overrides.

## Current product projection

COMPOZIȚIE is a read-only summary of **this** ProductDefinition /
ProductAggregate. Copy: „Rezumat numai-citire al acestui produs.” It does
not claim ACM + LETTERS assembly, Joint, or Assembly Interface.

Live status `complete` / `statusLabel` comes from domain
`compileDefinition(...).readiness` inside `projectConfiguratorView`.
Review still requires API `compileConfiguration`. Confirm still requires
API `confirmReviewedConfiguration`. UI does not persist Product Truth.

### LETTERS — `PRD-LETTERS-FRONTLIT-PLEXI-AL06`

```text
template   packages/domain/src/product/frontlitPlexiAl06.ts
           frontlitPlexiAl06Template.components
           FACE / VOLUME / BACK / LIGHTING
schema     frontlitPlexiAl06FormSchema
           ROOT / FACE / VOLUME  (BACK + LIGHTING are identity / derived)
kind       configuratorProductKind → letters
rail       availableConfiguratorScopes → LITERE + COMPOZIȚIE
blueprint  blueprintSectionsFor → ROOT/FACE/VOLUME/BACK/LIGHTING
           labels PRODUS / FAȚĂ / CANT / SPATE / ILUMINARE
editor     projectConfiguratorView.editorComponentIds
           ROOT/FACE/VOLUME/BACK/LIGHTING → FormRenderer
           section titles via editorSectionLabel / sectionTitleForView
status     compileDefinition.readiness === "ready"
           → "Configurare completă" else "X din Y module validate"
page       ProductConfigurationPage → ConfiguratorWorkspace
```

### ACM — `PRD-ACM-CASSETTE-NONE`

```text
template   packages/domain/src/product/acmCassetteNone.ts
           acmCassetteNoneTemplate.components
           FACE = ACM_CASSETTE_BODY (Corp casetă ACM)
           BACK = STEEL_INTERNAL_FRAME (Cadru intern)
schema     acmCassetteNoneFormSchema
           ROOT (denumire + mounting) / FACE (width/height/depth/folds)
kind       configuratorProductKind → acm
rail       availableConfiguratorScopes → PANOU ACM + COMPOZIȚIE
blueprint  blueprintSectionsFor → ROOT/FACE/BACK/LIGHTING
           labels PRODUS / CORP CASETAT / CADRU INTERN / ILUMINARE
editor     ROOT / FACE / BACK → FormRenderer
           ROOT mounting stays product-owned; not Assembly Interface
status     same compileDefinition.readiness path
```

## Source-to-component mapping

| Figma 219:3 | Runtime |
|---|---|
| Quiet top shell | Existing `AppShell` / UI20 L1 |
| Object context 28px | `ConfiguratorWorkspace` context strip from request / catalog |
| Page identity | `template.label` + derived module status |
| R1 datum rail | Available scopes only; brackets + azure tick |
| Configurezi COMUN / groups | Rendered only when `view.targets` exist |
| Blueprint | Effective identity + visible draft facts; required empty = `NECONFIGURAT` |
| Editor | Existing `FormRenderer` / field widgets, section titles FAȚĂ / CANT / SPATE / ILUMINARE or CORP CASETAT / CADRU INTERN |
| Compoziție | Read-only items + `Editează în …`; no verify CTA |
| Confirmă configurația literelor | Kept real action `Verifică configurația` |

Route remains `/products/:productCode` with `?request=` `?quote=` `?order=`.
Quote / order restore paths were not redesigned.

## Responsive contract

```text
1440  pad 48  two-column
1280  pad 32  editor 560px  blueprint fill
768   pad 24  stack Blueprint then Editor
```

E2E asserts column count: 2 at 1440/1280, 1 at 768.
Product-truth blueprint text is identical across those viewports.

## Tests and runtime proof

Reconciled 2026-09-14 on `feat/configurator-final-figma-v1` at `e993a70` plus
uncommitted current-contract wording / evidence amendments:

```text
typecheck           PASS  pnpm typecheck                 exit 0
lint                PASS  pnpm lint                      exit 0  (11 pre-existing warnings)
web unit            PASS  configurator + page + form     20/20
domain unit         PASS  453/453
api unit            PASS  302/302
playwright          PASS  16/16  configurator-final, acm-cassette, product-catalog,
                          quote-snapshot, quotes-overview, requests-overview,
                          hf-wave2, owner-surfaces
PLAYWRIGHT_RETRIES  = 0
web build           PASS  pnpm --filter @workos-final/web build  exit 0
HISTORICAL_SCREENSHOT_SIDE_EFFECTS_CLEANED = 114  (restored to HEAD; not committed)
```

Screenshots (local synthetic runtime, no cloud write):

```text
docs/worklog/screenshots/configurator-final-c-litere-comun-{1440,1280,768}.png
docs/worklog/screenshots/configurator-final-g-compozitie-{1440,1280,768}.png
docs/worklog/screenshots/configurator-final-h-incomplete-{1440,1280,768}.png
docs/worklog/screenshots/configurator-final-a-panou-acm-1440.png
```

D personalized has no live product groups. Unit fixture covers presentation.
Runtime D screenshot = not applicable.

## Known advisories

- Not pixel-parity with Figma fixture chrome (assembly title, four always-on scopes, COMUN/GRĂDINIȚA/PRICHINDEL/LOGO, Oracal / inner lip / multi-piece / Joint).
- Geist is not loaded; interface stays IBM Plex Sans.
- Scoped configurator tokens (`#F7F8FA`, `#1A1D21`, Azure `#2066CF`) do not rewrite the global app theme.
- Rail brackets are restrained CSS, not Figma’s exact glyph weight.
- Composition review is unnumbered (rail remains non-wizard).
- Segmented chips stay visually azure; native select remains the labelled control so existing e2e `selectOption` paths hold.
- Dark theme on this surface still uses the scoped light canvas tokens.

## Verdict

```text
VERDICT = IMPLEMENTED_LOCAL_IN_REVIEW
```
