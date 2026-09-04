# UI20-R1 — IA comparison

```text
IA_DIRECTION_1 = DESTINATION_PLUS_OBJECT_JOURNEY_RAIL
IA_DIRECTION_2 = LAUNCHPAD_FIRST_QUIETER_DESTINATIONS
IA_RECOMMENDATION = NOT_SELECTED
CURSOR_MAY_NOT_CLOSE = YES
```

Figma: page `80 — Prototypes`.

| Artifact | Node |
| --- | --- |
| IA-1 text board | `8:52` |
| IA-1 desktop shell | `10:2` |
| IA-1 mobile 768 | `10:32` |
| IA-2 text board | `8:70` |
| IA-2 desktop shell | `10:43` |
| IA-2 mobile 768 | `10:63` |
| Navigation pleasure | `10:416` |

## IA-1 — stable destinations + Journey Rail

Desktop: left or top destinations stay. Current object gets a Journey Rail (instance position, not a template picture).

Mobile: destinations compress (bottom or select). Rail becomes a compact stage chip + “următor”.

| Journey | Feel |
| --- | --- |
| Client → Cerere → Configurare | Destinations (Clienți / Cereri) stay. Rail shows instance: Client complete → Cerere current → Configurare future |
| Job → Atelier → Execuție | Destinations (Lucrări / Atelier / Execuție) stay. Rail shows production instance |
| Back | Browser + explicit “înapoi la CER-1042”. Filters/scroll of the registry are preserved |
| Object identity | Always in the header band: `CER-1042 • HUB MEDIA` |
| Journey position | Rail, not the sidebar highlight alone |
| Related objects | Lineage under identity (client / cerere / ofertă / lucrare), not a second sidebar |

**Strength:** matches current `/` = Lucrări invariant; teaches the company map; deep links stay obvious.

**Fatal risk:** if destinations and rail both shout, the user has two “you are here” signals. One must be quieter.

## IA-2 — launchpad-first + quieter destinations

Desktop: home is a launchpad (recent objects + next actions + command). Destinations recede into a quiet switcher.

Mobile: launchpad is the phone home. Destinations live behind a single “unde”.

Same two journeys: the object is the place. Destinations are how you change rooms, not how you know the room.

| Concern | IA-2 answer |
| --- | --- |
| Back | Object stack + recent. Risk: fights browser history if poorly done |
| Object identity | The whole chrome is the object |
| Journey position | Rail or stamp on the object, not on a destination |
| `/` Lucrări | Must be tested, not silently replaced. Launchpad may *open* on Lucrări without deleting the invariant |

**Strength:** navigation pleasure; less “admin sitemap.”

**Fatal risk:** operators lose the company map. Small companies may prefer fewer rooms; large companies may get lost without destinations.

## Do not choose yet

IA-1 is the safer WorkOS continuation. IA-2 is the stronger pleasure hypothesis. A later synthesis (quiet destinations + object-first chrome + command) is allowed only after Owner review — not as a silent Cursor close.
