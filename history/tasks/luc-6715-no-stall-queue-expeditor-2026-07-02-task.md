# Task

## Header
- ID: LUC-6715
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: LUC-12
- Priority: P0
- Mission ID: LUC-6715-NO-STALL-QUEUE-EXPEDITOR-2026-07-02
- Mission Status: VERIFIED

## Context
Soar V1 remains in the audit-to-completion loop. This heartbeat was a PM
queue-expeditor run scoped to the active Paperclip issue LUC-6715, with no
permission to implement product code, commit, push, deploy, restart, read
secrets, mutate production, or perform account/exchange/payment/live-trading
actions.

The wake payload had no pending comments and said checkout was already claimed
by the harness for this run, so no duplicate checkout was performed.

## Goal
Inspect the current Soar queue, identify any stalled open lane that needs a PM
disposition, and either route the stall or confirm that existing owner paths
already cover the current blockers.

## Scope
- Paperclip issue: LUC-6715.
- Project: Soar.
- Surfaces inspected: Paperclip heartbeat context and live Soar issue readback.
- Files changed: this task record and PM state summary only.

## Implementation Plan
1. Read Paperclip role and shared contracts.
2. Read LUC-6715 heartbeat context.
3. Attempt the issue-prescribed control signal.
4. Query live Soar issues by project/status.
5. Decide whether a new child issue is warranted.
6. Record evidence and close LUC-6715 with a clear disposition.

## Acceptance Criteria
- Current Soar open queue counts are recorded.
- Any ownerless or posture-mismatched lane is routed, or a no-new-child decision
  is justified.
- LUC-6715 receives a final Paperclip disposition.

## Definition of Done
- Queue readback completed.
- Existing owner paths or new child issue identified.
- No product/runtime mutation occurred.
- Source-of-truth task evidence recorded.

## Validation Evidence
- Tests: not applicable; coordination-only PM lane.
- Manual checks:
  - `GET /api/issues/{LUC-6715}/heartbeat-context` returned `200`.
  - Live Soar project readback returned `156` open issues:
    `2 in_progress`, `3 todo`, `1 in_review`, `146 blocked`, `4 backlog`.
  - Current active/todo/review lanes are assigned:
    [LUC-6716](/LUC/issues/LUC-6716) active QVE acceptance,
    [LUC-6711](/LUC/issues/LUC-6711) DRE production watch todo,
    [LUC-6705](/LUC/issues/LUC-6705) AIA owner-login posture recovery todo,
    [LUC-6468](/LUC/issues/LUC-6468) app-completion proof todo,
    [LUC-4103](/LUC/issues/LUC-4103) owner-login path in review.
  - `pnpm softwarehouse:control-tick` in the Soar checkout failed because the
    script is not present in this package, matching earlier no-stall caveats.
- High-risk checks: no secrets, deploy, push, restart, production mutation,
  account mutation, exchange/payment mutation, order, position, subscription
  mutation, or live-trading action.
- Reality status: verified.

## Result Report
- Task summary: live queue is not ownerless and does not need a duplicate PM,
  DRE, QVE, TSA, FEW, CBE, Security, or Ops child from this heartbeat.
- Files changed:
  - `history/tasks/luc-6715-no-stall-queue-expeditor-2026-07-02-task.md`
  - `.agents/state/next-steps.md`
- How tested: Paperclip heartbeat context and live issue readback.
- What is incomplete: V1 remains blocked on existing owner paths.
- Next steps:
  - DRE/Ops continues [LUC-6331](/LUC/issues/LUC-6331) production Web/backtest
    worker restoration and related watch lanes.
  - QVE continues [LUC-6716](/LUC/issues/LUC-6716) and reruns acceptance after
    production recovery.
  - AIA continues [LUC-6705](/LUC/issues/LUC-6705) for owner-login waiting
    posture recovery.
  - App-completion proof remains [LUC-6468](/LUC/issues/LUC-6468).
- Decisions made: no new child issue was created because every current
  actionable open lane has an owner or an explicit waiting/blocker posture.
