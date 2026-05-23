# Task

## Header
- ID: AUD09-EXACT-CAPABILITY-MATRIX-2026-05-19
- Title: Refactor exchange operation capability truth to exact market context
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: EXCHANGE-CAPABILITY-TRUTH-AUDIT-2026-05-19
- Priority: P1
- Module Confidence Rows: Exchange Adapter
- Requirement Rows: REQ-EXCH-029
- Quality Scenario Rows: Exchange fail-closed behavior
- Risk Rows: RISK-029
- Iteration: audit repair continuation
- Operation Mode: BUILDER
- Mission ID: FULL-REUSABLE-AUDIT-REPAIR-2026-05-19
- Mission Status: VERIFIED

## Context
`AUD-09` found that architecture requires exact `(exchange, marketType,
operation)` capability truth, while API operation capability services still
accepted only `(exchange, operation)`.

## Goal
Make exchange execution and authenticated-read capability checks resolve by
the exact exchange context without changing production scope or running any
LIVE/exchange-side mutation.

## Scope
- `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.ts`
- `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`
- `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/positions/positions.service.ts`
- focused exchange/order tests and audit/state documentation

## Implementation Plan
1. Extend the execution capability matrix to `exchange -> marketType -> operation`.
2. Update authenticated-read support to pass `marketType`.
3. Update exchange boundary, wallet preview, and positions snapshot consumers.
4. Update focused tests.
5. Run focused exchange tests and API typecheck.
6. Refresh audit, requirement, risk, rollup, and continuation state.

## Acceptance Criteria
- Capability support APIs accept `(exchange, marketType, operation)`.
- Unsupported market contexts fail closed.
- Existing exchange boundary tests still pass.
- No LIVE order, cancel, close, exchange-side mutation, or production data
  mutation is run.

## Definition of Done
- [x] Exact matrix implemented.
- [x] Consumers updated.
- [x] Focused tests pass.
- [x] API typecheck passes.
- [x] Audit/state docs updated.

## Validation Evidence
- Tests:
  - `corepack pnpm --dir apps/api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts --reporter=default` PASS (`2` files / `4` tests)
  - `corepack pnpm --dir apps/api exec vitest run src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAdapterRegistry.service.test.ts --reporter=default` PASS (`2` files / `17` tests)
  - `corepack pnpm --dir apps/api exec vitest run src/modules/orders/orders.service.test.ts --reporter=default` PASS after local Postgres/Redis startup (`1` file / `38` tests)
  - `corepack pnpm --dir apps/api run typecheck` PASS
  - `corepack pnpm run docs:parity:check` PASS
  - `corepack pnpm run docs:parity:endpoints:api -- --date 2026-05-19` PASS (`109` endpoints / `109` documented / `0` gaps)
  - `corepack pnpm run quality:guardrails` PASS
  - `git diff --check` PASS with line-ending warnings only
- Manual checks: `rg` confirmed no remaining old two-argument exchange capability call sites in API source.
- High-risk checks: no production journey, LIVE mutation, exchange-side mutation, or existing production data mutation.
- Requirements matrix updated: yes, `REQ-EXCH-029` verified.
- Risk register updated: yes, `RISK-029` closed.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, from prior `AUD-09`
- Decision required from user: no, implementation moved code toward the already approved stricter architecture
- Follow-up architecture doc updates: none required

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- production or exchange-side mutation

## Result Report
- Task summary: closed `AUD-EXCH-002` by making exchange operation support exact by `(exchange, marketType, operation)`.
- Files changed: exchange capability/authenticated-read/boundary services, wallet and positions consumers, focused tests, and audit/state docs.
- How tested: focused exchange Vitest packs and API typecheck.
- What is incomplete: none for `AUD-09`; `AUD-EXCH-007` was closed by `AUD09-NEUTRAL-EXCHANGE-TYPE-ALIASES-2026-05-19`.
- Next steps: continue with `AUD-20` or `AUD-01`, both of which still require product/architecture decision.
