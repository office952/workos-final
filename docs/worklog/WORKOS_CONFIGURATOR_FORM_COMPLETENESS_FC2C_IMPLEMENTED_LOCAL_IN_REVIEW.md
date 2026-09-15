# Configurator Form Completeness FC2C — implemented locally, in review

AUTHORITY                      = WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2C
PROGRAM                        = CONFIGURATOR_FORM_COMPLETENESS
SLICE                          = FC2C_LETTERS_VOLUME_CANT_FORM_AND_RESOLVER
STATUS                         = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                 = NO
PRODUCT_CODE                   = PRD-LETTERS-FRONTLIT-PLEXI-AL06
TEMPLATE_VERSION               = 2
FORM_SCHEMA_ID                 = prd-letters-frontlit-plexi-al06-form-v2
NEXT_RECOMMENDED_SLICE         = CONFIGURATOR_LETTERS_RUNTIME_TO_FIGMA_POLISH_ROUNDTRIP
FIGMA_WRITE                    = NO
REAL_CLOUD_WRITE               = NO
REAL_DB_WRITE                  = NO

This worklog records the FC2C LETTERS VOLUME/CANT V2 form and catalog-resolver slice. It is not Owner acceptance. Do not start Figma write, design-delta implementation, or resume PURE CLIMATE from this file.

## Product Truth

VOLUME remains aluminium 0.6 mm. Depth stays 30 / 60 / 80 / 100 mm. Finish is now order configuration:

- Stoc
- Oracal 641
- Oracal 651
- Vopsit RAL

Oracal 8500, print, and print + laminate are not VOLUME V1 options. FACE V2 is unchanged.

## Contracts

- One domain resolver (`resolveLettersVolumeDraft` / `projectLettersVolumeOptions`) serves presentation options, compile validation, snapshots, and resource resolution.
- Shared FC2A applications: `return_stock`, `return_letters_standard` (641), `return_cant_volum_wrapping` (651), `return_ral`.
- 641 uses the accepted 651 palette projection and persists the operator 651 color id. Resource stays `MAT-VINYL-ORACAL-641`.
- Stock color is optional descriptive text and does not change price.
- `returnWrapAllowanceMm = 10` is an `ALUMINIUM_VOLUME` technical setting, not an order field.

## Legacy and history

- Unconfirmed `volume.finish = none` drafts normalize to stock.
- Unconfirmed `vinyl` drafts normalize to Oracal 651. Free-text `volume.color` becomes a catalog id only when the match is deterministic.
- Unconfirmed `painted` plus deterministic RAL text becomes `volume.ralColorId`.
- Confirmed templateVersion = 1 truths stay on the V1 template/schema and are not recompiled through V2.

## Wrap and cost

Oracal material quantity is confirmed perimeter × (depth + 10 mm), converted to m². No +20% waste. Selected roll is persisted and does not change V1 quantity.

- stock: no vinyl or RAL finish rows
- 641: `MAT-VINYL-ORACAL-641` + `LAB-VINYL-VOLUME`
- 651: `MAT-VINYL-ORACAL-651` + `LAB-VINYL-VOLUME`
- RAL: existing `SVC-PAINT-RAL` via the paint recipe

`PRICE_ACCURACY_BLOCKS_CONFIGURATION = NO`
`PRICE_CONFIDENCE_BLOCKS_EIC = NO`
`PRICE_CONFIDENCE_BLOCKS_QUOTE = NO`

## Local verification

- domain 522/522, including `lettersVolume.test.ts` (14)
- api 325/325, including `fc2c-letters-volume.test.ts` (5)
- web 286/286
- typecheck domain/api/web PASS
- lint 0 errors (11 pre-existing warnings)
- web build PASS
- docs:check PASS
- isolated Playwright `e2e/letters-volume-v2.spec.ts --retries=0` 5/5
- isolated Playwright FACE regression `e2e/letters-face-v2.spec.ts --retries=0` 5/5
- hook allowlist dirt left unstaged
