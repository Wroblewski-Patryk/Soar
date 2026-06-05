# LUC-2329 Gap Register And Repair Lane Refresh Task

## Context

Issue: [LUC-2329](/LUC/issues/LUC-2329) `[Soar] Gap register and repair lane refresh`

Wake payload:
- Reason: `issue_assigned`
- Status at wake: `in_progress`
- Checkout: already claimed by harness; checkout was not repeated.
- Pending comments: `0/0`
- Fallback fetch: not needed.

Role boundary: Engineering Delivery Lead owns decomposition, integration order,
handoffs, and evidence expectations. This heartbeat did not implement feature
code.

Dirty baseline before this heartbeat:
- Modified: `.agents/state/system-health.md`
- Modified: `.codex/context/PROJECT_STATE.md`
- Modified: `.codex/context/TASK_BOARD.md`
- Modified: `docs/operations/coolify-vps-deployment-contract.md`
- Modified: `docs/operations/runtime-config-ledger.csv`
- Untracked: LUC-2316, LUC-2319, and LUC-2321 history task/evidence files.

Those files were treated as pre-existing same-program state/evidence work and
were not reverted.

## Goal

Refresh the Soar audit-to-completion gap register from current evidence and
ensure each actionable gap has an owned repair lane, severity, affected
workflow, expected fix or proof, verification expectation, commit/push/deploy
expectation, and release impact.

## Constraints

- Do not push, deploy, restart, rollback, mutate production, touch secrets, or
  run live-trading actions.
- Do not take over specialist implementation work.
- Preserve existing dirty worktree state.
- Prefer existing live child issues over creating duplicate lanes.

## Definition Of Done

- Current failed or stale checks are converted into register rows.
- Each actionable row has a named owner/lane and next proof.
- Existing live lanes are reused instead of duplicated.
- Source-of-truth evidence is updated.
- Paperclip issue receives a final disposition.

## Forbidden

- Feature-code implementation by Engineering Delivery Lead.
- Duplicate child issue creation for a lane already covered by an active issue.
- Treating public health as protected release proof.
- Treating comments as a live continuation path without an active child,
  blocker, interaction, or owner action.

## Stage

Stage: `verification`

Output expected from this stage: known-state gap register plus route-to-owner
repair lanes.

## Control Signal

Attempted command:

```powershell
pnpm softwarehouse:control-tick
```

Result: blocked by command shape in this checkout.

```text
ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL Command "softwarehouse:control-tick" not found
```

Fallback used: current issue heartbeat context, repository source-of-truth
files, Paperclip issue search, current system-health/project-state entries,
and current child issue topology.

## Refreshed Gap Register

| Gap ID | Severity | Layer | Workflow | Current evidence | Owner lane | Expected fix or proof | Verification | Commit/push/deploy expectation | Release impact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GAP-2329-01` | P0 | Backend/API + QA | Bot Runtime aggregate e2e proof after OOM mitigation | [LUC-2319](/LUC/issues/LUC-2319) restored local Postgres/Redis; focused aggregate e2e now reaches API and returns `200`, but assertion fails at `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts:534`: expected `trades.total=260`, received `0`. | Backend API Engineer via [LUC-2328](/LUC/issues/LUC-2328); QA parent [LUC-2317](/LUC/issues/LUC-2317) remains blocked by active child. | Repair runtime aggregate trade total/readback behavior or fixture contract so persisted trade totals survive bounded materialization. | Rerun focused aggregate e2e; rerun narrow API typecheck or focused aggregate tests; report DB/Redis cleanup or intentional keep-running status. | Backend issue must report commit SHA or no-commit reason; no push/deploy until source-control and Ops release gates approve. | Blocks closing `RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25` and keeps [LUC-2300](/LUC/issues/LUC-2300) / [LUC-2315](/LUC/issues/LUC-2315) from verified release confidence. | Active repair lane exists: [LUC-2328](/LUC/issues/LUC-2328) `in_progress`. |
| `GAP-2329-02` | P1 | Ops / release evidence | Production Web recovery follow-up | [LUC-2308](/LUC/issues/LUC-2308) and [LUC-2321](/LUC/issues/LUC-2321) show public API/Web recovered and production build-info matches `origin/main` `a70d7881b69e605c537af5f81cbeb74dc81e9329`; local `HEAD` is ahead at `10f1cfce94533e96a65b487d8cd0b1e9dff8f59e`. | Ops Release Lead / Source-control closure lane when code/evidence is ready. | Keep public recovery evidence separate from protected release readiness; classify local ahead-of-origin work before any push/deploy. | Public smoke and Coolify read-only status are already recorded; future protected smoke remains separate. | No deploy from local `HEAD`; push/deploy only after coherent closure and Ops permit. | Public availability no longer blocks local work, but protected/account/worker readiness remains unproven. | Covered by current production health evidence; no new child needed. |
| `GAP-2329-03` | P1 | Source control / release discipline | Dirty worktree and local ahead-of-origin state | `git status --short` shows existing modified state/context/ops docs and untracked LUC-2316/2319/2321 artifacts; [LUC-2327](/LUC/issues/LUC-2327) already classified the control tick dirty packet groups as done. | Soar PM / CTO source-control closure, as needed after active Backend [LUC-2328](/LUC/issues/LUC-2328). | Separate current issue artifacts from unrelated existing dirty files; commit only coherent validated sets, or record no-commit reason. | `git status --short`, targeted redaction/secret scan if committing evidence, `git diff --check` or focused docs guardrail. | No push/deploy from dirty tree. | Prevents accidental release from unreviewed local `HEAD`; does not block Backend repair itself. | Monitored; no duplicate source-control child created from this heartbeat. |
| `GAP-2329-04` | P1 | Release / protected proof | Protected/account and worker readiness proof | [LUC-2321](/LUC/issues/LUC-2321) public no-workers smoke passed; unauthenticated `/workers/ready` returned expected `401`; no protected account/dashboard/worker smoke was run. | QA Regression Lead + Ops Release Lead + Security when protected auth/input is approved. | Run protected smoke only under approved auth/context and redaction rules; keep public smoke from being overclaimed. | Protected UI/runtime/worker readiness packet, rollback/restore/SLO gates where required. | Requires explicit protected input path; no live-money mutation. | Keeps V1 audit-to-completion parent blocked until protected proof is current or explicitly deferred. | Recorded as release gate, not a code repair lane. |

## Existing Lane Topology

- [LUC-2317](/LUC/issues/LUC-2317) QA proof lane is `blocked` and covered by
  active child [LUC-2328](/LUC/issues/LUC-2328).
- [LUC-2328](/LUC/issues/LUC-2328) Backend repair lane is `in_progress` with a
  live run.
- [LUC-2319](/LUC/issues/LUC-2319) Ops local DB/Redis infra lane is `done`.
- [LUC-2321](/LUC/issues/LUC-2321) read-only production health sweep is `done`.

No duplicate child issue was created by this heartbeat because the only newly
actionable product/runtime failure is already assigned and running under
[LUC-2328](/LUC/issues/LUC-2328).

## Verification

- Read Paperclip heartbeat context for [LUC-2329](/LUC/issues/LUC-2329).
- Queried current Paperclip agent roster for owner routing.
- Queried issue topology for [LUC-2300](/LUC/issues/LUC-2300),
  [LUC-2317](/LUC/issues/LUC-2317), [LUC-2319](/LUC/issues/LUC-2319), and
  [LUC-2328](/LUC/issues/LUC-2328).
- Read current repository system-health, project-state, module-confidence,
  requirements, risk, active-mission, known-issues, task-board, and planning
  state.

No code/runtime tests were run because this was a coordination and evidence
refresh heartbeat. The only attempted control command is recorded above and
failed before making project changes.

## Result Report

Status: implemented and verified as a coordination refresh.

Files changed by this heartbeat:
- `history/tasks/luc-2329-gap-register-and-repair-lane-refresh-2026-06-06-task.md`
- `.agents/state/module-confidence-ledger.md`

Deployment impact: none.

Residual risk:
- Backend aggregate trade-total repair remains active in [LUC-2328](/LUC/issues/LUC-2328).
- Protected production/account/worker readiness remains separate from public
  health.
- Existing dirty/ahead-of-origin state must be closed before any push/deploy.

Next owner action:
- Backend API Engineer completes [LUC-2328](/LUC/issues/LUC-2328) with focused
  aggregate e2e proof, commit/no-commit disposition, push status, deploy impact,
  and rollback notes.
