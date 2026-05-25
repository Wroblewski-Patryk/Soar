# Pipeline: Backtest run

Updated: 2026-05-03

## Trigger
User creates a backtest run or opens backtest list/details/report/timeline.

## User/System Action
- UI submits run configuration.
- API creates a run and queues worker execution.
- Backtest worker loads candles, evaluates strategy through shared parity
  logic, persists trades/report/timeline-readable data.
- UI reads run, trades, report, and timeline.

## Involved Frontend Files
- `apps/web/src/features/backtest/*`
- `apps/web/src/app/dashboard/backtests/*`

## Involved Backend Files
- `apps/api/src/modules/backtests/*`
- `apps/api/src/modules/engine/*`
- `apps/api/src/modules/exchange/binancePublicRest.service.ts`
- `apps/api/src/workers/backtest.worker.ts`

## Involved Services
- Backtests service/repository.
- Backtest portfolio simulation and report lifecycle.
- Shared strategy indicator/evaluation kernel.
- Exchange-owned public candle data gateway.
- Backtest worker/queue.

## Data Read/Write
- Reads `Strategy`, market configuration, candle cache/exchange public data.
- Writes `BacktestRun`, `BacktestTrade`, `BacktestReport`.
- May use `MarketCandleCache`.

## Failure Points
- No usable candles for symbol/market type.
- Strategy/runtime parity drift.
- Worker queue failure.
- Missing report/timeline after run failure.
- Futures-vs-spot candle source confusion.

## Tests
- `backtests.e2e.test.ts`
- `backtestRunJob.test.ts`
- `backtestDataGateway.test.ts`
- `backtestRuntimeKernelParity.test.ts`
- `backtestReplayCore.test.ts`
- `lifecycleCloseParity.golden.test.ts`

## Related Docs
- `docs/modules/api-backtests.md`
- `docs/modules/web-backtest.md`
- `docs/architecture/07_modes-parity-and-data.md`
- `docs/architecture/reference/strategy-evaluation-parity-contract.md`
- `docs/operations/backtest-parity-mismatch-runbook.md`

## Known Gaps
- Backtest route/API details are covered in route and module docs; this
  pipeline intentionally stays flow-level.
