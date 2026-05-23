# Second Exchange Live Readiness Plan (2026-05-08)

## Header
- ID: `EXCHANGE2-LIVE-READINESS-PLAN-2026-05-08`
- Title: Plan second exchange adapter delivery after V1 live readiness blockers
- Task Type: planning
- Current Stage: post-release
- Status: DONE
- Owner: Planning Agent
- Depends on:
  - target exchange decision: `GATEIO` selected by user on 2026-05-08
  - protected production auth for `LIVEIMPORT-03`
  - rollback guard auth
  - real RC Gate 4 approver identities
- Priority: P0
- Iteration: V1 production hardening
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the active default iteration mode.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Soar has a tested local BACKTEST/PAPER/LIVE runtime path and current production
preflight reports build-info, public smoke, and production restore context as
passing or satisfied by evidence. The production release state remains blocked
on protected `LIVEIMPORT-03` runtime readback, rollback proof auth, and RC Gate
4 approval.

The current exchange capability truth supports `BINANCE` for
`PAPER_PRICING_FEED`, `LIVE_EXECUTION`, and `API_KEY_PROBE`, and now supports
`GATEIO` for public market data, authenticated readback, and live submit. The
architecture requires new exchange support to be explicit by operation family
and to fail closed where unsupported.

On 2026-05-08 the user selected `GATEIO` as the second-exchange target. The
first executed adapter line has deliberately stayed narrow: `GATEIO` is now a
recognized exchange, public market catalog/market-data reads are implemented
for the `FUTURES`/swap foundation, and paper pricing is enabled through the
existing public polling source. Authenticated reads, live submit, and
exchange-side cancel capabilities remain fail-closed unless an exact operation
adapter is implemented and verified.

2026-05-09 status reconciliation:
- Planning artifact: complete.
- Selected exchange: `GATEIO`.
- Implemented foundation: public catalog, public ticker/candle reader,
  opt-in market-stream polling source, runtime event context regressions,
  Web/API fail-closed gates, and production deploy freshness for the
  fail-closed batch through `90cd07d6`.
- Latest local source evidence: `EXCHANGE2-21` captured a real public
  `GATEIO/FUTURES/BTCUSDT` market-stream source smoke through
  `ExchangePublicPollingMarketStreamWorker`, proving ticker and final `1m`
  candle events are emitted by the existing worker source without credentials
  or exchange writes. This is not production deployment evidence and does not
  enable paper/live/authenticated capabilities.
- Public metadata refinement: `EXCHANGE2-22` decoupled symbol-rule resolution
  from `LIVE_EXECUTION` and now allows Gate.io public symbol rules through the
  existing `MARKET_CATALOG`/public market-map boundary. This does not enable
  paper pricing, authenticated reads, live submit, or cancel.
- Current paper support: `GATEIO` `PAPER_PRICING_FEED` is enabled for public
  paper runtime through the existing market-stream polling source.
- Current API-key probe support: `GATEIO` `API_KEY_PROBE` is enabled for
  provided and stored profile API-key connection tests through the shared
  exchange-aware probe service. This is credential validation only.
- Current balance preview support: `GATEIO` `BALANCE_PREVIEW` is enabled for
  the existing wallet preview route through the authenticated-read boundary.
- Current positions snapshot support: `GATEIO` `POSITIONS_SNAPSHOT` is enabled
  for the existing positions exchange-snapshot route through the
  authenticated-read boundary.
- Current open-orders snapshot support: `GATEIO` `OPEN_ORDERS_SNAPSHOT` is
  enabled through the authenticated-read boundary for reconciliation reads.
- Current trade-history snapshot support: `GATEIO` `TRADE_HISTORY_SNAPSHOT`
  is enabled through the authenticated-read boundary for executed-trade reads.
- Current wallet cashflow history support: `GATEIO`
  `WALLET_CASHFLOW_HISTORY` is enabled through the exchange adapter boundary
  for ledger/performance analytics reads.
- Current live submit support: `GATEIO` `LIVE_ORDER_SUBMIT` is enabled through
  the canonical orders/exchange boundary.
- Current live cancel support: `GATEIO` `LIVE_ORDER_CANCEL` is implemented
  through the canonical orders/exchange boundary. Production protected evidence
  is still required before live-money confidence.
- Still requiring user/operator input: first live scope and protected
  production readback/approval evidence.

## Goal
Prepare and execute a safe delivery path so a second exchange can be connected
through the approved exchange adapter boundaries without weakening the current
LIVE safety gates.

## Scope
- Architecture:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - exact operation support for `(exchange, marketType, operation)`
- Backend adapter boundaries:
  - `apps/api/src/modules/exchange/*`
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/positions/*`
  - `apps/api/src/modules/wallets/*`
  - `apps/api/src/modules/engine/*`
- Frontend capability surfaces:
  - `apps/web/src/features/exchanges/*`
  - `apps/web/src/features/wallets/*`
  - `apps/web/src/features/bots/*`
  - `apps/web/src/features/dashboard-home/*`
- Operations evidence:
  - `ops:release:v1:preflight`
  - `ops:liveimport:readback`
  - `ops:deploy:rollback-proof`
  - `ops:release:v1:gate`

## Implementation Plan

### Stage 1 - Close Existing V1 LIVE Readiness
1. Verify current `HEAD` is deployed through build-info.
2. Run authenticated `LIVEIMPORT-03` production runtime readback.
3. Run rollback proof with protected rollback guard auth.
4. Refresh RC gates and build final Gate 4 sign-off with real approver names.
5. Run the final non-dry-run production V1 release gate.

Acceptance criteria:
- `LIVEIMPORT-03` artifact exists and contains protected runtime positions
  payload evidence with ownership, strategy provenance, TTP/DCA visibility, and
  actionable state.
- rollback proof reports PASS with `shouldRollback=false`.
- final release gate reports `ready`.

### Stage 2 - Select Second Exchange And Exact Operation Matrix
1. User selected one target exchange: `GATEIO`. Done.
2. Freeze exact V1 operation support. Done for the current foundation:
   - `MARKET_CATALOG`: supported for `GATEIO`.
   - public `FUTURES` ticker/candle source: implemented through existing
     exchange public market-data contracts and opt-in market-stream polling.
   - `PAPER_PRICING_FEED`: supported for public paper runtime.
   - `BALANCE_PREVIEW`: supported.
   - `POSITIONS_SNAPSHOT`: supported.
   - `OPEN_ORDERS_SNAPSHOT`: supported.
   - `TRADE_HISTORY_SNAPSHOT`: supported.
   - `WALLET_CASHFLOW_HISTORY`: supported.
   - `LIVE_ORDER_SUBMIT`: supported.
   - `LIVE_ORDER_CANCEL`: supported through the canonical exchange boundary.
   - `API_KEY_PROBE`: supported for credential validation only.
3. Architecture/module docs were updated for the implemented foundation and
   fail-closed boundaries.

Acceptance criteria:
- no broad capability is enabled without exact operation support evidence.
- unsupported operations fail closed with explicit user-facing errors.

### Stage 3 - Public And Authenticated Read Adapter
1. Add exchange-specific connector bootstrap through `exchangeConnectorFactory`.
2. Implement market metadata and symbol-rule normalization through existing
   exchange module contracts.
3. API-key probe and balance preview are implemented for the target exchange.
4. Positions snapshot and open-orders snapshot are implemented for the target
   exchange.

Acceptance criteria:
- no feature module creates authenticated clients directly.
- exchange-specific differences stay inside exchange module boundaries.
- tests cover success, unsupported, invalid credentials, symbol normalization,
  and permission mismatch.

### Stage 4 - PAPER Runtime Support
1. Enable paper pricing feed only after public market data and symbol rules are
   stable. Done for `GATEIO` public `FUTURES` paper runtime.
2. Add backtest/runtime parser parity coverage for the selected exchange and
   market type.
3. Verify dashboard capability gating and wallet/bot create-edit UX.

Acceptance criteria:
- paper bot can run using the selected exchange market data without exchange
  writes.
- backtest and runtime decision semantics remain parity-aligned.

### Stage 5 - LIVE Order Submit Support
1. Add live submit adapter through `liveOrderAdapter.service.ts` and the
   existing orders service boundary. Done for Gate.io live submit.
2. Validate order type support, quantity precision, min notional, leverage,
   margin mode, and fee reconciliation. Done in mocked boundary coverage; real
   production proof still requires protected credentials.
3. Keep live cancel unsupported unless a real exchange cancel boundary is
   implemented and tested.

Acceptance criteria:
- manual LIVE order submit works through the canonical orders API.
- runtime LIVE submit works through the same adapter boundary.
- exchange failures fail closed and preserve local order/position consistency.

### Stage 6 - Production Evidence And Rollout
1. Deploy each adapter stage through Coolify after focused commits.
2. Wait for build-info after each pushed production-impacting commit.
3. Run public smoke and protected readback for the selected exchange.
4. Run rollback proof and final release gate after live submit is enabled.

Acceptance criteria:
- production readback proves the selected exchange context.
- final release evidence does not reuse Binance-only evidence for the new
  exchange.

## Forbidden
- enabling `LIVE_EXECUTION` for a second exchange before exact submit support
  is implemented and verified.
- inferring one operation from another, for example
  `LIVE_EXECUTION => POSITIONS_SNAPSHOT`.
- adding direct `ccxt` bootstrap in wallets, bots, orders consumers, or
  positions consumers outside approved exchange boundaries.
- silently narrowing unsupported target exchange requests back to Binance.
- accepting public smoke or no-session output as live runtime proof.
- running live-money actions without explicit operator approval and protected
  credentials.

## Required Decisions
1. Target exchange: `GATEIO` selected.
2. First implemented public market-data foundation: `FUTURES`/swap. Do not
   infer paper/live support from this.
3. Confirm whether V1 second-exchange goal includes live order submit, or only
   paper/backtest plus authenticated readback first.
4. Confirm whether exchange-side cancel is required for the first live slice.

## Validation Baseline
- `pnpm run quality:guardrails`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm --filter api run test -- --run`
- `pnpm --filter web run test -- --run`
- `pnpm run build`
- selected exchange focused adapter tests
- authenticated production readback after deploy
- rollback proof after deploy

## Result Report
- Task summary: planning artifact created and reconciled after the deployed
  Gate.io public foundation and later Gate.io public paper pricing enablement.
- Files changed: this planning document plus queue/context synchronization.
- How tested: repository guardrails and docs parity checks for the planning
  slice.
- What is incomplete: authenticated reads, live submit, live cancel,
  production authenticated readback, rollback proof, and RC Gate 4 approval
  remain blocked until exact support/access/approval exists.
- Next steps: close protected V1 evidence blockers; then choose the next exact
  Gate.io adapter operation without broad capability enablement.
