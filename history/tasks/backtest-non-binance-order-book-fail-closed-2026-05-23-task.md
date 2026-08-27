# BACKTEST-NON-BINANCE-ORDER-BOOK-FAIL-CLOSED-2026-05-23

## Context

Backtest supplemental futures data for non-Binance venues uses the Exchange
public derivatives boundary for funding-rate and open-interest history. The
same path kept `orderBook: []`, because the existing exchange boundary exposes
current order-book snapshots, not historical order-book series.

For strategies that do not use order-book indicators, an empty order-book
series is acceptable. For strategies that use `ORDER_BOOK_*` indicators, an
empty series must not be treated as valid historical input.

## Goal

Make non-Binance FUTURES backtest runs fail closed when the selected strategy
requires historical order-book input and the supplemental data contains no
historical order-book points.

## Scope

- `apps/api/src/modules/backtests/backtestRunJob.ts`
- `apps/api/src/modules/backtests/backtestRunJob.test.ts`
- Source-of-truth state for Backtests / Exchange Adapter requirements.

## Implementation Plan

1. Detect `ORDER_BOOK` references in the effective backtest strategy config or
   multi-strategy link configs.
2. After supplemental data is fetched, reject non-Binance FUTURES symbols that
   require order-book history but have zero order-book points.
3. Preserve symbol-level fail-soft behavior: diagnostics should explain the
   unsupported historical input instead of simulating with false data.
4. Add a focused job test that proves simulation is not called and the run
   fails with an explicit diagnostic error.

## Acceptance Criteria

- Non-Binance FUTURES strategies without `ORDER_BOOK` indicators continue to
  use funding/open-interest supplemental history.
- Non-Binance FUTURES strategies with `ORDER_BOOK_*` indicators and no
  historical order-book points fail closed.
- The failure is visible in `parityDiagnostics` with a stable unsupported
  historical order-book error.
- No LIVE exchange mutation, production data mutation, or fake historical
  order-book synthesis is introduced.

## Definition of Done

- Focused backtest job test passes.
- Backtest gateway/replay/runtime parity focused pack passes.
- API typecheck passes.
- Repository guardrails pass.
- `git diff --check` passes or only reports known CRLF warnings.

## Forbidden

- Do not synthesize historical order-book points from a current snapshot.
- Do not silently keep `orderBook: []` for an order-book-dependent strategy.
- Do not mutate LIVE exchange state or production data.

## Result Report

- Added an order-book requirement guard in `backtestRunJob`: if the effective
  strategy config references `ORDER_BOOK` and the run is non-Binance FUTURES,
  zero historical order-book points now raise an explicit unsupported input
  error for that symbol.
- Preserved fail-soft job behavior by recording the symbol failure in
  `parityDiagnostics`; when all symbols fail, the run status is `FAILED`.
- Added a focused regression test proving simulation is not called for the
  unsupported input and the diagnostic error is stable.
- Validation passed:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtestRunJob.test.ts`
  - `pnpm --filter api exec vitest run src/modules/backtests/backtestDataGateway.test.ts --testTimeout 15000`
  - `pnpm --filter api exec vitest run src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestDataGateway.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts --testTimeout 15000`
  - `pnpm --filter api run typecheck`
