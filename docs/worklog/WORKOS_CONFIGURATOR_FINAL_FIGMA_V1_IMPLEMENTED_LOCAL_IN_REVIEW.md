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
PRODUCT_LOGIC_CHANGED          = NO
BACKEND_CHANGED                = NO
API_CHANGED                    = NO
DB_CHANGED                     = NO
CLOUD_WRITE                    = NO
PUSH                           = NO
MERGE_MAIN                     = NO
NEXT_GATE                      = CHATGPT INDEPENDENT IMPLEMENTATION REVIEW
```

## Authority

Owner GO authorized React implementation from accepted Configurator Final Figma.
Only section `219:3` is implementation authority. Archive `219:2` and historical
`80:*` studies were not used as layout sources.

Roadmap and UI canons were read. This file does not rewrite them.

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

```text
web unit            PASS  (includes A–H projector + workspace)
domain unit         PASS
api unit            PASS
web typecheck/lint  PASS  (pre-existing warnings only)
web build           PASS
playwright          PASS  configurator-final, product-catalog, acm-cassette,
                          quote-snapshot, requests-overview, hf-wave2, owner-surfaces
PLAYWRIGHT_RETRIES  = 0
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
