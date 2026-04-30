# LIVE Wallet Cashflow Ledger Contract

Status: accepted target
Updated: 2026-04-30

## Purpose
Define the target accounting contract for LIVE wallet performance analytics.
This contract extends the wallet source-of-truth model without changing the
current runtime capital authority:

- runtime affordability remains based on authenticated exchange balance plus
  wallet allocation policy,
- user-facing performance must separate user capital movements from bot PnL,
- charts and summaries must expose uncertainty instead of inventing fake
  accounting truth.

Canonical parent:
- `docs/architecture/reference/wallet-source-of-truth-contract.md`

## Terms
- `accountBalance`: authenticated exchange balance for the wallet base
  currency.
- `referenceBalance`: account balance after wallet allocation policy is applied.
- `contributedCapital`: net user capital assigned to the wallet scope.
- `botRealizedPnl`: realized PnL from Soar-owned closed lifecycle rows.
- `botOpenPnl`: current unrealized PnL from Soar-owned open lifecycle rows.
- `botPnl`: `botRealizedPnl + botOpenPnl - botFeesFunding`.
- `unclassifiedAdjustment`: exchange-balance movement that cannot be mapped
  deterministically to user capital movement or Soar-owned bot result.
- `portfolioEquity`: current wallet value used for charting and summary.

## Ledger Completeness
Every wallet performance response must carry one completeness state:

- `COMPLETE`: all movements in the requested window are deterministically
  classified.
- `PARTIAL`: some exchange-history families are unsupported, unavailable, or
  outside import coverage, but current exchange balance is available.
- `UNAVAILABLE`: the system cannot read current wallet balance or enough local
  lifecycle truth to produce a reliable performance view.

Rules:
- `PARTIAL` is acceptable for display, but the UI must show a warning and
  expose unclassified movement.
- `UNAVAILABLE` must not display a chart as if the data were real.
- Completeness is scoped by wallet and requested time window.

## Persistent Models
Exact Prisma names may change during implementation, but the persisted model
must preserve these semantics.

### `WalletBalanceSnapshot`
Purpose: preserve observed wallet balance truth over time.

Required fields:
- `id`
- `userId`
- `walletId`
- `exchange`
- `marketType`
- `baseCurrency`
- `accountBalance`
- `freeBalance`
- `allocatedBalance`
- `allocationMode`
- `allocationValue`
- `fetchedAt`
- `source`
- optional `externalRef`
- optional normalized raw metadata for diagnostics only

Invariants:
- one snapshot belongs to exactly one wallet,
- balances are non-negative finite numbers,
- snapshots are append-only except explicit repair tooling,
- snapshots must not be used to infer bot PnL by themselves.

### `WalletCashflowEvent`
Purpose: classify money movement and PnL events.

Required fields:
- `id`
- `userId`
- `walletId`
- `direction`: `IN`, `OUT`, or `NEUTRAL`
- `source`:
  - `INITIAL_BALANCE`
  - `DEPOSIT`
  - `WITHDRAWAL`
  - `TRANSFER_IN`
  - `TRANSFER_OUT`
  - `BOT_REALIZED_PNL`
  - `BOT_OPEN_PNL_SNAPSHOT`
  - `FEE`
  - `FUNDING`
  - `UNKNOWN_EXTERNAL_ADJUSTMENT`
- `amount`
- `currency`
- `occurredAt`
- optional `exchangeEventId`
- optional `orderId`
- optional `tradeId`
- optional `positionId`
- optional `balanceSnapshotId`

Invariants:
- `INITIAL_BALANCE`, `DEPOSIT`, and `TRANSFER_IN` increase
  `contributedCapital`.
- `WITHDRAWAL` and `TRANSFER_OUT` decrease `contributedCapital`.
- `BOT_REALIZED_PNL`, `BOT_OPEN_PNL_SNAPSHOT`, `FEE`, and `FUNDING` affect
  `botPnl`, not `contributedCapital`.
- `UNKNOWN_EXTERNAL_ADJUSTMENT` affects neither `contributedCapital` nor
  `botPnl` silently; it must be displayed as unexplained movement.
- Exchange references must be idempotent per `(walletId, exchangeEventId,
  source)` when the exchange provides stable ids.

### `WalletEquityPoint`
Purpose: power timeline charts from classified ledger truth.

This may be materialized or derived at read time.

Required values:
- `timestamp`
- `portfolioEquity`
- `contributedCapital`
- `botRealizedPnl`
- `botOpenPnl`
- `botFeesFunding`
- `botPnl`
- `unclassifiedAdjustment`
- `completeness`

Invariants:
- chart points must be monotonic in time,
- chart buckets must not hide unclassified adjustments,
- if the point is derived from partial data, `completeness` must not be
  `COMPLETE`.

## Classification Rules
1. Initial wallet tracking:
   - first reliable authenticated balance for a LIVE wallet becomes
     `INITIAL_BALANCE`,
   - the event amount is the allocated/reference balance, not necessarily the
     full account balance when allocation is `PERCENT` or `FIXED`.
2. Deposits and inbound transfers:
   - classify as contributed capital increases when exchange history proves the
     movement.
3. Withdrawals and outbound transfers:
   - classify as contributed capital decreases when exchange history proves the
     movement.
4. Soar-owned closed position lifecycle:
   - realized result is `BOT_REALIZED_PNL`,
   - fees attributable to the lifecycle are `FEE`,
   - funding attributable to the lifecycle is `FUNDING`.
5. Soar-owned open position lifecycle:
   - current open PnL may appear as `BOT_OPEN_PNL_SNAPSHOT` in read models or
     derived equity points,
   - it must not create permanent realized cashflow before close.
6. Manual exchange activity outside Soar:
   - classify as external/manual only when exchange history can prove it,
   - otherwise keep it as `UNKNOWN_EXTERNAL_ADJUSTMENT`.
7. Raw balance drift:
   - balance differences may help detect missing events,
   - balance differences must not directly become bot PnL.

## Read Model Formulas
For a requested wallet window:

```text
contributedCapital =
  INITIAL_BALANCE
  + DEPOSIT
  + TRANSFER_IN
  - WITHDRAWAL
  - TRANSFER_OUT

botPnl =
  BOT_REALIZED_PNL
  + BOT_OPEN_PNL_SNAPSHOT
  - FEE
  + FUNDING

walletDeltaAmount = botPnl
walletDeltaPercent = botPnl / contributedCapital
```

`portfolioEquity` should reconcile to the latest authenticated balance when
complete. If it does not reconcile:
- create or expose `UNKNOWN_EXTERNAL_ADJUSTMENT`,
- lower completeness to `PARTIAL`,
- preserve the latest authenticated exchange balance as current balance truth.

## API Response Requirements
Wallet analytics endpoints must include:
- `completeness`
- `completenessReasons`
- `accountBalance`
- `referenceBalance`
- `freeCash`
- `reservedMargin`
- `contributedCapital`
- `botRealizedPnl`
- `botOpenPnl`
- `botFeesFunding`
- `botPnl`
- `walletDeltaAmount`
- `walletDeltaPercent`
- `unclassifiedAdjustment`
- `asOf`

Timeline endpoints must include marker events for:
- deposits,
- withdrawals,
- transfers,
- reset/import boundaries,
- unclassified adjustments.

## Exchange Boundary Requirements
Future exchange-history ingestion must go through the canonical exchange module.
Feature modules must not create authenticated exchange clients directly.

Required operation families:
- current balance snapshot,
- deposit history,
- withdrawal history,
- account transfer history,
- income/funding/fee history,
- deterministic paged or time-window replay.

Unsupported operation families must be represented in completeness reasons.

## Dashboard Requirements
- Current wallet balance may still render from authenticated exchange balance.
- Wallet performance delta must prefer ledger-backed `botPnl /
  contributedCapital` once available.
- If completeness is `PARTIAL`, show the delta with a visible caveat and expose
  unclassified adjustment.
- If completeness is `UNAVAILABLE`, show an empty/error state rather than a
  chart with fake points.

## Forbidden Patterns
- Counting deposits as bot profit.
- Counting withdrawals as bot loss.
- Inferring historical PnL from raw balance differences.
- Hiding unsupported exchange-history coverage.
- Reconstructing historical chart points from fake data.
- Bypassing the exchange access ownership matrix for authenticated reads.
