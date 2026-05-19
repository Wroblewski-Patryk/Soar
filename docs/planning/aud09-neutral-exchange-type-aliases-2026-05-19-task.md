# Task

## Header
- ID: AUD09-NEUTRAL-EXCHANGE-TYPE-ALIASES-2026-05-19
- Title: Replace non-exchange CCXT-named type imports with neutral exchange aliases
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: AUD09-EXACT-CAPABILITY-MATRIX-2026-05-19
- Priority: P3
- Module Confidence Rows: SOAR-EXCHANGE-ADAPTER-001
- Requirement Rows: REQ-EXCH-029
- Risk Rows: RISK-029
- Iteration: audit repair continuation
- Operation Mode: BUILDER
- Mission ID: FULL-REUSABLE-AUDIT-REPAIR-2026-05-19
- Mission Status: VERIFIED

## Context
`AUD-09` recorded `AUD-EXCH-007`: two non-exchange modules imported
CCXT-named exchange connector types directly from `ccxtFuturesConnector.types`.
The imports were type-only and not an SDK ownership breach, but they made
feature modules depend on connector-specific naming.

## Goal
Keep non-exchange consumers on neutral exchange-owned contract aliases.

## Scope
- `apps/api/src/modules/exchange/exchangeData.types.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/wallets/walletCashflowClassifier.service.ts`
- `docs/operations/exchange-capability-truth-audit-2026-05-19.md`
- audit registry, baseline, and module confidence state

## Implementation Plan
1. Export neutral `ExchangeOrderFill` and `ExchangeWalletCashflowHistoryEntry`
   aliases from the exchange module.
2. Update orders and wallet cashflow classifier imports.
3. Search for remaining CCXT-named type imports outside `modules/exchange`.
4. Run focused typecheck and tests.
5. Update audit/state artifacts.

## Acceptance Criteria
- Non-exchange modules no longer import `CcxtFuturesOrderFill` or
  `CcxtWalletCashflowHistoryEntry`.
- Runtime behavior is unchanged.
- Focused tests pass.

## Definition of Done
- [x] Neutral aliases added.
- [x] Non-exchange imports updated.
- [x] Focused validation passed.
- [x] Audit/state docs updated.

## Validation Evidence
- `rg -n "CcxtFuturesOrderFill|CcxtWalletCashflowHistoryEntry" apps/api/src/modules -g '*.ts'` shows remaining usages only inside `modules/exchange`.
- `corepack pnpm --dir apps/api run typecheck` PASS.
- `corepack pnpm --dir apps/api exec vitest run src/modules/wallets/walletCashflowClassifier.service.test.ts src/modules/orders/orders.service.test.ts --reporter=default` PASS after local Postgres/Redis startup (`2` files / `41` tests).

## Forbidden
- direct SDK/CCXT ownership outside the exchange module
- runtime behavior changes
- production or exchange-side mutation

## Result Report
- Task summary: closed `AUD-EXCH-007` by introducing neutral exchange-owned type aliases and updating non-exchange consumers.
- Files changed: exchange type alias file, orders service, wallet cashflow classifier, and audit/state docs.
- How tested: focused API typecheck and orders/wallet tests.
- What is incomplete: no remaining `AUD-09` blocker; future exchange additions must preserve this boundary.
