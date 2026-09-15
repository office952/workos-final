# Configurator Form Completeness — FORM_COMPLETENESS_AUDIT_V1

Accepted inventory for Configurator Form Completeness. This file is the FC0 audit. It is not Owner acceptance of FC1, not historical UI-FC0, and not Product Truth.

```text
AUTHORITY                      = FORM_COMPLETENESS_AUDIT_V1
PROGRAM                        = CONFIGURATOR_FORM_COMPLETENESS
SLICE                          = CANONICAL_AUDIT
IMPLEMENTATION                 = NO
PRODUCT_TRUTH_WRITE            = NO
CHATGPT_INDEPENDENT_REVIEW     = ACCEPTED
ORIGIN_MAIN_AT_AUDIT           = 756b9f6f537cf5ee571583577ef2552d28a0923b
HARNESS_V2                     = INTEGRATED_ON_MAIN
CONFIGURATOR_UI_UX_FRAMEWORK   = FROZEN_V1
LETTERS_FIELD_COUNT_CURRENT    = 8
ACM_FIELD_COUNT_CURRENT        = 6
```

Do not confuse this token with living `UI_FC0_*` records.

## Authority used

1. Current ProductTemplates
2. Current FormSchemas
3. Current component contracts
4. `compileDefinition`
5. Canonical architecture docs
6. Current runtime / tests

Legacy WorkOS, Figma fixtures, and research are evidence only.

## Question

What product facts are currently canonical, which must be editable or visible in Configurator, what is missing today, and which candidates require an Owner Product Truth decision?

The question is not “what fields would be nice.”

## Live products

### PRD-LETTERS-FRONTLIT-PLEXI-AL06

- `identityFacts` (4): iluminare frontală; Plexiglas 3 mm opal; Aluminiu 0,6 mm; Forex 10 mm
- `fixedValues` (8): face/volume/back materials and thicknesses, `face.opticalType=opal`, `lighting.mode=front_lit`
- Components: FACE `PLEXIGLAS_FACE`, VOLUME `ALUMINIUM_VOLUME`, BACK `FOREX_BACK` with `inputMapping.confirmedAreaMm2FromComponentId=FACE`, LIGHTING `LIGHTING_FRONT_LED` required
- FormSchema (8): `root.inscription`; `face.finish` / `face.color` (vinyl) / `face.confirmedAreaMm2`; `volume.depthMm` (30/60/80/100) / `volume.finish` / `volume.color` (vinyl|painted) / `volume.confirmedPerimeterMm`
- BACK / LIGHTING have no form fields. LED pitch / module power / PSU reserve stay `TECHNICAL_SETTING`

### PRD-ACM-CASSETTE-NONE

- `identityFacts` (3): ACM 3 mm; Profil oțel; Fără iluminare
- `fixedValues` (4): `face.materialFamily=acm`, `face.thicknessMm=3`, `face.finish=none`, `back.materialFamily=steel`
- Components: FACE `ACM_CASSETTE_BODY`, BACK `STEEL_INTERNAL_FRAME` only
- FormSchema (6): `root.inscription`, `root.mountingSystem`; `face.widthMm`, `face.heightMm`, `face.cassetteDepthMm`, `face.foldCount`
- `foldCount` is workshop truth and does not change frame/cost in current V1
- Frame / blank / LED quantities are calculate-time, not form fields

## Classification

### A — CURRENT_TRUTH_COMPLETE

The 8 LETTERS and 6 ACM FormSchema fields through FormRenderer + `isFieldVisible` + `compileDefinition` + ConfiguratorWorkspace edit/review. Identity/fixed materials. Hidden technical settings. ACM fold/mounting stored as current contract. Confirm uses compiled readiness. Live rail does not invent ANSAMBLARE / groups / logo. Calc quantities stay post-confirm.

### B — CURRENT_TRUTH_UI_GAPS

- **B1** Post-confirm / configuration summary can expose a draft field hidden by visibility rules (`selectedConfigurationFacts` ignored `isFieldVisible`)
- **B2** LETTERS BACK inherited FACE area exists via `inputMapping` and is not projected. Live Blueprint never emitted `kind: inherited`
- **B3** ACM Blueprint manufactured a LIGHTING component section although the template has only FACE + BACK. `Fără iluminare` is legitimate identity and must remain visible
- **B4** ACM `face.thicknessMm=3` is `FIXED_BY_PRODUCT` but UI can project the compiled measurement as derived / operator-entered. Presentation only
- **B5** `N din M module validate` can imply completeness while ROOT still blocks `compileDefinition.readiness`

### C — CURRENT_TRUTH_DOMAIN_EXPOSURE_GAPS

Deferred. Not FC1.

- ACM `face.finish=none` is `fixedValues` / `FIXED_BY_PRODUCT` but not `identityFacts`
- `compileDefinition` does not emit a BACK measurement — correct; do not add a second area owner
- `volume.finish=painted` is a form option; VOLUME calculate adds vinyl material only. Paint exists later as process/EIC service
- `projectConfiguratorView` ignores passed `definition` and recompiles the draft locally

### D — OWNER_DECISION_REQUIRED

Oracal/RAL catalogs; roll width; print/laminate; lighting color; alternate LED; back bevel; per-letter override; logo; groups; ACM profiles / traverse / V-groove / developed-blank-as-fields / extended frame; ACM finishes as order fields; LED/frame/blank quantities as configuration; exposing `TECHNICAL_SETTINGS` on the form.

### E — FUTURE_COMPOSITE_OUT_OF_SCOPE

Groups/layers; COMUN / per-group; logo/emblem; ACM+LETTERS persistence; Assembly / Joint; segmented-panel; multi-product; ANSAMBLARE scope.

## Ownership

- FIXED_BY_PRODUCT: LETTERS/ACM materials, thicknesses, ACM finish none, lighting mode
- CONFIGURABLE_BY_ORDER: LETTERS finishes/colors/depth; ACM depth, foldCount, mountingSystem
- MATERIAL_IDENTITY: `face.opticalType` (locked in `fixedValues`)
- MEASUREMENT: confirmed area/perimeter; ACM width/height
- TECHNICAL_SETTING: LED pitch, module power, PSU reserve
- DERIVED: BACK area via mapping; ACM frame/blank; LED counts — calculate-time

```text
COMPILER_READINESS_DUPLICATION = NO
UI_INVENTED_PRODUCT_TRUTH      = YES
```

Narrow invented surfaces: leftover hidden draft color in summary; ACM LIGHTING component slot.

## Smart modularity

Same ProductTemplate / FormSchema for every company. Unused template stays unused. Richer config later is a new template version + Owner truth, not a client fork. After quote/order, snapshots stay immutable.

```text
CUSTOMER_OPERABLE_WITHOUT_CURSOR = YES
NO_CLIENT_CODE_FORK              = YES
FROZEN_UI_FRAMEWORK_PRESERVED    = YES
```

## Recommended implementation sequence

FC1 = B1–B5 projection repairs only.

- DOMAIN_CHANGE = NO
- PRODUCT_TEMPLATE_CHANGE = NO
- FORM_SCHEMA_CHANGE = NO
- COMPILER_CHANGE = NO
- OWNER_DECISION_REQUIRED = NO
- Do not run `evaluateProductComponents` in Configurator
- Do not write a BACK `TechnicalMeasurement`
- Do not delete ACM `identityFacts.lighting`
- Do not widen `TechnicalMeasurement.source`

C/D/E stay out of FC1.

## Roadmap living-state amendment (implementation start)

Do not rewrite historical UI-FC0 blocks. Do not set bare `FC0 = COMPLETE`.

```text
ORIGIN_MAIN                    = 756b9f6f537cf5ee571583577ef2552d28a0923b
CURSOR_WORKOS_HARNESS_V2       = INTEGRATED_ON_MAIN
FORM_COMPLETENESS_AUDIT_V1     = ACCEPTED
FORM_COMPLETENESS              = FC1_IMPLEMENTED_LOCAL_IN_REVIEW
NEXT_PRODUCT_PROGRAM           = CONFIGURATOR_FORM_COMPLETENESS
```

## FC2A status pointer

Do not rewrite the FC1 block above. Living flags after FC2A local implementation:

```text
FORM_COMPLETENESS              = FC2A_IMPLEMENTED_LOCAL_IN_REVIEW
FORM_COMPLETENESS_FC2A         = IMPLEMENTED_LOCAL_IN_REVIEW
FC2_DECISION_PACK              = ACCEPTED_WITH_TARGETED_AMENDMENTS
NEXT_PRODUCT_SLICE             = FC2D_RESOURCE_IDENTITIES_AND_EDITABLE_COSTING
```

Worklog: `docs/worklog/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2A_IMPLEMENTED_LOCAL_IN_REVIEW.md`.

## FC2A1 status pointer

Do not rewrite the FC2A block above.

```text
FORM_COMPLETENESS              = FC2A1_IMPLEMENTED_LOCAL_IN_REVIEW
FORM_COMPLETENESS_FC2A1        = IMPLEMENTED_LOCAL_IN_REVIEW
FC2D_AUTHORIZED                = NO
NEXT_PRODUCT_SLICE             = FC2D_RESOURCE_IDENTITIES_AND_FUNCTIONAL_PROVISIONAL_COSTING
```

Worklog: `docs/worklog/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2A1_IMPLEMENTED_LOCAL_IN_REVIEW.md`.

## FC2D status pointer

Do not rewrite the earlier FC2 blocks above.

```text
FORM_COMPLETENESS              = FC2D_IMPLEMENTED_LOCAL_IN_REVIEW
FORM_COMPLETENESS_FC2D         = IMPLEMENTED_LOCAL_IN_REVIEW
FC2D_AUTHORIZED                = NO
FC2B_AUTHORIZED                = NO
NEXT_PRODUCT_SLICE             = FC2B_LETTERS_FACE_FORM_AND_RESOLVER_INTEGRATION
PRICE_CALIBRATION_DOES_NOT_BLOCK_WORKFLOW = YES
```

Worklog: `docs/worklog/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2D_IMPLEMENTED_LOCAL_IN_REVIEW.md`.

## FC2B status pointer

Do not rewrite the earlier FC2 blocks above.

```text
FORM_COMPLETENESS              = FC2B_IMPLEMENTED_LOCAL_IN_REVIEW
FORM_COMPLETENESS_FC2B         = IMPLEMENTED_LOCAL_IN_REVIEW
FC2B_AUTHORIZED                = NO
FC2C_AUTHORIZED                = NO
NEXT_PRODUCT_SLICE             = FC2C_LETTERS_VOLUME_CANT_FORM_AND_RESOLVER
LETTERS_TEMPLATE_VERSION       = 2
PRICE_ACCURACY_BLOCKS_CONFIGURATION = NO
```

Worklog: `docs/worklog/WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2B_IMPLEMENTED_LOCAL_IN_REVIEW.md`.
