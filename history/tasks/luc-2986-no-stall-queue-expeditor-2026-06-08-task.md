# LUC-2986 No-Stall Queue Expeditor

## Header
- ID: LUC-2986-NO-STALL-QUEUE-EXPEDITOR-2026-06-08
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Soar Product Manager
- Priority: P0
- Mission ID: LUC-2986-NO-STALL-QUEUE-EXPEDITOR-2026-06-08
- Mission Status: CHECKPOINTED

## Context
[LUC-2986](/LUC/issues/LUC-2986) woke as a critical Soar PM routine execution with no pending comments and `fallbackFetchNeeded=false`. The harness had already claimed checkout.

## Goal
Inspect the Soar V1 queue for stalled lanes, avoid duplicate issue creation, and leave one clear handoff or disposition.

## Scope
- Paperclip issue context for [LUC-2986](/LUC/issues/LUC-2986).
- Current local architecture-awareness report at `docs/status/architecture-awareness-report.md`.
- Existing issue disposition for [LUC-2252](/LUC/issues/LUC-2252), [LUC-2792](/LUC/issues/LUC-2792), [LUC-2873](/LUC/issues/LUC-2873), [LUC-2935](/LUC/issues/LUC-2935), [LUC-2957](/LUC/issues/LUC-2957), [LUC-2970](/LUC/issues/LUC-2970), and [LUC-2985](/LUC/issues/LUC-2985).

## Implementation Plan
1. Read scoped heartbeat context.
2. Review current architecture missing-test top list.
3. Deduplicate completed or protected helper families against existing lanes.
4. Create one narrow owner-scoped recovery/handoff issue for the real stall.
5. Update local task/project memory and close the Paperclip heartbeat issue.

## Acceptance Criteria
- Current PM issue has a final Paperclip disposition.
- A stalled or unresolved queue item has a named owner and next action.
- No product code, protected proof, secret, push, deploy, restart, rollback, database, exchange, order, position, account, or live-trading mutation occurs.

## Definition of Done
- [x] Paperclip context read.
- [x] Duplicate/protected families classified.
- [x] Follow-up issue created for the actionable stalled lane.
- [x] Evidence recorded in project memory.

## Validation Evidence
- Paperclip heartbeat-context readback for [LUC-2986](/LUC/issues/LUC-2986): issue `in_progress`, priority `critical`, no comments, no first-class blockers.
- `docs/status/architecture-awareness-report.md` generated `2026-06-07T23:39:08.795Z` reports `124` actionable missing-test links.
- [LUC-2985](/LUC/issues/LUC-2985) is `done` and removed `scripts/generateFunctionJourneyIndexes.mjs#chains` from the report.
- [LUC-2252](/LUC/issues/LUC-2252) is `done` but only covers script-level release/Ops wrapper relations; function-level `goLiveSmoke.mjs` anchors remain visible.
- [LUC-2792](/LUC/issues/LUC-2792) is `blocked` with no first-class blockers after duplicate-owner janitor comments.
- [LUC-2873](/LUC/issues/LUC-2873) is `blocked` with active recovery action `f93379c8-6867-4726-9276-e2179865195a` and no live execution path.
- Created [LUC-2989](/LUC/issues/LUC-2989) for QA to recover or manually resolve the go-live smoke helper proof lane without protected smoke or mutation.
- `pnpm softwarehouse:control-tick` remains unavailable in this checkout (`rg softwarehouse:control-tick` found no package script).

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: delegated to [LUC-2989](/LUC/issues/LUC-2989) if QA adds or classifies function-level relations.

## Result Report
- Task summary: PM routed the current no-stall heartbeat to one actionable recovery issue instead of creating a duplicate implementation lane.
- Files changed: `history/tasks/luc-2986-no-stall-queue-expeditor-2026-06-08-task.md`, `.agents/state/active-mission.md`, `.agents/state/next-steps.md`, `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`.
- How tested: Paperclip API readbacks and local report/CSV inspection only.
- What is incomplete: [LUC-2989](/LUC/issues/LUC-2989) must close or unblock the go-live smoke helper function-anchor disposition.
- Next steps: QA should recover [LUC-2873](/LUC/issues/LUC-2873) or manually resolve it as duplicate/superseded, then refresh architecture-awareness count.
- Decisions made: do not open new release/Ops wrapper or protected browser proof lanes while existing owner/evidence lanes cover those families.
