# LUC-1174 Backend Contract Verification Evidence (2026-06-01)

## Wake And Lane
- Wake: `issue_assigned` with `softwarehouse-local-repair-lane-starter:v1`.
- Lane mode: local repair/source-control closure only (`no push`, `no deploy`, `no production restart`).

## Affected Capability Chain
1. Exchange adapter identity -> synced position hydration owner path (`apiKey.exchange`).
2. Position reconciliation ownership partition (market-scope and symbol-scope owner separation).
3. Owned LIVE automation hydration continuity (DCA/TSL automation entrypoint follows exchange-sync truth).
4. Workers readiness protected contract (`/workers/ready` auth + split-mode readiness).

## Files Inspected
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `apps/api/src/router/workers-health-readiness.test.ts`

## Validation Commands And Results
1. DB-independent exchange/positions/automation contract slice:
   - Command:
     - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts -t "uses api-key exchange when hydrating owned LIVE automation after exchange-sync create|uses api-key exchange when hydrating owned LIVE automation after exchange-sync update|assigns different exact owners for different symbols|ignores other-market owners when seeding reconciliation cleanup candidates" --reporter=verbose`
   - Result: `PASS` (`1` file; `4` passed, `30` skipped).
2. DB-independent workers auth fail-closed check:
   - Command:
     - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts -t "rejects unauthenticated access" --reporter=verbose`
   - Result: `PASS` (`1` file; `1` passed, `7` skipped).
3. Full workers readiness contract check:
   - Command:
     - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
   - Result: `FAIL` (`1` file; `7` failed, `1` passed).
   - Failure signature: helper bootstrap for authenticated flows fails (`/auth/register` expected `201`, got `500`), plus one timeout; readiness-path assertions are therefore not fully executable in current local runtime state.

## Readiness Verdict
- Exchange/positions/automation contract slice: `implemented and verified` (for targeted DB-independent assertions).
- Workers readiness contract:
  - unauthenticated fail-closed path: `implemented and verified`.
  - authenticated/admin/split-mode readiness matrix: `implemented but not verified` in this heartbeat due to auth bootstrap blocker.
- Overall LUC-1174 status: `blocked` pending workers-readiness bootstrap stability.

## Regression Risk And Follow-Up
- Main residual risk: `/workers/ready` ready/not_ready/admin/non-admin behavior may regress unnoticed until `/auth/register` test bootstrap path is stabilized.
- Required follow-up owner/action:
  1. Backend owner fixes test-runtime auth bootstrap path for workers readiness suite.
  2. QA/backend reruns full workers readiness suite and republishes closure packet.

## Source-Control Closure
- Commit decision: `not committed` (verification + evidence sync only; issue-scoped lane did not introduce product-code mutation).
- Push status: `not needed`.
- Deploy impact: `none`.

## Continuation Delta (2026-06-01, source_scoped_recovery_action)
- Re-ran full readiness suite to confirm blocker determinism:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
- Result: `FAIL` (`7` failed, `1` passed) and command timed out after `124s`.
- Updated blocker signature in this environment:
  - repeated `Redis rate-limit client error` with `ECONNREFUSED` (`::1:6379`, `127.0.0.1:6379`);
  - seven readiness assertions timed out at `5000ms`.
- Updated unblock owner/action:
  1. Backend/Ops local-runtime lane: provide reachable Redis dependency (or deterministic test stub path) for workers readiness suite.
  2. Backend/QA lane: rerun full suite and publish closure packet only after Redis + auth bootstrap stability is restored.

## Continuation Delta (2026-06-01, issue_continuation_needed)
- Implemented deterministic test-runtime guard for this suite:
  - updated `apps/api/src/router/workers-health-readiness.test.ts` to enforce `NODE_ENV='test'` during test execution (`beforeEach`) and restore original value in `afterAll`.
- Re-ran full workers readiness suite:
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts --reporter=verbose`
- Result after guard:
  - Redis timeout signature removed from this suite run.
  - Suite still `FAIL` (`7` failed, `1` passed) because authenticated helper bootstrap remains broken (`/auth/register` expected `201`, got `500`).
- Updated blocker truth:
  1. Primary blocker is auth registration bootstrap/runtime path in this local test environment.
  2. Redis availability is no longer the first-failure cause for this suite after the local test guard.
