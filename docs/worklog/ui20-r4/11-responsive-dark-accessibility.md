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

Hierarchy matches light.

## Accessibility

- Actions 44×44
- Keyboard: Command affordance `Ctrl+K / ⌘K` kept
- Focus: existing ink focus language, not removed
- State is not color-only (copy + position + structure)
- GRAYSCALE clones: `73:626` Cerere, `73:709` Lucrare, `73:768` Atelier
- Reduced motion: MOTION_OFF Ofertă `73:837` / `73:897`
- Romanian wrapping with diacritics; 768 overflow on Lucrare/Exec was corrected

LOGO_OFF + TITLE_OFF set: `73:161`–`73:547`.
