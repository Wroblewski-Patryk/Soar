# WLEDGER-02 LIVE Wallet Ledger Persistence Task

## Header
- ID: WLEDGER-02
- Title: Add LIVE wallet balance snapshot and cashflow event persistence
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: WLEDGER-01
- Priority: P1

## Context
The approved LIVE wallet ledger contract requires durable wallet balance
snapshots and cashflow events before ingestion, summary APIs, dashboard cards,
or equity charts can be implemented.

## Goal
Persist the canonical wallet ledger primitives needed to separate contributed
capital, bot PnL, deposits, withdrawals, transfers, fees, funding, and
unclassified adjustments.

## Scope
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260430200000_add_live_wallet_cashflow_ledger/migration.sql`

## Implementation Plan
1. Add wallet balance snapshot enums and model.
2. Add wallet cashflow direction/source enums and model.
3. Link cashflow events to user, wallet, optional balance snapshot, and optional
   position/order/trade lifecycle records.
4. Add deterministic exchange-event uniqueness and read-path indexes.
5. Validate Prisma schema and API type contracts.

## Acceptance Criteria
- Wallet snapshots can store current exchange balance and allocated balance.
- Cashflow events can store user capital movements and bot lifecycle movements.
- Duplicate deterministic exchange events are rejected by database uniqueness.
- Existing runtime/order/trade relations still typecheck.

## Definition of Done
- [x] Prisma schema updated.
- [x] Migration added.
- [x] `pnpm --filter api exec prisma validate` passed.
- [x] `pnpm --filter api run typecheck` passed.
- [x] Source-of-truth planning/context docs updated.

## Validation Evidence
- Tests: not applicable for schema-only slice.
- Manual checks: Prisma schema validation passed.
- High-risk checks: API typecheck passed.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Result Report
- Task summary: added durable wallet ledger persistence primitives.
- Files changed: Prisma schema and ledger migration.
- How tested: Prisma validate, API typecheck.
- What is incomplete: ingestion/classification/read APIs remain queued.
- Next steps: WLEDGER-04 initial and periodic snapshot ingestion.
