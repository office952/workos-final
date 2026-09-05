# UI20-DL1 — Primitives

Promotion gate: more than one cognitive job, or the continuity spine. If promotion flattens personality, do not promote.

## PRIMITIVES_PROMOTED

| Primitive | Node | USED_ON | Shared | Page-specific |
| --- | --- | --- | --- | --- |
| ObjectRegister | `130:6` | Cerere, Config, Ofertă, Lucrare, Atelier, Exec | ID + lineage band | Copy, journey crumb |
| JourneyPosition | `130:36` | Cerere, Config, Ofertă | Path text | Hidden on 768 / Atelier / Exec |
| AttentionEdge | `130:33` | Cerere missing, Lucrare current | 3px edge + sentence | When it appears |
| ActionDock | `130:12` | Every instrument | 44px primary / secondary | Verb and count |
| StateCause | `130:27` | Cerere, Atelier blocked | Label + cause | Wording |
| MaterialIdentity | `130:40` | Config, Ofertă, Lucrare, Resources | Name + specification | Density |
| CommercialLine | `130:22` | Ofertă | Shared column tracks | Artifact copy |

CommercialLine is promoted because the clip bug is a shared track law, not because every page needs a quote line. Allowed usage remains Ofertă only.

Lane G (late) recommended promoting only ObjectRegister and AttentionEdge, and rejecting CommercialLine and ActionDock as one-job chrome. That gate is recorded, not averaged. Accessibility + the inherited Valoare clip required a shared column-track law. The 44px primary is a shared hit-target law. Both stay Ofertă-scoped / verb-scoped components, not page templates.

## PRIMITIVES_REJECTED

Card. MetricCard. ClientRegistryCard. SemanticSpine / SemanticAnchor as library cores.

## PRIMITIVES_NOT_YET

| Primitive | Why |
| --- | --- |
| WorkRow | Proven on Atelier only |
| ConstructionPart | Proven on Configurator only |
| ContextAction | Same job as ActionDock |

## ANTI_CARD_RULE

Several rectangles are not a Card. Promote structure that carries a semantic job.

## LANE_G_VS_SYNTHESIS

```text
LANE_G_PROMOTE = ObjectRegister AttentionEdge
LANE_G_REJECT = CommercialLine ActionDock WorkRow ConstructionPart
LANE_G_HOLD = JourneyPosition ContextAction MaterialIdentity StateCause
SYNTHESIS_KEPT = ObjectRegister JourneyPosition AttentionEdge ActionDock StateCause MaterialIdentity CommercialLine
AUTHORITY = accessibility + R5 clip evidence > specialist one-job gate
```
