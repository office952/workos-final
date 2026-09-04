# UI20-R3 — Accessibility and 768

## 768

Required proofs: Cerere `34:2`, Configurator `34:20`, Atelier `46:72` (R3 `32:172` hidden), Resurse `32:147`.

Law: Meniu + object identity + current work + next action.

No desktop-long relation lines. No command palette as only navigation. No tiny technical type. Primary controls minHeight 44.

Atelier 768 is the current-operator inbox, not a dispatch card. Ready work has an explicit 44px **Pornește**. Evidence: `evidence/r3b-atelier-768.png`.

## Light / Dark

Commercial dark: Ofertă `46:135`. R3 `35:57` failed visual review (white planes, light-on-light) and is hidden.

Operational dark: Execuție `46:101`. R3 `35:2` failed the same way and is hidden.

R3A dark is designed charcoal + cream ink. No neon. No LED glow. No cyberpunk workshop. Material swatches only where they mean material identity (Resurse light).

Contrast review is visual on the exported screenshots, not token names. Text in `r3a-oferta-dark-1440.png` and `r3a-executie-dark-1440.png` is readable.

## Keyboard / focus

Desktop chrome exposes `Ctrl+K / ⌘K`. Command overlay shows esc and ↵. Focus rings are not a React implementation; targets are sized for 44px.

## Contrast advisory

Execuție light originally painted the 44px title near-white (`30:96`). Corrected to dark ink in R3 before documentation close.

R3 dark compositions failed independently and were rebuilt in R3A.

## Overflow

1440 frames are fixed 1440×900. 768 frames are 768×1024. Long Romanian strings wrap. No clipping observed on the captured R3A screens.
