# Task

## Header
- ID: LUC-1161
- Title: [Soar][QA] Reconcile public green endpoints with restart evidence
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: Soar Project Manager
- Priority: high
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: IN_PROGRESS_PROD_STACK_DEPLOY

## Context
Board wake required concrete local repair/source-control lane action for issue-scoped reconciliation: align public-green endpoint evidence with restart/crash evidence and leave durable closure packet under fail-closed constraints.

## Goal
Produce one reconciled, dated evidence packet proving whether public-green status conflicts with restart evidence and what gate remains blocked.

## Constraints
- No push, deploy, production restart, secret disclosure, or protected mutation.
- Read-only production checks only.
- Keep issue scope narrow to evidence reconciliation.

## Definition of Done
- [x] Affected capability chain identified.
- [x] Fresh relevant verification command executed in this heartbeat.
- [x] Reconciled evidence packet written under `history/evidence/`.
- [x] Source-of-truth context updated with disposition and residual risk.

## Forbidden
- Runtime mutation.
- Broad unrelated repairs.

## Affected Capability / Chain
- Public release smoke visibility (`/health`, `/ready`, `/`, `/api/build-info`).
- Protected worker readiness gate (`/workers/ready`).
- Coolify restart/crash historical signal (`soar-api last_restart_type=crash`).

## Validation Commands And Results
1. `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
   - Result: mixed (`PASS` for public routes, `FAIL` on protected `/workers/ready` with `401`).
2. `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info`
   - Result: `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`, `buildId=9_MzvzTWKAhz25Nco5xPY`, `metadataGeneratedAt=2026-05-31T15:39:59.210Z`, `checkedAt=2026-05-31T21:49:10.142Z`.

## Reconciliation Outcome
- `implemented and verified`: public endpoint health is currently green.
- `implemented but not verified`: root cause of recorded API crash/restart remains unresolved.
- `blocked by error`: protected worker readiness evidence (`401`) still blocks full runtime readiness proof.
- Therefore: no contradiction; this is a recovered-but-not-fully-proven runtime state.

## Files Changed
- `history/evidence/luc-1161-public-green-endpoints-vs-restart-evidence-reconciliation-2026-05-31.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `history/tasks/luc-1161-soar-qa-reconcile-public-green-endpoints-with-restart-evidence-2026-05-31-task.md`

## Commit / Push / Deploy Disposition
- commit: `not committed`
- push status: `not needed`
- deploy impact: `none`
- reason: worktree contains unrelated runtime/product dirty files from other active lanes; this lane leaves durable no-commit closure evidence only.

## Residual Risk
- Recurrence risk remains until host-level pre-crash logs and one authorized protected readiness smoke are captured.

## Next Owner
- Ops Release Lead + platform/Coolify owner + auth credential owner.

## Continuation Checkpoint (finish_successful_run_handoff)
- Wake acknowledged: `finish_successful_run_handoff` (`fallbackFetchNeeded=false`, comments `0/0`).
- Concrete action:
  1. Reran canonical public smoke on production hosts.
  2. Refreshed build-info readback for timestamp continuity.
- Result:
  - public endpoints remain green (`/health`, `/ready`, `/`, `/api/build-info` => `200`),
  - protected `/workers/ready` remains `401`.
- Decision:
  - public probes alone are **not enough** to mark readiness as complete,
  - restart evidence cadence + protected readiness auth gate keep `LUC-241` blocked.
- Final disposition for this issue heartbeat: `done`.
