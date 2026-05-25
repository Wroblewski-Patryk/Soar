# ARCH-GRAPH-DRIFT-DETECTION-2026-05-24

## Context

The active architecture evidence graph mission has a working CSV-backed graph
and multiple feature-chain backfills. The next project risk is silent drift:
new or existing source/test/doc/config files may remain outside the official
graph without being visible to agents.

## Goal

Add an informational drift audit that compares representative repository
inventories against paths referenced by architecture graph CSV records.

## Constraints

- Do not change runtime behavior.
- Do not make drift a failing quality gate yet because full repository graph
  coverage is not complete.
- Keep generated drift output in source-of-truth/status locations.
- Keep the audit deterministic and local-only.

## Definition Of Done

- Add a package script for architecture graph drift detection.
- Generate a Markdown status report and JSON artifact.
- Preserve current graph generation validation.
- Record residual unmapped files as backfill guidance, not as a runtime defect.

## Result Report

- Added `scripts/auditArchitectureGraphDrift.mjs`.
- Added `pnpm run architecture:graph:drift`.
- Generated `docs/status/architecture-graph-drift.md`.
- Generated `history/artifacts/architecture-graph-drift-2026-05-24.json`.

## Validation

- `pnpm run architecture:graph:drift` PASS:
  - `796` inventoried files
  - `395` covered by graph CSV path references
  - `401` missing graph path references

## Residual Risk

The drift audit is informational. It intentionally does not fail CI yet because
the graph is still an incremental backfill. Future work should reduce missing
paths and only then enable `--fail-on-drift` as a quality gate.
