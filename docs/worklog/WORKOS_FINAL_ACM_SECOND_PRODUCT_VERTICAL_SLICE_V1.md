# ACM second-product vertical slice V1

Smallest useful second product to prove the LETTERS spine is generic.

## Decision

Non-illuminated basic ACM cassette. No lighting box. No Analyzer. No nesting.

```text
PRD-ACM-CASSETTE-NONE
Panou ACM casetat
SIGN_PANELS / ACM_CASSETTE_PANELS
FACE = ACM_CASSETTE_BODY
BACK = STEEL_INTERNAL_FRAME
```

Mounting is `root.mountingSystem`: Cornier oțel / Braț oțel vertical.
Finish is fixed `none`.
Fold count is workshop truth only. It does not change the frame formula or V1 cost.

## Owner-confirmed frame

```text
frame = panel − 2 × thickness − 2 mm
```

Golden fixture 1000 × 500 × 40 mm, ACM 3 mm, two folds, cornier:

```text
frame 992 × 492 mm
perimeter 2.968 m
blank DEVELOPMENT_DEFAULT 1080 × 580 → 0.6264 m²
```

Sheet quantity is one bounding-box unfold, not nesting.

## EIC

Generic engine. ACM sheet and steel profile have identities and no rates.
EIC is honestly PARTIAL. Commercial stays PARTIAL. No Quote freeze.

## Process

Type-driven extras. LETTERS bond/close/inspect require Plexiglas + aluminium types.
ACM attaches the internal frame, then packs.
Lighting readiness is `NOT_APPLICABLE` when no LIGHTING component is selected.

## UI

Same `/products/:productCode` grammar. No `/acm/*` page.

## Figma

Seat is View-only. No new file.

## Evidence

`docs/worklog/screenshots/acm-*.png`
