# Task

## Header
- ID: LUC-508
- Title: [Soar][Architecture Planning] Convert architecture docs into executable repair backlog
- Task Type: planning
- Current Stage: planning
- Status: DONE
- Owner: Soar Project Manager
- Depends on: `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`, `history/plans/luc-408-architecture-repair-backlog-execution-map-2026-05-28.md`
- Priority: high

## Context
Wake reason is `issue_assigned` with no pending comments (`0/0`) and `fallbackFetchNeeded=false`. The issue scope is planning coordination: keep architecture-repair backlog executable with current owner/blocker truth.

## Goal
Refresh and consolidate the executable architecture repair backlog into a single control map for immediate delegation and blocker routing.

## Constraints
- Planning/state only; no runtime/deploy mutation.
- Stay in PM role ownership; do not absorb specialist implementation.
- Preserve existing finished lane outcomes and keep blocker states fail-closed.

## Definition of Done
- [x] `ARB-001..ARB-008` rows are represented with current lane status and owner action.
- [x] Remaining blockers are explicit with unblock owners/actions.
- [x] Project state files record this heartbeat outcome.

## Forbidden
- Re-implementing already closed specialist lanes.
- Downgrading blocked rows to done without fresh unblock proof.
- Leaving stale `in_progress` with no live continuation path.

## Implementation Plan
1. Reconcile canonical ARB backlog (`LUC-384`) with execution map (`LUC-408`) and closed ARB issue outcomes.
2. Publish refreshed PM control map with current statuses and blockers.
3. Synchronize `TASK_BOARD` and `PROJECT_STATE`.

## Acceptance Criteria
- New control map exists in `history/plans/` and references canonical backlog + execution baseline.
- `ARB-007` is reflected as closed (`LUC-403`) and blockers remain only `ARB-001` and `ARB-006`.
- Board/state entries capture the final disposition for `LUC-508`.

## Validation Evidence
- `rg -n "LUC-508|ARB-00|control map|blocked_on_protected_inputs|LUC-403" history/plans/luc-508-architecture-repair-backlog-control-map-2026-05-28.md history/tasks/luc-508-architecture-docs-executable-repair-backlog-2026-05-28-task.md .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md`

## Result Report
- Task summary: refreshed the architecture-repair backlog into a current executable PM control map and synchronized state ledgers for durable routing truth.
- Files changed:
  - `history/plans/luc-508-architecture-repair-backlog-control-map-2026-05-28.md`
  - `history/tasks/luc-508-architecture-docs-executable-repair-backlog-2026-05-28-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- What is incomplete:
  - `ARB-001` remains blocked on Product/CTO activation decision.
  - `ARB-006` remains blocked on protected-input gate and child execution issuance.
- Next steps:
  1. Product + CTO publish `ARB-001` activation decision packet.
  2. Delivery/PM creates and assigns `ARB6-EV-001..008` child issues for `ARB-006`.
  3. Security/Test + Ops run bounded protected/public evidence execution per assigned child.
