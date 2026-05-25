# Pipeline: Wallet and bot configuration

Updated: 2026-05-03

## Trigger
User creates or edits wallet, market universe, strategy, and bot configuration.

## User/System Action
- User configures exchange/API-key-backed wallet context.
- User defines market universe and strategy.
- User creates/updates a bot with wallet-first context, market groups, and
  strategy links.

## Involved Frontend Files
- `apps/web/src/features/wallets/*`
- `apps/web/src/features/markets/*`
- `apps/web/src/features/strategies/*`
- `apps/web/src/features/bots/*`
- Route files under `apps/web/src/app/dashboard/{wallets,markets,strategies,bots}`.

## Involved Backend Files
- `apps/api/src/modules/wallets/*`
- `apps/api/src/modules/markets/*`
- `apps/api/src/modules/strategies/*`
- `apps/api/src/modules/bots/*`
- `apps/api/src/modules/exchange/*` for exchange-owned capability/API-key checks.

## Involved Services
- Wallet CRUD, preview, ledger and cashflow services.
- Market universe CRUD/catalog resolver.
- Strategy CRUD/indicator metadata.
- Bot command/read projection, ownership, context validation, market group and
  strategy link services.

## Data Read/Write
- `Wallet`, `WalletBalanceSnapshot`, `WalletCashflowEvent`.
- `MarketUniverse`, `SymbolGroup`.
- `Strategy`.
- `Bot`, `BotMarketGroup`, `MarketGroupStrategyLink`, `BotStrategy`.
- `ApiKey` for wallet/exchange context.

## Failure Points
- LIVE wallet/API-key mismatch.
- Active bot locks market or strategy edits.
- Invalid strategy threshold or unsupported indicator.
- Bot context drift between wallet, market group, and strategy.
- LIVE activation without required capability/consent.

## Tests
- `apps/api/src/modules/wallets/wallets*.test.ts`
- `apps/api/src/modules/markets/markets.e2e.test.ts`
- `apps/api/src/modules/strategies/strategies.e2e.test.ts`
- `apps/api/src/modules/bots/bots*.test.ts`
- Web form/list tests under related feature folders.

## Related Docs
- `docs/modules/api-wallets.md`
- `docs/modules/api-markets.md`
- `docs/modules/api-strategies.md`
- `docs/modules/api-bots.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/reference/wallet-source-of-truth-contract.md`
- `docs/architecture/reference/dashboard-route-map.md`

## Known Gaps
- Exact per-route frontend test mapping is not fully enumerated in this
  pipeline doc. See module deep dives and future module edits for expansion.
