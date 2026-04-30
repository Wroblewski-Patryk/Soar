# LIVE Wallet Cashflow Ledger and Equity Timeline Plan

Status: queued (`WLEDGER-01..WLEDGER-06` closed)
Date: 2026-04-30
Owner: Frontend Builder + Backend Builder + Exchange Integration

## Context
Dashboard wallet KPIs now show current LIVE runtime balance truth and can derive
a current session delta from runtime equity and selected bot PnL. That solves
the immediate dashboard gap, but it is not a full historical wallet accounting
model.

The target product experience is stronger: users should understand how much
money they put into the exchange wallet, how much the bot made or lost, when
they deposited or withdrew funds, and how wallet value changed over time.

Canonical architecture target:
- `docs/architecture/reference/wallet-source-of-truth-contract.md`
- `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`

## Goal
Add a LIVE wallet performance ledger that separates:
- user-contributed capital,
- bot-generated PnL,
- open unrealized PnL,
- deposits and withdrawals,
- transfers,
- fees and funding,
- unclassified exchange adjustments.

## User Story
Example target flow:
1. User has `5 USDT` on the exchange.
2. User creates a LIVE wallet with `100%` allocation.
3. Soar records the initial contributed capital as `5 USDT`.
4. Bot earns `+1 USDT`; delta is `+1 USDT / 5 USDT = +20%`.
5. User deposits `+10 USDT` on the exchange.
6. Contributed capital becomes `15 USDT`.
7. Bot PnL remains `+1 USDT`; delta becomes `+1 USDT / 15 USDT = +6.67%`.
8. If the user withdraws `4 USDT`, contributed capital decreases accordingly,
   and the chart shows the withdrawal marker instead of treating it as a bot
   loss.

## Non-Goals
- Do not infer bot PnL from raw balance drift alone.
- Do not invent historical deposits or withdrawals without exchange evidence.
- Do not bypass the exchange adapter boundary.
- Do not change runtime order sizing semantics before the ledger read model is
  proven.

## Data Model Target
Add persistent ledger tables or equivalent models:
- `WalletBalanceSnapshot`
  - `userId`, `walletId`, `exchange`, `marketType`, `baseCurrency`
  - `accountBalance`, `freeBalance`, `allocatedBalance`
  - `fetchedAt`, `source`, optional `rawRef`
- `WalletCashflowEvent`
  - `userId`, `walletId`, `direction` (`IN`/`OUT`/`NEUTRAL`)
  - `amount`, `currency`, `occurredAt`
  - `source` (`INITIAL_BALANCE`, `DEPOSIT`, `WITHDRAWAL`, `TRANSFER`,
    `REALIZED_PNL`, `FEE`, `FUNDING`, `UNKNOWN_EXTERNAL_ADJUSTMENT`)
  - deterministic exchange reference/id when available
  - optional linked `orderId`, `tradeId`, `positionId`
- `WalletEquityPoint`
  - derived or materialized series point
  - `portfolioEquity`, `contributedCapital`, `botPnl`, `openPnl`,
    `feesFunding`, `unclassifiedAdjustment`

## Exchange Boundary Target
Expose authenticated exchange reads through the existing exchange module:
- balance snapshot read,
- deposits/withdrawals history where supported,
- account transfer history where supported,
- income/funding/fee history where supported,
- deterministic cursor or time-window replay.

Unsupported exchange-history endpoints must degrade explicitly:
- ledger status `PARTIAL`,
- visible `UNKNOWN_EXTERNAL_ADJUSTMENT`,
- no silent conversion of balance drift into bot PnL.

## API Target
Add wallet analytics endpoints:
- `GET /dashboard/wallets/:id/performance-summary`
- `GET /dashboard/wallets/:id/equity-timeline?from=&to=&bucket=`
- `GET /dashboard/wallets/:id/cashflow-events?from=&to=&source=`
- optional admin/ops repair endpoint for backfill diagnostics.

Responses must include:
- current account balance,
- allocated/reference balance,
- contributed capital,
- bot realized PnL,
- bot open/unrealized PnL,
- fees/funding,
- unclassified adjustments,
- ledger completeness status.

## Web Target
Wallet detail/dashboard should show:
- current balance and allocation,
- contributed capital,
- bot PnL amount and percent,
- deposits/withdrawals/transfers,
- unclassified movement warnings,
- equity timeline chart with markers.

Dashboard wallet KPI delta should move from current web-derived baseline to the
ledger-backed value once the API exposes `contributedCapital` and `botPnl`.

## Suggested Implementation Slices
1. `[x] WLEDGER-01 docs(contract)`: freeze data model, event classification, and
   completeness semantics.
2. `[x] WLEDGER-02 db`: add wallet balance snapshot and cashflow event persistence.
3. `[x] WLEDGER-03 exchange`: expose Binance balance/income/transfer history behind
   exchange adapter boundary.
4. `[x] WLEDGER-04 api-ingest`: persist initial LIVE wallet balance and periodic
   balance snapshots.
5. `[x] WLEDGER-05 api-classify`: classify deposits, withdrawals, transfers,
   fees/funding, and bot lifecycle PnL.
6. `[x] WLEDGER-06 api-read`: expose performance summary and equity timeline
   endpoints with completeness state.
7. `[ ] WLEDGER-07 web-summary`: add wallet performance summary cards and explain
   unclassified adjustments.
8. `[ ] WLEDGER-08 web-chart`: add equity timeline chart with cashflow markers.
9. `[ ] WLEDGER-09 dashboard`: switch dashboard wallet delta to ledger-backed
   `botPnl / contributedCapital`.
10. `[ ] WLEDGER-10 verification`: run exchange-history backfill tests, web chart
    tests, typecheck/build, and guardrails.

## WLEDGER-01 Closure
Closed on 2026-04-30 by publishing
`docs/architecture/reference/live-wallet-cashflow-ledger-contract.md` and
linking it from wallet and exchange-access architecture. The contract freezes:
- persistent model semantics,
- event classification rules,
- ledger completeness states,
- read-model formulas,
- API response requirements,
- dashboard behavior,
- forbidden accounting shortcuts.

## WLEDGER-02 Closure
Closed on 2026-04-30 by adding Prisma persistence for
`WalletBalanceSnapshot` and `WalletCashflowEvent`, including user/wallet
ownership relations, exchange/base-currency fields, allocation snapshot fields,
cashflow direction/source enums, deterministic exchange-event uniqueness, and
optional links to position/order/trade lifecycle records.

No materialized `WalletEquityPoint` table was added in this slice because the
architecture contract allows the equity series to be derived at read time until
the API read model proves that materialization is needed.

## WLEDGER-03 Closure
Closed on 2026-04-30 by exposing wallet cashflow history through the existing
authenticated exchange boundary. Binance is explicitly marked as the only
supported V1 exchange for `WALLET_CASHFLOW_HISTORY`, unsupported exchanges fail
closed through the existing capability contract, and the CCXT connector now
normalizes supported account-history reads (`fetchLedger`, `fetchDeposits`,
`fetchWithdrawals`, `fetchTransactions`) into deterministic cashflow-history
entries for later ledger ingestion.

## WLEDGER-04 Closure
Closed on 2026-04-30 by adding wallet balance snapshot ingestion at the two
current exchange-balance read points:
- LIVE wallet creation records an initial `WalletBalanceSnapshot` from the
  authenticated exchange balance preview inside the wallet-create transaction.
- LIVE runtime capital refresh records a periodic `WalletBalanceSnapshot` when
  it fetches fresh exchange balance outside the live-balance cache.

This slice intentionally does not classify deposits, withdrawals, transfers, or
bot PnL yet; those remain queued for `WLEDGER-05`.

## WLEDGER-05 Closure
Closed on 2026-04-30 by adding deterministic cashflow classification helpers:
- initial allocated LIVE wallet balance becomes `INITIAL_BALANCE`,
- exchange deposit/withdrawal history maps to `DEPOSIT` and `WITHDRAWAL`,
- transfer, fee, funding, realized-income, and unknown account-history rows map
  to explicit `WalletCashflowSource` values,
- stable exchange event ids are upserted by `(walletId, exchangeEventId,
  source)`.

The slice records the initial balance cashflow during LIVE wallet creation.
Broader historical exchange replay and bot lifecycle event backfill remain part
of later read/repair ingestion work.

## WLEDGER-06 Closure
Closed on 2026-04-30 by adding wallet analytics read endpoints:
- `GET /dashboard/wallets/:id/performance-summary`
- `GET /dashboard/wallets/:id/equity-timeline`
- `GET /dashboard/wallets/:id/cashflow-events`

The first read model exposes current balance, contributed capital, bot PnL
fields, fees/funding, unclassified adjustment, wallet delta percent, timeline
points, cashflow markers, and completeness state.

## Acceptance Criteria
- User deposits and withdrawals do not change bot PnL.
- Bot PnL does not change contributed capital.
- Dashboard and wallet detail can explain why wallet balance changed.
- Missing exchange history is visible as partial ledger completeness, not
  silently hidden.
- Equity chart shows current and historical wallet value without fake data.

## Validation Plan
- API unit tests for cashflow classification.
- API e2e tests for wallet performance summary and equity timeline.
- Exchange-boundary tests for Binance history normalization.
- Web tests for summary cards, chart markers, empty/partial/error states.
- Manual protected LIVE verification with a small deposit/withdrawal scenario
  when safe to run.
