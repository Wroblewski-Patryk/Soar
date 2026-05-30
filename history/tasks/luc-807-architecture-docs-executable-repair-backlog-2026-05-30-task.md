# Task

## Header
- ID: LUC-807
- Title: [Soar][Architecture Planning] Convert architecture docs into executable repair backlog
- Task Type: planning
- Current Stage: planning
- Status: DONE
- Owner: Soar Project Manager
- Depends on: `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`, `history/plans/luc-408-architecture-repair-backlog-execution-map-2026-05-28.md`, `history/plans/luc-508-architecture-repair-backlog-control-map-2026-05-28.md`, `history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md`, `history/plans/luc-705-architecture-repair-backlog-control-map-2026-05-29.md`, `history/plans/luc-616-arb-001-activation-scope-decision-2026-05-29.md`
- Priority: high

## Context
Wake reason is `issue_assigned` with no pending comments (`0/0`) and `fallbackFetchNeeded=false`. The issue scope is planning coordination: refresh architecture-repair backlog control truth and keep owner/blocker routing explicit.

## Goal
Publish a current executable control map for `ARB-001..ARB-008` and synchronize project state to this heartbeat.

## Constraints
- Planning/state only; no runtime/deploy mutation.
- Keep PM role boundaries; no specialist implementation takeover.
- Preserve fail-closed blocker states unless new unblock proof exists.

## Definition of Done
- [x] Current control map exists for `LUC-807` with all `ARB-001..ARB-008` rows.
- [x] Remaining active blockers and decision-gated rows are explicit.
- [x] `TASK_BOARD` and `PROJECT_STATE` include this heartbeat result.

## Forbidden
- Re-implementing closed specialist lanes.
- Marking blocked rows as done without fresh unblock evidence.
- Leaving issue disposition ambiguous.

## Implementation Plan
1. Reconcile canonical ARB backlog and prior execution/control maps against current lane outcomes.
2. Publish refreshed `LUC-807` control map artifact.
3. Synchronize source-of-truth context files with final disposition and blockers.

## Acceptance Criteria
- `history/plans/luc-807-architecture-repair-backlog-control-map-2026-05-30.md` exists and references canonical backlog/execution artifacts.
- Control map reflects `DEC-ARB-001` and `DEC-ARB-002` as decision-gated rows and keeps `ARB-006` as the active blocker.
- `TASK_BOARD` and `PROJECT_STATE` record `LUC-807` as `done` planning lane.

## Validation Evidence
- `rg -n "LUC-807|DEC-ARB-001|DEC-ARB-002|ARB-006|control_map_refreshed" history/plans/luc-807-architecture-repair-backlog-control-map-2026-05-30.md history/tasks/luc-807-architecture-docs-executable-repair-backlog-2026-05-30-task.md .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md`

## Result Report
- Task summary: refreshed architecture-repair backlog PM control truth for 2026-05-30 with current decision gates and active blocker routing.
- Files changed:
  - `history/plans/luc-807-architecture-repair-backlog-control-map-2026-05-30.md`
  - `history/tasks/luc-807-architecture-docs-executable-repair-backlog-2026-05-30-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- What is incomplete:
  - `ARB-006` remains blocked on protected-input gate and `ARB6-EV-001..008` child execution issuance.
- Next steps:
  1. Delivery/PM creates and assigns `ARB6-EV-001..008` child issues for `ARB-006`.
  2. Security/Test + Ops execute bounded evidence checkpoints for ready child tasks.
  3. Keep `ARB-001` and `ARB-002` closed behind accepted decision-gate triggers unless an explicit reopen decision is issued.
