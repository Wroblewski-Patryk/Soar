# LUC-2168 Engine/Runtime Model Doc Graph Relations

Date: 2026-06-05
Owner lane: Docs Memory Lead
Process: docs/memory loop
Parent: [LUC-2166](/LUC/issues/LUC-2166)

## Context

Backend classification in `history/evidence/luc-2166-engine-runtime-model-doc-test-gap-classification-2026-06-05.md` found no engine/runtime implementation defect. The sampled rows were graph traceability gaps: model entities needed explicit documentation relations to the canonical runtime contracts.

## Goal

Backfill model-to-doc architecture-awareness relations for:

- `apps/api/src/modules/engine/positionManagement.types.ts`
- `apps/api/src/modules/engine/ruleEvaluator.types.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.types.ts`
- `apps/api/src/modules/engine/runtimePositionState.store.ts#RuntimePositionStateStore`
- `apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts#RuntimeSignalDecisionEngine`
- `apps/api/src/modules/engine/runtimeSignalEvaluationTypes.ts`
- `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts#RuntimeSignalMarketDataGateway`
- `apps/api/src/modules/engine/runtimeSignalSeriesTypes.ts`
- `apps/api/src/modules/engine/simulator.types.ts`

## Constraints

- No runtime behavior changes.
- No deploy, restart, protected smoke, account access, exchange action, or LIVE mutation.
- Preserve unrelated dirty worktree changes from adjacent LUC lanes.

## Definition Of Done

- Direct documentation-link rows exist for the sampled model entities.
- Architecture-awareness exports are refreshed through the approved scanner path.
- The sampled model rows no longer appear in `docs/status/architecture-awareness-report.md` top actionable missing-doc output, or residual scanner behavior is documented.

## Result Report

Completed.

- Added/confirmed direct rows in `docs/architecture/relations/documentation-links.csv` from the sampled model entities to `docs/modules/api-engine.md` and canonical runtime contracts under:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - supporting runtime reference docs where applicable.
- Refreshed architecture-awareness exports with:

```text
node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar
```

Result:

```text
entities: 14274
relations: 22228
files: 7583
exports refreshed under C:/Personal/Projekty/Aplikacje/Soar/docs
```

- Readback confirmed `docs/status/architecture-awareness-report.md` was regenerated at `2026-06-05T10:34:29.996Z`.
- Readback confirmed the sampled model identifiers no longer appear in `docs/status/architecture-awareness-report.md`.
- Readback confirmed `docs/graphs/architecture-awareness.json` includes `documents` relations sourced from `docs/architecture/relations/documentation-links.csv` for the sampled model IDs.

## Residual Risk

The report still lists `74` actionable implementation entities without inferred docs. Those are broader route-level/API engine rows such as `runtimePositionState.store.ts`, `runtimeSignalDecisionEngine.ts`, and `runtimeSignalMarketDataGateway.ts`, not the [LUC-2166](/LUC/issues/LUC-2166) sampled model rows closed here.

## Source Control Closure

- Files changed: `docs/architecture/relations/documentation-links.csv`; generated architecture-awareness exports under `docs/graphs/` and `docs/status/`; this task record.
- Verification: generator command above passed; report and JSON relation readbacks passed.
- Commit: not committed in this heartbeat because the worktree contains substantial adjacent dirty/untracked LUC lane output.
- Push status: not needed.
- Deploy impact: none.
