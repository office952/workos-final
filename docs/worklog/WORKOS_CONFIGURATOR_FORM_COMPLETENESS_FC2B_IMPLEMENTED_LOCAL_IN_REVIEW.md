# Configurator Form Completeness FC2B — implemented locally, in review

AUTHORITY                      = WORKOS_CONFIGURATOR_FORM_COMPLETENESS_FC2B
PROGRAM                        = CONFIGURATOR_FORM_COMPLETENESS
SLICE                          = FC2B_LETTERS_FACE_FORM_AND_RESOLVER_INTEGRATION
STATUS                         = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED                 = NO
PRODUCT_CODE                   = PRD-LETTERS-FRONTLIT-PLEXI-AL06
OLD_TEMPLATE_VERSION           = 1
NEW_TEMPLATE_VERSION           = 2
OLD_FORM_SCHEMA_ID             = prd-letters-frontlit-plexi-al06-form-v1
NEW_FORM_SCHEMA_ID             = prd-letters-frontlit-plexi-al06-form-v2
NEXT_RECOMMENDED_SLICE         = FC2C_LETTERS_VOLUME_CANT_FORM_AND_RESOLVER
FIGMA_WRITE                    = NO
REAL_CLOUD_WRITE               = NO
REAL_DB_WRITE                  = NO

This worklog records the FC2B LETTERS FACE V2 form and catalog-resolver slice. It is not Owner acceptance. Do not start FC2C, refresh Figma, or resume PURE CLIMATE from this file.

## Product Truth

FACE remains Plexiglas 3 mm opal. Finish is now order configuration:

- none
- Oracal 641 / 651 / 8500
- Print without laminate
- Print with laminate

RAL is not a FACE finish on this template. VOLUME form is unchanged.

## Contracts

- FormSchema owns configuration facts. Shared catalogs own colors and rolls.
- New reusable field types: `catalog_color`, `catalog_roll`. Compiler validation is explicit; unknown field types fail closed.
- One domain resolver (`resolveLettersFaceDraft` / `projectLettersFaceOptions`) serves presentation options, compile validation, snapshots, and resource resolution.
- Organization capability is injectable (`defaultFinishOrganization`). No HUB MEDIA organization id is hardcoded.
- ProductTemplate V2 declares FACE `slotFinishAllowances` using FC2A application identities.

## Legacy and history

- Unconfirmed `face.finish = vinyl` drafts normalize to Oracal 651. Free-text `face.color` becomes a catalog id only when the match is deterministic.
- Confirmed templateVersion = 1 truths stay on the V1 template/schema and are not recompiled through V2.
- Hidden stale child values may remain in draft storage. They do not enter compiled ProductDefinition, Review, ProductTruth, or cost.

## Snapshots and price

Confirmed V2 truth freezes color id/code/name/swatch, roll profile id, roll width, lamination, and application id. Later catalog or rate edits do not rewrite accepted records.

`PRICE_ACCURACY_BLOCKS_CONFIGURATION = NO`
`PRICE_CONFIDENCE_BLOCKS_EIC = NO`
`PRICE_CONFIDENCE_BLOCKS_QUOTE = NO`

## Resources

Quantity remains confirmed face area m². Selected roll width is persisted and does not change V1 quantity costing.

- none: no vinyl/print finish material
- 641: `MAT-VINYL-ORACAL-641` + `LAB-VINYL-FACE`
- 651: `MAT-VINYL-ORACAL-651` + `LAB-VINYL-FACE`
- 8500: `MAT-VINYL-ORACAL-8500` + `LAB-VINYL-FACE`
- print: `MAT-VINYL-PRINT` + `SVC-LARGE-FORMAT-PRINT` + `LAB-VINYL-FACE`
- print + laminate: those plus `MAT-VINYL-LAMINATE`

FACE apply labor still comes from the existing recipe when finish is vinyl, oracal, or print. Print-specific execution nodes stay deferred and do not block configuration or costing.
