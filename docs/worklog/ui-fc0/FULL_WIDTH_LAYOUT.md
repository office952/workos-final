# UI-FC0 — full-width content plane

```text
PROPOSED_LAW = FULL_WIDTH_WITHIN_WORKOS_CONTENT_PLANE
IMPLEMENTATION = NO
CSS_WRITE = NO
```

## Proposed rule

Inside the WorkOS shell, primary page content uses the **available content plane** after the sidebar. It is not a centered marketing column.

At 1440 with sidebar 256:

```text
SHELL = 1440
SIDEBAR = 256
CONTENT_PLANE = 1184
PRIMARY_GUTTER = 24 to 32
PRIMARY_CONTENT ≈ 1120 to 1136
```

Exceptions (keep constrained):

- reading-width lead copy
- focused forms (Date firmă, login card)
- dialogs / drawers
- focused execution decision rail
- narrow confirmation tasks

## Live Figma

Confirmed on `4:379` and `203:1734`. See `FIGMA_LIVE.md`.

## Runtime source (read-only)

`apps/web/src/index.css`:

- `.app-shell { --sidebar-expanded: 256px }`
- `.app-content { width: 100%; max-width: none; padding: 1.25rem 1.5rem 2rem }`

Runtime already follows the plane law at the shell. Drift is **inner** max-width, not a second shell.

## Known inner constraints (not automatically wrong)

| Selector | max-width | Class |
| --- | --- | --- |
| `.page-lead` | 42rem | reading-width exception |
| `.login-page` | centered card | focused auth exception |
| `.client-profile-hint` | 52.5rem | reading-width |
| several admin notes | 28–36rem | reading-width / form |

Do not assume every max-width fails the law.

## Runtime drift to verify with fresh screenshots

Count after capture. Candidate: Product System `OwnerCatalogView` 16rem rail + leftover detail; if the detail pane looks like a narrow card inside a wide plane, that is drift of **information model**, not of shell width.

```text
FULL_WIDTH_RUNTIME_DRIFT_COUNT = 0
```

Shell already uses `max-width: none` on `.app-content`. Fresh shots show registries and admin catalogs using the plane. Remaining inner `max-width` values are reading-width / form exceptions, not a second centered app.
