# Wallet Source-of-Truth Contract

Status: accepted (updated 2026-04-30)

## Purpose
- Make `Wallet` the canonical owner of bot execution mode and capital budgeting context.
- Remove duplicated mode/capital decisions from bot write contracts.
- Keep runtime budgeting and UI behavior deterministic under shared-wallet usage.
- Keep imported `LIVE` exchange-position management authority explicit at bot
  scope instead of spreading operator control across wallet and bot surfaces.

## Canonical Ownership
1. `Wallet` is the source-of-truth for bot execution context:
   - `mode` (`PAPER` or `LIVE`),
   - venue context (`exchange`, `marketType`, `baseCurrency`),
   - capital reference (`paperInitialBalance` or live allocation policy).
2. Bot write contract is wallet-first (`walletId` required after compatibility window).
3. Canonical V1 runtime is single-context: one bot binds to one wallet.
4. Backtests remain wallet-independent and keep explicit `initialBalance`.
5. For `LIVE` exchange takeover, wallet stays the execution and API-key context,
   but management policy is bot-scoped:
   - `bot.manageExternalPositions` decides whether synced exchange positions
     inside that bot's symbol scope may become `BOT_MANAGED`,
   - `apiKey.syncExternalPositions` decides only whether external positions are
     imported or snapshotted at the exchange-boundary layer,
   - `wallet.manageExternalPositions` is legacy compatibility-only persisted
     metadata and must not outrank bot ownership or management rules,
   - `apiKey.manageExternalPositions` is compatibility-only legacy metadata and
     must not outrank bot ownership or management rules.

## Context Invariants
1. `wallet.exchange == marketUniverse.exchange`
2. `wallet.marketType == marketUniverse.marketType`
3. `wallet.baseCurrency == marketUniverse.baseCurrency`
4. `wallet.mode == LIVE` requires exchange capability `LIVE_EXECUTION`
5. Wallet-context mismatch in bot create/update or runtime execution is fail-closed.

## Capital Policy
- Hard-fail policy is mandatory: when required margin exceeds wallet free budget, reject order (`OPEN`/`DCA`) and do not auto-clamp size.

### PAPER wallet
`referenceBalance = paperInitialBalance + realizedPnl(botId within walletId)`

`freeCash = referenceBalance - reservedMargin(botId within walletId)`

`paperResetAt` is a non-destructive checkpoint:
- active paper capital is recalculated from wallet `paperInitialBalance` plus
  realized PnL only from `paperResetAt` onward for the selected bot-scoped
  paper lifecycle,
- historical pre-reset trades, orders, and positions stay readable but do not
  count toward active runtime capital after reset.

### LIVE wallet
`accountBalance = exchangeBalance(wallet.baseCurrency)`

`walletCap = percent(accountBalance) OR fixedAllocation`

`referenceBalance = min(accountBalance, walletCap)`

`freeCash = referenceBalance - reservedMargin(walletId)`

Current V1 rule:
- `LIVE` stays wallet-authoritative because exchange balance is external truth,
- `PAPER` runtime and dashboard capital are selected-bot scoped under the
  linked wallet so historical lifecycle rows from replaced or legacy bots do
  not inflate current runtime capital.

Post-deposit rule:
- authenticated exchange balance remains the authority for `LIVE`,
- `PERCENT` allocation scales with refreshed exchange balance,
- `FIXED` allocation remains capped at the configured wallet amount even after
  an exchange deposit,
- no explicit allocation means runtime uses the full authenticated exchange
  balance.

## Bot/API Contract
- Bot create/update no longer accepts mode as canonical input.
- Bot create/update accepts the canonical imported-position management flag at
  bot scope: `manageExternalPositions`.
- During compatibility window, legacy bot fields (`mode`, `paperStartBalance`, `apiKeyId`) are derived from wallet only.
- During compatibility window, API-key-level `manageExternalPositions` may
  still be persisted or returned for legacy profile surfaces, but runtime
  ownership, takeover status, and reconciliation must derive management truth
  only from the linked `LIVE` bot plus its symbol scope.
- During compatibility window, wallet-level `manageExternalPositions` may still
  exist in persistence for historical rows or migration backfill, but operator
  write paths and runtime ownership must ignore it.
- Required wallet error contract:
  - `WALLET_NOT_FOUND`
  - `WALLET_MODE_INVALID`
  - `WALLET_LIVE_API_KEY_REQUIRED`
  - `WALLET_LIVE_API_KEY_EXCHANGE_MISMATCH`
  - `WALLET_MARKET_CONTEXT_MISMATCH`
  - `WALLET_INSUFFICIENT_FUNDS`
  - `WALLET_IN_USE_CANNOT_DELETE`

## Dashboard IA Contract
- Wallet module is a first-class dashboard area.
- Canonical navigation placement for V1 wallet-first rollout: `Exchanges -> Wallets -> Markets`.
- Bot creator/edit flows must present wallet selector as the execution-context input.
- The imported-position management toggle exists in bot settings only, not in
  wallet create/edit surfaces.

## Non-goals
- No forced wallet dependency for backtests.
- No strategy-logic changes.
- No new exchange adapter rollout in this contract.
