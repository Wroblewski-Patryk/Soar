# LUC-2982 No-Stall Queue Expeditor

Date: 2026-06-08

## Header

- ID: LUC-2982
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: coordination
- Current Stage: verification
- Status: DONE / DELEGATED
- Owner: Soar Product Manager
- Depends on: [LUC-12](/LUC/issues/LUC-12)
- Priority: P0
- Mission ID: LUC-2982-NO-STALL-QUEUE-EXPEDITOR-2026-06-08
- Mission Status: CHECKPOINTED

## Context

Wake `issue_assigned` scoped this heartbeat to [LUC-2982](/LUC/issues/LUC-2982).
There were no pending comments and `fallbackFetchNeeded=false`, so the inline
wake data was sufficient before targeted live readback.

The current architecture-awareness report generated
`2026-06-07T23:10:42.686Z` reports `125` actionable implementation entities
without inferred tests, `0` actionable missing-doc links, `0` ownerless
entities, and `0` disconnected entities.

## Goal

Prevent PM queue stall by making one concrete owner-scoped routing decision
without implementing code.

## Constraints

- Do not implement code.
- Do not run protected production proof.
- Do not deploy, push, restart, rollback, touch secrets, mutate accounts,
  databases, exchanges, orders, positions, or live-trading state.
- Preserve the existing dirty worktree and avoid reverting unrelated work.
- Avoid duplicate child lanes for already-owned helper families.

## Execution

- Read Paperclip PM role and shared bridge/evidence/responsibility contracts.
- Read Soar active mission, next steps, task board, project state, system
  health, current architecture-awareness report, and current git status.
- Live Paperclip readback for [LUC-2982](/LUC/issues/LUC-2982) passed:
  issue is `in_progress`, priority `critical`, no comments, no first-class
  blockers, parent [LUC-12](/LUC/issues/LUC-12), goal `Soar V1
  audit-to-completion loop`.
- `pnpm softwarehouse:control-tick` was attempted and failed because
  `softwarehouse:control-tick` is not exposed in this checkout.
- Duplicate and ownership review:
  - [LUC-2252](/LUC/issues/LUC-2252) already covers release/Ops wrapper
    relation rows for `runQaRepeatableSmokeE2e`, `runRcRefreshSummaryStrict`,
    and `runRestoreDrillEvidence`.
  - [LUC-2935](/LUC/issues/LUC-2935) already owns local protected-route helper
    proof/classification.
  - [LUC-2957](/LUC/issues/LUC-2957) and [LUC-2970](/LUC/issues/LUC-2970)
    already own production UI/UX helper tests and relation backfill for safe
    covered anchors.
  - [LUC-2871](/LUC/issues/LUC-2871) completed focused
    `generateFunctionJourneyIndexes` helper proof, but explicitly left
    `scripts/generateFunctionJourneyIndexes.mjs#chains` as a residual
    scanner-inferred row outside scope.
  - [LUC-2791](/LUC/issues/LUC-2791) is still `blocked` with no first-class
    blockers, so reopening the broad generator lane would be less precise than
    creating the isolated residual child.
- Created [LUC-2985](/LUC/issues/LUC-2985) for the idle Test Automation
  Engineer to resolve or classify
  `scripts/generateFunctionJourneyIndexes.mjs#chains`.

## Validation Evidence

- Paperclip heartbeat-context readback for [LUC-2982](/LUC/issues/LUC-2982):
  PASS.
- Test Automation Engineer agent readback: `idle`.
- [LUC-2985](/LUC/issues/LUC-2985) creation: PASS; status `todo`, assignee
  Test Automation Engineer, parent [LUC-2982](/LUC/issues/LUC-2982).
- `git status --short` reviewed; dirty tree is broad and pre-existing, so this
  PM lane only added/updated coordination evidence.
- No code tests were run because this is a PM routing lane with no product-code
  changes.

## Definition Of Done

- [x] Current queue evidence reviewed.
- [x] Duplicate families filtered before delegation.
- [x] One concrete owner-scoped follow-up issue created.
- [x] Source-of-truth state updated.
- [x] Paperclip issue disposition updated with evidence.

## Result Report

- Task summary: converted the top residual generated-index missing-test row
  into a narrow Test Automation child, [LUC-2985](/LUC/issues/LUC-2985), while
  avoiding duplicate lanes for release/Ops wrappers, local protected-route
  helper proof, production UI/UX helper proof, and prior generator helper
  coverage.
- Files changed: this task file plus PM state/context files.
- How tested: Paperclip readbacks, duplicate search/evidence review, and child
  issue creation confirmation.
- What is incomplete: [LUC-2985](/LUC/issues/LUC-2985) must resolve or
  classify `scripts/generateFunctionJourneyIndexes.mjs#chains`.
- Next step: Test Automation Engineer executes [LUC-2985](/LUC/issues/LUC-2985)
  and reports whether [LUC-2791](/LUC/issues/LUC-2791) can remain blocked or be
  closed separately.
