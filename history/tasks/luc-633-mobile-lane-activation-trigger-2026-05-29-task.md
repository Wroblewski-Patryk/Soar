# Task

## Header
- ID: LUC-633
- Title: Decide mobile lane activation trigger for ARB-002 doc registry follow-up
- Task Type: design
- Current Stage: planning
- Status: DONE
- Owner: Soar Project Manager
- Priority: P1

## Context
`ARB-002` was previously closed with a broad note to reopen only on "mobile scope expansion", but no exact activation trigger existed for PM/docs routing.

## Goal
Define a precise, fail-closed trigger for when ARB-002 mobile doc-registry follow-up must be reopened.

## Scope
- `.agents/state/decision-register.md`
- `history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Confirm current ARB-002 baseline status and blocker class in active control maps.
2. Decide and record exact activation criteria as durable PM decision memory.
3. Sync board/state artifacts so future continuations route ARB-002 consistently.

## Acceptance Criteria
- A durable decision row defines exact ARB-002 mobile activation criteria.
- Control map row references the decision and uses explicit gate semantics.
- Task board and project state record the new gating rule with evidence links.

## Definition of Done
- [x] Decision captured in canonical decision register.
- [x] ARB-002 control map row updated with exact trigger.
- [x] Task board and project state synchronized.

## Validation Evidence
- Command: `rg -n "DEC-ARB-002|LUC-633|ARB-002|done_gated|decision_gate" .agents/state/decision-register.md history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md`
- Reality status: verified

## Result Report
- Task summary: defined and published a fail-closed activation trigger for ARB-002 mobile doc-registry follow-up.
- Decision outcome (`DEC-ARB-002`): reopen ARB-002 only when both are true:
  1. A Product/CTO-approved mobile issue is moved to `in_progress` with Frontend/Mobile ownership.
  2. That issue explicitly includes non-scaffold runtime behavior in `apps/mobile` (not docs/index/scaffold-only edits).
- Files changed:
  - `.agents/state/decision-register.md`
  - `history/plans/luc-583-architecture-repair-backlog-control-map-2026-05-29.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `history/tasks/luc-633-mobile-lane-activation-trigger-2026-05-29-task.md`
- Next step: PM/Docs Memory should open the ARB-002 follow-up in the same heartbeat where the trigger conditions first become true.
