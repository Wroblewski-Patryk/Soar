# LUC-6873 No-Stall Queue Expeditor - 2026-07-02

## Header
- ID: LUC-6873
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: none
- Priority: P0
- Mission ID: LUC-6873-NO-STALL-QUEUE-EXPEDITOR-2026-07-02
- Mission Status: VERIFIED

## Context
LUC-6873 is a scoped Paperclip heartbeat for the Soar PM no-stall loop. The wake payload had no pending comments and `fallbackFetchNeeded=false`, so the latest change was the assignment itself.

## Goal
Inspect the open Soar issue queue and force a disposition without implementing code.

## Scope
- Paperclip issue readbacks for [LUC-6873](/LUC/issues/LUC-6873).
- Soar project issue queue readback for `todo`, `in_progress`, `in_review`, `blocked`, and `backlog`.
- Project state/task-board evidence update.

## Explicit Exclusions
- No product code.
- No commit, push, deploy, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment mutation, order, position, subscription mutation, or live-trading action.

## Implementation Plan
1. Read the scoped issue and heartbeat context.
2. Query the live Soar project queue.
3. Check the control-loop helpers required by the issue contract.
4. Decide whether a duplicate child, reassignment, escalation, or closure is warranted.
5. Record state and close the issue with evidence.

## Acceptance Criteria
- [x] LUC-6873 issue readback succeeds.
- [x] LUC-6873 heartbeat context readback succeeds.
- [x] Live Soar queue count is recorded.
- [x] Runnable and review owner paths are named.
- [x] No duplicate child is created when an existing owner path is valid.

## Validation Evidence
- `GET /api/issues/LUC-6873/heartbeat-context` returned `200`.
- `GET /api/issues/LUC-6873` returned `200`.
- Live Soar project query returned `154` open issues:
  - `1 in_progress`
  - `1 in_review`
  - `1 todo`
  - `147 blocked`
  - `4 backlog`
- Current runnable/review lanes:
  - [LUC-6873](/LUC/issues/LUC-6873): current PM heartbeat, `in_progress`, active run `running`.
  - [LUC-4103](/LUC/issues/LUC-4103): owner-login verification path, `in_review`.
  - [LUC-6468](/LUC/issues/LUC-6468): only runnable non-PM todo, assigned to CBE and unblocked.
- `pnpm softwarehouse:control-tick` failed because the script is unavailable in this checkout: `Command "softwarehouse:control-tick" not found`.
- `scripts/run-live-run-janitor.mjs` is absent.

## Result Report
- Task summary: no stalled duplicate lane was found that justifies creating another child. Existing owner paths remain the correct route.
- Files changed: this task record plus Soar state/context files.
- How tested: Paperclip issue/context readbacks and live project queue readback.
- What is incomplete: actual production restoration and protected proof remain on existing specialist gates.
- Next steps: CBE continues [LUC-6468](/LUC/issues/LUC-6468); local-board/operator review remains [LUC-4103](/LUC/issues/LUC-4103); Ops/DRE continues [LUC-6331](/LUC/issues/LUC-6331); Security/protected-input path remains [LUC-6002](/LUC/issues/LUC-6002); source/build provenance remains [LUC-6461](/LUC/issues/LUC-6461); regression evidence remains [LUC-6820](/LUC/issues/LUC-6820).
- Decisions made: close [LUC-6873](/LUC/issues/LUC-6873) as done; do not create a duplicate child issue.

## Source-Control Closure
- Repo: `C:/Personal/Projekty/Aplikacje/Soar`.
- Initial git state: dirty/divergent, `main...origin/main [ahead 22, behind 3]`, with substantial pre-existing tracked and untracked work.
- Commit SHA: not committed.
- Push status: not needed and not authorized.
- Deploy impact: none.
- Residual risk: this PM checkpoint only proves queue disposition, not production readiness.

## Definition of Done
- [x] Concrete queue readback completed.
- [x] Existing owner paths preserved or routed.
- [x] Evidence recorded.
- [x] Paperclip issue disposition can be moved to `done`.
