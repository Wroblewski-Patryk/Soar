# LUC-1166 Evidence - Gate.io Position Ingestion Readiness

Date: 2026-05-31
Lane: Soar Project Manager (verification/integration)

## Affected Capability Chain
- Gate.io LIVE position sync ingestion
  - `reconcileExternalPositionsFromExchange(...)`
  - owned LIVE automation hydration path
  - `processOwnedSyncedPositionAutomation(...)`

## Affected Files
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`

## Change Verified
- Previous behavior: owned LIVE automation hydration forwarded hardcoded `exchange: 'BINANCE'`.
- Current behavior: forwards `exchange: apiKey.exchange ?? 'BINANCE'`.
- Type contract widened from `'BINANCE'` to `Exchange` for hydration input.
- New regression tests assert Gate.io passthrough on both create and update sync paths.

## Validation Commands And Results
1. Command:
   - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/router/workers-health-readiness.test.ts --reporter=verbose`
2. Result:
   - Partial pass with explicit Gate.io regression tests passing:
     - `uses api-key exchange when hydrating owned LIVE automation after exchange-sync create` -> pass
     - `uses api-key exchange when hydrating owned LIVE automation after exchange-sync update` -> pass
   - Suite failure blockers:
     - Multiple tests fail because local DB is unavailable:
       - `Can't reach database server at localhost:5432`
    - `workers health and readiness endpoints > returns workers health status` timed out at 5000 ms.

3. Command (continuation, DB-independent subset):
   - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts -t "uses api-key exchange when hydrating owned LIVE automation after exchange-sync|continues syncing healthy api keys when one api key fetch fails|ignores other-market owners when seeding reconciliation cleanup candidates|assigns different exact owners for different symbols" --reporter=verbose`
   - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts -t "rejects unauthenticated access" --reporter=verbose`
4. Result:
   - PASS: `5` targeted position-ingestion tests, `29` skipped.
   - PASS: unauthenticated readiness gate test (`1` pass, `7` skipped).

## Acceptance Matrix (local/mock + read-only only)
- Empty account path: `verified` (mocked empty positions in reconciliation tests).
- Open position ingestion path: `verified` (create/update hydration + owner mapping tests).
- Auth failure class: `partially verified` (unauthenticated readiness rejection verified; authenticated non-admin still pending DB-backed run).
- Rate-limit / upstream error class: `verified` (healthy key sync continues when another key fetch fails).
- Persistence sync class: `implemented but not verified` in this lane (DB-backed assertions blocked by missing local PostgreSQL on `localhost:5432`).
- UI/API display path: `present in code, behavior unknown` for this issue scope (no dedicated UI verification executed in this lane).

## Regression Risk
- Low risk for the exact adapter-fix line (single-field source correction + direct regression coverage).
- Medium integration risk for full readiness claim until DB-backed API suites are rerun in a valid test DB environment.

## Source-Control Closure Decision
- Commit decision: `no-commit` in this PM verification lane.
- Reason:
  - Worktree is broadly dirty with unrelated active implementation files across API/Web/context/history.
  - This lane produced verification evidence, not isolated implementation ownership.

## Continuation Recheck (2026-06-01)
- Re-ran DB-independent subset to confirm continuity in the issue-continuation heartbeat:
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts -t "uses api-key exchange when hydrating owned LIVE automation after exchange-sync|continues syncing healthy api keys when one api key fetch fails|ignores other-market owners when seeding reconciliation cleanup candidates|assigns different exact owners for different symbols" --reporter=verbose`
  - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts -t "rejects unauthenticated access" --reporter=verbose`
- Result: pass unchanged (`5` position-ingestion checks + `1` readiness auth-gate check, with expected skips).
- Disposition remains `blocked` for full readiness until DB-backed and UI/API display-path proofs are completed by Backend/QA owner.

## Required Follow-Up Gap
- Owner: Backend/QA execution lane.
- Action:
  - Run full targeted suites with local PostgreSQL test dependency up (`localhost:5432`) to clear DB-backed cases.
  - Run readiness authenticated/non-admin checks after DB availability.
  - Run dedicated UI/API display-path verification for position ingestion state.
  - If green, perform scoped source-control closure for owned implementation files and link commit SHA back to `LUC-1166`.
