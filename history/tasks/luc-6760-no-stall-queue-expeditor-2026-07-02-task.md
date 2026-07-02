# LUC-6760 No-Stall Queue Expeditor

## Header
- ID: LUC-6760
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Priority: P0
- Mission ID: LUC-6760-NO-STALL-QUEUE-EXPEDITOR-2026-07-02
- Mission Status: VERIFIED

## Context
This heartbeat was scoped to [LUC-6760](/LUC/issues/LUC-6760), a critical
Soar Product Manager control-loop issue. The goal was to prevent queue stall by
inspecting live Soar issue posture and either route a real runnable lane or
confirm that existing owner paths are already first-class.

## Goal
Refresh the live Soar queue, identify runnable or stalled non-PM work, avoid
duplicate children, and give [LUC-6760](/LUC/issues/LUC-6760) a terminal
disposition with evidence.

## Scope
- Paperclip issue readback for [LUC-6760](/LUC/issues/LUC-6760).
- Live Soar project queue readback for statuses `todo`, `in_progress`,
  `in_review`, `blocked`, and `backlog`.
- Focused owner-path readbacks for [LUC-6468](/LUC/issues/LUC-6468),
  [LUC-4103](/LUC/issues/LUC-4103), [LUC-6331](/LUC/issues/LUC-6331),
  [LUC-6584](/LUC/issues/LUC-6584), [LUC-6594](/LUC/issues/LUC-6594),
  [LUC-6002](/LUC/issues/LUC-6002), and [LUC-6461](/LUC/issues/LUC-6461).
- Project state updates only.

## Explicit Exclusions
No product code, commit, push, deploy, restart, rollback execution, env edit,
secret/account readback, DB/Redis mutation, production account mutation,
exchange/payment mutation, order, position, subscription mutation, or
live-trading action.

## Implementation Plan
1. Read the scoped wake payload and role instructions.
2. Read the current Soar PM state files for recent no-stall posture.
3. Query the Paperclip API for [LUC-6760](/LUC/issues/LUC-6760), live open
   Soar issues, and known owner-path issues.
4. Run the smallest control signal available from the Soar checkout.
5. Update source-of-truth state and close the issue with a clear disposition.

## Acceptance Criteria
- [x] [LUC-6760](/LUC/issues/LUC-6760) readback succeeds.
- [x] Live Soar queue counts are recorded.
- [x] Runnable non-PM todo lane is identified or absent.
- [x] Duplicate child creation decision is explicit.
- [x] Next owner/action is named.

## Validation Evidence
- Paperclip issue readback for [LUC-6760](/LUC/issues/LUC-6760): `200`.
- Paperclip heartbeat-context readback for [LUC-6760](/LUC/issues/LUC-6760):
  `200`, with `0` comments.
- Live Soar project queue: `154` open issues: `1 in_progress`, `1 in_review`,
  `147 blocked`, `4 backlog`, and `1 todo`.
- Only runnable non-PM todo: [LUC-6468](/LUC/issues/LUC-6468), assigned to CBE
  and unblocked.
- Waiting/review path: [LUC-4103](/LUC/issues/LUC-4103) remains `in_review`
  with the local-board/operator method-selection path.
- Blocked gate paths remain [LUC-6331](/LUC/issues/LUC-6331),
  [LUC-6584](/LUC/issues/LUC-6584), [LUC-6594](/LUC/issues/LUC-6594),
  [LUC-6002](/LUC/issues/LUC-6002), and [LUC-6461](/LUC/issues/LUC-6461).
- `pnpm softwarehouse:control-tick` failed in this checkout with
  `Command "softwarehouse:control-tick" not found`.
- `git rev-list --left-right --count origin/main...HEAD` returned `3 22`;
  the repo was already heavily dirty before this PM coordination heartbeat.

## Result Report
- Task summary: verified the live Soar queue and confirmed there is no new PM,
  DRE, QVE, TSA, FEW, CBE, Security, or Ops child to create from this run.
- Files changed: this task packet plus source-of-truth PM state entries.
- How tested: Paperclip API readbacks and focused command checks.
- What is incomplete: no product implementation was in scope; production and
  release gates remain on their existing owner paths.
- Next steps: CBE continues [LUC-6468](/LUC/issues/LUC-6468); Ops/DRE
  continues [LUC-6331](/LUC/issues/LUC-6331); QA/Test continues
  [LUC-6584](/LUC/issues/LUC-6584); Security/Ops continues
  [LUC-6594](/LUC/issues/LUC-6594) and [LUC-6002](/LUC/issues/LUC-6002);
  source/build provenance remains [LUC-6461](/LUC/issues/LUC-6461);
  local-board/operator resolves [LUC-4103](/LUC/issues/LUC-4103).
