# LUC-6838 No-Stall Queue Expeditor

## Header
- ID: LUC-6838
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: LUC-12
- Priority: P0
- Mission ID: LUC-6838-NO-STALL-QUEUE-EXPEDITOR-2026-07-02
- Mission Status: VERIFIED

## Context
This is a Soar project no-stall loop heartbeat. The issue asks the Soar Product
Manager to inspect open Soar issues, force stalled lanes to a clear disposition,
and avoid duplicate child work when existing owner paths already cover the
release blockers.

## Goal
Refresh the live Soar queue, identify whether any stalled lane needs PM action,
and close the heartbeat with a durable Paperclip disposition.

## Scope
- Paperclip issue readback for LUC-6838.
- Live Soar project queue readback for open `todo`, `in_progress`, `in_review`,
  `blocked`, and `backlog` issues.
- Project-native control-helper availability checks.
- Local repository status classification.

## Implementation Plan
1. Read LUC-6838 and heartbeat context.
2. Query the live Soar project issue queue.
3. Identify runnable, review, and blocked owner paths.
4. Run the smallest control-helper checks requested by the issue description.
5. Record outcome in project memory and close the Paperclip issue.

## Acceptance Criteria
- LUC-6838 issue/context readbacks succeed.
- Open Soar queue counts are recorded.
- Runnable and review lanes are named.
- New child issue is created only if no existing owner path covers the gap.
- Final Paperclip status is `done`, `blocked`, `in_review`, or delegated.

## Definition of Done
- Queue state is verified from the live Paperclip API.
- Existing owner paths are preserved without duplicate no-stall child creation.
- Source-control closure impact is recorded.
- No product code, push, deploy, restart, secret/account readback, database
  mutation, exchange/payment mutation, order, position, subscription mutation,
  or live-trading action occurred.

## Validation Evidence
- Paperclip issue readback: `GET /api/issues/6fa5855b-c913-4f7a-b30f-57c78793bd06` returned `200`.
- Paperclip heartbeat context: `GET /api/issues/6fa5855b-c913-4f7a-b30f-57c78793bd06/heartbeat-context` returned `200`.
- Live Soar queue readback returned `155` open issues:
  - `1 in_progress`: LUC-6838 only.
  - `1 todo`: LUC-6468, assigned to CBE, unblocked.
  - `1 in_review`: LUC-4103 owner-login verification path.
  - `148 blocked`.
  - `4 backlog`.
- `pnpm softwarehouse:control-tick` failed because the command is unavailable
  in this Soar checkout: `Command "softwarehouse:control-tick" not found`.
- `node scripts/run-live-run-janitor.mjs --dry-run` failed because the script is
  unavailable in this Soar checkout: `MODULE_NOT_FOUND`.
- `git status --short --branch` shows `main...origin/main [ahead 22, behind 3]`
  with a pre-existing large dirty tree. No commit or push was performed.
- Reality status: verified coordination checkpoint.

## Result Report
- Task summary: live queue readback confirms no stalled PM-disposable lane that
  needs a new child issue. LUC-6468 remains the only runnable non-PM todo and
  is already assigned to the backend owner. LUC-4103 remains the explicit review
  gate. Existing blocked release paths remain first-class.
- Files changed: this task note plus source-of-truth queue summaries.
- How tested: Paperclip API readbacks, project queue query, control-helper
  availability checks, and git status inspection.
- What is incomplete: production restoration, protected input/account gates,
  source/build provenance, regression evidence, and app-completion proof remain
  on their existing owner paths.
- Next steps: continue LUC-6468, LUC-6331, LUC-6002, LUC-6461, LUC-4103, and
  LUC-6820 through their assigned owners. Do not treat cancelled LUC-6584 and
  LUC-6594 as active owner paths. No duplicate PM no-stall child is warranted.
- Decisions made: close LUC-6838 as `done` because the expeditor checkpoint is
  complete and no fresh PM handoff is required.
