# 04 Runtime Contexts

## Purpose
Define who owns the runtime context required to make and execute trading decisions.

## Canonical Context Types
### VenueContext
```json
{
  "exchange": "BINANCE",
  "marketType": "SPOT | FUTURES",
  "baseCurrency": "USDT"
}
```

### WalletExecutionContext
```json
{
  "walletId": "uuid",
  "mode": "PAPER | LIVE",
  "venueContext": "derived wallet venue context",
  "capitalPolicy": {
    "referenceBalance": "derived",
    "freeCash": "derived"
  }
}
```

### BotRuntimeContext
```json
{
  "botId": "uuid",
  "walletId": "uuid",
  "marketGroupId": "uuid",
  "strategyLinkIds": ["uuid"],
  "selectedScope": "strict bot-scoped runtime surface"
}
```

## Ownership Rules
### MarketUniverse owns venue context
- `exchange`
- `marketType`
- `baseCurrency`

`SymbolGroup`, `Bot`, and `BacktestRun` inherit from this context. They do not invent their own venue context.

### Wallet owns execution context
- `mode`
- compatible exchange credential binding for `LIVE`
- capital reference and free-cash calculations

### Bot owns runtime unit identity
- activation state
- runtime partitioning through market-groups and strategy links
- selected-bot operator scope

## Canonical Invariants
- wallet venue context must match the linked market universe venue context
- `LIVE` bot execution requires a compatible wallet and API key context
- no hidden fallback from one venue context to another
- selected-bot reads and writes are strict and fail-closed

## Capital Context
### PAPER
- reference balance comes from wallet paper baseline plus realized results
- paper reset changes the baseline checkpoint, not historical truth

### LIVE
- reference balance comes from exchange balance constrained by wallet allocation policy
- insufficient funds reject `OPEN` or `DCA`; runtime does not auto-clamp to guess a smaller size

## Selected-Bot Scope
Dashboard runtime context must remain bot-scoped.

Allowed visibility and actionability are derived from:
- canonical runtime topology
- wallet compatibility
- explicit takeover rules where imported exchange state is allowed

## Out of Scope
- strategy evaluation semantics
- order execution adapter details
- UI presentation details

## Supporting References
- `venue-context-source-of-truth-contract.md`
- `wallet-source-of-truth-contract.md`

## Related Files
- [03 Domain Model](./03_domain-model.md)
- [06 Execution Lifecycle](./06_execution-lifecycle.md)
