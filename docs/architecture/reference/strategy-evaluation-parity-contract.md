# Strategy Evaluation Parity Contract (V1)

Status: current-version behavioral contract, corrected 2026-10-17. The legacy
no-match `EXIT` evaluator option and tests are an implementation gap; this
document is not evidence that the fix or cross-mode parity has shipped.

## Purpose
Define one deterministic strategy-evaluation contract shared by `BACKTEST`, `PAPER`, and `LIVE`.

## Scope
- Evaluation unit: `(symbol, timeframe, closed candle index)`.
- Input source of truth:
  - runtime modes (`PAPER`, `LIVE`): stream-maintained candle series,
  - backtest: historical candle series loaded from exchange/cache.
- Signal domain: `LONG | SHORT | EXIT | NO_TRADE`; absence of an entry signal
  is `NO_TRADE`/HOLD, never `EXIT`.

## Canonical Strategy Input
- Strategy evaluation reads the same shape in all modes:
  - `open.direction` (`both|long|short`) or `openConditions.direction`,
  - `open.indicatorsLong|indicatorsShort` or `openConditions.indicatorsLong|indicatorsShort`.
- Supported indicator rule operators:
  - `>`, `>=`, `<`, `<=`, `==`, `!=`.
  - `CROSS_ABOVE`, `CROSS_BELOW`.
  - `IN_RANGE`, `OUT_OF_RANGE`.
- Supported indicator families in V1 parity contract are the full canonical
  builder-exposed registry from
  [indicator-registry-parity-contract.md](./indicator-registry-parity-contract.md):
  - trend: `EMA`, `SMA`, `MACD`, `ADX`
  - momentum / oscillator: `RSI`, `MOMENTUM`, `ROC`, `STOCHRSI`, `STOCHASTIC`, `CCI`
  - volatility: `BOLLINGER_BANDS`, `ATR`, `DONCHIAN_CHANNELS`
  - candle patterns: `BULLISH_ENGULFING`, `BEARISH_ENGULFING`, `HAMMER`, `SHOOTING_STAR`, `DOJI`, `MORNING_STAR`, `EVENING_STAR`, `INSIDE_BAR`, `OUTSIDE_BAR`
  - futures derivatives: `FUNDING_RATE`, `FUNDING_RATE_ZSCORE`, `OPEN_INTEREST`, `OPEN_INTEREST_DELTA`, `OPEN_INTEREST_MA`, `OPEN_INTEREST_ZSCORE`, `ORDER_BOOK_IMBALANCE`, `ORDER_BOOK_SPREAD_BPS`, `ORDER_BOOK_DEPTH_RATIO`

## Evaluation Rules
1. Parse strategy rules from canonical input.
2. If strategy mode is active and no valid indicator rules are produced:
   - return `NO_TRADE` (do not fallback to heuristic percent-threshold logic).
3. Evaluate long and short rule sets at the same candle index.
4. Resolve entry direction:
   - `LONG` when long set matches and short does not,
   - `SHORT` when short set matches and long does not,
   - `NO_TRADE`/HOLD when neither side matches,
   - `NO_TRADE` when both sides match or input is insufficient.
5. An open position remains open when entry conditions cease to match. `EXIT`
   requires a separate explicit exit signal, or the lifecycle may close under
   an applicable risk rule. Exit authority and position ownership still pass
   through the lifecycle manager.

Legacy `open.noMatchAction = EXIT` and `open.exitOnNoSignal = true` do not
constitute separate exit conditions under this contract. The current evaluator
can still emit `EXIT` for those fields, so strategy validation, stored-config
handling, runtime/backtest traces, and tests require repair before acceptance.

## Mode Parity Requirements
- Strategy evaluator implementation must be shared and imported by both:
  - runtime signal loop path,
  - backtest replay path.
- Backtest must not keep mode-specific "shortcut" evaluators when strategy payload is present.
- Differences between modes are allowed only in execution adapters (fills, latency, exchange side effects), never in signal semantics.

## Data and Candle Semantics
- Only closed candles are eligible for deterministic signal evaluation.
- Candle ordering must be ascending by open time.
- Indicator series cache keys must be deterministic (`indicator + params`) and reusable in one evaluation pass.
- Runtime, paper, live, backtest, and operator surfaces must evaluate the same
  indicator registry against the same candle/derivatives snapshot contract.
- Operator surfaces must not introduce a second subset evaluator or synthetic
  placeholder values such as `X` when canonical indicator data is available.

## Diagnostics and Testing
- Every parity change must include:
  - targeted evaluator tests,
  - backtest replay tests,
  - runtime signal loop tests,
  - parity regression (`paper/live decision equivalence` at minimum).
- Include a position-open sequence in which entry conditions cease to match:
  no close command or false `EXIT` trace may result. Prove separately that an
  explicit exit signal or risk rule can close through the approved lifecycle.
- Required mismatch diagnostics payload (for reports/logs):
  - `mode`, `symbol`, `timeframe`, `candleIndex`, `strategyId`,
  - expected vs actual direction,
  - rule evaluation summary and mismatch reason.
