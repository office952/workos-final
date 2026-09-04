# UI20-R4 — Responsive, dark, accessibility

## Required widths

Cerere, Configurator, Lucrare, Atelier, Execuție exist at 1440, 1280, and 768.

768 keeps object, current state, current work, and next 44px action. Lucrare/Execuție 768 use Meniu chrome instead of the clipped desktop destination row.

## Dark

R3A charcoal + cream remains the baseline. No neon, glow, or cyberpunk.

| Dark proof | Node |
| --- | --- |
| Lucrare | `72:1916` |
| Cerere resolved | `72:372` |
| Execuție advanced | `72:1483` |

Independent R4 review failed Lucrare Dark primary `Continuă execuția` (node `72:1972` inside `72:1916`): dark-green fill on charcoal with near-ink text.

R4A correction, same node, no page redesign:

- fill `{ r: 0.78, g: 0.76, b: 0.71 }`
- text `{ r: 0.078, g: 0.086, b: 0.098 }`
- size 220 × 44

Hierarchy stays: one solid primary, one quiet secondary note. Light pages keep the dark primary. Dark Lucrare inverts the primary so the control remains the strongest action, not a camouflaged chip.

Exported: `lucrare-dark-1440.png`, `lucrare-dark-cta.png`.

```text
LUCRARE_DARK_CORRECTED_NODE = 72:1916
LUCRARE_DARK_PRIMARY = 72:1972
LUCRARE_DARK_CONTRAST = PASS
```

## Accessibility

- Actions 44×44
- Keyboard: Command affordance `Ctrl+K / ⌘K` kept
- Focus: existing ink focus language, not removed
- State is not color-only (copy + position + structure)
- GRAYSCALE clones: `73:626` Cerere, `73:709` Lucrare, `73:768` Atelier
- Reduced motion: MOTION_OFF Ofertă `73:837` / `73:897`; end-state meaning is immediate
- Romanian wrapping with diacritics; 768 overflow on Lucrare/Exec was corrected
- No clipping or overflow introduced by R4A

LOGO_OFF + TITLE_OFF set: `73:161`–`73:547`.
