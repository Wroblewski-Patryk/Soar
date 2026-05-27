# Task

## Header
- ID: LUC-386
- Title: Add `docs/modules/mobile-*.md` index + module registry rows once mobile lane is active
- Task Type: design
- Current Stage: implementation
- Status: DONE
- Owner: Product Docs Agent
- Priority: P2

## Context
`ARB-002` flagged missing mobile module registry/index coverage while `apps/mobile` is scaffold-only but active as a documented lane.

## Goal
Add canonical mobile module documentation/index entries and connect them to module registries without changing runtime behavior.

## Scope
- `docs/modules/mobile-module-index.md` (new)
- `docs/modules/mobile-bootstrap.md` (new)
- `docs/modules/module-registry.md`
- `docs/modules/module-doc-status-index.md`
- `docs/modules/system-modules.md`
- `docs/modules/README.md`
- `docs/analysis/documentation-drift.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Publish scaffold-phase mobile module deep-dive + index.
2. Add mobile rows/sections to canonical module registries.
3. Update system map and drift report to reflect repaired gap.
4. Record issue completion in project state/task board.

## Acceptance Criteria
- `docs/modules/mobile-*.md` files exist and describe current scaffold truth.
- `module-registry.md` contains a mobile registry row.
- `module-doc-status-index.md` contains a mobile section row.
- Drift report no longer marks missing mobile module registry as unresolved.

## Definition of Done
- [x] Mobile module docs/index added.
- [x] Registry/status/system map references added.
- [x] Project state/task board evidence updated.

## Validation Evidence
- Command: `rg -n "mobile-module-index|mobile-bootstrap|Mobile Module Registry|Mobile Surface" docs/modules docs/analysis/documentation-drift.md`
- Reality status: verified

## Result Report
- Task summary: added mobile scaffold documentation index and integrated it with canonical module registries.
- Files changed:
  - `docs/modules/mobile-module-index.md`
  - `docs/modules/mobile-bootstrap.md`
  - `docs/modules/module-registry.md`
  - `docs/modules/module-doc-status-index.md`
  - `docs/modules/system-modules.md`
  - `docs/modules/README.md`
  - `docs/analysis/documentation-drift.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested: grep-based content verification for newly added mobile registry/index anchors.
- What is incomplete: mobile runtime implementation remains intentionally deferred.
- Next steps: on native feature activation, add additional `mobile-*.md` deep-dives in the same lane as implementation.
