# UI-FC0 — live Figma frame resolution

```text
FIGMA_WRITE = NO
PLUGIN_AVAILABLE = YES
PLUGIN_USED = user-figma get_metadata
LIVE_READ = YES
```

Worklog names are not enough. Each row below was resolved by live `get_metadata`.

## Files live

| FILE_KEY | Live top-level pages | Note |
| --- | --- | --- |
| `1ev5lg7m2Ze1h3Vqmax8ho` | `0:1` Screens, `1:2` Components | Hub / Cereri / prequote resolve by node id even when the Screens dump is Clients+Resources-heavy |
| `7elwvIscvMPDiEHrX4f6kQ` | `0:1` 00 — Read Me & Evidence only in page list | HF frames still resolve by known node id |
| `Q8zfu4MZhsxLjJMGLHUHZh` | `0:1` 00 — Cover & Status only | Live file is cover frames `3:2` / `5:3432`. Simulation pages are **not** in the current page list |

## Resolved frames

| FILE_KEY | PAGE | NODE_ID | FRAME_NAME | VIEWPORT | THEME | STATE | CURRENTNESS | FIGMA_STATUS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `1ev5lg7m2Ze1h3Vqmax8ho` | Screens | `4:379` | Clients / 1440 / Light | 1440 | Light | populated | live | ACCEPTED_CURRENT |
| `1ev5lg7m2Ze1h3Vqmax8ho` | Screens | `4:444` | Clients / 1440 / Dark | 1440 | Dark | populated | live | ACCEPTED_CURRENT |
| `1ev5lg7m2Ze1h3Vqmax8ho` | Screens | `4:1734` | Clients / 768 | 768 | Light | populated | live | ACCEPTED_CURRENT |
| `1ev5lg7m2Ze1h3Vqmax8ho` | — | `49:2569` | Client Workspace / 1440 / Light / Active | 1440 | Light | active | live | ACCEPTED_CURRENT |
| `1ev5lg7m2Ze1h3Vqmax8ho` | — | `107:4394` | Cereri / 1440 / Light / Populated | 1440 | Light | populated | live | ACCEPTED_CURRENT |
| `1ev5lg7m2Ze1h3Vqmax8ho` | — | `107:6506` | Cerere / 1920 / Light / Object | 1920 | Light | object | live | ACCEPTED_CURRENT |
| `1ev5lg7m2Ze1h3Vqmax8ho` | — | `176:5183` | F1 · Product Prequote / READY / 1440 / Light | 1440 | Light | ready | live | ACCEPTED_CURRENT |
| `1ev5lg7m2Ze1h3Vqmax8ho` | Screens | `203:1734` | RESOURCES_AND_COSTS_V3_FLAT_OWNER_WORKSPACE / 1440 / Light | 1440 | Light | workspace | live | ACCEPTED_WITH_ADVISORIES |
| `7elwvIscvMPDiEHrX4f6kQ` | HF lot | `67:3` | Login / implicit / LIGHT / 1280 | 1280 | Light | idle | live | ACCEPTED_HF_NOT_V3_FINAL |
| `7elwvIscvMPDiEHrX4f6kQ` | HF lot | `68:2` | Lucrări / empty / LIGHT / 1280 | 1280 | Light | empty | live | ACCEPTED_HF_NOT_V3_FINAL |
| `7elwvIscvMPDiEHrX4f6kQ` | HF lot | `70:257` | Oferte / listă / LIGHT / 1280 | 1280 | Light | list | live | ACCEPTED_HF_NOT_V3_FINAL |
| `7elwvIscvMPDiEHrX4f6kQ` | HF lot | `71:2` | Catalog / list-detail / LIGHT / 1280 | 1280 | Light | list-detail | live | ACCEPTED_HF_NOT_V3_FINAL |
| `7elwvIscvMPDiEHrX4f6kQ` | HF lot | `71:395` | Atelier / inbox populat / LIGHT / 1280 | 1280 | Light | populated | live | ACCEPTED_HF_NOT_V3_FINAL |
| `7elwvIscvMPDiEHrX4f6kQ` | HF lot | `71:509` | Execuție / machine-blocked / LIGHT / 1280 | 1280 | Light | blocked | live | ACCEPTED_HF_NOT_V3_FINAL |
| `Q8zfu4MZhsxLjJMGLHUHZh` | Cover | `3:2` | Cover / Status | 1440 | Light | cover | live | HISTORICAL |

HF frames still encode **top-nav**. That is SUPERSEDED chrome, accepted content.

Arch C: live file does not expose the old simulation page list. Do not treat missing simulation pages as ACCEPTED_CURRENT.

## Width law (live, not inferred)

Clients 1440 `4:379`: sidebar **256**, column **1184**, PageHeader/registry **1136** at x=24.

Resources 1440 `203:1734`: sidebar **256**, main **1184**, header/registry **1120** at x=32.

Validated against ChatGPT independent inspection.
