# Project Index

Generated at: 2026-05-14T17:21:31.146Z
Evidence date: 2026-05-14

## Purpose

This index is a local, no-network map of the current Soar repository. It is not
V1 approval evidence. Use it as the starting point for module-by-module audits
and fixes.

## V1 Product Action Matrix

Source: `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`

- PASS: 21

## V1 Audit Work Map

This table is the working map for finishing V1. It connects each matrix row to
the likely code and validation surfaces. The priority is audit order, not
business value.

| Priority | V1 row | Status | Risk | API | Web | Routes | Candidate tests | Next proof |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Dashboard Home | PASS | P0 operator truth surface | 5 | 1 | 1 | 30 | Rendered/browser proof for selected bot, wallet KPIs, tables, loading/empty/error, responsive states, and safe clickthrough. |
| 2 | Bot Runtime | PASS | P0 runtime truth | 5 | 2 | 2 | 30 | Production-safe Bot Runtime clickthrough on approved representative data. |
| 3 | Auth | PASS | P0 auth/session correctness | 1 | 1 | 2 | 16 | Production-safe browser Auth clickthrough for login, logout, and expired-session redirect. |
| 4 | Profile API Keys | PASS | P0 secrets/exchange access | 3 | 2 | 2 | 30 | Production-safe Profile API Keys clickthrough for create, test, delete, and audit log visibility. |
| 5 | Bots | PASS | P0 bot lifecycle | 5 | 1 | 10 | 30 | Production-safe non-destructive clickthrough for bot actions; local action proof already exists. |
| 6 | Profile | PASS | P1 user settings and validation | 1 | 1 | 1 | 12 | Production-safe Profile browser clickthrough for basic profile save and password/security update. |
| 7 | Wallets | PASS | P1 capital source of truth | 3 | 1 | 6 | 30 | Production-safe Wallets clickthrough for create/edit/delete/reset/preview on approved fixture data. |
| 8 | Markets | PASS | P1 runtime symbol scope | 4 | 1 | 3 | 30 | Production-safe Markets clickthrough for universe create/edit/delete, catalog import, and active-bot guard messaging. |
| 9 | Strategies | PASS | P1 trading decision config | 3 | 1 | 4 | 30 | Production-safe Strategies clickthrough for create/edit/delete/clone/config validation, preserving RSI 20/80, plus representative runtime/backtest compatibility proof. |
| 10 | Manual Orders | PASS | P0 money-impacting order flow | 5 | 2 | 1 | 30 | Production-safe Manual Orders clickthrough for PAPER place/cancel/close with DB readback; LIVE remains blocked-risk without an explicit safe plan. |
| 11 | Positions | PASS | P0 position ownership/runtime truth | 4 | 2 | 1 | 30 | Production-safe Positions clickthrough for list/close/update/takeover/import-status with exchange snapshot boundary; live mutation remains blocked-risk without explicit safe plan. |
| 12 | Orders | PASS | P0 order lifecycle | 4 | 2 | 1 | 30 | Production-safe Orders clickthrough for list/cancel/fill/fee readback through API and adapter boundary; live mutation remains blocked-risk without explicit safe plan. |
| 13 | Backtests | PASS | P1 simulation correctness | 3 | 1 | 3 | 30 | Production-safe Backtests browser clickthrough for create/delete/details/report/timeline on approved representative RSI strategy and market data. |
| 14 | Reports | PASS | P2 operator reporting | 4 | 1 | 1 | 30 | Production-safe Reports browser clickthrough for summaries, cross-mode performance, and per-run report readback on approved data. |
| 15 | Subscriptions/Admin | PASS | P0 role/entitlement access | 3 | 1 | 3 | 6 | Production admin clickthrough with approved non-destructive data and entitlement checks. |
| 16 | Logs/Audit Trail | PASS | P1 auditability | 1 | 1 | 1 | 3 | Production-safe Logs/Audit Trail browser clickthrough for filters, pagination, action-produced events, and metadata trace inspection. |
| 17 | Exchange Adapter | PASS | P0 external exchange boundary | 6 | 3 | 3 | 30 | Production-safe exchange-boundary proof for approved real credentials or read-only adapter operations; live mutation remains blocked-risk without explicit safe plan. |
| 18 | Workers | PASS | P0 async runtime reliability | 4 | 2 | 3 | 30 | Production-safe protected worker/process proof for health, readiness, runtime freshness, queue/process lifecycle, and observability on the deployed target. |
| 19 | Operations | PASS | P0 release safety | 2 | 1 | 3 | 30 | Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence. |
| 20 | Security/Privacy | PASS | P0 auth/secrets/data isolation | 5 | 3 | 6 | 30 | Production-safe protected security proof for auth, ownership isolation, rate-limit, secret redaction, fail-closed errors, and abuse cases on an approved deployed target; external security review remains open. |
| 21 | UX/A11y/Mobile | PASS | P1 product usability | 0 | 7 | 31 | 30 | Production browser clickthrough and external accessibility review for per-screen loading/empty/error/success, keyboard/touch, responsive, and accessibility evidence. |

## V1 Audit Work Details

### 1. Dashboard Home (PASS)

- Risk: P0 operator truth surface
- Action family: selected bot, loading/error/empty states, wallet KPIs, positions/orders/trades tables, TTP/TSL/DCA/PnL rendering
- Required proof: UI table assertions + runtime payload fixtures + browser screenshots
- Next proof: Rendered/browser proof for selected bot, wallet KPIs, tables, loading/empty/error, responsive states, and safe clickthrough.
- API modules: bots, orders, positions, wallets, reports
- Web features: dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`
- Notes: Runtime table presenter proof covers negative/zero/positive protection semantics, DCA/fees/history/trade metadata, blocked position actions, and order cancelability. Rendered `HomeLiveWidgets` proof covers negative-PnL prospective TTP suppression, loading state, retryable error state, selected-bot switching, wallet KPI recalculation, open-orders tab rows, and trade-history tab rows. Local browser proof covers authenticated empty/onboarding state on desktop and mobile, keyboard focus, active PAPER snapshot runtime rows, wallet KPIs, desktop/tablet/mobile visibility, and Orders tab interaction through the API aggregate contract. 2026-05-14 production proof for deployed `457bce05` adds authenticated `/dashboard` route reachability and live production runtime readback for both PAPER bots plus controlled Binance LIVE observation. Evidence: `docs/planning/v1-production-dashboard-runtime-action-proof-457bce05-2026-05-14-task.md`.

### 2. Bot Runtime (PASS)

- Risk: P0 runtime truth
- Action family: runtime graph, sessions, symbol stats, open positions, open orders, trades
- Required proof: UI table proof + API + worker telemetry
- Next proof: Production-safe Bot Runtime clickthrough on approved representative data.
- API modules: bots, engine, orders, positions, market-stream
- Web features: bots, dashboard-home
- Routes: /dashboard/bots/[id]/runtime, /dashboard/bots/runtime
- Candidate scripts: `go-live:infra:down`, `go-live:infra:up`, `ops:live:controlled-proof`, `ops:liveimport:readback`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`
- Notes: Runtime table presenters cover open-position PnL/TTP/TSL/actionability and open-order cancelability locally. The canonical Bot Runtime route has local authenticated running/completed PAPER proof, API readbacks, desktop/tablet/mobile screenshots, safe view switch, completed-session filter, and legacy redirects. Worker telemetry/live-loop proof passes through the real runtime signal loop and authenticated Bot Runtime read APIs. 2026-05-14 production proof for deployed `457bce05` adds authenticated UI route reachability plus runtime readback: both active Binance PAPER bots expose fresh RUNNING sessions, symbol stats, positions, trades, and aggregate data; controlled no-order-guard Binance LIVE proof exposes a RUNNING LIVE session and `LIVEIMPORT-03` readback for `TRXUSDT`; post-cleanup readback confirms the LIVE bot is inactive again. Evidence: `docs/planning/v1-production-dashboard-runtime-action-proof-457bce05-2026-05-14-task.md`.

### 3. Auth (PASS)

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
- Notes: Local API lifecycle proof covers registration/login cookie TTLs, logout cookie clearing with subsequent `/auth/me` fail-closed behavior, deleted-user session expiry, expired JWT cookie clearing, and duplicate token precedence. Local web tests cover AuthProvider bootstrap, logout redirect, session-expired warning cleanup, API interceptor redirect to `/auth/login?session=expired`, middleware cookie gate, and login form/session-refresh fail-closed behavior. 2026-05-14 production status-only proof for deployed `457bce05` verifies login `200`, `/auth/me` before logout `200`, logout `200`, and `/auth/me` after logout `401` without storing credentials, cookies, tokens, or response bodies. Evidence: `docs/planning/v1-production-auth-session-proof-457bce05-2026-05-14-task.md`.

### 4. Profile API Keys (PASS)

- Risk: P0 secrets/exchange access
- Action family: create/test/delete keys, futures-only handling, unsupported exchange handling
- Required proof: UI action + API probe + audit log
- Next proof: Production-safe Profile API Keys clickthrough for create, test, delete, and audit log visibility.
- API modules: profile, exchange, logs
- Web features: profile, exchanges
- Routes: /dashboard/exchanges, /dashboard/profile
- Candidate scripts: `build`, `ops:deploy:wait-web-build-info`, `ops:exchange:gateio-market-stream-smoke`, `ops:prod-security-exchange:proof`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeMarketCatalog.service.test.ts`, `apps/api/src/modules/exchange/exchangeMetadataContract.service.test.ts`
- Notes: Local API proof covers encrypted-only storage, masked list/create responses, create/update/delete/rotate/revoke ownership, Binance and Gate.io provided/stored probes, no persistence of provided test secrets, audit log metadata without raw secrets, futures-missing rejection, bad-key rejection, placeholder exchange fail-closed probe contract, and unsupported ownership protections. Local Web proof covers connection-test-before-save, placeholder exchange save behavior, probe support status, stored-key test action, and delete risk confirmation. 2026-05-14 production fixture proof verifies disposable key create, masked response, stored-key probe fail-closed behavior, audit-log event visibility, and delete cleanup `PASS` without raw secret artifacts.

### 5. Bots (PASS)

- Risk: P0 bot lifecycle
- Action family: create/edit/delete, activate/deactivate, PAPER/LIVE mode, assistant config, market groups, strategy links
- Required proof: UI action + API + DB/runtime readback
- Next proof: Production-safe non-destructive clickthrough for bot actions; local action proof already exists.
- API modules: bots, engine, wallets, markets, strategies
- Web features: bots
- Routes: /dashboard/bots/[id]/assistant, /dashboard/bots/[id]/edit, /dashboard/bots/[id], /dashboard/bots/[id]/preview, /dashboard/bots/[id]/runtime, /dashboard/bots/assistant, /dashboard/bots/create, /dashboard/bots/new, /dashboard/bots, /dashboard/bots/runtime
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:bot:v2:baseline`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`
- Notes: Local safe-fixture action proof covers list delete success/failure, API CRUD/delete/runtime close, ownership, market groups, strategy links, LIVE opt-in guards, duplicate active guards, and runtime monitoring. 2026-05-14 production fixture proof verifies disposable inactive PAPER bot create/read/update, runtime graph read, market-group and strategy-link readbacks, assistant config update, and delete cleanup `PASS` against deployed `457bce05`; no bot was activated live and no order/position mutation was performed.

### 6. Profile (PASS)

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
- Notes: Local API/Web proof covers profile save success/error, timezone persistence/rejection, password mismatch fail-closed behavior, valid password change, invalid/weak password rejection, old-login failure/new-login success, and password-confirmed account deletion. 2026-05-14 production fixture proof verifies deployed profile read/update/restore round-trip with cleanup `PASS`.

### 7. Wallets (PASS)

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
- Notes: Local API/Web proof covers create/edit/delete, PAPER/LIVE mode guards, API-key ownership, balance preview, reset/repair guards, and ledger readback. 2026-05-14 production fixture proof verifies disposable PAPER wallet create/update/read/delete with cleanup `PASS`.

### 8. Markets (PASS)

- Risk: P1 runtime symbol scope
- Action family: universe create/edit/delete, symbols import, capability guards
- Required proof: UI action + API + adapter capability
- Next proof: Production-safe Markets clickthrough for universe create/edit/delete, catalog import, and active-bot guard messaging.
- API modules: markets, market-data, market-stream, exchange
- Web features: markets
- Routes: /dashboard/markets/[id]/edit, /dashboard/markets/create, /dashboard/markets/list
- Candidate scripts: `build`, `ops:deploy:wait-web-build-info`, `ops:exchange:gateio-market-stream-smoke`, `ops:prod-security-exchange:proof`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeMarketCatalog.service.test.ts`, `apps/api/src/modules/exchange/exchangeMetadataContract.service.test.ts`
- Notes: Local API/Web proof covers universe CRUD, catalog import, symbol composition, placeholder capability guards, active-bot guard behavior, inactive-bot edit/delete behavior, stale legacy link handling, and ownership isolation. 2026-05-14 production fixture proof verifies disposable universe create/update/delete and Binance futures catalog readback with cleanup `PASS`.

### 9. Strategies (PASS)

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
- Notes: Local API/Web proof covers CRUD, export/import, ownership, active-bot guards, clone payloads, config validation, presets, indicators, and form mapping. 2026-05-14 production fixture proof verifies disposable strategy create/export/update/delete with cleanup `PASS` and does not mutate the preserved RSI 20/80 strategy.

### 10. Manual Orders (PASS)

- Risk: P0 money-impacting order flow
- Action family: place PAPER order, validation, preview/context, cancel/close paths
- Required proof: UI action + API + DB readback
- Next proof: Production-safe Manual Orders clickthrough for PAPER place/cancel/close with DB readback; LIVE remains blocked-risk without an explicit safe plan.
- API modules: orders, bots, wallets, exchange, positions
- Web features: orders, dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`
- Notes: Local API/Web proof covers manual context, PAPER placement, validation, lifecycle readback, cancel/close, selected-bot scope, open-order actions, and blocked/action states. 2026-05-14 production fixture proof verifies manual-order context, disposable PAPER limit order open/read/cancel, `riskAck` fail-closed cancel guard, and canceled-order readback; LIVE order actions are `BLOCKED_RISK` without an explicit safe plan.

### 11. Positions (PASS)

- Risk: P0 position ownership/runtime truth
- Action family: list, close, update, takeover, import status, live reconciliation
- Required proof: UI/API action proof + exchange snapshot boundary
- Next proof: Production-safe Positions clickthrough for list/close/update/takeover/import-status with exchange snapshot boundary; live mutation remains blocked-risk without explicit safe plan.
- API modules: positions, bots, orders, exchange
- Web features: positions, dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:liveimport:readback`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`
- Notes: Local API/Web proof covers list/read, close/update, takeover, exchange snapshots, live status/reconciliation, orphan repair, imported history, and runtime position close UI states. 2026-05-14 production proof on deployed `2fc90a08` covers PAPER-only open/update/close lifecycle, fail-closed close without `riskAck`, terminal cleanup, takeover/live-status reads, and exchange snapshot boundary. LIVE exchange mutation requires explicit safe plan.

### 12. Orders (PASS)

- Risk: P0 order lifecycle
- Action family: list, cancel, exchange-backed cancel, order fills, fees
- Required proof: UI/API action proof + adapter boundary
- Next proof: Production-safe Orders clickthrough for list/cancel/fill/fee readback through API and adapter boundary; live mutation remains blocked-risk without explicit safe plan.
- API modules: orders, exchange, positions, bots
- Web features: orders, dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`
- Notes: Local API/Web proof covers list/read/open/cancel/close, active filtering, exchange-backed cancel boundary, fills, fees, exchange events, source labels, and cancel actions. 2026-05-14 production fixture proof verifies disposable PAPER limit order open/read/cancel and fail-closed cancel-without-ack behavior; live mutation remains blocked-risk without explicit safe plan.

### 13. Backtests (PASS)

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
- Notes: Local API/Web proof covers create/list/get/delete, explicit ranges, pending reports, worker/job persistence, replay, parity, route shells, create/list/details UI, table actions, hooks, and timeline/report utilities. Production fixture proof covers disposable run create/readback, report/trades/timeline readback, and delete cleanup against deployed `457bce05`.

### 14. Reports (PASS)

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
- Notes: Local API/Web proof covers cross-mode performance aggregation, weighted win rate, PAPER trade aggregation, route shell, empty/success states, aggregated cards/tables, and route-reachable locale copy. Production fixture proof covers per-run report readback for a disposable production backtest run; export/download is not part of the current implemented Reports surface.

### 15. Subscriptions/Admin (PASS)

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
- Notes: Local API/Web/admin route proof covers role fail-closed behavior, plan catalog, entitlement validation, user list metadata, role/plan actions, self-demotion guard, and rendered admin pages. 2026-05-14 production UI module audit for deployed `457bce05` verifies authenticated `/admin`, `/admin/users`, and `/admin/subscriptions` route reachability with admin auth and no blockers. Evidence: `docs/operations/prod-ui-module-clickthrough-457bce05-2026-05-14.md`.

### 16. Logs/Audit Trail (PASS)

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
- Notes: Local API/Web proof covers authenticated rejection, owner-only reads, source/actor/severity filters, pagination defaults/bounds, action-produced audit event visibility, route shell, empty/loaded states, severity filtering, metadata trace rendering, and route-reachable locale copy. 2026-05-14 production fixture proof verifies audit-log readback for the generated API-key probe event.

### 17. Exchange Adapter (PASS)

- Risk: P0 external exchange boundary
- Action family: Binance/Gate.io capabilities, public data, authenticated reads, submit/cancel
- Required proof: adapter contract tests + fail-closed proofs
- Next proof: Production-safe exchange-boundary proof for approved real credentials or read-only adapter operations; live mutation remains blocked-risk without explicit safe plan.
- API modules: exchange, profile, orders, positions, wallets, market-stream
- Web features: exchanges, profile, dashboard-home
- Routes: /dashboard/exchanges, /dashboard, /dashboard/profile
- Candidate scripts: `go-live:infra:down`, `go-live:infra:up`, `ops:exchange:gateio-market-stream-smoke`, `ops:live:controlled-proof`, `ops:liveimport:readback`, `ops:prod-security-exchange:proof`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts`, `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`, `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`
- Notes: Local API/Web proof covers capability boundaries, public catalog/read paths, authenticated read support contracts, API-key probes, connector factories, registry behavior, live order adapter retry/fill/fee boundaries, symbol rules, metadata contracts, snapshot normalization, runtime exchange order guards, and UI capability/redirect/profile integration. 2026-05-14 production proof on deployed `2fc90a08` verifies unsupported exchange probe fail-closed behavior, Binance and Gate.io public catalog reads, Gate.io canonical symbols, and protected readiness details. Real live execution remains outside this proof.

### 18. Workers (PASS)

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
- Notes: Local API proof covers worker ownership/topology, protected `/workers/health`, split/inline `/workers/ready`, `/workers/runtime-freshness` pass/fail/skip behavior, `/ready` diagnostics, market-stream contracts/fanout/polling/binance source behavior, queue tuning, backtest job execution, execution orchestrator parity/import handling, and runtime-flow worker telemetry. 2026-05-14 production proof for deployed `457bce05` verifies protected runtime freshness, worker heartbeat, market data, runtime signal lag, runtime sessions, release gate go-live smoke, and controlled simultaneous PAPER+LIVE runtime readback. Evidence: `docs/operations/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md` and `docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`.

### 19. Operations (PASS)

- Risk: P0 release safety
- Action family: deploy, rollback, restore, release gate, SLO, alerts
- Required proof: existing ops proofs + protected evidence
- Next proof: Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence.
- API modules: engine, bots
- Web features: admin
- Routes: /admin, /admin/subscriptions, /admin/users
- Candidate scripts: `ops:db:backup-restore:check-local`, `ops:db:backup-verify`, `ops:db:backup-verify:local`, `ops:db:backup-verify:prod`, `ops:db:backup-verify:stage`, `ops:db:restore-drill`, `ops:db:restore-drill:local`, `ops:db:restore-drill:prod`, `ops:db:restore-drill:stage`, `ops:deploy:rollback-guard`, `ops:deploy:rollback-proof`, `ops:deploy:rollback-proof:prod`, `ops:deploy:rollback-proof:stage`, `ops:deploy:runtime-freshness`, `ops:deploy:smoke`, `ops:deploy:wait-web-build-info`, `ops:liveimport:readback`, `ops:rc:checklist:sync`, `ops:rc:gates:evidence:check`, `ops:rc:gates:evidence:check:strict:prod`, `ops:rc:gates:local-pipeline`, `ops:rc:gates:local-pipeline:strict`, `ops:rc:gates:local-pipeline:strict:prod`, `ops:rc:gates:prod-pipeline`, `ops:rc:gates:refresh`, `ops:rc:gates:refresh:strict`, `ops:rc:gates:refresh:strict:prod`, `ops:rc:gates:refresh:summary`, `ops:rc:gates:refresh:summary:strict`, `ops:rc:gates:refresh:summary:strict:prod`, `ops:rc:gates:status`, `ops:rc:gates:summary`, `ops:rc:signoff:build`, `ops:release:v1:gate`, `ops:release:v1:preflight`, `ops:release:v1:stage-rehearsal`, `ops:slo:collect`, `ops:slo:window-report`
- Candidate workers: `apps/api/src/workers/backtest.worker.ts`, `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`, `apps/api/src/modules/admin/users/users.e2e.test.ts`, `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`
- Notes: 2026-05-14 protected operations evidence is verified for deployed `457bce05`: build-info freshness, public smoke, protected runtime freshness, rollback proof/guard with no alerts, authenticated production UI clickthrough, `LIVEIMPORT-03`, production backup/restore drill, RC gates/sign-off/checklist, final preflight, and the full non-dry-run release gate all pass. Evidence: `docs/operations/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md`, `docs/operations/v1-final-preflight-457bce05-2026-05-14-ready.md`, `docs/operations/v1-restore-drill-prod-2026-05-14T00-00-00-000Z.md`, and `docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`.

### 20. Security/Privacy (PASS)

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
- Notes: Local API/Web proof covers action-level abuse, fail-closed, secret, and ownership cases. 2026-05-14 production proof on deployed `2fc90a08` verifies protected route fail-closed behavior, ops/metrics rejection without auth, no-store authenticated reads, API-key list redaction, trusted-origin rejection, unsupported probe redaction/fail-closed behavior, security headers, and authenticated readiness details. External independent review remains a separate governance follow-up.

### 21. UX/A11y/Mobile (PASS)

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
- Notes: Local route audit, focused Web state/a11y tests, desktop/mobile screenshots, mobile menu interaction, and console proof passed. 2026-05-14 production route/module audit and CDP browser proof passed on desktop/mobile with screenshots, mobile menu click, keyboard focus, no framework overlay, and no horizontal overflow; non-blocking accessibility heuristic warnings remain for polish.


## API Modules

| Module | Route files | Controller files | Service files | Test files | TS files |
| --- | ---: | ---: | ---: | ---: | ---: |
| admin | 2 | 2 | 2 | 2 | 10 |
| auth | 1 | 1 | 2 | 5 | 14 |
| backtests | 1 | 1 | 5 | 12 | 27 |
| bots | 1 | 1 | 52 | 31 | 85 |
| engine | 0 | 0 | 44 | 45 | 105 |
| exchange | 0 | 0 | 34 | 16 | 40 |
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
| dashboard-home | 36 | 23 | 42 |
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

- Total test/spec files: 335
- API tests: 184
- Web tests: 149
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
- `ops:prod-auth:proof`
- `ops:prod-fixture:action-proof`
- `ops:prod-positions:proof`
- `ops:prod-security-exchange:proof`
- `ops:prod-ux:proof`
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

- none

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
