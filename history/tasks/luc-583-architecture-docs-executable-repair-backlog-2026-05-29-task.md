# Task

## Header
- ID: LUC-583
- Title: [Soar][Architecture Planning] Convert architecture docs into executable repair backlog
- Task Type: planning
- Current Stage: planning
- Status: DONE
- Owner: Soar Project Manager
- Depends on: `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`, `history/plans/luc-408-architecture-repair-backlog-execution-map-2026-05-28.md`, `history/plans/luc-508-architecture-repair-backlog-control-map-2026-05-28.md`
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
- [x] Current control map exists for `LUC-583` with all `ARB-001..ARB-008` rows.
- [x] Remaining blockers and unblock ownership are explicit.
- [x] `TASK_BOARD` and `PROJECT_STATE` include this heartbeat result.

## Forbidden
- Re-implementing closed specialist lanes.
- Marking blocked rows as done without fresh unblock evidence.
- Leaving issue disposition ambiguous.

## Implementation Plan
1. Reconcile canonical ARB backlog and prior execution/control maps against current lane outcomes.
2. Publish refreshed `LUC-583` control map artifact.
3. Synchronize source-of-truth context files with final disposition and blockers.

## Acceptance Criteria
- `history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md` exists and references canonical backlog/execution artifacts.
- Control map shows `ARB-007` closed and only `ARB-001` + `ARB-006` as remaining blockers.
- `TASK_BOARD` and `PROJECT_STATE` record `LUC-583` as `done` planning lane.

## Validation Evidence
- `rg -n "LUC-583|ARB-001|ARB-006|control_map_refreshed" history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md history/tasks/luc-583-architecture-docs-executable-repair-backlog-2026-05-29-task.md .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md`

## Result Report
- Task summary: refreshed the architecture-repair backlog PM control map for 2026-05-29 and synchronized state artifacts for issue closure.
- Files changed:
  - `history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md`
  - `history/tasks/luc-583-architecture-docs-executable-repair-backlog-2026-05-29-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- What is incomplete:
  - `ARB-001` remains blocked on Product/CTO activation decision.
  - `ARB-006` remains blocked on protected-input gate and ARB6-EV child execution issuance.
- Next steps:
  1. Product + CTO publish `ARB-001` activation decision packet.
  2. Delivery/PM creates and assigns `ARB6-EV-001..008` child issues for `ARB-006`.
  3. Security/Test + Ops execute bounded evidence checkpoints for ready child tasks.
