# LUC-6322 No-Stall Queue Expeditor

## Header

- ID: [LUC-6322](/LUC/issues/LUC-6322)
- Title: [Soar][PM] No-stall queue expeditor
- Task Type: coordination
- Current Stage: verification
- Status: DONE / STALE_TODO_ROUTED / OWNER_PATH_CHILD_CREATED
- Owner: Soar Product Manager
- Parent: [LUC-12](/LUC/issues/LUC-12)
- Priority: P0
- Mission ID: LUC-6322-NO-STALL-QUEUE-EXPEDITOR-2026-06-30
- Operation Mode: BUILDER

## Context

Paperclip assigned [LUC-6322](/LUC/issues/LUC-6322) as the strict Soar PM
no-stall control-loop heartbeat. The wake payload had no new comments,
`fallbackFetchNeeded=false`, and checkout was already claimed by the harness.

The PM lane is coordination-only. No product code, push, deploy, restart,
protected smoke, secret/account readback, production mutation,
exchange/payment mutation, order, position, subscription/payment mutation, or
live-trading action was authorized.

## Goal

Inspect the open Soar queue, find stalled executable lanes, and force one
durable disposition: close, delegate, block, reassign, or create a narrow
unblock path.

## Scope

- Paperclip issue readback for [LUC-6322](/LUC/issues/LUC-6322).
- Open Soar queue readback.
- Focused stale todo reconciliation for [LUC-5606](/LUC/issues/LUC-5606).
- Local state/task evidence update.

## Implementation Plan

1. Consume inline wake payload and role instructions.
2. Read current Soar state files and recent evidence.
3. Read [LUC-6322](/LUC/issues/LUC-6322) heartbeat context.
4. Query open Soar issues by status.
5. Identify one stale executable lane.
6. Attempt direct cleanup if authorized.
7. If authorization blocks PM cleanup, create one owner-path child issue.
8. Record local evidence and close [LUC-6322](/LUC/issues/LUC-6322).

## Acceptance Criteria

- Live queue readback is recorded.
- At least one real no-stall action is taken.
- Stale or blocked work has a named next owner/action.
- No duplicate broad no-stall, Backend/Auth, TSA, DRE, QVE, FEW, Docs, or
  protected-input lane is created.
- Final Paperclip disposition is not left as stale `in_progress`.

## Definition of Done

- [x] [LUC-6322](/LUC/issues/LUC-6322) heartbeat context readback passed.
- [x] Open Soar queue readback passed.
- [x] Stale [LUC-5606](/LUC/issues/LUC-5606) todo identified.
- [x] Direct PM cleanup attempted and rejected by first-class authorization
  boundary.
- [x] Owner-path child [LUC-6323](/LUC/issues/LUC-6323) created for CBE.
- [x] Local task/state evidence updated.

## Forbidden

- Product/runtime implementation.
- Push, deploy, restart, rollback execution, or production mutation.
- Protected smoke, secret/account value readback, DB/Redis mutation,
  exchange/payment mutation, order, position, subscription/payment mutation, or
  live-trading action.
- Duplicate broad repair lanes already covered by existing owner paths.

## Validation Evidence

| Check | Result |
| --- | --- |
| `GET /api/issues/{LUC-6322}/heartbeat-context` | PASS: status `in_progress`, no blockers, parent [LUC-12](/LUC/issues/LUC-12), comments `0`. |
| `GET /api/companies/{companyId}/issues?q=Soar&status=todo,in_progress,in_review,blocked,backlog` | PASS: `194` open Soar-matching issues: `1 in_progress`, `159 blocked`, `5 in_review`, `22 backlog`, `7 todo`. |
| Focused [LUC-5606](/LUC/issues/LUC-5606) heartbeat context | PASS: stale `todo`, CBE-assigned, no comments, acceptance matches later [LUC-6164](/LUC/issues/LUC-6164) proof. |
| `PATCH /api/issues/{LUC-5606}` to `done` | BLOCKED: `403 Issue is outside this actor's authorization boundary`. |
| `POST /api/companies/{companyId}/issues` | PASS: created [LUC-6323](/LUC/issues/LUC-6323), assigned to CBE, to close [LUC-5606](/LUC/issues/LUC-5606) using [LUC-6164](/LUC/issues/LUC-6164) evidence. |
| `pnpm softwarehouse:control-tick` | NOT AVAILABLE in this checkout: `Command "softwarehouse:control-tick" not found`. |

## Queue Decision

[LUC-5606](/LUC/issues/LUC-5606) is stale because [LUC-6164](/LUC/issues/LUC-6164)
resumed and completed the same Backtests cleanup-isolation acceptance packet:
focused Backtests with infra passed (`15/15`), broad API smoke with infra
passed (`45/45`), and repeatable `api,backtests` passed (`2/2` selected
checks). PM cannot close [LUC-5606](/LUC/issues/LUC-5606) directly due to
authorization, so [LUC-6323](/LUC/issues/LUC-6323) is the narrow owner-path
cleanup lane.

No new product repair child is needed from this heartbeat. Current release
residuals remain on existing owner paths: [LUC-6234](/LUC/issues/LUC-6234)
protected input/account-access gate, source/build provenance, host-level proof,
and app-completion burn-down.

## Result Report

- Task summary: executed a no-stall queue pass, found a stale Backend todo,
  created a CBE owner-path cleanup child after direct PM mutation returned
  `403`, and prepared [LUC-6322](/LUC/issues/LUC-6322) for closure.
- Files changed:
  - `history/tasks/luc-6322-no-stall-queue-expeditor-2026-06-30-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Verification:
  - Paperclip heartbeat context and open issue query passed.
  - Owner-path child creation passed.
- What is incomplete:
  - [LUC-6323](/LUC/issues/LUC-6323) must close stale [LUC-5606](/LUC/issues/LUC-5606).
- Next owner:
  - CBE owns [LUC-6323](/LUC/issues/LUC-6323).
- Source-control/deploy:
  - Not committed; coordination/state evidence only in a pre-existing dirty
    shared worktree. No push or deploy.
