# Pipeline: Runtime signal execution

Updated: 2026-05-03

## Trigger
Market stream or runtime scan work provides a final candle/tick for an active
bot symbol.

## User/System Action
- System ingests market data.
- Runtime evaluates indicator-ready strategy inputs.
- Guardrails and pre-trade checks decide whether execution can proceed.
- Dashboard and bot monitoring surfaces read runtime events, symbol stats,
  positions, and trades.

## Involved Frontend Files
- `apps/web/src/features/dashboard-home/*`
- `apps/web/src/features/bots/*`
- `apps/web/src/features/shared/*`

## Involved Backend Files
- `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.ts`
- `apps/api/src/modules/engine/preTrade*.ts`
- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/bots/runtime*`
- `apps/api/src/modules/market-stream/*`
- `apps/api/src/workers/*`

## Involved Services
- Market stream and fanout.
- Runtime signal market-data gateway.
- Runtime final-candle decision service.
- Strategy signal evaluator and indicator registry.
- Pre-trade/risk and exchange-min-order guardrails.
- Execution orchestrator and runtime dedupe.
- Bots runtime read models.

## Data Read/Write
- Reads bot/wallet/market/strategy configuration.
- Writes `BotRuntimeSession`, `BotRuntimeEvent`, `BotRuntimeSymbolStat`.
- Writes or reads `RuntimeExecutionDedupe`, `Signal`, `Order`, `Position`,
  `Trade`, and `OrderFill` depending on decision outcome.

## Failure Points
- Short or missing indicator candle series.
- Stale market stream/fanout or Redis dependency failure.
- Pre-trade/risk block.
- Exchange min order/capability block.
- Runtime state restart or dedupe collision.
- Read-model fallback hiding a concrete guardrail block.

## Tests
- `runtimeSignalLoop.service.test.ts`
- `runtimeFinalCandleDecision.service.test.ts`
- `runtimeSignalMarketDataGateway.test.ts`
- `runtimeSignalLoopSupervisor.test.ts`
- `runtimeExecutionDedupe.service.test.ts`
- `paperLiveDecisionEquivalence.test.ts`
- `bots.runtime-*.e2e.test.ts`
- market-stream service/route tests.

## Related Docs
- `docs/architecture/05_strategy-signal-and-decision-flow.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/reference/stream-transport-contract.md`
- `docs/modules/api-engine.md`
- `docs/modules/api-bots.md`
- `docs/modules/api-market-stream.md`

## Known Gaps
- Production signal delivery status must be read from current planning/context
  evidence before using older V1 task plans as current truth.
