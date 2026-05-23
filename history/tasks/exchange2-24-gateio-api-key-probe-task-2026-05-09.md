# EXCHANGE2-24 Gate.io API-Key Probe

## Header
- ID: `EXCHANGE2-24-GATEIO-API-KEY-PROBE-2026-05-09`
- Title: Enable Gate.io API-key connection probe through shared exchange adapter boundary
- Task Type: implementation
- Current Stage: post-release
- Status: DONE
- Owner: Execution Agent
- Depends on:
  - `EXCHANGE2-23-GATEIO-PAPER-PRICING-ENABLE-2026-05-09`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Priority: P1
- Iteration: 42
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches iteration 42 (`ARCHITECT`).
- [x] The task is aligned with repository source-of-truth documents.

## Context
Gate.io is the selected second-exchange target. The current foundation supports
public market catalog, public ticker/candle reads, public paper pricing, and
paper bot activation. Gate.io authenticated reads, live submit, and
exchange-side cancel remain intentionally fail-closed.

The next smallest implementation gap is API-key connection testing. The
existing profile API-key probe was Binance-specific, while the architecture
requires exchange-facing behavior to pass through shared boundaries and
explicit capability truth.

## Goal
Enable `GATEIO` `API_KEY_PROBE` for provided and stored profile API-key
connection tests without enabling any other authenticated read or live
execution capability.

## Scope
- `libs/shared/index.js`
- `apps/api/src/modules/profile/apiKey/*`
- Web exchange capability regression
- Architecture/module/status docs that describe Gate.io capability truth

## Implementation Plan
1. Replace the Binance-only API-key probe service with a shared
   exchange-aware probe service.
2. Keep Binance messages and behavior stable through the generic service.
3. Add Gate.io probe support using CCXT `swap` default type for futures probes.
4. Enable only `GATEIO` `API_KEY_PROBE` in the shared capability matrix.
5. Update API/Web tests and source-of-truth docs.
6. Run focused API/Web validations, typechecks, guardrails, docs parity, and
   diff check.

## Acceptance Criteria
- Provided Gate.io API-key tests return HTTP 200 with audit-safe metadata and
  do not persist secrets.
- Stored Gate.io API-key tests decrypt stored credentials and return HTTP 200
  with audit-safe metadata.
- Placeholder exchanges other than Gate.io still return the explicit
  `API_KEY_PROBE` unsupported contract.
- Gate.io balance preview, positions, open-orders, trade-history, live submit,
  and exchange-side cancel remain unsupported.
- The old Binance-only probe implementation is removed so probe logic is not
  duplicated.

## Definition Of Done
- Focused API-key probe unit coverage passes.
- Focused API-key e2e coverage passes.
- Focused Web exchange capability coverage passes.
- API and Web typechecks pass.
- Repository guardrails, docs parity, and diff check pass.
- Source-of-truth docs are updated.

## Forbidden
- Do not enable Gate.io `LIVE_EXECUTION`.
- Do not enable Gate.io `BALANCE_PREVIEW`, `POSITIONS_SNAPSHOT`,
  `OPEN_ORDERS_SNAPSHOT`, `TRADE_HISTORY_SNAPSHOT`, or `LIVE_ORDER_CANCEL`.
- Do not create feature-local exchange bootstrap logic.
- Do not call real exchange APIs in test mode.
- Do not store raw API key or secret values in logs.

## Result Report
- Replaced the Binance-only API-key probe with a shared exchange-aware probe
  service.
- Preserved Binance connection-test behavior and messages through the shared
  service.
- Enabled only `GATEIO` `API_KEY_PROBE` in the shared capability matrix.
- Added Gate.io provided and stored API-key e2e coverage with audit-safe
  metadata assertions.
- Kept BYBIT, OKX, KRAKEN, and COINBASE API-key probes fail-closed with the
  explicit unsupported contract.
- Kept Gate.io balance preview, positions/open-orders, trade-history, live
  submit, and exchange-side cancel unsupported.

## Verification
- PASS: `apps/api` `vitest.CMD run src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts`
- PASS: `apps/web` `vitest.CMD run src/features/exchanges/exchangeCapabilities.test.ts`
- PASS: `apps/api` with `DATABASE_URL=postgresql://postgres:password@localhost:5432/cryptosparrow?schema=public` `vitest.CMD run src/modules/profile/apiKey/apiKey.e2e.test.ts --sequence.concurrent=false`
- PASS: `apps/api` `tsc.CMD --noEmit`
- PASS: `apps/web` `tsc.CMD --noEmit`
- PASS: `node scripts/repoGuardrails.mjs`
- PASS: `node scripts/checkDocsParity.mjs`
- PASS: `git diff --check` (line-ending warnings only)
- PASS: production Web build-info reached
  `e76e08a1a20b12abaeabf4edc44a38ba37619005`
- PASS: production public deploy smoke (`API /health`, `API /ready`, `Web /`)
- BLOCKED as expected: no-secret final V1 preflight public checks pass, while
  protected/formal release evidence remains blocked. Evidence:
  `history/releases/v1-final-preflight-e76e08a1-2026-05-09.md`
