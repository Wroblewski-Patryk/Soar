# LUC-6817 No-Stall Queue Expeditor - 2026-07-02

## Context

- Issue: [LUC-6817](/LUC/issues/LUC-6817) `[Soar][PM] No-stall queue expeditor`.
- Role: 11 SPM (Soar Product Manager).
- Stage: verification / coordination.
- Process class: project no-stall loop.
- Wake: `issue_assigned`; harness already checked out the issue.
- Parent: [LUC-12](/LUC/issues/LUC-12) Soar full takeover audit and operating baseline.

## Goal

Inspect the active Soar queue, identify stalled or duplicate PM/no-stall work,
and leave a clear disposition: owner path, blocker path, or next runnable lane.

## Constraints

- No product code implementation.
- No push, deploy, restart, rollback, production mutation, env edit, secret or
  account readback, DB/Redis mutation, exchange/payment mutation, order,
  position, subscription mutation, or live-trading action.
- Do not take over specialist-owned issues where an existing owner path is
  already present.
- Preserve the existing mixed dirty worktree.

## Implementation Plan

1. Read scoped wake payload and heartbeat context for [LUC-6817](/LUC/issues/LUC-6817).
2. Read live Soar issues in `todo`, `in_progress`, `in_review`, `blocked`, and
   `backlog`.
3. Check for canonical PM no-stall lane [LUC-244](/LUC/issues/LUC-244).
4. Attempt project-native control signals where available.
5. Close [LUC-6817](/LUC/issues/LUC-6817) with evidence and next owner paths.

## Acceptance Criteria

- Live queue count is recorded.
- Runnable lanes and review/blocker lanes are named.
- Existing owner paths are used instead of duplicate child issues.
- Final Paperclip disposition is updated with evidence.

## Verification Evidence

- [LUC-6817](/LUC/issues/LUC-6817) heartbeat-context readback returned `200`:
  no blockers, no comments, current issue `in_progress`, parent
  [LUC-12](/LUC/issues/LUC-12) `blocked`.
- Live Soar project readback returned `155` open issues:
  `1 in_progress`, `1 in_review`, `1 todo`, `148 blocked`, and `4 backlog`.
- Current runnable/review lanes:
  - [LUC-6817](/LUC/issues/LUC-6817): current SPM sweep, `in_progress`.
  - [LUC-4103](/LUC/issues/LUC-4103): owner-login verification path,
    `in_review`, assigned to Security/owner-login path.
  - [LUC-6468](/LUC/issues/LUC-6468): runtime automation AI worker contract
    app-completion proof packet, `todo`, assigned to CBE and unblocked.
- Canonical [LUC-244](/LUC/issues/LUC-244) exists but is `cancelled`, so it is
  not a live canonical lane to update.
- Existing release-critical owner paths remain:
  - [LUC-6331](/LUC/issues/LUC-6331): production Web/backtest worker
    restoration.
  - [LUC-6584](/LUC/issues/LUC-6584): regression evidence sweep.
  - [LUC-6594](/LUC/issues/LUC-6594) and [LUC-6002](/LUC/issues/LUC-6002):
    security/account/protected-input gates.
  - [LUC-6461](/LUC/issues/LUC-6461): source/build provenance, first-class
    blocked by [LUC-6331](/LUC/issues/LUC-6331).
- [LUC-6816](/LUC/issues/LUC-6816) is `blocked` and assigned to DRE/Ops. Its
  latest local evidence names [LUC-6331](/LUC/issues/LUC-6331) as the
  continuing Ops restoration owner. SPM did not take over the DRE-owned issue.
- `pnpm softwarehouse:control-tick` in the Soar checkout failed because the
  command is not defined here.
- `scripts/run-live-run-janitor.mjs` is unavailable in the Soar checkout.

## Definition Of Done

- No duplicate worker child is created.
- The one unblocked non-PM worker lane remains [LUC-6468](/LUC/issues/LUC-6468).
- Protected production/operator gates remain fail-closed on their existing
  owner paths.
- [LUC-6817](/LUC/issues/LUC-6817) is marked `done` with this evidence.

## Result Report

Status: `DONE / LIVE_QUEUE_READBACK_COMPLETE / SINGLE_RUNNABLE_TODO_CONFIRMED /
NO_DUPLICATE_CHILD_CREATED / CONTROL_TICK_UNAVAILABLE_IN_SOAR_CHECKOUT /
JANITOR_SCRIPT_UNAVAILABLE_IN_SOAR_CHECKOUT`.

Residual risk: several older blocked issues still show `needs_attention`, but
the active release-critical paths are already represented by current owner
lanes. The next non-PM runnable worker action is [LUC-6468](/LUC/issues/LUC-6468);
production restoration remains with Ops/DRE through [LUC-6331](/LUC/issues/LUC-6331).

