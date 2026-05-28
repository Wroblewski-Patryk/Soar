# Task

## Header
- ID: LUC-404
- Title: [Soar][ARB-008] Exchange capability contract regression suite
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Iteration: 1
- Operation Mode: TESTER

## Context
`ARB-008` requires regression protection for exact `(exchange, marketType, operation)` capability truth and boundary-safe exchange data types.

## Goal
Prevent silent regressions in capability support checks and prevent CCXT-specific type leakage outside `modules/exchange`.

## Constraints
- No runtime/deploy mutation.
- Keep scope to focused exchange contract regression coverage.

## Definition of Done
- [x] Exact unsupported capability errors are asserted with full details.
- [x] Boundary regression test fails when CCXT-specific types leak outside `modules/exchange`.
- [x] Focused tests and API typecheck pass.

## Validation Evidence
- `pnpm --filter api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeCapabilityContract.regression.test.ts` -> PASS (`3` files, `6` tests).
- `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/wallets/walletCashflowClassifier.service.test.ts` -> PASS (`2` files, `27` tests).
- `pnpm --filter api run typecheck` -> PASS.
- Contract diff review: capability contract remains exact and tuple-based (`supportsExchangeExecutionCapability(exchange, marketType, operation)`); authenticated-read contract remains delegated to same tuple truth; non-exchange modules (`orders`, `wallets`) consume neutral aliases from `exchangeData.types`.
- Reality status: verified.

## Files Changed
- `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`
- `apps/api/src/modules/exchange/exchangeCapabilityContract.regression.test.ts`
