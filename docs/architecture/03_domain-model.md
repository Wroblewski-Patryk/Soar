# 03 Domain Model

## Purpose
Define the canonical entities of Soar, their responsibilities, and their relationships.

## Core Entities
### User
- owns product resources
- owns trading configuration and runtime scope

### SubscriptionPlan and Subscription
- define entitlements and limits
- gate runtime capabilities and bot counts

### Wallet
- canonical owner of execution mode and capital context
- binds exchange credentials for `LIVE` where required

### MarketUniverse
- canonical owner of venue context
- defines filtered tradable scope for symbol selection

### SymbolGroup
- named symbol selection derived from a market universe
- cannot override the parent venue context

### Strategy
- stores strategy schema and risk settings
- defines entry, exit, filters, and timeframes

### Bot
- explicit runtime unit
- binds operator intent to a wallet and runtime topology

### BotMarketGroup
- explicit runtime partition inside a bot
- groups one market scope within one bot

### MarketGroupStrategyLink
- binds one strategy to one bot market-group
- carries evaluation ordering metadata such as weight and priority

### Order
- tracks submitted trading intent and order-state evolution

### Trade
- tracks fill-level execution results and PnL-relevant evidence

### Position
- tracks open and closed position lifecycle state

### Signal
- records evaluated signal outcomes and diagnostics

### BacktestRun
- stores immutable replay seed and output references

### Assistant Config
- stores main assistant and subagent runtime configuration

## Canonical Relationships
- `User 1 -> N Wallet`
- `User 1 -> N MarketUniverse`
- `MarketUniverse 1 -> N SymbolGroup`
- `User 1 -> N Strategy`
- `User 1 -> N Bot`
- `Bot 1 -> N BotMarketGroup`
- `BotMarketGroup 1 -> N MarketGroupStrategyLink`
- `MarketGroupStrategyLink N -> 1 Strategy`
- `Bot N -> 1 Wallet`
- `Bot 1 -> N runtime events/orders/positions/trades/signals`

## Runtime Unit
The canonical runtime unit is:

```text
User
  -> Bot
    -> BotMarketGroup
      -> MarketGroupStrategyLink
        -> Strategy evaluation
```

## Entity Boundaries
- `Wallet` owns execution mode and capital context.
- `MarketUniverse` owns venue context.
- `Bot` owns runtime activation and operator-facing execution scope.
- `Strategy` owns logic and risk schema, not wallet or venue context.
- `Order` does not directly equal `Position`.
- `Position` becomes visible only through fill/lifecycle authority.

## Source-of-Truth Priority
When multiple entities can imply context, the canonical priority is:
1. Market universe for venue context
2. Wallet for execution mode and capital context
3. Bot runtime topology for selected-bot scope
4. Strategy for logic and risk rules

## MVP vs Future
### Current baseline
- one exchange family in production scope
- multi-bot runtime model
- assistant configuration attached to bots

### Future extensions
- more exchange adapters
- richer assistant mandates
- more advanced portfolio-level controls

## Related Files
- [04 Runtime Contexts](./04_runtime-contexts.md)
- [07 Modes, Parity, and Data](./07_modes-parity-and-data.md)
