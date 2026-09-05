# UI20-DL1 — Color + dark

Color is not identity. No brand rainbow.

## COLOR_ROLE_MAP

| Role | Light | Dark | Job |
| --- | --- | --- | --- |
| canvas | `#f4f3f0` | `#1c1d1f` | Page paper / charcoal |
| ink | `#141619` | `#ede8e0` | Primary reading |
| muted | `#616369` | `#ada89e` | Meta, idle nav |
| muted-warm | `#615c54` | `#ada89e` | Lucrare traveler meta |
| strip | `#e8e6e1` | `#262628` | Object register band |
| border | `#c8c4bc` | `#3a3b3d` | Hairline, secondary control |
| primary | `#1f332e` | `#c7c2b5` | Next valid act |
| on-primary | `#f4f3f0` | `#141619` | Label on primary |
| focus | `#141619` | `#ede8e0` | 2px ring |
| edge | `#141619` | `#ede8e0` | Attention bar only when current/missing |

Frozen Ofertă paper is slightly cooler `#f2f2f0`. Same role as canvas. Not a new token.

Lane B (late): Ofertă dark `96:1461` is still a warm-white artifact, not a charcoal page. The paper stays `#f4f3f0`. Only Destinations / object-register chrome sits on `#1c1d1f`. Do not restyle the quote into charcoal to “complete” dark.

## LIGHT_DARK_MAPPING

Dark preserves hierarchy: canvas recedes, ink reads, primary remains the strongest control by inverting to cream (R4A Lucrare `72:1972` / R5 `96:1573`). No neon. No glow. Ofertă is the exception that keeps commercial paper in dark.

## CONTRAST_RISKS

R5 dark Ofertă `96:1461` still paints Destinations / object IDs with light-theme `#141619` on charcoal `#1c1d1f`. The artifact body is warm white and already readable. Lucrare / Exec dark already use cream ink on charcoal. Treat Ofertă dark chrome as an inherited restyle gap, not a second look and not a reason to invert the quote paper.

Do not invent status greens/reds. State is copy + position + structure.

## STATE_COLOR_RULES

Selected / current / complete / blocked survive grayscale (R1 no-color board `10:108`). Primary fill may support. It must not be the only channel.

## WHAT_MUST_NOT_BE_A_TOKEN

Accent rainbow, success/warning/danger chips, glass elevation, glow.
