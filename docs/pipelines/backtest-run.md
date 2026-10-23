# Pipeline: Backtest run

Updated: 2026-05-03

## Trigger
User creates a backtest run or opens backtest list/details/report/timeline.

## User/System Action
- UI submits run configuration.
- API creates a run and queues worker execution.
- API creates the `PENDING` run and its pending report in one database
  transaction. If enqueue has an uncertain outcome, the API returns the run ID
  with 503; workers recover the durable `PENDING` run instead of marking it
  failed or creating a second job for that run.
- Backtest worker loads candles, evaluates strategy through shared parity
  logic, persists trades/report/timeline-readable data.
- PostgreSQL grants one time-limited execution lease per run. A worker must
  hold its current token to update progress or atomically commit trades,
  report, and terminal status. A stale worker cannot commit after takeover.
- Redis is a delivery queue. At startup and periodically, workers reconcile
  database `PENDING` and expired `RUNNING` runs with Redis. Terminal or missing
  runs left in `processing` after an interrupted acknowledgement are removed.
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
- Worker crash, lease expiry, or acknowledgement crash. Database claim and
  fenced terminal transaction prevent duplicate results; the next worker
  resumes after the lease expires.
- Missing report/timeline after run failure.
- Futures-vs-spot candle source confusion.

## Tests
- `backtests.e2e.test.ts`
- `backtestRunJob.test.ts`
- `backtestClaimedRun.test.ts`
- `backtestRunOwnership.repository.test.ts` (isolated `_test` database)
- `backtestTwoProcess.runtime.test.ts` (opt-in real Redis and `_test` database)
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
