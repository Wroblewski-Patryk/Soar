# Task

## Header
- ID: LUC-408
- Title: [Soar][Architecture Planning] Convert architecture docs into executable repair backlog
- Task Type: planning
- Current Stage: planning
- Status: DONE
- Owner: Soar Project Manager
- Depends on: `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`
- Priority: high

## Context
Wake reason is `issue_assigned` with no pending comments (`0/0`) and `fallbackFetchNeeded=false`. The required heartbeat action is concrete planning output, not broad repo exploration.

## Goal
Produce an execution-ready mapping from architecture repair backlog rows to active lanes, blockers, and next owner actions.

## Constraints
- Planning/state only, no runtime or deploy mutation.
- Stay inside PM role ownership (coordination, backlog routing, issue-state truth).
- Preserve existing specialist evidence; do not re-implement finished lanes.

## Definition of Done
- [x] Every `ARB-001..ARB-008` row has execution status and next owner action.
- [x] Explicit blocker class is recorded for blocked rows.
- [x] Source-of-truth state files are synced with this heartbeat outcome.

## Forbidden
- Implementing specialist-layer code in this PM lane.
- Marking blocked rows as done without unblock owner/action.
- Leaving the issue in stale `in_progress` without a live continuation path.

## Implementation Plan
1. Read current ARB backlog and already-closed ARB execution lanes.
2. Build execution map with lane/status/owner/action/blocker class.
3. Sync project state artifacts and publish lane disposition.

## Acceptance Criteria
- Execution map exists in `history/plans/` and references the canonical ARB backlog.
- Blocked rows (`ARB-001`, `ARB-006`) have named owners and exact next actions.
- Remaining low-coupling row (`ARB-007`) is tracked as `LUC-403` and ready for the Docs Memory lane.

## Validation Evidence
- `rg -n "LUC-408|ARB-00|execution map|blocked_on_protected_inputs|LUC-403" history/plans/luc-408-architecture-repair-backlog-execution-map-2026-05-28.md .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md`

## Result Report
- Task summary: Converted ARB backlog into an execution map with clear next owners and blocker classes; synchronized state files for durable PM routing truth.
- Files changed:
  - `history/plans/luc-408-architecture-repair-backlog-execution-map-2026-05-28.md`
  - `history/tasks/luc-408-architecture-docs-executable-repair-backlog-2026-05-28-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- What is incomplete:
  - `ARB-001` remains blocked on Product/CTO decision.
  - `ARB-006` remains blocked on protected evidence inputs.
  - `ARB-007` is tracked as `LUC-403` and still needs execution by the Docs Memory lane.
- Next steps:
  1. Start `LUC-403` for `ARB-007` (Docs Memory lane).
  2. Create/assign `ARB6-EV-001..008` child issues from the ARB-006 register.
  3. Await Product/CTO decision gate for `ARB-001` before reopening implementation.
