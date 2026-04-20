# API Deep-Dive: Backtests Module

## Metadata
- Module name: `backtests`
- Layer: `api`
- Source path: `apps/api/src/modules/backtests`
- Owner: backend/trading-domain
- Last updated: 2026-04-20
- Related planning task: `MURC-10`

## 1. Purpose and Scope
- Owns backtest run lifecycle and read APIs:
  - create/list/get/delete runs
  - trades/report/timeline views
- Implements replay/simulation pipeline with indicator + derivatives enrichment and parity traces.
- Manages queue/job execution path for run processing.

Out of scope:
- Live runtime signal loop (engine runtime path).
- Dashboard runtime position/order APIs.

## 2. Boundaries and Dependencies
- Mounted under `/dashboard/backtests`.
- Depends on:
  - `prisma` repositories for runs/trades/reports.
  - market data gateway for candles + supplemental series.
  - engine shared evaluator/execution/position sizing helpers.
  - run queue/job processors.

## 3. Data and Contract Surface
- Core DTO/contracts:
  - `CreateBacktestRunDto`
  - `ListBacktestRunsQuery`, `ListBacktestTradesQuery`, `GetBacktestTimelineQuery`
- Output surfaces:
  - run summary state, trades table, report aggregates, timeline payload.
- Internal parity contracts:
  - replay event types and decision trace structures.
- BTCF list/create contract freeze (2026-04-20):
  - list payload must support canonical web table columns:
    - `Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`
  - create/run payload must support explicit time-window fields:
    - `startAt`, `endAt`
  - candles range contract:
    - requested bounds min `250`, max `10000`
  - execution contract for new runs:
    - run job/gateway use explicit `startAt/endAt` range as primary source (no implicit now-backward fallback).
  - compatibility contract:
    - legacy runs without explicit range fields remain readable in run list/details/report flows.

## 4. Runtime Flows
- Run creation:
  1. Validate owned strategy + market universe.
  2. Resolve run symbol seed via shared market-universe contract:
     - `final = unique(filter_result U whitelist) - blacklist`,
     - fail closed when final symbol set is empty.
  3. Resolve and persist one candle-window contract per run:
     - `requestedMaxCandles` (nullable request input),
     - `effectiveMaxCandles` (single adapted value reused everywhere),
     - compatibility `maxCandles` mirror.
  4. Build run record and queue job payload.
  5. Execute replay with indicator/derivative series and fill model.
  6. Persist trades and report summary; update run status.
- Timeline/report reads:
  - resolve owned run and emit scoped timeline/report projections.
  - terminal runs (`COMPLETED/FAILED/CANCELED`) anchor timeline by `finishedAt` (not stale `liveProgress.currentCandleTime`).
  - timeline replay context supports:
    - `isolated` (default): requested symbol only,
    - `portfolio`: full run-symbol context.
- Metrics semantics:
  - run/report totals are run-level portfolio truth.
  - timeline/chart diagnostics are replay-context scoped and may differ in portfolio mode by design.

## 5. API and UI Integration
- Routes:
  - `GET /dashboard/backtests/runs`
  - `GET /dashboard/backtests/runs/:id`
  - `GET /dashboard/backtests/runs/:id/trades`
  - `GET /dashboard/backtests/runs/:id/report`
  - `GET /dashboard/backtests/runs/:id/timeline`
  - `POST /dashboard/backtests/runs`
  - `DELETE /dashboard/backtests/runs/:id`

## 6. Security and Risk Guardrails
- Dashboard auth + ownership checks across run/trade/report/timeline surfaces.
- Timeline/report are run-scoped to user-owned runs only.
- Safe update wrappers protect against missing-run race conditions.

## 7. Observability and Operations
- Run queue and job modules provide controlled execution lifecycle.
- Rich parity and replay tests protect deterministic behavior across strategy modes.

## 8. Test Coverage and Evidence
- Representative tests:
  - `backtests.e2e.test.ts`
  - `backtestReplayCore.test.ts`
  - `backtestRunJob.test.ts`
  - `backtestRunQueue.test.ts`
  - `backtestParity3Symbols.test.ts`
- Suggested validation command:
```powershell
pnpm --filter api test -- src/modules/backtests/backtests.e2e.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/backtests/backtestParity3Symbols.test.ts
```

## 9. Open Issues and Follow-Ups
- Continue parity hardening between backtest and runtime decision paths.
- Consider additional queue observability SLIs for heavy multi-symbol workloads.
- Deliver `BTCF-02..BTCF-09` to fully align API list/create/runtime-range behavior with frozen BTCF contract.

## 10. Market-Universe Symbol Contract Parity (`MURC`)
- `seedConfig.symbols` must always reflect the shared market-universe composition formula.
- No whitelist override path is allowed; whitelist is unioned with filter output and then blacklist is subtracted.
- Backtest symbol resolution must stay parity-compatible with:
  - bots runtime symbol scope,
  - manual-order strategy-context symbol matching.
