# LUC-6736 No-Stall Queue Expeditor

## Header
- ID: LUC-6736
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: P0
- Mission ID: LUC-6736-NO-STALL-QUEUE-EXPEDITOR-2026-07-02
- Mission Status: VERIFIED
- Operation Mode: BUILDER

## Context
Soar V1 remains in an audit-to-completion loop with production and release gates
held by existing specialist owner paths. This PM heartbeat was scoped to the
Paperclip queue only: inspect open Soar issues, identify stalled runnable work,
and force exactly one disposition without implementing product code.

## Goal
Prevent the Soar queue from stalling by confirming whether there is a runnable
owner path, a stale waiting issue, or a missing child issue that needs creation.

## Scope
- Paperclip issue readback for [LUC-6736](/LUC/issues/LUC-6736).
- Soar project open issue readback for statuses `todo`, `in_progress`,
  `in_review`, `blocked`, and `backlog`.
- Focused readback of current owner paths:
  [LUC-6468](/LUC/issues/LUC-6468), [LUC-4103](/LUC/issues/LUC-4103),
  [LUC-6331](/LUC/issues/LUC-6331), [LUC-6594](/LUC/issues/LUC-6594),
  [LUC-6002](/LUC/issues/LUC-6002), and [LUC-6461](/LUC/issues/LUC-6461).

## Implementation Plan
1. Read the [LUC-6736](/LUC/issues/LUC-6736) heartbeat context and issue.
2. Query the open Soar issue queue and summarize statuses.
3. Verify the active/todo/review owner paths.
4. Create a duplicate child only if no existing first-class runnable path exists.
5. Update Soar state and close [LUC-6736](/LUC/issues/LUC-6736) with evidence.

## Acceptance Criteria
- Queue readback identifies all open Soar issue counts by status.
- Any runnable `todo` or `in_progress` issue has a named owner and disposition.
- No duplicate child issue is created when an existing first-class path is
  already assigned and unblocked.
- Source-control, deploy, secret, and production mutation boundaries are
  recorded.

## Definition of Done
- [x] [LUC-6736](/LUC/issues/LUC-6736) heartbeat-context and issue readback
  returned `200`.
- [x] Live Soar queue readback returned `154` open issues:
  `1 in_progress`, `1 in_review`, `147 blocked`, `4 backlog`, and `1 todo`.
- [x] The only runnable non-PM todo is [LUC-6468](/LUC/issues/LUC-6468):
  `todo`, priority `high`, assigned to CBE, unblocked, with `0` comments.
- [x] Existing gate/wait owner paths remain first-class:
  [LUC-4103](/LUC/issues/LUC-4103) `in_review`;
  [LUC-6331](/LUC/issues/LUC-6331) `blocked`;
  [LUC-6594](/LUC/issues/LUC-6594) `blocked` by
  [LUC-6331](/LUC/issues/LUC-6331) and [LUC-6002](/LUC/issues/LUC-6002);
  [LUC-6002](/LUC/issues/LUC-6002) `blocked`;
  [LUC-6461](/LUC/issues/LUC-6461) `blocked` by
  [LUC-6331](/LUC/issues/LUC-6331).
- [x] No product code, commit, push, deploy, restart, rollback, env edit,
  secret/account readback, DB/Redis mutation, exchange/payment mutation, order,
  position, subscription mutation, or live-trading action occurred.

## Validation Evidence
- Tests: not applicable; PM control-plane coordination only.
- Manual checks:
  - `GET /api/issues/{LUC-6736-id}/heartbeat-context` -> `200`.
  - `GET /api/issues/{LUC-6736-id}` -> `200`.
  - `GET /api/companies/{companyId}/issues?projectId={Soar}&status=todo,in_progress,in_review,blocked,backlog&limit=300` -> `200`, `154` items.
  - Focused heartbeat-context readback for [LUC-6468](/LUC/issues/LUC-6468),
    [LUC-4103](/LUC/issues/LUC-4103), [LUC-6331](/LUC/issues/LUC-6331),
    [LUC-6594](/LUC/issues/LUC-6594), [LUC-6002](/LUC/issues/LUC-6002),
    and [LUC-6461](/LUC/issues/LUC-6461) -> all `200`.
  - `pnpm softwarehouse:control-tick` -> unavailable in this checkout:
    `Command "softwarehouse:control-tick" not found`.
- Source control:
  - No commit or push.
  - Baseline before PM doc update: repo already dirty and
    `main...origin/main` was `[ahead 22, behind 3]`.
- Reality status: verified.

## Result Report
- Task summary:
  PM verified that Soar is not idle. The only runnable non-PM todo remains
  [LUC-6468](/LUC/issues/LUC-6468), assigned to CBE and unblocked. Existing
  production/security/source gates remain on their current owner paths.
- Files changed:
  - `history/tasks/luc-6736-no-stall-queue-expeditor-2026-07-02-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  Paperclip live readback and focused owner-path readback, as listed above.
- What is incomplete:
  Product V1 remains gate-held on existing owner paths; this issue has no
  remaining PM action.
- Next steps:
  CBE continues [LUC-6468](/LUC/issues/LUC-6468). Ops/DRE continues
  [LUC-6331](/LUC/issues/LUC-6331). Security/Ops continues
  [LUC-6594](/LUC/issues/LUC-6594) and [LUC-6002](/LUC/issues/LUC-6002).
  Source/build provenance remains [LUC-6461](/LUC/issues/LUC-6461). Local
  board/operator resolves the pending [LUC-4103](/LUC/issues/LUC-4103)
  owner-login interaction.
