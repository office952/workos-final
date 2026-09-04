# UI20-R1 — Current (historical) Figma audit

```text
AUDITED_FILE = 1ev5lg7m2Ze1h3Vqmax8ho
AUDITED_AS = DESIGN_SYSTEM_ARTIFACT
MUTATION = NO
INDEPENDENT_OF = ChatGPT R0 observation
```

Inspected via Plugin API (pages must be loaded; bare `get_metadata` under-reports).

## Inventory

| Kind | Count / note |
| --- | --- |
| Pages | Screens, Components, Tokens, Client Hub, Cereri, Configurație produs, UI-FC1 — Sistem produs (explorare) `236:2821` |
| Components | 48 |
| Component sets | 6 — `StatusBadge`, `FilterControl`, `ClientRegistryCard`, `SidebarNavItem`, `RegistryToolbar`, `RequestWorklistRow` |
| Text styles | 11 |
| Color variables | Color Light/Dark, 16 vars |
| Space variables | 12 |
| Paint / effect styles | 0 |
| Motion | A3.1 select-volume; Plugin `playbackSettings.loop=false`; `get_motion_context` still emitted `repeat: Infinity` |

## WHAT WAS STRONG?

- **Registry grammar.** Toolbar + filter + row is a real collection language, not a dashboard of cards pretending to be a list.
- **Status as a typed chip.** `StatusBadge` is reusable and honest when the domain owns the state.
- **Navigation item.** `SidebarNavItem` carries current / default without inventing a second IA.
- **Focus and blocked states exist** in the later FC1 work — not only hover paint.
- **A3.1 reading.** Structure → relation → selection → context is the strongest WorkOS visual idea in the old file. FACE `260:9442`, VOLUME `261:3427`, ACM `261:3618`, 768 `261:9837`, primitives `260:3351`.
- **Tokens exist.** Light/Dark + space variables are a start, even if modes are thin.

## WHAT CREATED GENERIC CARD/LIST BIAS?

- `ClientRegistryCard` and metric-card thinking leaked from Clients into “this is how WorkOS objects look.”
- Collection pages were designed first and hardest. Journey, construction, and capability never received an equal primitive set.
- Page personality was mostly **title + icon + card grid**. After the H1, many pages could swap names and still look like the same SaaS.
- Density was globally “comfortable dashboard,” not locally expert or locally focused.
- Operational primitives (dispatch, eligibility, blocked cause) arrived late or not at all as library language.

## Independent check of the ChatGPT observation

| Claim | Verdict |
| --- | --- |
| Strong: registry, toolbar, filter, status, navigation | **Confirmed** |
| Weak: semantic topology, journey, context lens, capability, dynamic forms, operational primitives | **Confirmed** |

The old file is a competent **admin/collection system** with one exceptional Product System study. It is not yet an operating-system language.

## WHAT SHOULD TRANSFER?

```text
TRANSFER_SET
- Status as typed language (not color-only chips)
- Registry toolbar + filter + worklist row
- Sidebar / destination current-state
- Focus ring discipline
- Blocked + cause pairing
- A3.1 structure → relation → selection → context
- Light/Dark as designed modes, not inversion
- Romanian operator labels
- 1440 / 768 evidence habit
```

## WHAT SHOULD DIE WITH THE OLD FILE?

```text
REJECT_SET
- MetricCard as the default object
- ClientRegistryCard as the OS object
- Catalog dump as a floorplan
- Card grid as page personality
- Looping motion
- Fake capacity / utilization chrome
- Treating A3.1 as the visual canon of every page
- Recreating the full old component library before a 2.0 architecture
```

A3.1 is research gold. It is not automatically the 2.0 system.
