# Task Contract - LUC-1174

## Context
- Issue: `LUC-1174` - `[Soar][V1 Conformance][Backend] Verify exchange, positions, DCA/TSL, and worker readiness contracts`.
- Wake note requires `softwarehouse-local-repair-lane-starter:v1` behavior (local-only, fail-closed, explicit closure evidence).
- Worktree already contains unrelated in-progress implementation/doc changes from other lanes.

## Goal
- Produce an evidence-backed readiness verdict for backend contracts covering exchange/positions/DCA-TSL and workers readiness, without widening scope.

## Constraints
- No push/deploy/production restart/live mutation.
- PM lane: verification + source-of-truth sync only.
- Preserve unrelated dirty paths.

## Stage
- `verification`

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/router/workers-health-readiness.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Definition of Done
- Affected capability chain and files named.
- Minimal validation commands executed with concrete results.
- Regression risk + unblock owner/action captured.
- Commit/no-commit decision recorded.

## Forbidden
- Push/deploy/restart/secret disclosure.
- Revert or stage unrelated dirty files.
- Claim full verification when DB/auth bootstrap path is still failing.

## Result
- Contract chain verified in this heartbeat:
  1. Exchange-to-position ownership hydration (`apiKey.exchange` forwarded into owned LIVE automation path).
  2. Position reconciliation ownership partitioning across market scope and symbol ownership.
  3. DCA/TSL automation continuity entrypoint (owned LIVE automation hydration execution path).
  4. Workers readiness auth/readiness contract.
- Targeted DB-independent contract verification:
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts -t "uses api-key exchange when hydrating owned LIVE automation after exchange-sync create|uses api-key exchange when hydrating owned LIVE automation after exchange-sync update|assigns different exact owners for different symbols|ignores other-market owners when seeding reconciliation cleanup candidates" --reporter=verbose` -> PASS (`4` passed, `30` skipped).
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts -t "rejects unauthenticated access" --reporter=verbose` -> PASS (`1` passed, `7` skipped).
- Full workers readiness contract run:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose` -> FAIL (`7` failed, `1` passed).
  - Blocker signature unchanged: auth bootstrap in test helper fails early (`/auth/register` returns `500` instead of `201`), so admin/non-admin/ready/not_ready readiness assertions are not reached.
- Disposition: `blocked`.
- Unblock owner/action:
  1. Backend owner: restore deterministic auth registration bootstrap in workers-readiness test runtime.
  2. QA/backend lane: rerun full `workers-health-readiness.test.ts` after bootstrap fix and attach passing packet.
- Source-control closure decision:
  - `not committed` in this heartbeat (verification/state-sync only; broader unrelated dirty set active).

## Continuation Delta - 2026-06-01 (`source_scoped_recovery_action`)
- Recheck command:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
- Result:
  - command timed out after `124s`;
  - suite still `FAIL` (`7` failed, `1` passed), with repeated Redis connectivity errors (`ECONNREFUSED` on `localhost:6379`) and 5s test timeouts across readiness assertions.
- Disposition remains: `blocked`.
- Updated unblock owner/action:
  1. Backend/Ops local-runtime lane: make Redis dependency reachable (or stubbed deterministically) for workers-readiness test runtime.
  2. Backend/QA lane: rerun full workers readiness suite and attach passing closure evidence.

## Continuation Delta - 2026-06-01 (`issue_continuation_needed`)
- Concrete action:
  - stabilized this suite against non-test runtime mode by enforcing `NODE_ENV='test'` for each test case in `apps/api/src/router/workers-health-readiness.test.ts` and restoring it after suite completion.
- Verification:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
  - result: `FAIL` (`7` failed, `1` passed); Redis timeout failure signature no longer dominates, but `/auth/register` still returns `500` instead of `201` in auth bootstrap helpers.
- Disposition: `blocked` (unchanged).
- Updated unblock owner/action:
  1. Backend owner: fix auth registration bootstrap/runtime path used by workers-readiness helpers.
  2. Backend/QA lane: rerun full workers readiness matrix and publish closure packet after auth bootstrap fix.
