# Task Contract - LUC-1166

## Context
- Issue: `LUC-1166` - `[Soar][Gate.io][QA] Verify position ingestion readiness after adapter fix`.
- Wake note requires local repair/source-control lane behavior with no push/deploy and explicit closure evidence.
- Workspace is already dirty with unrelated in-progress files from other lanes.

## Goal
- Verify whether Gate.io position-ingestion chain is ready after adapter fix and record evidence-backed disposition.

## Constraints
- No push/deploy/production mutation.
- PM lane: verify and integrate evidence; do not absorb broad implementation.
- Preserve unrelated dirty files.

## Stage
- `verification`

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- Read-only check of adjacent dirty tests in `apps/api/src/router/workers-health-readiness.test.ts`

## Definition of Done
- Affected capability chain and changed files identified.
- Targeted validation run with concrete command output.
- Regression risk and blockers recorded.
- Commit/no-commit decision recorded with reason.

## Forbidden
- Push/deploy/restart production.
- Revert or stage unrelated dirty files.
- Claim verified readiness without executable evidence.

## Result
- Verified code delta removes hardcoded `BINANCE` exchange during owned LIVE automation hydration and now forwards `apiKey.exchange`.
- Added focused regressions for create/update sync paths expecting `exchange: 'GATEIO'`.
- Targeted validation command run:
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/router/workers-health-readiness.test.ts --reporter=verbose`
- Outcome:
  - Newly added Gate.io hydration tests: passing.
  - Suite overall: failing due to local dependency blockers (`Can't reach database server at localhost:5432`) and one readiness timeout.
- Source-control closure:
  - `not committed` in this lane.
  - Blocker: worktree contains broad unrelated active code changes; PM verification lane does not own consolidation commit.
- Continuation recheck (2026-06-01, issue continuation heartbeat):
  - Re-ran DB-independent subset to confirm deterministic evidence continuity:
    - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts -t "uses api-key exchange when hydrating owned LIVE automation after exchange-sync|continues syncing healthy api keys when one api key fetch fails|ignores other-market owners when seeding reconciliation cleanup candidates|assigns different exact owners for different symbols" --reporter=verbose` -> PASS (`5` passed, `29` skipped).
    - `pnpm --filter api exec vitest run src/router/workers-health-readiness.test.ts -t "rejects unauthenticated access" --reporter=verbose` -> PASS (`1` passed, `7` skipped).
  - Disposition unchanged: `blocked` pending DB-backed verification and owner-scoped source-control closure.
- Blocker-resolved closure (2026-06-08):
  - Consumed child blocker evidence:
    - [LUC-2977](/LUC/issues/LUC-2977): DB-backed position ingestion verification passed (`2` files / `42` tests).
    - [LUC-2978](/LUC/issues/LUC-2978): scoped source-control closure passed; fix SHA `44a9ceba612e8d49eb86a9001e63b1f0be6243ea` is on `origin/main`.
  - Ran parent display-path API proof:
    - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts -t "imports six exchange positions through real ownership scope and shows all six for the selected LIVE bot" --reporter=verbose` -> FAIL by default `5000ms` timeout during local DB/API setup.
    - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts -t "imports six exchange positions through real ownership scope and shows all six for the selected LIVE bot" --reporter=verbose --testTimeout=30000` -> PASS (`1` passed, `4` skipped).
  - Final acceptance matrix is covered: empty account, open position ingestion, auth failure/non-admin, upstream error continuity, persistence sync, and local API display path.
  - Final disposition: `done`; no production smoke, protected proof, secret readback, push, deploy, restart, real exchange account use, order mutation, position mutation, or live-trading mutation occurred.
