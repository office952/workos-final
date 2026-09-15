# FC2 LETTERS V2 current-UI E2E compatibility recovery

AUTHORITY                      = WORKOS_FC2_V2_E2E_CURRENT_UI_COMPATIBILITY_RECOVERY
PROGRAM                        = CONFIGURATOR_FORM_COMPLETENESS
SLICE                          = FC2_V2_E2E_CURRENT_UI_COMPATIBILITY_RECOVERY
STATUS                         = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                 = NO
BASE_HEAD                      = 8e429c8e7c3824b24502fc59829ea593763b3fab
LIVE_MAIN_BASE                 = aacbc212bf7149acca0811e97c05e9c4f21df4e6
PR31                           = DRAFT_OPEN
FC2_INTEGRATED_ON_MAIN         = NO
PRODUCT_TRUTH_CHANGED          = NO
FORM_SCHEMA_CHANGED            = NO
FIGMA_WRITE                    = NO
REAL_CLOUD_WRITE               = NO
REAL_DB_WRITE                  = NO

This worklog records test/helper recovery only. It is not Owner acceptance. Do not merge PR #31, write Figma, or resume PURE CLIMATE from this file.

## Classification

Current Configurator UI tests that still selected V1 `face.finish=vinyl` or `volume.finish=none` were category A and were migrated to V2 operator vocabulary:

- FACE: `none` | `oracal` + series `651` + catalog color `010 — White` + roll `roll:shared:oracal:1260` | `print`
- VOLUME: `stock` | `oracal` | `painted` + RAL `9010 — Pure white`

Category B/C/D kept legacy values:

- FACE V1 vinyl draft normalization: `packages/domain/src/finishes/lettersFace.test.ts`
- VOLUME V1 none → stock and vinyl → Oracal 651: `packages/domain/src/finishes/lettersVolume.test.ts`
- Historical `templateVersion = 1` snapshot immutability: both files above
- API/request fixtures that still post `volume.finish: "none"` remain legacy draft inputs

## Helper law

- Added `e2e/helpers/lettersV2.ts` as the canonical current-UI fill/confirm helper.
- `confirmCanonicalLettersOnPage` now uses that helper.
- Removed the `8e429c8` silent shim in `selectProductChoice` that mapped arbitrary `Finisaj volum` / `none` to `stock`. Current UI tests now speak `stock` directly.

Full isolated E2E also required `e2e/owner-surfaces.spec.ts` to select `Setări tip Iluminare frontală cu module LED` after opening Setări tehnice. FC2C added `Setări tip Aluminiu` (wrap 10 mm), which is now the first catalog item. That is current Product System UI, not a Product Truth change.

## Evidence

Starting-head CI `35019055966` on `8e429c8` completed `failure`. That run is not exact-head evidence after this recovery commit.

Stale CI on `3990ec8` is ignored.
