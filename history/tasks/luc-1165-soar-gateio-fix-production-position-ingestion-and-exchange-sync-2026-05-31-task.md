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
- Full-file run `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` timed out in this environment (no failing assertion captured before timeout).
- `pnpm --filter api run typecheck` timed out in this runner during this heartbeat (no type error output captured before timeout).

## Risk
- Residual risk: full reconciliation suite not completed in this heartbeat due timeout; broader regressions outside targeted case are not fully re-proven here.
- No LIVE exchange mutation was performed.
