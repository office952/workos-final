# Process composition cost-completeness alignment V1

One-truth cleanup. Process composition no longer hardcodes cost readiness.

## Semantic audit

`composition.completeness` / technological readiness = process-graph state. Independent.

`composition.costCompleteness` was hardcoded `PARTIAL` / `Parțială`. Same question as EIC completeness: are used internal-cost lines backed by acceptable evidence? Only consumer: admin Procese → Compoziții. Not persisted on snapshot. Execution does not read it.

`executionReadiness` remains `NOT_IMPLEMENTED` / `Neimplementat` on this inspection surface. Execution exists elsewhere. Classified ACTIVE WRONG as operator copy, left unchanged. No new execution semantics in this build.

## Ownership

EIC / cost evidence owns completeness. Composition projects `compileEic(...).completeness` for the selected configuration.

## Labels

- COMPLETE → `Complete pentru configurația curentă`
- PARTIAL → `Necesită calibrare`

## Configuration

60 mm none/none → COMPLETE. 30 / 80 / 100 mm, vinyl, RAL → PARTIAL while evidence stays unconfirmed.

## Outside this build

Commercial, new rates, executionReadiness rewrite, Analyzer, 30/80/100 calibration, vinyl/RAL confirmation.
