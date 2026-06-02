# Task Contract - LUC-1197 continuation (source_scoped_recovery_action)

## Context
- Issue: `LUC-1197` - `[Soar][Backend+Ops][LUC-1188] Unblock workers/ready contract suite and close readiness proof gap`.
- Wake payload: `source_scoped_recovery_action`, `fallbackFetchNeeded=false`, comments `0/0`.
- Existing repo contains prior `LUC-1197` closure artifacts; this checkpoint revalidates current executable truth in the active workspace state.

## Goal
- Re-run full `/workers/ready` contract suite and classify current blocker state with explicit unblock owners.

## Constraints
- No deploy/push/restart/production mutation.
- Coordination-only lane (Engineering Delivery Lead); no feature implementation.

## Stage
- `verification`

## Scope
- `apps/api/src/router/workers-health-readiness.test.ts`
- `history/evidence/luc-1197-source-scoped-recovery-workers-ready-suite-reblock-2026-06-01.md`
- `.codex/context/TASK_BOARD.md`

## Definition of Done
- Fresh full-suite command output captured.
- Blocker class and unblock owner/action documented.
- Heartbeat disposition explicitly set.

## Result
- Ran:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
- Outcome:
  - `FAIL` (`7 failed`, `1 passed`).
- Failure signature in this run:
  1. setup/helper auth bootstrap class: expected `201`, received `500`,
  2. timeout class at `5000ms` on early suite assertions,
  3. readiness-contract proof remains unverified in full-suite mode.
- Disposition for this continuation: `blocked`.
- Unblock owners/actions:
  1. Backend API owner: stabilize suite auth/bootstrap setup path.
  2. Ops/Runtime owner: provide deterministic local dependency preconditions.
  3. Backend QA owner: rerun full suite and publish closure packet.
- Source-control closure in this lane:
  - commit: `not committed`
  - push: `not needed`
  - deploy impact: `none`
