# 05 Strategy, Signal, and Decision Flow

## Purpose
Define how Soar turns market inputs into deterministic trading decisions.

## Canonical Inputs
- OHLCV candles
- optional derivatives context where supported
- strategy schema
- market-universe symbol scope
- runtime wallet and bot context
- open-position and risk state

All market inputs are scoped by the inherited `ExchangeContext`
`(exchange, marketType)`.

This means:
- `SPOT` indicators and signals are derived from `SPOT` candles and `SPOT`
  pricing only
- `FUTURES` indicators and signals are derived from `FUTURES` candles and
  `FUTURES` pricing only
- one exchange's market data must not be reused as another exchange's signal
  input

## Strategy Schema
The MVP strategy schema is structured around:
- `entry`
- `exit`
- `risk`
- `filters`
- `timeframes`

Nested recursive rule trees are out of the current baseline.

## Market-Universe Resolution
The canonical symbol formula is:

```text
final = unique(filter_result U whitelist) - blacklist
```

Edge rules:
- `filter_result` exists only when the volume filter is enabled
- filter off plus empty whitelist resolves to an empty set
- blacklist-only input does not create symbols

## Indicator Contract
One indicator registry must drive:
- builder availability
- runtime evaluator availability
- backtest evaluator availability
- timeline overlay availability
- operator signal-surface analysis and condition rendering

If an indicator is not implemented end-to-end, it must not silently behave like a supported rule.

Operator surfaces must reuse the same shared indicator kernel and rule parser as
runtime/backtest evaluation. A configured market snapshot may be shown before
runtime has emitted a decision, but it must still use canonical
closed-candle/derivatives analysis semantics and must not invent subset-only
fallback values such as `X`.

The indicator registry is shared, but indicator input data is not shared across
venue pairs. The same indicator definition may run on many exchanges and market
types, yet each execution must consume the exact candles and derivatives context
 for the current `(exchange, marketType)` pair.

## Evaluation Unit
The canonical evaluation unit is:

```text
(botId, symbol, intervalWindow)
```

The bot's single linked symbol-group market scope defines whether the symbol is
in scope for that evaluation unit. The linked strategy defines the interval and
decision schema for the bot.

## Signal Output Domain
- `LONG`
- `SHORT`
- `EXIT`
- `NO_TRADE`

`NO_TRADE` is a valid and often preferred outcome.

## Signal Merge
When several strategies attached to the same runtime partition emit outputs for the same symbol/window:
1. apply hard guardrails first
2. apply `EXIT` priority rules
3. apply weighted directional merge
4. resolve ties or weak consensus as `NO_TRADE`

Runtime must never guess randomly.

## Guardrails Before Merge
- kill switch
- incompatible manual or external ownership state
- no-flip rule while a position is open
- risk-cap breaches

## Example Decision Envelope
```json
{
  "symbol": "BTCUSDT",
  "window": "2026-04-21T10:00:00Z/2026-04-21T10:04:59Z",
  "strategyOutputs": [
    { "strategyLinkId": "a", "proposal": "LONG", "weight": 1.0, "priority": 100 },
    { "strategyLinkId": "b", "proposal": "NO_TRADE", "weight": 1.0, "priority": 100 }
  ],
  "guardrails": [],
  "finalProposal": "LONG"
}
```

## Out of Scope
- order submission mechanics
- fill processing
- UI rendering of diagnostics

## Supporting References
- `reference/strategy-evaluation-parity-contract.md`
- `reference/indicator-registry-parity-contract.md`
- `reference/runtime-signal-merge-contract.md`

## Related Files
- [06 Execution Lifecycle](./06_execution-lifecycle.md)
- [07 Modes, Parity, and Data](./07_modes-parity-and-data.md)
