# LUC-1165 - Gate.io position ingestion and exchange sync fix

## Context
Production Gate.io position ingestion/sync path regressed because post-reconciliation automation events were emitted with a hardcoded `BINANCE` exchange, even when reconciliation processed a `GATEIO` API key.

## Goal
Restore exchange-correct post-sync automation so Gate.io reconciled positions propagate with `exchange=GATEIO` instead of `BINANCE`.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`

## Implementation
1. Replaced hardcoded automation exchange payload from `'BINANCE'` to `apiKey.exchange ?? 'BINANCE'` in both update/create reconciliation paths.
2. Widened the `processOwnedSyncedPositionAutomation` dependency contract from `'BINANCE'` only to `Exchange`.
3. Added regression tests proving Gate.io keys emit automation events with `exchange: 'GATEIO'` for both exchange-sync create and update paths.

## Verification
- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts -t "uses api-key exchange when hydrating owned LIVE automation"` PASS (2 passed, 32 skipped).
- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts --reporter=verbose` PASS (34 passed).
- `pnpm --filter api run typecheck` PASS.
- Consumed blocker-resolved evidence from `history/evidence/luc-1166-gateio-position-ingestion-readiness-after-adapter-fix-2026-05-31.md`: DB-backed QA verification and scoped source-control closure completed; fix SHA `44a9ceba612e8d49eb86a9001e63b1f0be6243ea` is reachable from `origin/main`.

## Risk
- Residual risk: browser-rendered UI was not separately smoked in this issue; API display/read path is locally verified by blocker-resolved evidence.
- No LIVE exchange mutation was performed.
