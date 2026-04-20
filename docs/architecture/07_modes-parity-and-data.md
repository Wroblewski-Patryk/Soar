# 07 Modes, Parity, and Data

## Purpose
Define how backtest, paper, and live relate to each other, and which data contracts support that parity.

## Canonical Modes
### Backtest
- historical replay
- no real exchange side effects
- uses replay windows and timeline/report contracts

### Paper
- live market data
- simulated execution
- shares runtime decision logic with live where parity is intended

### Live
- live market data
- real exchange side effects
- exchange-confirmed fills and balances are authoritative

## Parity Rule
Backtest, paper, and live should share:
- strategy parsing
- indicator evaluation
- signal output semantics
- lifecycle ordering
- diagnostics vocabulary

Approved differences are limited to:
- market-data freshness and source
- fill model
- exchange side effects
- account balance authority

## Shared Data Contract
The canonical runtime and replay candle payload is OHLCV-based:
- `openTime`
- `closeTime`
- `open`
- `high`
- `low`
- `close`
- `volume`

Close-only series are insufficient for the supported architecture.

## Backtest Run Contract
Backtests store:
- immutable context snapshot
- explicit time window (`startAt`, `endAt`)
- run-level output and replay diagnostics

Legacy runs may remain readable, but new runs must use the explicit range contract.

## Database Responsibilities
PostgreSQL is the system of record for:
- users and subscriptions
- strategies, wallets, markets, bots
- runtime entities: signals, orders, trades, positions
- backtests and reports
- audit and operational records

Redis supports:
- caches
- coordination
- runtime support services

## Data Retention Direction
- runtime truth must be durable in PostgreSQL
- caches and stream helpers may be ephemeral
- pruning must not destroy active business truth

## Example Parity Check Question
When the same symbol, interval, strategy, and context are replayed:
- signal direction should match across modes
- differences must be explainable by approved adapter differences, not by hidden logic drift

## Supporting References
- `archive/database.md`
- `reference/strategy-evaluation-parity-contract.md`
- `reference/position-lifecycle-parity-matrix.md`

## Related Files
- [03 Domain Model](./03_domain-model.md)
- [06 Execution Lifecycle](./06_execution-lifecycle.md)
