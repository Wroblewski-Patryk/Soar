# LUC-41 Trading Runtime Boundary Checkpoint
- Date: 2026-05-25
- Issue: LUC-41 [Soar][Integration] Exchange and trading runtime boundary
- Status: in_progress
- Goal: map and verify manual order, positions, bot runtime, exchange adapter, and market data chains with explicit PAPER/LIVE boundaries.

## Evidence Run
- Command: `pnpm --filter api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/orders/orders.positionScope.test.ts src/modules/positions/livePositionReconciliation.service.test.ts`
- Result: 4 files, 50 tests passed.
- Command: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoop.service.test.ts`
- Result: 12 failed, 35 passed.

## Boundary Findings
- Exchange/Adapter boundary: implemented and verified at local read-safe scope.
- Manual order + positions + reconciliation boundary: implemented and verified at local read-safe scope.
- Runtime loop boundary (`runtimeSignalLoop`): blocked by regression/failures (12 tests).
- Observed failure pattern: repeated 5000ms test timeouts and one explicit backlog-drop assertion failure (`spy` not called).

## Next Required Actions
1. Lift runtime loop timing/await boundaries in `runtimeSignalLoop` test path to remove false timeouts and restore deterministic fanout/backpressure behavior assertions.
2. Revalidate runtime chain tests after the fix before any live-boundary proof claim.
3. Keep live mutation proof/request blocked until explicit board/operator safe-environment confirmation.

## Decision
- Issue disposition for this heartbeat: `blocked` until runtime loop boundary pack is green and mapped back into module evidence.

## Risk Register Note
- High risk: runtime topology and final-candle fanout can stall under heavy queue pressure, which can weaken confidence in execution safety and LIVE/PAPER separation checks.