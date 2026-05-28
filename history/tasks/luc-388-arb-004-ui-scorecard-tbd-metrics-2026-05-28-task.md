# Task

## Context
LUC-388 / ARB-004 flagged unresolved `TBD` placeholders in the UX scorecard review template (`docs/ux/ui-scorecard.md`), which violated documentation truthfulness for review metrics.

## Goal
Replace `TBD` placeholders with either measured values or explicit defer metadata (`owner/date/reason`).

## Constraints
- Keep scope limited to UX docs lane.
- Do not invent measured scores without a concrete screen review artifact.
- Preserve existing scorecard structure and intent.

## Definition of Done
- [x] No `TBD` placeholders remain in the ARB-004 target rows.
- [x] Each previously unresolved row has explicit defer metadata (`owner/date/reason`).
- [x] Source-of-truth context files reflect the heartbeat outcome.

## Forbidden
- Fabricated measured values without evidence.
- Scope expansion outside ARB-004 documentation fix.
- Architecture/process rewrites unrelated to the scorecard rows.

## Result Report
- Task summary: Replaced three unresolved `TBD` entries in the scorecard review template with explicit defer metadata and recorded lane evidence.
- Files changed:
  - `docs/ux/ui-scorecard.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `history/tasks/luc-388-arb-004-ui-scorecard-tbd-metrics-2026-05-28-task.md`
- How tested:
  - `rg -n "\\bTBD\\b" docs/ux/ui-scorecard.md` -> no matches.
- What is incomplete:
  - Concrete measured values still require a real per-screen UX review session.
- Next steps:
  - During next UX review pass, replace deferred template metadata with measured review content for the reviewed flow.
- Decisions made:
  - Used explicit defer metadata instead of fabricated scores because no new visual review dataset was produced in this heartbeat.
