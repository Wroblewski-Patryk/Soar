# Project Index

Generated at: 2026-05-13T17:06:23.574Z
Evidence date: 2026-05-13

## Purpose

This index is a local, no-network map of the current Soar repository. It is not
V1 approval evidence. Use it as the starting point for module-by-module audits
and fixes.

## V1 Product Action Matrix

Source: `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`

- BLOCKED_AUTH: 1
- PASS_LOCAL: 20

## V1 Audit Work Map

This table is the working map for finishing V1. It connects each matrix row to
the likely code and validation surfaces. The priority is audit order, not
business value.

| Priority | V1 row | Status | Risk | API | Web | Routes | Candidate tests | Next proof |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Dashboard Home | PASS_LOCAL | P0 operator truth surface | 5 | 1 | 1 | 30 | Rendered/browser proof for selected bot, wallet KPIs, tables, loading/empty/error, responsive states, and safe clickthrough. |
| 2 | Bot Runtime | PASS_LOCAL | P0 runtime truth | 5 | 2 | 2 | 30 | Production-safe Bot Runtime clickthrough on approved representative data. |
| 3 | Auth | PASS_LOCAL | P0 auth/session correctness | 1 | 1 | 2 | 16 | Production-safe browser Auth clickthrough for login, logout, and expired-session redirect. |
| 4 | Profile API Keys | PASS_LOCAL | P0 secrets/exchange access | 3 | 2 | 2 | 30 | Production-safe Profile API Keys clickthrough for create, test, delete, and audit log visibility. |
| 5 | Bots | PASS_LOCAL | P0 bot lifecycle | 5 | 1 | 10 | 30 | Production-safe non-destructive clickthrough for bot actions; local action proof already exists. |
| 6 | Profile | PASS_LOCAL | P1 user settings and validation | 1 | 1 | 1 | 12 | Production-safe Profile browser clickthrough for basic profile save and password/security update. |
| 7 | Wallets | PASS_LOCAL | P1 capital source of truth | 3 | 1 | 6 | 30 | Production-safe Wallets clickthrough for create/edit/delete/reset/preview on approved fixture data. |
| 8 | Markets | PASS_LOCAL | P1 runtime symbol scope | 4 | 1 | 3 | 30 | Production-safe Markets clickthrough for universe create/edit/delete, catalog import, and active-bot guard messaging. |
| 9 | Strategies | PASS_LOCAL | P1 trading decision config | 3 | 1 | 4 | 30 | Production-safe Strategies clickthrough for create/edit/delete/clone/config validation, preserving RSI 20/80, plus representative runtime/backtest compatibility proof. |
| 10 | Manual Orders | PASS_LOCAL | P0 money-impacting order flow | 5 | 2 | 1 | 30 | Production-safe Manual Orders clickthrough for PAPER place/cancel/close with DB readback; LIVE remains blocked-risk without an explicit safe plan. |
| 11 | Positions | PASS_LOCAL | P0 position ownership/runtime truth | 4 | 2 | 1 | 30 | Production-safe Positions clickthrough for list/close/update/takeover/import-status with exchange snapshot boundary; live mutation remains blocked-risk without explicit safe plan. |
| 12 | Orders | PASS_LOCAL | P0 order lifecycle | 4 | 2 | 1 | 30 | Production-safe Orders clickthrough for list/cancel/fill/fee readback through API and adapter boundary; live mutation remains blocked-risk without explicit safe plan. |
| 13 | Backtests | PASS_LOCAL | P1 simulation correctness | 3 | 1 | 3 | 30 | Production-safe Backtests browser clickthrough for create/delete/details/report/timeline on approved representative RSI strategy and market data. |
| 14 | Reports | PASS_LOCAL | P2 operator reporting | 4 | 1 | 1 | 30 | Production-safe Reports browser clickthrough for summaries, cross-mode performance, and per-run report readback on approved data. |
| 15 | Subscriptions/Admin | PASS_LOCAL | P0 role/entitlement access | 3 | 1 | 3 | 6 | Production admin clickthrough with approved non-destructive data and entitlement checks. |
| 16 | Logs/Audit Trail | PASS_LOCAL | P1 auditability | 1 | 1 | 1 | 3 | Production-safe Logs/Audit Trail browser clickthrough for filters, pagination, action-produced events, and metadata trace inspection. |
| 17 | Exchange Adapter | PASS_LOCAL | P0 external exchange boundary | 6 | 3 | 3 | 30 | Production-safe exchange-boundary proof for approved real credentials or read-only adapter operations; live mutation remains blocked-risk without explicit safe plan. |
| 18 | Workers | PASS_LOCAL | P0 async runtime reliability | 4 | 2 | 3 | 30 | Production-safe protected worker/process proof for health, readiness, runtime freshness, queue/process lifecycle, and observability on the deployed target. |
| 19 | Operations | BLOCKED_AUTH | P0 release safety | 2 | 1 | 3 | 30 | Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence. |
| 20 | Security/Privacy | PASS_LOCAL | P0 auth/secrets/data isolation | 5 | 3 | 6 | 30 | Production-safe protected security proof for auth, ownership isolation, rate-limit, secret redaction, fail-closed errors, and abuse cases on an approved deployed target; external security review remains open. |
| 21 | UX/A11y/Mobile | PASS_LOCAL | P1 product usability | 0 | 7 | 31 | 30 | Production browser clickthrough and external accessibility review for per-screen loading/empty/error/success, keyboard/touch, responsive, and accessibility evidence. |

## V1 Audit Work Details

### 1. Dashboard Home (PASS_LOCAL)

- Risk: P0 operator truth surface
- Action family: selected bot, loading/error/empty states, wallet KPIs, positions/orders/trades tables, TTP/TSL/DCA/PnL rendering
- Required proof: UI table assertions + runtime payload fixtures + browser screenshots
- Next proof: Rendered/browser proof for selected bot, wallet KPIs, tables, loading/empty/error, responsive states, and safe clickthrough.
- API modules: bots, orders, positions, wallets, reports
- Web features: dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`, `apps/api/src/modules/bots/bots.orchestration.e2e.test.ts`, `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- Notes: Runtime table presenter proof now covers negative/zero/positive protection semantics, DCA/fees/history/trade metadata, blocked position actions, and order cancelability. Rendered `HomeLiveWidgets` proof covers negative-PnL prospective TTP suppression, loading state, retryable error state, selected-bot switching, wallet KPI recalculation, open-orders tab rows, and trade-history tab rows. Local browser proof covers authenticated empty/onboarding state on desktop and mobile, plus keyboard focus on the next action. Active PAPER snapshot browser proof now renders runtime-session-backed open position rows, wallet KPIs, desktop/tablet/mobile visibility, and Orders tab interaction through the real API aggregate contract. Production-safe clickthrough remains open.

### 2. Bot Runtime (PASS_LOCAL)

- Risk: P0 runtime truth
- Action family: runtime graph, sessions, symbol stats, open positions, open orders, trades
- Required proof: UI table proof + API + worker telemetry
- Next proof: Production-safe Bot Runtime clickthrough on approved representative data.
- API modules: bots, engine, orders, positions, market-stream
- Web features: bots, dashboard-home
- Routes: /dashboard/bots/[id]/runtime, /dashboard/bots/runtime
- Candidate scripts: `go-live:infra:down`, `go-live:infra:up`, `ops:live:controlled-proof`, `ops:liveimport:readback`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`, `apps/api/src/modules/bots/bots.orchestration.e2e.test.ts`, `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- Notes: Runtime table presenters cover open-position PnL/TTP/TSL/actionability and open-order cancelability locally. The canonical Bot Runtime route now has local authenticated running and completed PAPER session proof with API readbacks, desktop/tablet/mobile screenshots, safe view switch, completed-session filter, and legacy redirects. Worker telemetry/live-loop proof now passes through the real runtime signal loop and authenticated Bot Runtime read APIs. Production-safe/non-local clickthrough remains open.

### 3. Auth (PASS_LOCAL)

- Risk: P0 auth/session correctness
- Action family: login, logout, session refresh, expired session redirects
- Required proof: browser + API auth lifecycle
- Next proof: Production-safe browser Auth clickthrough for login, logout, and expired-session redirect.
- API modules: auth
- Web features: auth
- Routes: /auth/login, /auth/register
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/middleware/requireAuth.test.ts`, `apps/api/src/modules/auth/auth.cookie.test.ts`, `apps/api/src/modules/auth/auth.e2e.test.ts`, `apps/api/src/modules/auth/auth.errors.test.ts`, `apps/api/src/modules/auth/auth.jwt.test.ts`, `apps/api/src/modules/auth/auth.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/positions/positions.authenticatedSnapshots.service.test.ts`, `apps/web/src/app/(public)/auth/authPageCacheContract.test.ts`, `apps/web/src/context/AuthContext.test.tsx`, `apps/web/src/features/auth/components/LoginForm.test.tsx`
- Notes: Local API lifecycle proof covers registration/login cookie TTLs, logout cookie clearing with subsequent `/auth/me` fail-closed behavior, deleted-user session expiry, expired JWT cookie clearing, and duplicate token precedence. Local web tests cover AuthProvider bootstrap, logout redirect, session-expired warning cleanup, API interceptor redirect to `/auth/login?session=expired`, middleware cookie gate, and login form/session-refresh fail-closed behavior. Production-safe browser clickthrough remains open.

### 4. Profile API Keys (PASS_LOCAL)

- Risk: P0 secrets/exchange access
- Action family: create/test/delete keys, futures-only handling, unsupported exchange handling
- Required proof: UI action + API probe + audit log
- Next proof: Production-safe Profile API Keys clickthrough for create, test, delete, and audit log visibility.
- API modules: profile, exchange, logs
- Web features: profile, exchanges
- Routes: /dashboard/exchanges, /dashboard/profile
- Candidate scripts: `build`, `ops:deploy:wait-web-build-info`, `ops:exchange:gateio-market-stream-smoke`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeMarketCatalog.service.test.ts`, `apps/api/src/modules/exchange/exchangeMetadataContract.service.test.ts`
- Notes: Local API proof covers encrypted-only storage, masked list/create responses, create/update/delete/rotate/revoke ownership, Binance and Gate.io provided/stored probes, no persistence of provided test secrets, audit log metadata without raw secrets, futures-missing rejection, bad-key rejection, placeholder exchange fail-closed probe contract, and unsupported ownership protections. Local Web proof covers connection-test-before-save, placeholder exchange save behavior, probe support status, stored-key test action, and delete risk confirmation. Production-safe browser clickthrough remains open.

### 5. Bots (PASS_LOCAL)

- Risk: P0 bot lifecycle
- Action family: create/edit/delete, activate/deactivate, PAPER/LIVE mode, assistant config, market groups, strategy links
- Required proof: UI action + API + DB/runtime readback
- Next proof: Production-safe non-destructive clickthrough for bot actions; local action proof already exists.
- API modules: bots, engine, wallets, markets, strategies
- Web features: bots
- Routes: /dashboard/bots/[id]/assistant, /dashboard/bots/[id]/edit, /dashboard/bots/[id], /dashboard/bots/[id]/preview, /dashboard/bots/[id]/runtime, /dashboard/bots/assistant, /dashboard/bots/create, /dashboard/bots/new, /dashboard/bots, /dashboard/bots/runtime
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:bot:v2:baseline`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`, `apps/api/src/modules/bots/bots.orchestration.e2e.test.ts`, `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- Notes: Local safe-fixture action proof covers list delete success/failure, API CRUD/delete/runtime close, ownership, market groups, strategy links, LIVE opt-in guards, duplicate active guards, and runtime monitoring. Production clickthrough remains separate and must be non-destructive.

### 6. Profile (PASS_LOCAL)

- Risk: P1 user settings and validation
- Action family: basic profile update, password/security update
- Required proof: UI form submit + API validation
- Next proof: Production-safe Profile browser clickthrough for basic profile save and password/security update.
- API modules: profile
- Web features: profile
- Routes: /dashboard/profile
- Candidate scripts: `build`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`, `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts`, `apps/api/src/modules/profile/basic/basic.e2e.test.ts`, `apps/api/src/modules/profile/security/security.e2e.test.ts`, `apps/api/src/modules/profile/stage-abuse-throttling.e2e.test.ts`, `apps/api/src/modules/profile/subscription/subscription.e2e.test.ts`, `apps/web/src/app/dashboard/profile/page.test.tsx`, `apps/web/src/features/profile/components/ApiKeyForm.test.tsx`, `apps/web/src/features/profile/components/ApiKeysList.test.tsx`, `apps/web/src/features/profile/components/BasicForm.test.tsx`, `apps/web/src/features/profile/components/Security.test.tsx`, `apps/web/src/features/profile/components/Subscription.test.tsx`
- Notes: Local API/Web proof covers profile save success/error, timezone persistence/rejection, password mismatch fail-closed behavior, valid password change, invalid/weak password rejection, old-login failure/new-login success, and password-confirmed account deletion. Production-safe browser clickthrough remains open.

### 7. Wallets (PASS_LOCAL)

- Risk: P1 capital source of truth
- Action family: create/edit/delete, paper/live wallet modes, balance preview, reset/repair flows
- Required proof: UI action + API + DB/state readback
- Next proof: Production-safe Wallets clickthrough for create/edit/delete/reset/preview on approved fixture data.
- API modules: wallets, exchange, logs
- Web features: wallets
- Routes: /dashboard/wallets/[id]/edit, /dashboard/wallets/[id], /dashboard/wallets/[id]/preview, /dashboard/wallets/create, /dashboard/wallets/list, /dashboard/wallets
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeMarketCatalog.service.test.ts`, `apps/api/src/modules/exchange/exchangeMetadataContract.service.test.ts`
- Notes: Local API/Web proof covers create/edit/delete, PAPER/LIVE mode guards, API-key ownership, balance preview, reset/repair guards, and ledger readback. Production-safe browser clickthrough remains open.

### 8. Markets (PASS_LOCAL)

- Risk: P1 runtime symbol scope
- Action family: universe create/edit/delete, symbols import, capability guards
- Required proof: UI action + API + adapter capability
- Next proof: Production-safe Markets clickthrough for universe create/edit/delete, catalog import, and active-bot guard messaging.
- API modules: markets, market-data, market-stream, exchange
- Web features: markets
- Routes: /dashboard/markets/[id]/edit, /dashboard/markets/create, /dashboard/markets/list
- Candidate scripts: `build`, `ops:deploy:wait-web-build-info`, `ops:exchange:gateio-market-stream-smoke`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeMarketCatalog.service.test.ts`, `apps/api/src/modules/exchange/exchangeMetadataContract.service.test.ts`
- Notes: Local API/Web proof covers universe CRUD, catalog import, symbol composition, placeholder capability guards, active-bot guard behavior, inactive-bot edit/delete behavior, stale legacy link handling, and ownership isolation. Production-safe browser clickthrough remains open.

### 9. Strategies (PASS_LOCAL)

- Risk: P1 trading decision config
- Action family: create/edit/delete/clone, RSI 20/80 preserved, config validation
- Required proof: UI action + API + runtime/backtest compatibility
- Next proof: Production-safe Strategies clickthrough for create/edit/delete/clone/config validation, preserving RSI 20/80, plus representative runtime/backtest compatibility proof.
- API modules: strategies, backtests, engine
- Web features: strategies
- Routes: /dashboard/strategies/[id]/edit, /dashboard/strategies/[id], /dashboard/strategies/create, /dashboard/strategies/list
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/backtest.worker.ts`, `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/backtests/backtestDataGateway.test.ts`, `apps/api/src/modules/backtests/backtestFillModel.test.ts`, `apps/api/src/modules/backtests/backtestIndicatorTimelineSeries.test.ts`, `apps/api/src/modules/backtests/backtestParity3Symbols.test.ts`, `apps/api/src/modules/backtests/backtestPatternParityFixtures.test.ts`, `apps/api/src/modules/backtests/backtestRange.service.test.ts`, `apps/api/src/modules/backtests/backtestReplayCore.test.ts`, `apps/api/src/modules/backtests/backtestRunJob.test.ts`, `apps/api/src/modules/backtests/backtestRunQueue.test.ts`, `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts`, `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- Notes: Local API/Web proof covers CRUD, export/import, ownership, active-bot guards, clone payloads, config validation, presets, indicators, and form mapping. Production-safe browser clickthrough and representative runtime/backtest compatibility proof remain open. Do not delete the preserved RSI 20/80 strategy.

### 10. Manual Orders (PASS_LOCAL)

- Risk: P0 money-impacting order flow
- Action family: place PAPER order, validation, preview/context, cancel/close paths
- Required proof: UI action + API + DB readback
- Next proof: Production-safe Manual Orders clickthrough for PAPER place/cancel/close with DB readback; LIVE remains blocked-risk without an explicit safe plan.
- API modules: orders, bots, wallets, exchange, positions
- Web features: orders, dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`, `apps/api/src/modules/bots/bots.orchestration.e2e.test.ts`, `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- Notes: Local API/Web proof covers manual context, PAPER placement, validation, lifecycle readback, cancel/close, selected-bot scope, open-order actions, and blocked/action states. Production-safe browser clickthrough remains open; LIVE order actions are `BLOCKED_RISK` without an explicit safe plan.

### 11. Positions (PASS_LOCAL)

- Risk: P0 position ownership/runtime truth
- Action family: list, close, update, takeover, import status, live reconciliation
- Required proof: UI/API action proof + exchange snapshot boundary
- Next proof: Production-safe Positions clickthrough for list/close/update/takeover/import-status with exchange snapshot boundary; live mutation remains blocked-risk without explicit safe plan.
- API modules: positions, bots, orders, exchange
- Web features: positions, dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:liveimport:readback`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`, `apps/api/src/modules/bots/bots.orchestration.e2e.test.ts`, `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- Notes: Local API/Web proof covers list/read, close/update, takeover, exchange snapshots, live status/reconciliation, orphan repair, imported history, and runtime position close UI states. Production-safe browser clickthrough remains open; LIVE exchange mutation requires explicit safe plan.

### 12. Orders (PASS_LOCAL)

- Risk: P0 order lifecycle
- Action family: list, cancel, exchange-backed cancel, order fills, fees
- Required proof: UI/API action proof + adapter boundary
- Next proof: Production-safe Orders clickthrough for list/cancel/fill/fee readback through API and adapter boundary; live mutation remains blocked-risk without explicit safe plan.
- API modules: orders, exchange, positions, bots
- Web features: orders, dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`, `apps/api/src/modules/bots/bots.orchestration.e2e.test.ts`, `apps/api/src/modules/bots/bots.portfolio-history.e2e.test.ts`
- Notes: Local API/Web proof covers list/read/open/cancel/close, active filtering, exchange-backed cancel boundary, fills, fees, exchange events, source labels, and cancel actions. Production-safe browser clickthrough remains open; live mutation remains blocked-risk without explicit safe plan.

### 13. Backtests (PASS_LOCAL)

- Risk: P1 simulation correctness
- Action family: create run, cancel/delete/view details, reports/timeline
- Required proof: UI action + worker/result readback
- Next proof: Production-safe Backtests browser clickthrough for create/delete/details/report/timeline on approved representative RSI strategy and market data.
- API modules: backtests, strategies, market-data
- Web features: backtest
- Routes: /dashboard/backtests/[id], /dashboard/backtests/create, /dashboard/backtests/list
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/backtest.worker.ts`
- Candidate tests: `apps/api/src/modules/backtests/backtestDataGateway.test.ts`, `apps/api/src/modules/backtests/backtestFillModel.test.ts`, `apps/api/src/modules/backtests/backtestIndicatorTimelineSeries.test.ts`, `apps/api/src/modules/backtests/backtestParity3Symbols.test.ts`, `apps/api/src/modules/backtests/backtestPatternParityFixtures.test.ts`, `apps/api/src/modules/backtests/backtestRange.service.test.ts`, `apps/api/src/modules/backtests/backtestReplayCore.test.ts`, `apps/api/src/modules/backtests/backtestRunJob.test.ts`, `apps/api/src/modules/backtests/backtestRunQueue.test.ts`, `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts`, `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- Notes: Local API/Web proof covers create/list/get/delete, explicit ranges, pending reports, worker/job persistence, replay, parity, route shells, create/list/details UI, table actions, hooks, and timeline/report utilities. Production-safe browser clickthrough remains open.

### 14. Reports (PASS_LOCAL)

- Risk: P2 operator reporting
- Action family: summaries, cross-mode performance, per-run report table, export/download if present
- Required proof: UI action + API data proof
- Next proof: Production-safe Reports browser clickthrough for summaries, cross-mode performance, and per-run report readback on approved data.
- API modules: reports, backtests, bots, wallets
- Web features: reports
- Routes: /dashboard/reports
- Candidate scripts: `build`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/backtests/backtestDataGateway.test.ts`, `apps/api/src/modules/backtests/backtestFillModel.test.ts`, `apps/api/src/modules/backtests/backtestIndicatorTimelineSeries.test.ts`, `apps/api/src/modules/backtests/backtestParity3Symbols.test.ts`, `apps/api/src/modules/backtests/backtestPatternParityFixtures.test.ts`, `apps/api/src/modules/backtests/backtestRange.service.test.ts`, `apps/api/src/modules/backtests/backtestReplayCore.test.ts`, `apps/api/src/modules/backtests/backtestRunJob.test.ts`, `apps/api/src/modules/backtests/backtestRunQueue.test.ts`, `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts`, `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- Notes: Local API/Web proof covers cross-mode performance aggregation, weighted win rate, PAPER trade aggregation, route shell, empty/success states, aggregated cards/tables, and route-reachable locale copy. Production-safe browser clickthrough remains open; export/download is not part of the current implemented Reports surface.

### 15. Subscriptions/Admin (PASS_LOCAL)

- Risk: P0 role/entitlement access
- Action family: entitlement gates, admin user view/actions
- Required proof: protected UI + API ownership checks
- Next proof: Production admin clickthrough with approved non-destructive data and entitlement checks.
- API modules: admin, subscriptions, users
- Web features: admin
- Routes: /admin, /admin/subscriptions, /admin/users
- Candidate scripts: `build`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`, `apps/api/src/modules/admin/users/users.e2e.test.ts`, `apps/api/src/modules/subscriptions/subscriptionEntitlements.service.test.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.test.ts`, `apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx`, `apps/web/src/features/admin/users/pages/AdminUsersPage.test.tsx`
- Notes: Local API/Web/admin route proof covers role fail-closed behavior, plan catalog, entitlement validation, user list metadata, role/plan actions, self-demotion guard, and rendered admin pages. Production admin clickthrough remains open.

### 16. Logs/Audit Trail (PASS_LOCAL)

- Risk: P1 auditability
- Action family: filters, pagination, action log visibility
- Required proof: UI action + API ownership proof
- Next proof: Production-safe Logs/Audit Trail browser clickthrough for filters, pagination, action-produced events, and metadata trace inspection.
- API modules: logs
- Web features: logs
- Routes: /dashboard/logs
- Candidate scripts: `build`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/logs/logs.e2e.test.ts`, `apps/web/src/app/dashboard/logs/page.test.tsx`, `apps/web/src/features/logs/components/AuditTrailView.test.tsx`
- Notes: Local API/Web proof covers authenticated rejection, owner-only reads, source/actor/severity filters, pagination defaults/bounds, action-produced audit event visibility, route shell, empty/loaded states, severity filtering, metadata trace rendering, and route-reachable locale copy. Production-safe browser clickthrough remains open.

### 17. Exchange Adapter (PASS_LOCAL)

- Risk: P0 external exchange boundary
- Action family: Binance/Gate.io capabilities, public data, authenticated reads, submit/cancel
- Required proof: adapter contract tests + fail-closed proofs
- Next proof: Production-safe exchange-boundary proof for approved real credentials or read-only adapter operations; live mutation remains blocked-risk without explicit safe plan.
- API modules: exchange, profile, orders, positions, wallets, market-stream
- Web features: exchanges, profile, dashboard-home
- Routes: /dashboard/exchanges, /dashboard, /dashboard/profile
- Candidate scripts: `go-live:infra:down`, `go-live:infra:up`, `ops:exchange:gateio-market-stream-smoke`, `ops:live:controlled-proof`, `ops:liveimport:readback`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts`, `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`, `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`
- Notes: Local API/Web proof covers capability boundaries, public catalog/read paths, authenticated read support contracts, API-key probes, connector factories, registry behavior, live order adapter retry/fill/fee boundaries, symbol rules, metadata contracts, snapshot normalization, runtime exchange order guards, and UI capability/redirect/profile integration. Real live execution remains outside local proof.

### 18. Workers (PASS_LOCAL)

- Risk: P0 async runtime reliability
- Action family: runtime loops, market stream, backtest worker, scheduler lifecycle
- Required proof: process health + action result proof
- Next proof: Production-safe protected worker/process proof for health, readiness, runtime freshness, queue/process lifecycle, and observability on the deployed target.
- API modules: engine, market-stream, backtests, bots
- Web features: dashboard-home, bots
- Routes: /dashboard/bots/[id]/runtime, /dashboard/bots/runtime, /dashboard
- Candidate scripts: `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:rollback-guard`, `ops:deploy:rollback-proof`, `ops:deploy:rollback-proof:prod`, `ops:deploy:rollback-proof:stage`, `ops:deploy:runtime-freshness`, `ops:deploy:smoke`, `ops:deploy:wait-web-build-info`, `ops:live:controlled-proof`, `ops:liveimport:readback`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`
- Candidate workers: `apps/api/src/workers/backtest.worker.ts`, `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/backtests/backtestDataGateway.test.ts`, `apps/api/src/modules/backtests/backtestFillModel.test.ts`, `apps/api/src/modules/backtests/backtestIndicatorTimelineSeries.test.ts`, `apps/api/src/modules/backtests/backtestParity3Symbols.test.ts`, `apps/api/src/modules/backtests/backtestPatternParityFixtures.test.ts`, `apps/api/src/modules/backtests/backtestRange.service.test.ts`, `apps/api/src/modules/backtests/backtestReplayCore.test.ts`, `apps/api/src/modules/backtests/backtestRunJob.test.ts`, `apps/api/src/modules/backtests/backtestRunQueue.test.ts`, `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts`, `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- Notes: Local API proof covers worker ownership/topology, protected `/workers/health`, split/inline `/workers/ready`, `/workers/runtime-freshness` pass/fail/skip behavior, `/ready` diagnostics, market-stream contracts/fanout/polling/binance source behavior, queue tuning, backtest job execution, execution orchestrator parity/import handling, and runtime-flow worker telemetry. Production-safe protected worker/process proof remains open.

### 19. Operations (BLOCKED_AUTH)

- Risk: P0 release safety
- Action family: deploy, rollback, restore, release gate, SLO, alerts
- Required proof: existing ops proofs + protected evidence
- Next proof: Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence.
- API modules: engine, bots
- Web features: admin
- Routes: /admin, /admin/subscriptions, /admin/users
- Candidate scripts: `ops:db:backup-restore:check-local`, `ops:db:backup-verify`, `ops:db:backup-verify:local`, `ops:db:backup-verify:prod`, `ops:db:backup-verify:stage`, `ops:db:restore-drill`, `ops:db:restore-drill:local`, `ops:db:restore-drill:prod`, `ops:db:restore-drill:stage`, `ops:deploy:rollback-guard`, `ops:deploy:rollback-proof`, `ops:deploy:rollback-proof:prod`, `ops:deploy:rollback-proof:stage`, `ops:deploy:runtime-freshness`, `ops:deploy:smoke`, `ops:deploy:wait-web-build-info`, `ops:liveimport:readback`, `ops:rc:checklist:sync`, `ops:rc:gates:evidence:check`, `ops:rc:gates:evidence:check:strict:prod`, `ops:rc:gates:local-pipeline`, `ops:rc:gates:local-pipeline:strict`, `ops:rc:gates:local-pipeline:strict:prod`, `ops:rc:gates:prod-pipeline`, `ops:rc:gates:refresh`, `ops:rc:gates:refresh:strict`, `ops:rc:gates:refresh:strict:prod`, `ops:rc:gates:refresh:summary`, `ops:rc:gates:refresh:summary:strict`, `ops:rc:gates:refresh:summary:strict:prod`, `ops:rc:gates:status`, `ops:rc:gates:summary`, `ops:rc:signoff:build`, `ops:release:v1:gate`, `ops:release:v1:preflight`, `ops:release:v1:stage-rehearsal`, `ops:slo:collect`, `ops:slo:window-report`
- Candidate workers: `apps/api/src/workers/backtest.worker.ts`, `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`, `apps/api/src/modules/admin/users/users.e2e.test.ts`, `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`
- Notes: Local protected proof now covers rollback proof PASS, short SLO collection/window report, RC gate status/evidence check with Gate 4 sign-off blocked, local release gate PASS with deploy smoke/runtime freshness/rollback guard, and alert absence through rollback guard. Final V1 still requires production/stage rollback proof, LIVEIMPORT-03 readback on a running LIVE/import session, approved sign-off, and production-safe SLO/release gate evidence.

### 20. Security/Privacy (PASS_LOCAL)

- Risk: P0 auth/secrets/data isolation
- Action family: ownership isolation, rate limits, secret redaction, fail-closed errors
- Required proof: focused tests + production-safe probes
- Next proof: Production-safe protected security proof for auth, ownership isolation, rate-limit, secret redaction, fail-closed errors, and abuse cases on an approved deployed target; external security review remains open.
- API modules: auth, isolation, profile, admin, subscriptions
- Web features: auth, admin, profile
- Routes: /auth/login, /auth/register, /admin, /admin/subscriptions, /admin/users, /dashboard/profile
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/middleware/requireAuth.test.ts`, `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`, `apps/api/src/modules/admin/users/users.e2e.test.ts`, `apps/api/src/modules/auth/auth.cookie.test.ts`, `apps/api/src/modules/auth/auth.e2e.test.ts`, `apps/api/src/modules/auth/auth.errors.test.ts`, `apps/api/src/modules/auth/auth.jwt.test.ts`, `apps/api/src/modules/auth/auth.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/isolation/data-isolation.e2e.test.ts`, `apps/api/src/modules/positions/positions.authenticatedSnapshots.service.test.ts`
- Notes: Local API/Web proof covers action-level abuse, fail-closed, secret, and ownership cases. Production-safe protected security proof and external review remain open.

### 21. UX/A11y/Mobile (PASS_LOCAL)

- Risk: P1 product usability
- Action family: loading, empty, error, success, keyboard/touch, responsive states
- Required proof: browser screenshots/clickthrough
- Next proof: Production browser clickthrough and external accessibility review for per-screen loading/empty/error/success, keyboard/touch, responsive, and accessibility evidence.
- API modules: none
- Web features: dashboard-home, bots, wallets, markets, strategies, backtest, profile
- Routes: /dashboard/backtests/[id], /dashboard/backtests/create, /dashboard/backtests/list, /dashboard/bots/[id]/assistant, /dashboard/bots/[id]/edit, /dashboard/bots/[id], /dashboard/bots/[id]/preview, /dashboard/bots/[id]/runtime, /dashboard/bots/assistant, /dashboard/bots/create, /dashboard/bots/new, /dashboard/bots, /dashboard/bots/runtime, /dashboard/exchanges, /dashboard/logs, /dashboard/markets/[id]/edit, /dashboard/markets/create, /dashboard/markets/list, /dashboard, /dashboard/profile, /dashboard/reports, /dashboard/strategies/[id]/edit, /dashboard/strategies/[id], /dashboard/strategies/create, /dashboard/strategies/list, /dashboard/wallets/[id]/edit, /dashboard/wallets/[id], /dashboard/wallets/[id]/preview, /dashboard/wallets/create, /dashboard/wallets/list, /dashboard/wallets
- Candidate scripts: `build`, `i18n:audit:route-reachable:web`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/backtests/backtestDataGateway.test.ts`, `apps/api/src/modules/backtests/backtestFillModel.test.ts`, `apps/api/src/modules/backtests/backtestIndicatorTimelineSeries.test.ts`, `apps/api/src/modules/backtests/backtestParity3Symbols.test.ts`, `apps/api/src/modules/backtests/backtestPatternParityFixtures.test.ts`, `apps/api/src/modules/backtests/backtestRange.service.test.ts`, `apps/api/src/modules/backtests/backtestReplayCore.test.ts`, `apps/api/src/modules/backtests/backtestRunJob.test.ts`, `apps/api/src/modules/backtests/backtestRunQueue.test.ts`, `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts`, `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- Notes: Local route audit, focused Web state/a11y tests, desktop/mobile screenshots, mobile menu interaction, and console proof passed. Production clickthrough and external accessibility review remain open.


## API Modules

| Module | Route files | Controller files | Service files | Test files | TS files |
| --- | ---: | ---: | ---: | ---: | ---: |
| admin | 2 | 2 | 2 | 2 | 10 |
| auth | 1 | 1 | 2 | 5 | 14 |
| backtests | 1 | 1 | 5 | 12 | 27 |
| bots | 1 | 1 | 51 | 28 | 82 |
| engine | 0 | 0 | 44 | 45 | 105 |
| exchange | 0 | 0 | 34 | 16 | 38 |
| icons | 1 | 1 | 1 | 1 | 5 |
| isolation | 0 | 0 | 0 | 1 | 1 |
| logs | 1 | 1 | 1 | 1 | 5 |
| market-data | 0 | 0 | 4 | 2 | 6 |
| market-stream | 1 | 0 | 4 | 6 | 11 |
| markets | 1 | 1 | 2 | 1 | 7 |
| orders | 1 | 1 | 7 | 10 | 22 |
| pagination | 0 | 0 | 0 | 1 | 1 |
| positions | 1 | 1 | 7 | 11 | 27 |
| profile | 4 | 4 | 6 | 6 | 24 |
| reports | 1 | 1 | 2 | 1 | 4 |
| strategies | 2 | 2 | 3 | 3 | 12 |
| subscriptions | 0 | 0 | 4 | 1 | 9 |
| upload | 1 | 0 | 0 | 1 | 2 |
| users | 0 | 0 | 0 | 0 | 1 |
| wallets | 1 | 1 | 5 | 4 | 11 |

## Web Features

| Feature | Component-like files | Test files | TS/TSX files |
| --- | ---: | ---: | ---: |
| admin | 4 | 2 | 9 |
| auth | 13 | 5 | 15 |
| backtest | 16 | 10 | 29 |
| bots | 19 | 10 | 34 |
| dashboard-home | 35 | 22 | 41 |
| exchanges | 2 | 2 | 4 |
| icons | 0 | 0 | 3 |
| logs | 2 | 1 | 4 |
| markets | 5 | 2 | 8 |
| orders | 0 | 0 | 0 |
| positions | 0 | 0 | 1 |
| profile | 12 | 5 | 22 |
| reports | 2 | 1 | 3 |
| shared | 2 | 2 | 4 |
| strategies | 17 | 10 | 29 |
| wallets | 9 | 3 | 11 |

## Web Routes

- /auth/login (apps/web/src/app/(public)/auth/login/page.tsx)
- /auth/register (apps/web/src/app/(public)/auth/register/page.tsx)
- / (apps/web/src/app/(public)/page.tsx)
- /admin (apps/web/src/app/admin/page.tsx)
- /admin/subscriptions (apps/web/src/app/admin/subscriptions/page.tsx)
- /admin/users (apps/web/src/app/admin/users/page.tsx)
- /dashboard/backtests/[id] (apps/web/src/app/dashboard/backtests/[id]/page.tsx)
- /dashboard/backtests/create (apps/web/src/app/dashboard/backtests/create/page.tsx)
- /dashboard/backtests/list (apps/web/src/app/dashboard/backtests/list/page.tsx)
- /dashboard/bots/[id]/assistant (apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx)
- /dashboard/bots/[id]/edit (apps/web/src/app/dashboard/bots/[id]/edit/page.tsx)
- /dashboard/bots/[id] (apps/web/src/app/dashboard/bots/[id]/page.tsx)
- /dashboard/bots/[id]/preview (apps/web/src/app/dashboard/bots/[id]/preview/page.tsx)
- /dashboard/bots/[id]/runtime (apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx)
- /dashboard/bots/assistant (apps/web/src/app/dashboard/bots/assistant/page.tsx)
- /dashboard/bots/create (apps/web/src/app/dashboard/bots/create/page.tsx)
- /dashboard/bots/new (apps/web/src/app/dashboard/bots/new/page.tsx)
- /dashboard/bots (apps/web/src/app/dashboard/bots/page.tsx)
- /dashboard/bots/runtime (apps/web/src/app/dashboard/bots/runtime/page.tsx)
- /dashboard/exchanges (apps/web/src/app/dashboard/exchanges/page.tsx)
- /dashboard/logs (apps/web/src/app/dashboard/logs/page.tsx)
- /dashboard/markets/[id]/edit (apps/web/src/app/dashboard/markets/[id]/edit/page.tsx)
- /dashboard/markets/create (apps/web/src/app/dashboard/markets/create/page.tsx)
- /dashboard/markets/list (apps/web/src/app/dashboard/markets/list/page.tsx)
- /dashboard (apps/web/src/app/dashboard/page.tsx)
- /dashboard/profile (apps/web/src/app/dashboard/profile/page.tsx)
- /dashboard/reports (apps/web/src/app/dashboard/reports/page.tsx)
- /dashboard/strategies/[id]/edit (apps/web/src/app/dashboard/strategies/[id]/edit/page.tsx)
- /dashboard/strategies/[id] (apps/web/src/app/dashboard/strategies/[id]/page.tsx)
- /dashboard/strategies/create (apps/web/src/app/dashboard/strategies/create/page.tsx)
- /dashboard/strategies/list (apps/web/src/app/dashboard/strategies/list/page.tsx)
- /dashboard/wallets/[id]/edit (apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx)
- /dashboard/wallets/[id] (apps/web/src/app/dashboard/wallets/[id]/page.tsx)
- /dashboard/wallets/[id]/preview (apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx)
- /dashboard/wallets/create (apps/web/src/app/dashboard/wallets/create/page.tsx)
- /dashboard/wallets/list (apps/web/src/app/dashboard/wallets/list/page.tsx)
- /dashboard/wallets (apps/web/src/app/dashboard/wallets/page.tsx)
- /offline (apps/web/src/app/offline/page.tsx)

## Workers

- `apps/api/src/workers/backtest.worker.ts`
- `apps/api/src/workers/execution.worker.ts`
- `apps/api/src/workers/marketData.worker.ts`
- `apps/api/src/workers/marketStream.worker.ts`
- `apps/api/src/workers/marketStreamSubscriptions.service.ts`
- `apps/api/src/workers/marketStreamWorkerConfig.ts`
- `apps/api/src/workers/workerBootstrap.ts`
- `apps/api/src/workers/workerOwnership.ts`

## Test Inventory

- Total test/spec files: 331
- API tests: 181
- Web tests: 148
- Script tests: 2
- Other tests: 0

## Package Scripts

- `api/dev`
- `backend:dev`
- `backend/dev`
- `build`
- `client/dev`
- `docs:parity:check`
- `frontend:dev`
- `frontend/dev`
- `go-live:infra:down`
- `go-live:infra:up`
- `i18n:audit:route-reachable:web`
- `lint`
- `ops:cutover:dry-run`
- `ops:data:backfill:venue-context`
- `ops:data:backfill:venue-context:dry`
- `ops:db:backup-restore:check-local`
- `ops:db:backup-verify`
- `ops:db:backup-verify:local`
- `ops:db:backup-verify:prod`
- `ops:db:backup-verify:stage`
- `ops:db:restore-drill`
- `ops:db:restore-drill:local`
- `ops:db:restore-drill:prod`
- `ops:db:restore-drill:stage`
- `ops:deploy:rollback-guard`
- `ops:deploy:rollback-proof`
- `ops:deploy:rollback-proof:prod`
- `ops:deploy:rollback-proof:stage`
- `ops:deploy:runtime-freshness`
- `ops:deploy:smoke`
- `ops:deploy:wait-web-build-info`
- `ops:exchange:gateio-market-stream-smoke`
- `ops:live:controlled-proof`
- `ops:liveimport:readback`
- `ops:project:index`
- `ops:project:ledger`
- `ops:project:scan`
- `ops:project:scorecard`
- `ops:rc:checklist:sync`
- `ops:rc:gates:evidence:check`
- `ops:rc:gates:evidence:check:strict:prod`
- `ops:rc:gates:local-pipeline`
- `ops:rc:gates:local-pipeline:strict`
- `ops:rc:gates:local-pipeline:strict:prod`
- `ops:rc:gates:prod-pipeline`
- `ops:rc:gates:refresh`
- `ops:rc:gates:refresh:strict`
- `ops:rc:gates:refresh:strict:prod`
- `ops:rc:gates:refresh:summary`
- `ops:rc:gates:refresh:summary:strict`
- `ops:rc:gates:refresh:summary:strict:prod`
- `ops:rc:gates:status`
- `ops:rc:gates:summary`
- `ops:rc:signoff:build`
- `ops:release:v1:gate`
- `ops:release:v1:preflight`
- `ops:release:v1:stage-rehearsal`
- `ops:slo:collect`
- `ops:slo:window-report`
- `ops:ui:prod-clickthrough`
- `prod-like:start`
- `prod-like/start`
- `quality:guardrails`
- `server/dev`
- `test`
- `test:bot:v2:baseline`
- `test:go-live:api`
- `test:go-live:api:with-infra`
- `test:go-live:client`
- `test:go-live:server`
- `test:go-live:server:with-infra`
- `test:go-live:smoke`
- `test:go-live:web`
- `typecheck`
- `web:verify:build-typecheck`
- `web/dev`
- `workers:dev`
- `workers:prod`
- `workers/dev`
- `workers/prod`

## Open Queue Markers

Showing up to 40 unchecked markers from the canonical queue sources.

- .codex/context/TASK_BOARD.md:772 - [ ] `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10 release: capture guarded LIVE runtime session readback`
- .codex/context/TASK_BOARD.md:5294 - [ ] `LIVEIMPORT-03 release(prod): read back imported ETH/DOGE provenance on current production`
- docs/planning/mvp-next-commits.md:678 - [ ] `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10 release: capture guarded LIVE runtime session readback`
- docs/planning/mvp-next-commits.md:4747 - [ ] `LIVEIMPORT-03 release(prod): read back imported ETH/DOGE provenance on current production`

## Architecture And Module Sources

- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/02_system-topology.md`
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/05_strategy-signal-and-decision-flow.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/07_modes-parity-and-data.md`
- `docs/architecture/08_operator-surfaces-and-routing.md`
- `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- `docs/architecture/10_safety-entitlements-and-risk.md`
- `docs/architecture/11_assistant-runtime.md`
- `docs/architecture/12_documentation-governance.md`
- `docs/architecture/architecture-source-of-truth.md`
- `docs/architecture/archive/architecture-maintainability-closure-2026-04-19.md`
- `docs/architecture/archive/bot-v2-create-update-contract.md`
- `docs/architecture/archive/database.md`
- `docs/architecture/archive/legacy-cryptobot-positions-analysis.md`
- `docs/architecture/archive/modules.md`
- `docs/architecture/archive/post-remediation-architecture-delta-2026-04-09.md`
- `docs/architecture/archive/README.md`
- `docs/architecture/archive/runtime-critical-path-decomposition-contract.md`
- `docs/architecture/archive/system-architecture.md`
- `docs/architecture/archive/tech-stack.md`
- `docs/architecture/archive/trading-logic.md`
- `docs/architecture/codebase-map.md`
- `docs/architecture/README.md`
- `docs/architecture/reference/admin-frontend-architecture.md`
- `docs/architecture/reference/app-shell-template-split-contract.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `docs/architecture/reference/coin-icon-source-contract.md`
- `docs/architecture/reference/dashboard-loading-ux-contract.md`
- `docs/architecture/reference/dashboard-route-map.md`
- `docs/architecture/reference/dashboard-signal-panel-ia-contract.md`
- `docs/architecture/reference/dashboard-trade-history-financial-semantics-contract.md`
- `docs/architecture/reference/dca-ladder-display-contract.md`
- `docs/architecture/reference/dynamic-stop-display-contract.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/indicator-registry-parity-contract.md`
- `docs/architecture/reference/live-exchange-protection-order-contract.md`
- `docs/architecture/reference/live-fee-reconciliation-contract.md`
- `docs/architecture/reference/live-futures-lifecycle-price-contract.md`
- `docs/architecture/reference/live-paper-runtime-safety-contract.md`
- `docs/architecture/reference/live-position-restart-continuity-contract.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- `docs/architecture/reference/maintainability-remediation-contract.md`
- `docs/architecture/reference/numeric-input-policy.md`
- `docs/architecture/reference/position-close-attribution-contract.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- `docs/architecture/reference/README.md`
- `docs/architecture/reference/runtime-execution-idempotency-contract.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`
- `docs/architecture/reference/strategy-evaluation-parity-contract.md`
- `docs/architecture/reference/stream-transport-contract.md`
- `docs/architecture/reference/subscription-tier-entitlements-contract.md`
- `docs/architecture/reference/v1-production-activation-contract.md`
- `docs/architecture/reference/venue-context-source-of-truth-contract.md`
- `docs/architecture/reference/wallet-source-of-truth-contract.md`
- `docs/architecture/reference/web-container-split-contract.md`
- `docs/architecture/traceability-matrix.md`
- `docs/modules/api-admin.md`
- `docs/modules/api-auth.md`
- `docs/modules/api-backtests.md`
- `docs/modules/api-bots.md`
- `docs/modules/api-engine.md`
- `docs/modules/api-exchange.md`
- `docs/modules/api-icons.md`
- `docs/modules/api-isolation.md`
- `docs/modules/api-logs.md`
- `docs/modules/api-market-data.md`
- `docs/modules/api-market-stream.md`
- `docs/modules/api-markets.md`
- `docs/modules/api-orders.md`
- `docs/modules/api-pagination.md`
- `docs/modules/api-positions.md`
- `docs/modules/api-profile.md`
- `docs/modules/api-reports.md`
- `docs/modules/api-strategies.md`
- `docs/modules/api-subscriptions.md`
- `docs/modules/api-upload.md`
- `docs/modules/api-users.md`
- `docs/modules/api-wallets.md`
- `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`
- `docs/modules/documentation-coverage-audit-2026-04-12.md`
- `docs/modules/index.md`
- `docs/modules/module-deep-dive-template.md`
- `docs/modules/module-doc-status-index.md`
- `docs/modules/README.md`
- `docs/modules/system-modules.md`
- `docs/modules/web-admin.md`
- `docs/modules/web-auth.md`
- `docs/modules/web-backtest.md`
- `docs/modules/web-bots.md`
- `docs/modules/web-dashboard-home.md`
- `docs/modules/web-exchanges.md`
- `docs/modules/web-icons.md`
- `docs/modules/web-logs.md`
- `docs/modules/web-markets.md`
- `docs/modules/web-orders.md`
- `docs/modules/web-positions.md`
- `docs/modules/web-profile.md`
- `docs/modules/web-reports.md`
- `docs/modules/web-shared.md`
- `docs/modules/web-strategies.md`
- `docs/modules/web-wallets.md`

## Use In Next Work

1. Pick one V1 matrix row that is not `PASS`.
2. Use this index to find the matching API module, Web feature, route, tests,
   and worker surface.
3. Add focused evidence before calling the row complete.
4. Update the V1 matrix and task/context state after the slice.
