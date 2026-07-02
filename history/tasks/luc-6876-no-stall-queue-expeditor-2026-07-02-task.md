# Task

## Header
- ID: LUC-6876
- Title: No-stall queue expeditor
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: LUC-12
- Priority: P0
- Module Confidence Rows: not changed; coordination-only queue proof
- Requirement Rows: not changed; coordination-only queue proof
- Quality Scenario Rows: not changed; coordination-only queue proof
- Risk Rows: production and release risks preserved on existing owner paths
- Iteration: 2026-07-02 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6876-NO-STALL-QUEUE-EXPEDITOR-2026-07-02
- Mission Status: VERIFIED

## Context
Paperclip assigned this scoped heartbeat for [LUC-6876](/LUC/issues/LUC-6876).
The issue requires the Soar PM lane to inspect open Soar work, prevent stall
or duplicate routing, and create or escalate only if the live queue lacks an
owned next action. The wake payload had no pending comments and
`fallbackFetchNeeded=false`, so no comment-thread expansion was required.

## Goal
Refresh the live Soar queue posture and force a disposition: confirm an
existing owner path, create a narrow child only if a real gap exists, or block
with owner/action evidence.

## Scope
- Paperclip live issue readback for [LUC-6876](/LUC/issues/LUC-6876).
- Soar project issue query for statuses `todo`, `in_progress`, `in_review`,
  `blocked`, and `backlog`.
- Focused owner-path readbacks for [LUC-244](/LUC/issues/LUC-244),
  [LUC-6468](/LUC/issues/LUC-6468), [LUC-4103](/LUC/issues/LUC-4103),
  [LUC-6331](/LUC/issues/LUC-6331), [LUC-6002](/LUC/issues/LUC-6002),
  [LUC-6461](/LUC/issues/LUC-6461), [LUC-6820](/LUC/issues/LUC-6820),
  [LUC-6584](/LUC/issues/LUC-6584), and [LUC-6594](/LUC/issues/LUC-6594).
- Local state updates only.

## Implementation Plan
1. Consume scoped wake payload and avoid re-checkout because the harness already
   claimed the issue for this run.
2. Read [LUC-6876](/LUC/issues/LUC-6876) heartbeat context and issue state.
3. Query the live Soar issue queue and count open statuses.
4. Identify runnable todo lanes and focused release-gate owner paths.
5. Try the documented control tick and janitor checks.
6. Record evidence and close [LUC-6876](/LUC/issues/LUC-6876) if no new child is
   warranted.

## Acceptance Criteria
- [x] [LUC-6876](/LUC/issues/LUC-6876) issue and heartbeat-context readbacks
  return successfully.
- [x] Live Soar queue counts are recorded.
- [x] Any runnable unblocked todo or review gate is named with owner path.
- [x] Duplicate no-stall child creation is avoided unless a gap is found.
- [x] Repository/production safety boundaries are recorded.

## Definition of Done
- [x] Live queue readback complete.
- [x] Existing owner paths preserved.
- [x] No duplicate child warranted.
- [x] Paperclip issue disposition updated to `done`.
- [x] No product code, deploy, secret, account, DB, exchange, or payment
  mutation performed.

## Validation Evidence
- Tests:
  - `pnpm softwarehouse:control-tick` failed because command
    `softwarehouse:control-tick` is not present in this checkout.
- Manual checks:
  - `GET /api/issues/{LUC-6876}/heartbeat-context` returned `200`.
  - `GET /api/issues/{LUC-6876}` returned `200`.
  - `GET /api/companies/{companyId}/issues?projectId=Soar&status=todo,in_progress,in_review,blocked,backlog`
    returned `200` with `154` open Soar issues:
    `1 in_progress`, `1 in_review`, `1 todo`, `147 blocked`, `4 backlog`.
  - The only runnable non-PM todo is [LUC-6468](/LUC/issues/LUC-6468),
    assigned and unblocked.
  - [LUC-4103](/LUC/issues/LUC-4103) remains the owner-login review path.
  - [LUC-244](/LUC/issues/LUC-244) is `cancelled`, so it is not an active
    canonical lane to resume from this heartbeat.
  - [LUC-6331](/LUC/issues/LUC-6331), [LUC-6002](/LUC/issues/LUC-6002),
    [LUC-6461](/LUC/issues/LUC-6461), and [LUC-6820](/LUC/issues/LUC-6820)
    remain existing owner paths.
  - [LUC-6584](/LUC/issues/LUC-6584) and [LUC-6594](/LUC/issues/LUC-6594) are
    cancelled and not active owner paths.
  - `scripts/run-live-run-janitor.mjs` is unavailable in this checkout.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No protected production, secret, credential, account, database, exchange,
    payment, deployment, restart, rollback, push, or live-trading action.
- Module confidence ledger updated: not applicable.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Source Control
- Repo path: `C:\Personal\Projekty\Aplikacje\Soar`.
- Initial dirty state: existing dirty/divergent workspace with `575` changed or
  untracked paths and `HEAD...origin/main` at `22 ahead / 3 behind`.
- Files changed by this heartbeat:
  - `history/tasks/luc-6876-no-stall-queue-expeditor-2026-07-02-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Commit SHA: not committed.
- Push status: not needed and not allowed by this coordination-only heartbeat.
- Deploy impact: none.

## Result Report
- Task summary:
  SPM consumed the scoped wake, refreshed live Soar queue state, confirmed the
  existing runnable and blocked/review owner paths, and found no valid reason
  to create a duplicate child issue.
- Files changed:
  coordination evidence and state only.
- How tested:
  Paperclip API readbacks and local command availability checks.
- What is incomplete:
  production restoration, protected input binding, source/build provenance,
  app-completion proof, owner-login review, and regression evidence remain on
  their existing issues.
- Next steps:
  Continue [LUC-6468](/LUC/issues/LUC-6468), [LUC-6331](/LUC/issues/LUC-6331),
  [LUC-6002](/LUC/issues/LUC-6002), [LUC-6461](/LUC/issues/LUC-6461),
  [LUC-4103](/LUC/issues/LUC-4103), and [LUC-6820](/LUC/issues/LUC-6820).
- Decisions made:
  No new no-stall child, no duplicate PM lane, and no code/runtime mutation.
