# WLEDGER-03 LIVE Wallet Exchange History Boundary Task

## Header
- ID: WLEDGER-03
- Title: Expose Binance wallet cashflow history behind the exchange adapter boundary
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: WLEDGER-01, WLEDGER-02
- Priority: P1

## Context
The wallet ledger must not infer deposits, withdrawals, transfers, fees, or
funding from balance drift alone. Exchange-history access has to stay behind
the canonical authenticated exchange boundary.

## Goal
Expose wallet cashflow history as one typed authenticated-read operation so
future ingestion can replay exchange-backed wallet movements without creating
parallel exchange clients.

## Scope
- `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.ts`
- `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`
- `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts`
- `apps/api/src/modules/exchange/ccxtFuturesConnector.service.ts`
- `apps/api/src/modules/exchange/ccxtFuturesConnector.types.ts`
- Focused exchange tests.

## Implementation Plan
1. Add `WALLET_CASHFLOW_HISTORY` to the existing exchange capability contract.
2. Keep Binance as the only V1 supported exchange and unsupported exchanges
   fail-closed.
3. Add one adapter-boundary function for wallet cashflow history.
4. Normalize supported CCXT account-history reads into deterministic cashflow
   entries.
5. Cover capability, boundary, and connector normalization with focused tests.

## Acceptance Criteria
- Binance support is explicit and non-Binance exchanges fail closed.
- No caller bypasses the approved exchange adapter boundary.
- Deposit and withdrawal rows normalize with direction, amount, currency, fee,
  timestamp, source, status, raw payload, and exchange event id.
- Missing connector support fails with an explicit error.

## Definition of Done
- [x] Capability contract updated.
- [x] Boundary function added.
- [x] CCXT normalization added.
- [x] Focused exchange tests passed.
- [x] API typecheck passed.
- [x] Source-of-truth planning/context docs updated.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/ccxtFuturesConnector.service.test.ts`
- Manual checks: API typecheck passed.
- High-risk checks: unsupported exchange behavior remains fail-closed.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Result Report
- Task summary: added the exchange-boundary read contract for wallet cashflow history.
- Files changed: exchange capability, boundary, connector, connector types, tests, planning/context docs.
- How tested: focused exchange tests and API typecheck.
- What is incomplete: persistence ingestion and classification remain queued.
- Next steps: WLEDGER-04 initial and periodic balance snapshot ingestion.
