# UI20-DL1 — Primitives

Promotion gate: more than one cognitive job, or the continuity spine. If promotion flattens personality, do not promote. A valuable component may still be instrument-specific.

Raw DL1 extracts on page 80 are historical visual clones. They are not an applied-component test. DL1A recomposed proofs are the real abstraction test.

## PRIMITIVE_TAXONOMY

### CORE_SHARED_PRIMITIVES

| Primitive | Node | USED_ON | Why core | Page-specific |
| --- | --- | --- | --- | --- |
| ObjectRegister | `130:6` | Cerere, Config, Ofertă, Lucrare, Atelier | Object spine across clarification, construction, commercial, traveler, inbox | Copy, lineage clause |
| ActionDock | `130:12` | Cerere, Ofertă, Exec, Atelier | 44px next valid act across different verbs | Verb, count, quiet note |
| AttentionEdge | `130:33` | Cerere missing, Lucrare current | Energy only when current or missing | When it appears |
| JourneyPosition | `130:36` | Cerere, Config, Ofertă | Commercial-path crumb on different jobs | Hidden on 768 / Atelier / Exec |
| StateCause | `130:27` | Cerere LIPSEȘTE, Atelier blocked | Cause copy, not a chip | Wording |
| MaterialIdentity | `130:40` | Config, Ofertă, Lucrare, Resources | Same frozen material fact | Density |

ObjectRegister is allowed on Exec in the older specimen note. Live Exec contract is ReducedChrome. Do not force ObjectRegister onto the station.

StateCause must not replace Cerere's CUNOSCUT / LIPSEȘTE two-column.

MaterialIdentity must not duplicate Ofertă CommercialLine.

### INSTRUMENT_SCOPED_PRIMITIVES

| Primitive | Node | Scope | Why not core |
| --- | --- | --- | --- |
| CommercialLine | `130:22` | Ofertă only | One cognitive job: commercial artifact line. Keep. Do not put in generic table grammar. |

```text
COMMERCIAL_LINE_CLASSIFICATION = INSTRUMENT_SCOPED_PRIMITIVE / OFERTA
```

Board `129:153` now shows Shared vs Instrument-scoped. CommercialLine stays in the file.

### NOT_YET_PRIMITIVES

| Primitive | Why |
| --- | --- |
| WorkRow | Proven on Atelier only |
| ConstructionPart | Proven on Configurator only |
| ContextAction | Same job as ActionDock |

## ABSTRACTION_REJECTED_ON

| Rejection | Why |
| --- | --- |
| `EXEC_OBJECTREGISTER` | Exec personality is ReducedChrome, not the commercial identity strip |
| `EXEC_JOURNEYPOSITION` | Work is the position |
| `EXEC_COMMERCIALLINE` | Station is not a quote |
| `EXEC_ATTENTIONEDGE` | The station is the attention |
| `CERERE_STATECAUSE_REPLACES_TWO_COLUMN` | CUNOSCUT / LIPSEȘTE is the instrument |
| `OFERTA_MATERIALIDENTITY` | Line already carries the material fact |
| Card / MetricCard / ClientRegistryCard | Rectangles are not a semantic job |

## DL1A INSTANCE PROOF

| Proof | Node | Instances | Mains |
| --- | --- | --- | --- |
| Cerere 1440 | `141:3` | 4 | ObjectRegister `141:192`→`130:6` · JourneyPosition `141:196`→`130:36` · AttentionEdge `141:198`→`130:33` · ActionDock `141:203`→`130:12` |
| Ofertă 1440 | `141:86` | 4 | ObjectRegister `141:209`→`130:6` · JourneyPosition `141:213`→`130:36` · CommercialLine `141:215`→`130:22` · ActionDock `141:224`→`130:12` |
| Execuție 1440 | `141:146` | 1 | ActionDock `141:229`→`130:12` |

Instances inherit the main-component variable bindings. Historical extracts `130:53` / `130:224` / `130:414` stay instance-less.
