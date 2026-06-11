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

## Blocker-Resolved Closure (2026-06-08)
- Paperclip blockers resolved:
  - [LUC-2977](/LUC/issues/LUC-2977): DB-backed QA verification completed.
  - [LUC-2978](/LUC/issues/LUC-2978): scoped source-control closure completed; fix SHA `44a9ceba612e8d49eb86a9001e63b1f0be6243ea` is reachable from `origin/main`.
- Consumed [LUC-2977](/LUC/issues/LUC-2977) evidence:
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/router/workers-health-readiness.test.ts --reporter=verbose`
  - Result: PASS (`2` files / `42` tests).
  - Covers DB-backed Gate.io synced LIVE key scope, persistence lookup/sync behaviors, stale order/position transitions, canonical continuity context, and workers readiness unauthenticated/non-admin/fail-closed paths.
- Additional parent closure proof for the API display path:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts -t "imports six exchange positions through real ownership scope and shows all six for the selected LIVE bot" --reporter=verbose`
  - Result: FAIL by timeout only at Vitest default `5000ms` while local DB/API setup was still running.
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts -t "imports six exchange positions through real ownership scope and shows all six for the selected LIVE bot" --reporter=verbose --testTimeout=30000`
  - Result: PASS (`1` test passed, `4` skipped). The test imports exchange positions through the reconciliation path and verifies the selected LIVE bot runtime positions endpoint returns all imported positions.
- Final acceptance matrix:
  - Empty account path: `verified` by reconciliation and runtime position no-position paths.
  - Open position ingestion path: `verified` by Gate.io create/update hydration regressions and DB-backed ingestion tests.
  - Auth failure class: `verified` by workers readiness unauthenticated `401` and authenticated non-admin `403`.
  - Rate-limit / upstream error class: `verified` by healthy-key continuation when another key fetch fails.
  - Persistence sync class: `verified` by [LUC-2977](/LUC/issues/LUC-2977) DB-backed focused suite.
  - UI/API display path: `verified locally at API display layer`; no separate browser UI smoke was run for this issue.
- Safety result: no production smoke, protected proof, secret readback, push, deploy, restart, real exchange account use, order mutation, position mutation, or live-trading mutation occurred.

## Closure Decision
- Parent issue disposition: `done`.
- Previously required follow-up gap is closed by [LUC-2977](/LUC/issues/LUC-2977), [LUC-2978](/LUC/issues/LUC-2978), and the 2026-06-08 parent display-path proof above.
- Residual risk: browser-rendered UI was not separately smoked in this issue; API display/read path is locally verified.
