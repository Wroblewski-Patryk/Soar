# Project Index

Generated at: 2026-05-26T21:14:22.611Z
Evidence date: 2026-05-26

## Purpose

This index is a local, no-network map of the current Soar repository. It is not
V1 approval evidence. Use it as the starting point for module-by-module audits
and fixes.

## V1 Product Action Matrix

Source: `history/audits/v1-product-action-audit-matrix-2026-05-10.md`

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
| 4 | Profile API Keys | PASS | P0 secrets/exchange access | 3 | 2 | 1 | 30 | Production-safe Profile API Keys clickthrough for create, test, delete, and audit log visibility. |
| 5 | Bots | PASS | P0 bot lifecycle | 5 | 1 | 10 | 30 | Production-safe non-destructive clickthrough for bot actions; local action proof already exists. |
| 6 | Profile | PASS | P1 user settings and validation | 1 | 1 | 1 | 13 | Production-safe Profile browser clickthrough for basic profile save and password/security update. |
| 7 | Wallets | PASS | P1 capital source of truth | 3 | 1 | 6 | 30 | Production-safe Wallets clickthrough for create/edit/delete/reset/preview on approved fixture data. |
| 8 | Markets | PASS | P1 runtime symbol scope | 4 | 1 | 3 | 30 | Production-safe Markets clickthrough for universe create/edit/delete, catalog import, and active-bot guard messaging. |
| 9 | Strategies | PASS | P1 trading decision config | 3 | 1 | 4 | 30 | Production-safe Strategies clickthrough for create/edit/delete/clone/config validation, preserving RSI 20/80, plus representative runtime/backtest compatibility proof. |
| 10 | Manual Orders | PASS | P0 money-impacting order flow | 5 | 2 | 1 | 30 | Production-safe Manual Orders clickthrough for PAPER place/cancel/close with DB readback; LIVE remains blocked-risk without an explicit safe plan. |
| 11 | Positions | PASS | P0 position ownership/runtime truth | 4 | 2 | 1 | 30 | Production-safe Positions clickthrough for list/close/update/takeover/import-status with exchange snapshot boundary; live mutation remains blocked-risk without explicit safe plan. |
| 12 | Orders | PASS | P0 order lifecycle | 4 | 2 | 1 | 30 | Production-safe Orders clickthrough for list/cancel/fill/fee readback through API and adapter boundary; live mutation remains blocked-risk without explicit safe plan. |
| 13 | Backtests | PASS | P1 simulation correctness | 3 | 1 | 3 | 30 | Production-safe Backtests browser clickthrough for create/delete/details/report/timeline on approved representative RSI strategy and market data. |
| 14 | Reports | PASS | P2 operator reporting | 4 | 1 | 1 | 30 | Production-safe Reports browser clickthrough for summaries, cross-mode performance, and per-run report readback on approved data. |
| 15 | Subscriptions/Admin | PASS | P0 role/entitlement access | 3 | 1 | 3 | 7 | Production admin clickthrough with approved non-destructive data and entitlement checks. |
| 16 | Logs/Audit Trail | PASS | P1 auditability | 1 | 1 | 1 | 3 | Production-safe Logs/Audit Trail browser clickthrough for filters, pagination, action-produced events, and metadata trace inspection. |
| 17 | Exchange Adapter | PASS | P0 external exchange boundary | 6 | 3 | 2 | 30 | Production-safe exchange-boundary proof for approved real credentials or read-only adapter operations; live mutation remains blocked-risk without explicit safe plan. |
| 18 | Workers | PASS | P0 async runtime reliability | 4 | 2 | 3 | 30 | Production-safe protected worker/process proof for health, readiness, runtime freshness, queue/process lifecycle, and observability on the deployed target. |
| 19 | Operations | PASS | P0 release safety | 2 | 1 | 3 | 30 | Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence. |
| 20 | Security/Privacy | PASS | P0 auth/secrets/data isolation | 5 | 3 | 6 | 30 | Production-safe protected security proof for auth, ownership isolation, rate-limit, secret redaction, fail-closed errors, and abuse cases on an approved deployed target; external security review remains open. |
| 21 | UX/A11y/Mobile | PASS | P1 product usability | 0 | 7 | 30 | 30 | Production browser clickthrough and external accessibility review for per-screen loading/empty/error/success, keyboard/touch, responsive, and accessibility evidence. |

## V1 Audit Work Details

### 1. Dashboard Home (PASS)

- Risk: P0 operator truth surface
- Action family: selected bot, loading/error/empty states, wallet KPIs, positions/orders/trades tables, TTP/TSL/DCA/PnL rendering
- Required proof: UI table assertions + runtime payload fixtures + browser screenshots
- Next proof: Rendered/browser proof for selected bot, wallet KPIs, tables, loading/empty/error, responsive states, and safe clickthrough.
- API modules: bots, orders, positions, wallets, reports
- Web features: dashboard-home
- Routes: /dashboard
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `apps/api/src/modules/bots/bots.multi-strategy-write.e2e.test.ts`
- Notes: Runtime table presenter proof covers negative/zero/positive protection semantics, DCA/fees/history/trade metadata, blocked position actions, and order cancelability. Rendered `HomeLiveWidgets` proof covers negative-PnL prospective TTP suppression, loading state, retryable error state, selected-bot switching, wallet KPI recalculation, open-orders tab rows, and trade-history tab rows. Local browser proof covers authenticated empty/onboarding state on desktop and mobile, keyboard focus, active PAPER snapshot runtime rows, wallet KPIs, desktop/tablet/mobile visibility, and Orders tab interaction through the API aggregate contract. 2026-05-14 production proof for deployed `457bce05` adds authenticated `/dashboard` route reachability and live production runtime readback for both PAPER bots plus controlled Binance LIVE observation. Evidence: `history/evidence/v1-production-dashboard-runtime-action-proof-457bce05-2026-05-14-task.md`.

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
- Notes: Runtime table presenters cover open-position PnL/TTP/TSL/actionability and open-order cancelability locally. The canonical Bot Runtime route has local authenticated running/completed PAPER proof, API readbacks, desktop/tablet/mobile screenshots, safe view switch, completed-session filter, and legacy redirects. Worker telemetry/live-loop proof passes through the real runtime signal loop and authenticated Bot Runtime read APIs. 2026-05-14 production proof for deployed `457bce05` adds authenticated UI route reachability plus runtime readback: both active Binance PAPER bots expose fresh RUNNING sessions, symbol stats, positions, trades, and aggregate data; controlled no-order-guard Binance LIVE proof exposes a RUNNING LIVE session and `LIVEIMPORT-03` readback for `TRXUSDT`; post-cleanup readback confirms the LIVE bot is inactive again. Evidence: `history/evidence/v1-production-dashboard-runtime-action-proof-457bce05-2026-05-14-task.md`.

### 3. Auth (PASS)

- Risk: P0 auth/session correctness
- Action family: login, logout, session refresh, expired session redirects
- Required proof: browser + API auth lifecycle
- Next proof: Production-safe browser Auth clickthrough for login, logout, and expired-session redirect.
- API modules: auth
- Web features: auth
- Routes: /auth/login, /auth/register
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/middleware/requireAuth.test.ts`, `apps/api/src/modules/auth/auth.cookie.test.ts`, `apps/api/src/modules/auth/auth.e2e.test.ts`, `apps/api/src/modules/auth/auth.errors.test.ts`, `apps/api/src/modules/auth/auth.jwt.test.ts`, `apps/api/src/modules/auth/auth.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/positions/positions.authenticatedSnapshots.service.test.ts`, `apps/web/src/app/(public)/auth/authPageCacheContract.test.ts`, `apps/web/src/context/AuthContext.test.tsx`, `apps/web/src/features/auth/components/LoginForm.test.tsx`
- Notes: Local API lifecycle proof covers registration/login cookie TTLs, logout cookie clearing with subsequent `/auth/me` fail-closed behavior, deleted-user session expiry, expired JWT cookie clearing, and duplicate token precedence. Local web tests cover AuthProvider bootstrap, logout redirect, session-expired warning cleanup, API interceptor redirect to `/auth/login?session=expired`, middleware cookie gate, and login form/session-refresh fail-closed behavior. 2026-05-14 production status-only proof for deployed `457bce05` verifies login `200`, `/auth/me` before logout `200`, logout `200`, and `/auth/me` after logout `401` without storing credentials, cookies, tokens, or response bodies. Evidence: `history/evidence/v1-production-auth-session-proof-457bce05-2026-05-14-task.md`.

### 4. Profile API Keys (PASS)

- Risk: P0 secrets/exchange access
- Action family: create/test/delete keys, futures-only handling, unsupported exchange handling
- Required proof: UI action + API probe + audit log
- Next proof: Production-safe Profile API Keys clickthrough for create, test, delete, and audit log visibility.
- API modules: profile, exchange, logs
- Web features: profile, exchanges
- Routes: /dashboard/profile
- Candidate scripts: `build`, `docker:app:build`, `ops:deploy:wait-web-build-info`, `ops:exchange:gateio-market-stream-smoke`, `ops:prod-security-exchange:proof`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeMarketCatalog.service.test.ts`
- Notes: Local API proof covers encrypted-only storage, masked list/create responses, create/update/delete/rotate/revoke ownership, Binance and Gate.io provided/stored probes, no persistence of provided test secrets, audit log metadata without raw secrets, futures-missing rejection, bad-key rejection, placeholder exchange fail-closed probe contract, and unsupported ownership protections. Local Web proof covers connection-test-before-save, placeholder exchange save behavior, probe support status, stored-key test action, and delete risk confirmation. 2026-05-14 production fixture proof verifies disposable key create, masked response, stored-key probe fail-closed behavior, audit-log event visibility, and delete cleanup `PASS` without raw secret artifacts.

### 5. Bots (PASS)

- Risk: P0 bot lifecycle
- Action family: create/edit/delete, activate/deactivate, PAPER/LIVE mode, assistant config, market groups, strategy links
- Required proof: UI action + API + DB/runtime readback
- Next proof: Production-safe non-destructive clickthrough for bot actions; local action proof already exists.
- API modules: bots, engine, wallets, markets, strategies
- Web features: bots
- Routes: /dashboard/bots/[id]/assistant, /dashboard/bots/[id]/edit, /dashboard/bots/[id], /dashboard/bots/[id]/preview, /dashboard/bots/[id]/runtime, /dashboard/bots/assistant, /dashboard/bots/create, /dashboard/bots/new, /dashboard/bots, /dashboard/bots/runtime
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:bot:v2:baseline`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
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
- Candidate scripts: `build`, `docker:app:build`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
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
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeMarketCatalog.service.test.ts`
- Notes: Local API/Web proof covers create/edit/delete, PAPER/LIVE mode guards, API-key ownership, balance preview, reset/repair guards, and ledger readback. 2026-05-14 production fixture proof verifies disposable PAPER wallet create/update/read/delete with cleanup `PASS`.

### 8. Markets (PASS)

- Risk: P1 runtime symbol scope
- Action family: universe create/edit/delete, symbols import, capability guards
- Required proof: UI action + API + adapter capability
- Next proof: Production-safe Markets clickthrough for universe create/edit/delete, catalog import, and active-bot guard messaging.
- API modules: markets, market-data, market-stream, exchange
- Web features: markets
- Routes: /dashboard/markets/[id]/edit, /dashboard/markets/create, /dashboard/markets/list
- Candidate scripts: `build`, `docker:app:build`, `ops:deploy:wait-web-build-info`, `ops:exchange:gateio-market-stream-smoke`, `ops:prod-security-exchange:proof`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`, `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeMarketCatalog.service.test.ts`
- Notes: Local API/Web proof covers universe CRUD, catalog import, symbol composition, placeholder capability guards, active-bot guard behavior, inactive-bot edit/delete behavior, stale legacy link handling, and ownership isolation. 2026-05-14 production fixture proof verifies disposable universe create/update/delete and Binance futures catalog readback with cleanup `PASS`.

### 9. Strategies (PASS)

- Risk: P1 trading decision config
- Action family: create/edit/delete/clone, RSI 20/80 preserved, config validation
- Required proof: UI action + API + runtime/backtest compatibility
- Next proof: Production-safe Strategies clickthrough for create/edit/delete/clone/config validation, preserving RSI 20/80, plus representative runtime/backtest compatibility proof.
- API modules: strategies, backtests, engine
- Web features: strategies
- Routes: /dashboard/strategies/[id]/edit, /dashboard/strategies/[id], /dashboard/strategies/create, /dashboard/strategies/list
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
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
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
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
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:liveimport:readback`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
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
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
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
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
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
- Candidate scripts: `build`, `docker:app:build`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
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
- Candidate scripts: `build`, `docker:app:build`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`, `apps/api/src/modules/admin/users/users.e2e.test.ts`, `apps/api/src/modules/subscriptions/subscriptionEntitlements.service.test.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.test.ts`, `apps/web/src/features/admin/layout/AdminLayoutShell.test.tsx`, `apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx`, `apps/web/src/features/admin/users/pages/AdminUsersPage.test.tsx`
- Notes: Local API/Web/admin route proof covers role fail-closed behavior, plan catalog, entitlement validation, user list metadata, role/plan actions, self-demotion guard, and rendered admin pages. 2026-05-14 production UI module audit for deployed `457bce05` verifies authenticated `/admin`, `/admin/users`, and `/admin/subscriptions` route reachability with admin auth and no blockers. Evidence: `history/plans/prod-ui-module-clickthrough-457bce05-2026-05-14.md`.

### 16. Logs/Audit Trail (PASS)

- Risk: P1 auditability
- Action family: filters, pagination, action log visibility
- Required proof: UI action + API ownership proof
- Next proof: Production-safe Logs/Audit Trail browser clickthrough for filters, pagination, action-produced events, and metadata trace inspection.
- API modules: logs
- Web features: logs
- Routes: /dashboard/logs
- Candidate scripts: `build`, `docker:app:build`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
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
- Routes: /dashboard, /dashboard/profile
- Candidate scripts: `go-live:infra:down`, `go-live:infra:up`, `ops:exchange:gateio-market-stream-smoke`, `ops:live:controlled-proof`, `ops:liveimport:readback`, `ops:prod-security-exchange:proof`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`
- Candidate workers: `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts`, `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`, `apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts`, `apps/api/src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts`, `apps/api/src/modules/exchange/binancePublicRest.service.test.ts`, `apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts`, `apps/api/src/modules/exchange/ccxtFuturesConnector.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `apps/api/src/modules/exchange/exchangeConnectorFactory.service.test.ts`
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
- Notes: Local API proof covers worker ownership/topology, protected `/workers/health`, split/inline `/workers/ready`, `/workers/runtime-freshness` pass/fail/skip behavior, `/ready` diagnostics, market-stream contracts/fanout/polling/binance source behavior, queue tuning, backtest job execution, execution orchestrator parity/import handling, and runtime-flow worker telemetry. 2026-05-14 production proof for deployed `457bce05` verifies protected runtime freshness, worker heartbeat, market data, runtime signal lag, runtime sessions, release gate go-live smoke, and controlled simultaneous PAPER+LIVE runtime readback. Evidence: `history/releases/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md` and `history/evidence/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`.

### 19. Operations (PASS)

- Risk: P0 release safety
- Action family: deploy, rollback, restore, release gate, SLO, alerts
- Required proof: existing ops proofs + protected evidence
- Next proof: Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence.
- API modules: engine, bots
- Web features: admin
- Routes: /admin, /admin/subscriptions, /admin/users
- Candidate scripts: `architecture:graph:drift`, `architecture:graph:drift:strict`, `architecture:graph:generate`, `architecture:journey:index`, `architecture:journey:index:strict`, `architecture:journey:triage`, `audit:data:db-isolated`, `ops:db:backup-restore:check-local`, `ops:db:backup-verify`, `ops:db:backup-verify:local`, `ops:db:backup-verify:prod`, `ops:db:backup-verify:stage`, `ops:db:restore-drill`, `ops:db:restore-drill:local`, `ops:db:restore-drill:prod`, `ops:db:restore-drill:stage`, `ops:deploy:rollback-guard`, `ops:deploy:rollback-proof`, `ops:deploy:rollback-proof:prod`, `ops:deploy:rollback-proof:stage`, `ops:deploy:runtime-freshness`, `ops:deploy:smoke`, `ops:deploy:wait-web-build-info`, `ops:liveimport:readback`, `ops:rc:checklist:sync`, `ops:rc:gates:evidence:check`, `ops:rc:gates:evidence:check:strict:prod`, `ops:rc:gates:local-pipeline`, `ops:rc:gates:local-pipeline:strict`, `ops:rc:gates:local-pipeline:strict:prod`, `ops:rc:gates:prod-pipeline`, `ops:rc:gates:refresh`, `ops:rc:gates:refresh:strict`, `ops:rc:gates:refresh:strict:prod`, `ops:rc:gates:refresh:summary`, `ops:rc:gates:refresh:summary:strict`, `ops:rc:gates:refresh:summary:strict:prod`, `ops:rc:gates:status`, `ops:rc:gates:summary`, `ops:rc:signoff:build`, `ops:release:v1:gate`, `ops:release:v1:preflight`, `ops:release:v1:stage-rehearsal`, `ops:slo:collect`, `ops:slo:window-report`
- Candidate workers: `apps/api/src/workers/backtest.worker.ts`, `apps/api/src/workers/execution.worker.ts`, `apps/api/src/workers/marketData.worker.ts`, `apps/api/src/workers/marketStream.worker.ts`, `apps/api/src/workers/marketStreamSubscriptions.service.ts`, `apps/api/src/workers/marketStreamWorkerConfig.ts`
- Candidate tests: `apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts`, `apps/api/src/modules/admin/users/users.e2e.test.ts`, `apps/api/src/modules/bots/botCanonicalUpdateScope.service.test.ts`, `apps/api/src/modules/bots/botContextValidation.service.test.ts`, `apps/api/src/modules/bots/botOwnership.service.test.ts`, `apps/api/src/modules/bots/bots.delete-cleanup.e2e.test.ts`, `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts`, `apps/api/src/modules/bots/bots.live-paper-concurrent.e2e.test.ts`, `apps/api/src/modules/bots/bots.market-universe-contract.e2e.test.ts`, `apps/api/src/modules/bots/bots.mode-switch-active-position.e2e.test.ts`
- Notes: 2026-05-14 protected operations evidence is verified for deployed `457bce05`: build-info freshness, public smoke, protected runtime freshness, rollback proof/guard with no alerts, authenticated production UI clickthrough, `LIVEIMPORT-03`, production backup/restore drill, RC gates/sign-off/checklist, final preflight, and the full non-dry-run release gate all pass. Evidence: `history/releases/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md`, `history/releases/v1-final-preflight-457bce05-2026-05-14-ready.md`, `history/evidence/v1-restore-drill-prod-2026-05-14T00-00-00-000Z.md`, and `history/artifacts/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`.

### 20. Security/Privacy (PASS)

- Risk: P0 auth/secrets/data isolation
- Action family: ownership isolation, rate limits, secret redaction, fail-closed errors
- Required proof: focused tests + production-safe probes
- Next proof: Production-safe protected security proof for auth, ownership isolation, rate-limit, secret redaction, fail-closed errors, and abuse cases on an approved deployed target; external security review remains open.
- API modules: auth, isolation, profile, admin, subscriptions
- Web features: auth, admin, profile
- Routes: /auth/login, /auth/register, /admin, /admin/subscriptions, /admin/users, /dashboard/profile
- Candidate scripts: `build`, `docker:app:build`, `go-live:infra:down`, `go-live:infra:up`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `test:go-live:api`, `test:go-live:api:with-infra`, `test:go-live:client`, `test:go-live:server`, `test:go-live:server:with-infra`, `test:go-live:smoke`, `test:go-live:web`, `web:verify:build-typecheck`
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
- Routes: /dashboard/backtests/[id], /dashboard/backtests/create, /dashboard/backtests/list, /dashboard/bots/[id]/assistant, /dashboard/bots/[id]/edit, /dashboard/bots/[id], /dashboard/bots/[id]/preview, /dashboard/bots/[id]/runtime, /dashboard/bots/assistant, /dashboard/bots/create, /dashboard/bots/new, /dashboard/bots, /dashboard/bots/runtime, /dashboard/logs, /dashboard/markets/[id]/edit, /dashboard/markets/create, /dashboard/markets/list, /dashboard, /dashboard/profile, /dashboard/reports, /dashboard/strategies/[id]/edit, /dashboard/strategies/[id], /dashboard/strategies/create, /dashboard/strategies/list, /dashboard/wallets/[id]/edit, /dashboard/wallets/[id], /dashboard/wallets/[id]/preview, /dashboard/wallets/create, /dashboard/wallets/list, /dashboard/wallets
- Candidate scripts: `build`, `docker:app:build`, `i18n:audit:route-reachable:web`, `ops:deploy:wait-web-build-info`, `ops:rc:signoff:build`, `ops:ui:prod-clickthrough`, `web:verify:build-typecheck`
- Candidate workers: none
- Candidate tests: `apps/api/src/modules/backtests/backtestDataGateway.test.ts`, `apps/api/src/modules/backtests/backtestFillModel.test.ts`, `apps/api/src/modules/backtests/backtestIndicatorTimelineSeries.test.ts`, `apps/api/src/modules/backtests/backtestParity3Symbols.test.ts`, `apps/api/src/modules/backtests/backtestPatternParityFixtures.test.ts`, `apps/api/src/modules/backtests/backtestRange.service.test.ts`, `apps/api/src/modules/backtests/backtestReplayCore.test.ts`, `apps/api/src/modules/backtests/backtestRunJob.test.ts`, `apps/api/src/modules/backtests/backtestRunQueue.test.ts`, `apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts`, `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- Notes: Local route audit, focused Web state/a11y tests, desktop/mobile screenshots, mobile menu interaction, and console proof passed. 2026-05-14 production route/module audit and CDP browser proof passed on desktop/mobile with screenshots, mobile menu click, keyboard focus, no framework overlay, and no horizontal overflow; non-blocking accessibility heuristic warnings remain for polish.


## API Modules

| Module | Route files | Controller files | Service files | Test files | TS files |
| --- | ---: | ---: | ---: | ---: | ---: |
| admin | 2 | 2 | 2 | 2 | 10 |
| auth | 1 | 1 | 2 | 5 | 14 |
| backtests | 1 | 1 | 5 | 12 | 28 |
| bots | 1 | 1 | 53 | 32 | 88 |
| engine | 0 | 0 | 44 | 48 | 109 |
| exchange | 0 | 0 | 34 | 16 | 41 |
| icons | 1 | 1 | 1 | 1 | 5 |
| isolation | 0 | 0 | 0 | 1 | 1 |
| logs | 1 | 1 | 1 | 1 | 5 |
| market-data | 0 | 0 | 4 | 2 | 6 |
| market-stream | 1 | 0 | 4 | 6 | 11 |
| markets | 1 | 1 | 2 | 1 | 7 |
| orders | 1 | 1 | 9 | 12 | 24 |
| pagination | 0 | 0 | 0 | 1 | 1 |
| positions | 1 | 1 | 7 | 11 | 27 |
| profile | 4 | 4 | 6 | 6 | 24 |
| reports | 1 | 1 | 2 | 2 | 5 |
| strategies | 2 | 2 | 3 | 3 | 12 |
| subscriptions | 0 | 0 | 4 | 1 | 9 |
| upload | 1 | 0 | 0 | 2 | 3 |
| users | 0 | 0 | 0 | 0 | 1 |
| wallets | 1 | 1 | 5 | 4 | 11 |

## Web Features

| Feature | Component-like files | Test files | TS/TSX files |
| --- | ---: | ---: | ---: |
| admin | 4 | 3 | 10 |
| auth | 13 | 5 | 15 |
| backtest | 16 | 10 | 29 |
| bots | 19 | 10 | 34 |
| dashboard-home | 38 | 24 | 44 |
| exchanges | 2 | 2 | 4 |
| icons | 0 | 0 | 3 |
| logs | 2 | 1 | 4 |
| markets | 5 | 2 | 8 |
| orders | 0 | 0 | 0 |
| positions | 0 | 0 | 1 |
| profile | 12 | 6 | 23 |
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
- `apps/api/src/workers/workerHeartbeat.ts`
- `apps/api/src/workers/workerOwnership.ts`

## Test Inventory

- Total test/spec files: 362
- API tests: 195
- Web tests: 151
- Script tests: 16
- Other tests: 0

## Package Scripts

- `api/dev`
- `architecture:graph:drift`
- `architecture:graph:drift:strict`
- `architecture:graph:generate`
- `architecture:journey:index`
- `architecture:journey:index:strict`
- `architecture:journey:triage`
- `audit:data:db-isolated`
- `audit:handoff:check`
- `audit:handoff:check:test`
- `audit:manifest:check`
- `audit:manifest:check:test`
- `audit:manifest:compare`
- `audit:manifest:compare:test`
- `audit:manifest:verify`
- `audit:remediation-plan:check`
- `audit:remediation-plan:check:test`
- `audit:rerun-playbook:check`
- `audit:rerun-playbook:check:test`
- `audit:rollup:check`
- `audit:rollup:check:test`
- `audit:tooling-index:check`
- `audit:tooling-index:check:test`
- `backend:dev`
- `backend/dev`
- `build`
- `client/dev`
- `docker:app:build`
- `docker:app:config`
- `docker:app:down`
- `docker:app:logs`
- `docker:app:ps`
- `docker:app:up`
- `docker:coolify:config`
- `docker:coolify:shared-api:config`
- `docs:parity:check`
- `docs:parity:endpoints:api`
- `frontend:dev`
- `frontend/dev`
- `go-live:infra:down`
- `go-live:infra:up`
- `i18n:audit:route-reachable:web`
- `lint`
- `ops:coolify-stack:env-check`
- `ops:coolify-stack:env-check:example`
- `ops:coolify-stack:env-check:test`
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
- `ops:operator-unblock:check`
- `ops:operator-unblock:check:test`
- `ops:prod-auth:proof`
- `ops:prod-fixture:action-proof`
- `ops:prod-positions:proof`
- `ops:prod-security-exchange:proof`
- `ops:prod-ux:proof`
- `ops:project:index`
- `ops:project:known-state`
- `ops:project:ledger`
- `ops:project:scan`
- `ops:project:scorecard`
- `ops:protected-inputs:check`
- `ops:protected-inputs:check:test`
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
- `qa:smoke-e2e:repeatable`
- `quality:guardrails`
- `quality:guardrails:test`
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
- `docs/architecture/agent-system-primitives.md`
- `docs/architecture/architecture-documentation.md`
- `docs/architecture/architecture-evidence-graph-system.md`
- `docs/architecture/architecture-source-of-truth.md`
- `docs/architecture/archive/architecture-archive.md`
- `docs/architecture/archive/bot-v2-create-update-contract.md`
- `docs/architecture/archive/database.md`
- `docs/architecture/archive/legacy-cryptobot-positions-analysis.md`
- `docs/architecture/archive/modules.md`
- `docs/architecture/archive/runtime-critical-path-decomposition-contract.md`
- `docs/architecture/archive/system-architecture.md`
- `docs/architecture/archive/tech-stack.md`
- `docs/architecture/archive/trading-logic.md`
- `docs/architecture/chains/CHAIN-AI-ASSISTANT-FOUNDATION.md`
- `docs/architecture/chains/CHAIN-API-PLATFORM-SAFETY.md`
- `docs/architecture/chains/CHAIN-API-SUPPORT-ROUTES.md`
- `docs/architecture/chains/CHAIN-AUTH-SESSION-DEEP.md`
- `docs/architecture/chains/CHAIN-AUTH-SESSION.md`
- `docs/architecture/chains/CHAIN-BACKTESTS.md`
- `docs/architecture/chains/CHAIN-BOT-RUNTIME-CORE.md`
- `docs/architecture/chains/CHAIN-BOT-SETUP.md`
- `docs/architecture/chains/CHAIN-DASHBOARD-RUNTIME.md`
- `docs/architecture/chains/CHAIN-ENGINE-RUNTIME-CORE.md`
- `docs/architecture/chains/CHAIN-EXCHANGE-ADAPTER-DEEP.md`
- `docs/architecture/chains/CHAIN-LOGS-AUDIT.md`
- `docs/architecture/chains/CHAIN-MANUAL-ORDER-DEEP.md`
- `docs/architecture/chains/CHAIN-MANUAL-ORDER.md`
- `docs/architecture/chains/CHAIN-MARKET-DATA-STREAM-ADAPTERS.md`
- `docs/architecture/chains/CHAIN-MARKETS.md`
- `docs/architecture/chains/CHAIN-OPS-CONFIG-PIPELINE.md`
- `docs/architecture/chains/CHAIN-POSITIONS-CORE.md`
- `docs/architecture/chains/CHAIN-PROFILE-API-KEYS.md`
- `docs/architecture/chains/CHAIN-RELEASE-AUDIT-TOOLING.md`
- `docs/architecture/chains/CHAIN-REPORTS.md`
- `docs/architecture/chains/CHAIN-RUNTIME-DCA-PNL.md`
- `docs/architecture/chains/CHAIN-RUNTIME-SUPPORT-SERVICES.md`
- `docs/architecture/chains/CHAIN-STRATEGIES.md`
- `docs/architecture/chains/CHAIN-SUBSCRIPTIONS-ADMIN.md`
- `docs/architecture/chains/CHAIN-WALLETS-CORE.md`
- `docs/architecture/chains/CHAIN-WEB-RUNTIME-SURFACES.md`
- `docs/architecture/chains/README.md`
- `docs/architecture/codebase-map.md`
- `docs/architecture/data-ownership-map.md`
- `docs/architecture/nodes/SOAR-AGENT-AI-RED-TEAM.md`
- `docs/architecture/nodes/SOAR-AGENT-COORDINATOR.md`
- `docs/architecture/nodes/SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE.md`
- `docs/architecture/nodes/SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST.md`
- `docs/architecture/nodes/SOAR-API-ADMIN-USERS-LIST.md`
- `docs/architecture/nodes/SOAR-API-ADMIN-USERS-UPDATE.md`
- `docs/architecture/nodes/SOAR-API-AUTH-LOGIN.md`
- `docs/architecture/nodes/SOAR-API-AUTH-LOGOUT.md`
- `docs/architecture/nodes/SOAR-API-AUTH-ME.md`
- `docs/architecture/nodes/SOAR-API-AUTH-REGISTER.md`
- `docs/architecture/nodes/SOAR-API-BACKTEST-RUN-CREATE.md`
- `docs/architecture/nodes/SOAR-API-BACKTEST-RUN-DELETE.md`
- `docs/architecture/nodes/SOAR-API-BACKTEST-RUN-GET.md`
- `docs/architecture/nodes/SOAR-API-BACKTEST-RUN-LIST.md`
- `docs/architecture/nodes/SOAR-API-BACKTEST-RUN-REPORT.md`
- `docs/architecture/nodes/SOAR-API-BACKTEST-RUN-TIMELINE.md`
- `docs/architecture/nodes/SOAR-API-BACKTEST-RUN-TRADES.md`
- `docs/architecture/nodes/SOAR-API-BOT-ASSISTANT-CONFIG-GET.md`
- `docs/architecture/nodes/SOAR-API-BOT-ASSISTANT-CONFIG-UPSERT.md`
- `docs/architecture/nodes/SOAR-API-BOT-ASSISTANT-DRY-RUN.md`
- `docs/architecture/nodes/SOAR-API-BOT-CREATE.md`
- `docs/architecture/nodes/SOAR-API-BOT-DELETE.md`
- `docs/architecture/nodes/SOAR-API-BOT-GET.md`
- `docs/architecture/nodes/SOAR-API-BOT-LIST.md`
- `docs/architecture/nodes/SOAR-API-BOT-MARKET-GROUP-CREATE.md`
- `docs/architecture/nodes/SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH.md`
- `docs/architecture/nodes/SOAR-API-BOT-MARKET-GROUPS-LIST.md`
- `docs/architecture/nodes/SOAR-API-BOT-RUNTIME-AGGREGATE.md`
- `docs/architecture/nodes/SOAR-API-BOT-RUNTIME-CLOSE-POSITION.md`
- `docs/architecture/nodes/SOAR-API-BOT-RUNTIME-GRAPH.md`
- `docs/architecture/nodes/SOAR-API-BOT-RUNTIME-POSITIONS.md`
- `docs/architecture/nodes/SOAR-API-BOT-RUNTIME-SESSION-GET.md`
- `docs/architecture/nodes/SOAR-API-BOT-RUNTIME-SESSIONS.md`
- `docs/architecture/nodes/SOAR-API-BOT-RUNTIME-SYMBOL-STATS.md`
- `docs/architecture/nodes/SOAR-API-BOT-RUNTIME-TRADES.md`
- `docs/architecture/nodes/SOAR-API-BOT-SUBAGENT-DELETE.md`
- `docs/architecture/nodes/SOAR-API-BOT-SUBAGENT-UPSERT.md`
- `docs/architecture/nodes/SOAR-API-BOT-UPDATE.md`
- `docs/architecture/nodes/SOAR-API-ICON-LOOKUP.md`
- `docs/architecture/nodes/SOAR-API-LOGS-LIST.md`
- `docs/architecture/nodes/SOAR-API-MANUAL-CONTEXT.md`
- `docs/architecture/nodes/SOAR-API-MARKET-CATALOG.md`
- `docs/architecture/nodes/SOAR-API-MARKET-STREAM-EVENTS.md`
- `docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-CREATE.md`
- `docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-DELETE.md`
- `docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-GET.md`
- `docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-LIST.md`
- `docs/architecture/nodes/SOAR-API-MARKET-UNIVERSE-UPDATE.md`
- `docs/architecture/nodes/SOAR-API-ORDER-CANCEL.md`
- `docs/architecture/nodes/SOAR-API-ORDER-CLOSE.md`
- `docs/architecture/nodes/SOAR-API-ORDER-GET.md`
- `docs/architecture/nodes/SOAR-API-ORDER-LIST.md`
- `docs/architecture/nodes/SOAR-API-ORDER-OPEN.md`
- `docs/architecture/nodes/SOAR-API-POSITION-EXCHANGE-SNAPSHOT.md`
- `docs/architecture/nodes/SOAR-API-POSITION-GET.md`
- `docs/architecture/nodes/SOAR-API-POSITION-LIST.md`
- `docs/architecture/nodes/SOAR-API-POSITION-LIVE-STATUS.md`
- `docs/architecture/nodes/SOAR-API-POSITION-MANAGEMENT-MODE.md`
- `docs/architecture/nodes/SOAR-API-POSITION-MANUAL-UPDATE.md`
- `docs/architecture/nodes/SOAR-API-POSITION-ORPHAN-REPAIR.md`
- `docs/architecture/nodes/SOAR-API-POSITION-TAKEOVER-REBIND.md`
- `docs/architecture/nodes/SOAR-API-POSITION-TAKEOVER-STATUS.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-CREATE.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-DELETE.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-LIST.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-REVOKE.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-ROTATE.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-STORED-TEST.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-TEST.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-APIKEY-UPDATE.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-BASIC-DELETE.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-BASIC-GET.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-BASIC-UPDATE.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-SECURITY-ACCOUNT.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-SECURITY-PASSWORD.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT.md`
- `docs/architecture/nodes/SOAR-API-PROFILE-SUBSCRIPTION-GET.md`
- `docs/architecture/nodes/SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE.md`
- `docs/architecture/nodes/SOAR-API-STRATEGY-CREATE.md`
- `docs/architecture/nodes/SOAR-API-STRATEGY-DELETE.md`
- `docs/architecture/nodes/SOAR-API-STRATEGY-EXPORT.md`
- `docs/architecture/nodes/SOAR-API-STRATEGY-GET.md`
- `docs/architecture/nodes/SOAR-API-STRATEGY-IMPORT.md`
- `docs/architecture/nodes/SOAR-API-STRATEGY-INDICATORS.md`
- `docs/architecture/nodes/SOAR-API-STRATEGY-LIST.md`
- `docs/architecture/nodes/SOAR-API-STRATEGY-UPDATE.md`
- `docs/architecture/nodes/SOAR-API-UPLOAD-AVATAR.md`
- `docs/architecture/nodes/SOAR-API-WALLET-CASHFLOW-EVENTS.md`
- `docs/architecture/nodes/SOAR-API-WALLET-CREATE.md`
- `docs/architecture/nodes/SOAR-API-WALLET-DELETE.md`
- `docs/architecture/nodes/SOAR-API-WALLET-EQUITY-TIMELINE.md`
- `docs/architecture/nodes/SOAR-API-WALLET-GET.md`
- `docs/architecture/nodes/SOAR-API-WALLET-LIST.md`
- `docs/architecture/nodes/SOAR-API-WALLET-METADATA.md`
- `docs/architecture/nodes/SOAR-API-WALLET-PERFORMANCE-SUMMARY.md`
- `docs/architecture/nodes/SOAR-API-WALLET-PREVIEW-BALANCE.md`
- `docs/architecture/nodes/SOAR-API-WALLET-RESET-PAPER.md`
- `docs/architecture/nodes/SOAR-API-WALLET-UPDATE.md`
- `docs/architecture/nodes/SOAR-COMP-ADMIN-LAYOUT-SHELL.md`
- `docs/architecture/nodes/SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE.md`
- `docs/architecture/nodes/SOAR-COMP-ADMIN-USERS-PAGE.md`
- `docs/architecture/nodes/SOAR-COMP-API-KEY-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-API-KEYS-LIST.md`
- `docs/architecture/nodes/SOAR-COMP-AUDIT-TRAIL-VIEW.md`
- `docs/architecture/nodes/SOAR-COMP-BACKTEST-CREATE-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-BACKTEST-DETAIL-PRESENTERS.md`
- `docs/architecture/nodes/SOAR-COMP-BACKTEST-RUN-DETAILS.md`
- `docs/architecture/nodes/SOAR-COMP-BACKTESTS-LIST-VIEW.md`
- `docs/architecture/nodes/SOAR-COMP-BOT-CREATE-EDIT-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-BOT-FORM-PAGE-CONTENT.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-ASSISTANT-TAB.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-LIST-TABLE.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-MANAGEMENT-TABS.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-MANAGEMENT.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-MONITORING-ATTRIBUTION-PILLS.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-MONITORING-PROTECTION-CELL.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-MONITORING-SECTIONS.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-MONITORING-TAB.md`
- `docs/architecture/nodes/SOAR-COMP-BOTS-PORTFOLIO-HISTORY-SECTION.md`
- `docs/architecture/nodes/SOAR-COMP-EXCHANGE-CONNECTIONS-VIEW.md`
- `docs/architecture/nodes/SOAR-COMP-HOME-LIVE-WIDGETS.md`
- `docs/architecture/nodes/SOAR-COMP-LIVE-MARKET-BAR.md`
- `docs/architecture/nodes/SOAR-COMP-LOGIN-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-MARKET-SEARCHABLE-MULTISELECT.md`
- `docs/architecture/nodes/SOAR-COMP-MARKET-UNIVERSE-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-MARKET-UNIVERSES-TABLE.md`
- `docs/architecture/nodes/SOAR-COMP-MONITORING-FUTURE-SIGNALS.md`
- `docs/architecture/nodes/SOAR-COMP-PERFORMANCE-REPORTS-VIEW.md`
- `docs/architecture/nodes/SOAR-COMP-PROFILE-BASIC-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-PROFILE-SECURITY.md`
- `docs/architecture/nodes/SOAR-COMP-PROFILE-SUBSCRIPTION.md`
- `docs/architecture/nodes/SOAR-COMP-REGISTER-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-RUNTIME-DATA-PRESENTERS.md`
- `docs/architecture/nodes/SOAR-COMP-RUNTIME-DATA-SECTION.md`
- `docs/architecture/nodes/SOAR-COMP-RUNTIME-ONBOARDING-SECTION.md`
- `docs/architecture/nodes/SOAR-COMP-RUNTIME-SIDEBAR-SECTION.md`
- `docs/architecture/nodes/SOAR-COMP-RUNTIME-SIGNALS-SECTION.md`
- `docs/architecture/nodes/SOAR-COMP-SORTABLE-THRESHOLD-LIST-EDITOR.md`
- `docs/architecture/nodes/SOAR-COMP-STRATEGIES-LIST.md`
- `docs/architecture/nodes/SOAR-COMP-STRATEGY-FORM-SECTIONS.md`
- `docs/architecture/nodes/SOAR-COMP-STRATEGY-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-STRATEGY-PRESET-PICKER.md`
- `docs/architecture/nodes/SOAR-COMP-WALLET-CREATE-EDIT-FORM.md`
- `docs/architecture/nodes/SOAR-COMP-WALLET-FORM-PAGE-CONTENT.md`
- `docs/architecture/nodes/SOAR-COMP-WALLET-PREVIEW-PANEL.md`
- `docs/architecture/nodes/SOAR-COMP-WALLETS-LIST-TABLE.md`
- `docs/architecture/nodes/SOAR-CONFIG-API-PACKAGE.md`
- `docs/architecture/nodes/SOAR-CONFIG-COOLIFY-STACK-COMPOSE.md`
- `docs/architecture/nodes/SOAR-CONFIG-CRITICAL-SECRETS-READINESS.md`
- `docs/architecture/nodes/SOAR-CONFIG-LOCAL-COMPOSE.md`
- `docs/architecture/nodes/SOAR-CONFIG-MOBILE-PACKAGE.md`
- `docs/architecture/nodes/SOAR-CONFIG-PNPM-WORKSPACE.md`
- `docs/architecture/nodes/SOAR-CONFIG-PROXY-TRUST.md`
- `docs/architecture/nodes/SOAR-CONFIG-ROOT-PACKAGE.md`
- `docs/architecture/nodes/SOAR-CONFIG-RUNTIME-EXECUTION.md`
- `docs/architecture/nodes/SOAR-CONFIG-SHARED-PACKAGE.md`
- `docs/architecture/nodes/SOAR-CONFIG-VPS-COMPOSE.md`
- `docs/architecture/nodes/SOAR-CONFIG-WEB-PACKAGE.md`
- `docs/architecture/nodes/SOAR-CONTEXT-WEB-AUTH.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-ADMIN-USERS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-AUTH.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-BACKTESTS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-BOTS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-ICONS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-LOGS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-MARKETS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-ORDERS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-POSITIONS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-PROFILE-API-KEYS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-PROFILE-BASIC.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-PROFILE-SECURITY.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-PROFILE-SUBSCRIPTION.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-REPORTS.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-STRATEGIES.md`
- `docs/architecture/nodes/SOAR-CONTROLLER-WALLETS.md`
- `docs/architecture/nodes/SOAR-DB-API-KEY.md`
- `docs/architecture/nodes/SOAR-DB-BACKTEST-REPORT.md`
- `docs/architecture/nodes/SOAR-DB-BACKTEST-RUN.md`
- `docs/architecture/nodes/SOAR-DB-BACKTEST-TRADE.md`
- `docs/architecture/nodes/SOAR-DB-BOT-ASSISTANT-CONFIG.md`
- `docs/architecture/nodes/SOAR-DB-BOT-MARKET-GROUP.md`
- `docs/architecture/nodes/SOAR-DB-BOT-SUBAGENT-CONFIG.md`
- `docs/architecture/nodes/SOAR-DB-BOT.md`
- `docs/architecture/nodes/SOAR-DB-LOG.md`
- `docs/architecture/nodes/SOAR-DB-MARKET-GROUP-STRATEGY-LINK.md`
- `docs/architecture/nodes/SOAR-DB-MARKET-UNIVERSE.md`
- `docs/architecture/nodes/SOAR-DB-ORDER-FILL.md`
- `docs/architecture/nodes/SOAR-DB-ORDER.md`
- `docs/architecture/nodes/SOAR-DB-PAYMENT-INTENT.md`
- `docs/architecture/nodes/SOAR-DB-POSITION.md`
- `docs/architecture/nodes/SOAR-DB-RUNTIME-SESSION.md`
- `docs/architecture/nodes/SOAR-DB-STRATEGY.md`
- `docs/architecture/nodes/SOAR-DB-SUBSCRIPTION-PLAN.md`
- `docs/architecture/nodes/SOAR-DB-SYMBOL-GROUP.md`
- `docs/architecture/nodes/SOAR-DB-TRADE.md`
- `docs/architecture/nodes/SOAR-DB-USER-SUBSCRIPTION.md`
- `docs/architecture/nodes/SOAR-DB-USER.md`
- `docs/architecture/nodes/SOAR-DB-WALLET.md`
- `docs/architecture/nodes/SOAR-DOC-AI-INTEGRATION.md`
- `docs/architecture/nodes/SOAR-DOC-AI-TESTING-PROTOCOL.md`
- `docs/architecture/nodes/SOAR-DOC-API-ADMIN.md`
- `docs/architecture/nodes/SOAR-DOC-API-AUTH.md`
- `docs/architecture/nodes/SOAR-DOC-API-BACKTESTS.md`
- `docs/architecture/nodes/SOAR-DOC-API-BOTS.md`
- `docs/architecture/nodes/SOAR-DOC-API-ICONS.md`
- `docs/architecture/nodes/SOAR-DOC-API-LOGS.md`
- `docs/architecture/nodes/SOAR-DOC-API-MARKET-STREAM.md`
- `docs/architecture/nodes/SOAR-DOC-API-MARKETS.md`
- `docs/architecture/nodes/SOAR-DOC-API-ORDERS.md`
- `docs/architecture/nodes/SOAR-DOC-API-POSITIONS.md`
- `docs/architecture/nodes/SOAR-DOC-API-PROFILE.md`
- `docs/architecture/nodes/SOAR-DOC-API-REPORTS.md`
- `docs/architecture/nodes/SOAR-DOC-API-ROOT.md`
- `docs/architecture/nodes/SOAR-DOC-API-STRATEGIES.md`
- `docs/architecture/nodes/SOAR-DOC-API-SUBSCRIPTIONS.md`
- `docs/architecture/nodes/SOAR-DOC-API-UPLOAD.md`
- `docs/architecture/nodes/SOAR-DOC-API-WALLETS.md`
- `docs/architecture/nodes/SOAR-DOC-ARCHITECTURE-CONTRACT-INDEX.md`
- `docs/architecture/nodes/SOAR-DOC-ARCHITECTURE-GOVERNANCE-INDEX.md`
- `docs/architecture/nodes/SOAR-DOC-ARCHITECTURE-GRAPH-SYSTEM.md`
- `docs/architecture/nodes/SOAR-DOC-ASSISTANT-RUNTIME-CONTRACT.md`
- `docs/architecture/nodes/SOAR-DOC-ASSISTANT-RUNTIME.md`
- `docs/architecture/nodes/SOAR-DOC-CODEBASE-MAP.md`
- `docs/architecture/nodes/SOAR-DOC-COOLIFY-VPS.md`
- `docs/architecture/nodes/SOAR-DOC-DASHBOARD-ROUTE-MAP.md`
- `docs/architecture/nodes/SOAR-DOC-DATA-MODEL.md`
- `docs/architecture/nodes/SOAR-DOC-EXCHANGE-OWNERSHIP.md`
- `docs/architecture/nodes/SOAR-DOC-EXECUTION-LIFECYCLE.md`
- `docs/architecture/nodes/SOAR-DOC-LIVE-POSITION-RESTART.md`
- `docs/architecture/nodes/SOAR-DOC-LOCAL-DEVELOPMENT.md`
- `docs/architecture/nodes/SOAR-DOC-MODULE-GOVERNANCE-INDEX.md`
- `docs/architecture/nodes/SOAR-DOC-POSITION-PNL-LIFECYCLE.md`
- `docs/architecture/nodes/SOAR-DOC-TESTING.md`
- `docs/architecture/nodes/SOAR-DOC-TRACEABILITY.md`
- `docs/architecture/nodes/SOAR-DOC-VENUE-CONTEXT.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-ADMIN.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-AUTH.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-BACKTESTS.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-BOTS.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-DASHBOARD-HOME.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-EXCHANGES.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-ICONS.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-LOGS.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-MARKETS.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-ORDERS.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-POSITIONS.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-PROFILE.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-REPORTS.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-SHARED.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-STRATEGIES.md`
- `docs/architecture/nodes/SOAR-DOC-WEB-WALLETS.md`
- `docs/architecture/nodes/SOAR-FEATURE-AI-ASSISTANT-FOUNDATION.md`
- `docs/architecture/nodes/SOAR-FEATURE-API-PLATFORM-SAFETY.md`
- `docs/architecture/nodes/SOAR-FEATURE-API-SUPPORT-ROUTES.md`
- `docs/architecture/nodes/SOAR-FEATURE-ARCHITECTURE-EVIDENCE-GRAPH.md`
- `docs/architecture/nodes/SOAR-FEATURE-AUTH-SESSION.md`
- `docs/architecture/nodes/SOAR-FEATURE-BACKTESTS.md`
- `docs/architecture/nodes/SOAR-FEATURE-BOT-RUNTIME.md`
- `docs/architecture/nodes/SOAR-FEATURE-BOT-SETUP.md`
- `docs/architecture/nodes/SOAR-FEATURE-DASHBOARD-RUNTIME.md`
- `docs/architecture/nodes/SOAR-FEATURE-ENGINE-RUNTIME-CORE.md`
- `docs/architecture/nodes/SOAR-FEATURE-EXCHANGE-ADAPTER.md`
- `docs/architecture/nodes/SOAR-FEATURE-LOGS-AUDIT.md`
- `docs/architecture/nodes/SOAR-FEATURE-MANUAL-ORDER.md`
- `docs/architecture/nodes/SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS.md`
- `docs/architecture/nodes/SOAR-FEATURE-MARKETS.md`
- `docs/architecture/nodes/SOAR-FEATURE-OPS-CONFIG-PIPELINE.md`
- `docs/architecture/nodes/SOAR-FEATURE-POSITIONS.md`
- `docs/architecture/nodes/SOAR-FEATURE-PROFILE-API-KEYS.md`
- `docs/architecture/nodes/SOAR-FEATURE-RELEASE-AUDIT-TOOLING.md`
- `docs/architecture/nodes/SOAR-FEATURE-REPORTS.md`
- `docs/architecture/nodes/SOAR-FEATURE-RUNTIME-DCA-PNL.md`
- `docs/architecture/nodes/SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES.md`
- `docs/architecture/nodes/SOAR-FEATURE-STRATEGIES.md`
- `docs/architecture/nodes/SOAR-FEATURE-SUBSCRIPTIONS-ADMIN.md`
- `docs/architecture/nodes/SOAR-FEATURE-WALLETS.md`
- `docs/architecture/nodes/SOAR-FEATURE-WEB-RESIDUAL-SURFACES.md`
- `docs/architecture/nodes/SOAR-FEATURE-WEB-RUNTIME-SURFACES.md`
- `docs/architecture/nodes/SOAR-HOOK-BOTS-ASSISTANT-CONTROLLER.md`
- `docs/architecture/nodes/SOAR-HOOK-BOTS-LIST-CONTROLLER.md`
- `docs/architecture/nodes/SOAR-HOOK-BOTS-MONITORING-CONTROLLER.md`
- `docs/architecture/nodes/SOAR-HOOK-CLOSE-RUNTIME-POSITION-ACTION.md`
- `docs/architecture/nodes/SOAR-HOOK-COIN-ICON-LOOKUP.md`
- `docs/architecture/nodes/SOAR-HOOK-MANUAL-ORDER-CONTROLLER.md`
- `docs/architecture/nodes/SOAR-HOOK-RUNTIME-SELECTION-VIEWMODEL.md`
- `docs/architecture/nodes/SOAR-HOOK-USE-API-KEYS.md`
- `docs/architecture/nodes/SOAR-HOOK-USE-HYDRATION-READY.md`
- `docs/architecture/nodes/SOAR-HOOK-USE-LOGIN-FORM.md`
- `docs/architecture/nodes/SOAR-HOOK-USE-REGISTER-FORM.md`
- `docs/architecture/nodes/SOAR-HOOK-USE-USER.md`
- `docs/architecture/nodes/SOAR-LIB-ENV.md`
- `docs/architecture/nodes/SOAR-LIB-ERRORS.md`
- `docs/architecture/nodes/SOAR-LIB-HTTP-ERROR-MAPPER.md`
- `docs/architecture/nodes/SOAR-LIB-LOGGER.md`
- `docs/architecture/nodes/SOAR-LIB-SYMBOLS.md`
- `docs/architecture/nodes/SOAR-MIDDLEWARE-ERROR-HANDLER.md`
- `docs/architecture/nodes/SOAR-MIDDLEWARE-OPS-NETWORK.md`
- `docs/architecture/nodes/SOAR-MIDDLEWARE-RATE-LIMIT.md`
- `docs/architecture/nodes/SOAR-MIDDLEWARE-REQUEST-LOGGER.md`
- `docs/architecture/nodes/SOAR-MIDDLEWARE-REQUIRE-AUTH.md`
- `docs/architecture/nodes/SOAR-MIDDLEWARE-TRUSTED-ORIGIN.md`
- `docs/architecture/nodes/SOAR-PAGE-ADMIN-ROOT.md`
- `docs/architecture/nodes/SOAR-PAGE-ADMIN-SUBSCRIPTIONS.md`
- `docs/architecture/nodes/SOAR-PAGE-ADMIN-USERS.md`
- `docs/architecture/nodes/SOAR-PAGE-BACKTEST-CREATE.md`
- `docs/architecture/nodes/SOAR-PAGE-BACKTEST-DETAIL.md`
- `docs/architecture/nodes/SOAR-PAGE-BACKTESTS-LIST.md`
- `docs/architecture/nodes/SOAR-PAGE-BOT-ASSISTANT.md`
- `docs/architecture/nodes/SOAR-PAGE-BOT-CREATE.md`
- `docs/architecture/nodes/SOAR-PAGE-BOT-DETAIL-ALIAS.md`
- `docs/architecture/nodes/SOAR-PAGE-BOT-EDIT.md`
- `docs/architecture/nodes/SOAR-PAGE-BOT-NEW-ALIAS.md`
- `docs/architecture/nodes/SOAR-PAGE-BOT-PREVIEW.md`
- `docs/architecture/nodes/SOAR-PAGE-BOT-RUNTIME.md`
- `docs/architecture/nodes/SOAR-PAGE-BOTS-LIST.md`
- `docs/architecture/nodes/SOAR-PAGE-DASHBOARD.md`
- `docs/architecture/nodes/SOAR-PAGE-LOGIN.md`
- `docs/architecture/nodes/SOAR-PAGE-LOGS.md`
- `docs/architecture/nodes/SOAR-PAGE-MARKET-CREATE.md`
- `docs/architecture/nodes/SOAR-PAGE-MARKET-EDIT.md`
- `docs/architecture/nodes/SOAR-PAGE-MARKETS-LIST.md`
- `docs/architecture/nodes/SOAR-PAGE-OFFLINE.md`
- `docs/architecture/nodes/SOAR-PAGE-POSITIONS-LEGACY.md`
- `docs/architecture/nodes/SOAR-PAGE-PROFILE.md`
- `docs/architecture/nodes/SOAR-PAGE-PUBLIC-HOME.md`
- `docs/architecture/nodes/SOAR-PAGE-REGISTER.md`
- `docs/architecture/nodes/SOAR-PAGE-REPORTS.md`
- `docs/architecture/nodes/SOAR-PAGE-STRATEGIES-LIST.md`
- `docs/architecture/nodes/SOAR-PAGE-STRATEGY-CREATE.md`
- `docs/architecture/nodes/SOAR-PAGE-STRATEGY-EDIT.md`
- `docs/architecture/nodes/SOAR-PAGE-STRATEGY-ID-ROOT.md`
- `docs/architecture/nodes/SOAR-PAGE-WALLET-CREATE.md`
- `docs/architecture/nodes/SOAR-PAGE-WALLET-EDIT.md`
- `docs/architecture/nodes/SOAR-PAGE-WALLET-ID-ROOT.md`
- `docs/architecture/nodes/SOAR-PAGE-WALLET-PREVIEW.md`
- `docs/architecture/nodes/SOAR-PAGE-WALLETS-LIST.md`
- `docs/architecture/nodes/SOAR-PAGE-WALLETS-ROOT.md`
- `docs/architecture/nodes/SOAR-PIPELINE-GITHUB-CI.md`
- `docs/architecture/nodes/SOAR-PROMPT-AI-RED-TEAM.md`
- `docs/architecture/nodes/SOAR-ROUTER-ADMIN.md`
- `docs/architecture/nodes/SOAR-ROUTER-API-ROOT.md`
- `docs/architecture/nodes/SOAR-ROUTER-DASHBOARD.md`
- `docs/architecture/nodes/SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS.md`
- `docs/architecture/nodes/SOAR-SERVICE-ADMIN-USERS.md`
- `docs/architecture/nodes/SOAR-SERVICE-ASSISTANT-ORCHESTRATOR.md`
- `docs/architecture/nodes/SOAR-SERVICE-AUTH-COOKIE.md`
- `docs/architecture/nodes/SOAR-SERVICE-AUTH-ERRORS.md`
- `docs/architecture/nodes/SOAR-SERVICE-AUTH-JWT.md`
- `docs/architecture/nodes/SOAR-SERVICE-AUTH-SESSION-TOKEN.md`
- `docs/architecture/nodes/SOAR-SERVICE-AUTH.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-DATA-GATEWAY.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-FILL-MODEL.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-RANGE.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-REPLAY-CORE.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-REPORT-LIFECYCLE.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-RUN-JOB.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-RUN-QUEUE.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-STRATEGY-SNAPSHOTS.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTEST-WEB-VIEWMODEL.md`
- `docs/architecture/nodes/SOAR-SERVICE-BACKTESTS.md`
- `docs/architecture/nodes/SOAR-SERVICE-BINANCE-PUBLIC-REST.md`
- `docs/architecture/nodes/SOAR-SERVICE-BINANCE-STREAM.md`
- `docs/architecture/nodes/SOAR-SERVICE-BINANCE-USER-DATA-STREAM.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-ACTIVATION-POLICY.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-API-KEY-RESOLVER.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-ASSISTANT.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-CANONICAL-UPDATE-SCOPE.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-CONTEXT-VALIDATION.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-LIVE-CONSENT.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-MARKET-GROUPS.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-OWNERSHIP.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-PORTFOLIO-HISTORY-READ.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-READ-PROJECTION.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-RESPONSE-MAPPER.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-STRATEGY-PROJECTION-DRIFT.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOT-WRITE-VALIDATION.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOTS-MONITORING-AGGREGATE.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOTS-RUNTIME-READ.md`
- `docs/architecture/nodes/SOAR-SERVICE-BOTS.md`
- `docs/architecture/nodes/SOAR-SERVICE-CCXT-FUTURES-CONNECTOR.md`
- `docs/architecture/nodes/SOAR-SERVICE-CCXT-SPOT-CONNECTOR.md`
- `docs/architecture/nodes/SOAR-SERVICE-ENGINE-ORDER-TYPES.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-API-KEY-PROBE-CLIENT.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-AUTH-READ-CONTRACT.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-AUTH-READ.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-CAPABILITIES.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-EXECUTION-CAPABILITY.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-MARKET-CATALOG.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-PUBLIC-READ.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-REGISTRY.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXCHANGE-SYMBOL-RULES.md`
- `docs/architecture/nodes/SOAR-SERVICE-EXECUTION-ORCHESTRATOR.md`
- `docs/architecture/nodes/SOAR-SERVICE-ICONS.md`
- `docs/architecture/nodes/SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR.md`
- `docs/architecture/nodes/SOAR-SERVICE-INDICATOR-ADAPTER.md`
- `docs/architecture/nodes/SOAR-SERVICE-LIVE-FEE-RECONCILIATION.md`
- `docs/architecture/nodes/SOAR-SERVICE-LIVE-ORDER-ADAPTER.md`
- `docs/architecture/nodes/SOAR-SERVICE-LIVE-POSITION-RECONCILIATION.md`
- `docs/architecture/nodes/SOAR-SERVICE-LOGS.md`
- `docs/architecture/nodes/SOAR-SERVICE-MANUAL-CONTEXT.md`
- `docs/architecture/nodes/SOAR-SERVICE-MARKET-CATALOG-SYMBOL-RESOLVER.md`
- `docs/architecture/nodes/SOAR-SERVICE-MARKET-DATA.md`
- `docs/architecture/nodes/SOAR-SERVICE-MARKET-STREAM-FANOUT.md`
- `docs/architecture/nodes/SOAR-SERVICE-MARKET-STREAM.md`
- `docs/architecture/nodes/SOAR-SERVICE-MARKET-UNIVERSE-HELPERS.md`
- `docs/architecture/nodes/SOAR-SERVICE-MARKETS.md`
- `docs/architecture/nodes/SOAR-SERVICE-ORDER-EXCHANGE-EVENTS.md`
- `docs/architecture/nodes/SOAR-SERVICE-ORDER-LIFECYCLE.md`
- `docs/architecture/nodes/SOAR-SERVICE-ORDER-QUANTITY-RULES.md`
- `docs/architecture/nodes/SOAR-SERVICE-ORDERS.md`
- `docs/architecture/nodes/SOAR-SERVICE-PAPER-LIFECYCLE.md`
- `docs/architecture/nodes/SOAR-SERVICE-PAPER-RUNTIME.md`
- `docs/architecture/nodes/SOAR-SERVICE-PAYMENT-CHECKOUT.md`
- `docs/architecture/nodes/SOAR-SERVICE-POSITION-MANAGEMENT.md`
- `docs/architecture/nodes/SOAR-SERVICE-POSITION-SNAPSHOT-NORMALIZATION.md`
- `docs/architecture/nodes/SOAR-SERVICE-POSITIONS.md`
- `docs/architecture/nodes/SOAR-SERVICE-PRETRADE-RISK.md`
- `docs/architecture/nodes/SOAR-SERVICE-PRETRADE.md`
- `docs/architecture/nodes/SOAR-SERVICE-PROFILE-API-KEY-PROBE.md`
- `docs/architecture/nodes/SOAR-SERVICE-PROFILE-API-KEYS.md`
- `docs/architecture/nodes/SOAR-SERVICE-PROFILE-BASIC-CACHE.md`
- `docs/architecture/nodes/SOAR-SERVICE-PROFILE-BASIC.md`
- `docs/architecture/nodes/SOAR-SERVICE-PROFILE-SECURITY.md`
- `docs/architecture/nodes/SOAR-SERVICE-PROFILE-SUBSCRIPTION.md`
- `docs/architecture/nodes/SOAR-SERVICE-REPORT-MODE-AGGREGATOR.md`
- `docs/architecture/nodes/SOAR-SERVICE-REPORTS.md`
- `docs/architecture/nodes/SOAR-SERVICE-RULE-EVALUATOR.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-AGGREGATE.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-AUTOMATION.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-CAPITAL-CONTEXT.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-DCA-PROTECTION-DISPLAY.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-EXECUTION-DEDUPE.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-EXTERNAL-POSITION-OWNER.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-FINAL-CANDLE-DECISION.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-MARKET-DATA-FALLBACK.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-MARKET-TRUTH-STATE.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-METRICS.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-ORDER-LIFETIME.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-POSITION-COMMAND.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-POSITION-LIFETIME.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-POSITIONS-READ.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SCAN-LOOP.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SESSIONS.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SIGNAL-CONDITION-LINES.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SIGNAL-CONDITION-SUMMARY.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SIGNAL-INDICATORS.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SIGNAL-LOOP.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SIGNAL-STATS-FORMATTING.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-STRATEGY-CONFIG-PARSER.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-STRATEGY-DISPLAY-BY-SYMBOL.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SYMBOL-CATALOG-RESOLVER.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SYMBOL-STATS.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-SYMBOL-UNIVERSE.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-TELEMETRY.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-TOPOLOGY-CACHE.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-TRADE-ACTION-REASON.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-TRADE-LIFECYCLE.md`
- `docs/architecture/nodes/SOAR-SERVICE-RUNTIME-TRADES.md`
- `docs/architecture/nodes/SOAR-SERVICE-SIMULATOR.md`
- `docs/architecture/nodes/SOAR-SERVICE-STRATEGIES.md`
- `docs/architecture/nodes/SOAR-SERVICE-STRATEGY-CONFIG-VALIDATION.md`
- `docs/architecture/nodes/SOAR-SERVICE-STRATEGY-FORM-MAPPER.md`
- `docs/architecture/nodes/SOAR-SERVICE-STRATEGY-INDICATORS.md`
- `docs/architecture/nodes/SOAR-SERVICE-STRATEGY-PRESETS.md`
- `docs/architecture/nodes/SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS.md`
- `docs/architecture/nodes/SOAR-SERVICE-SUBSCRIPTIONS.md`
- `docs/architecture/nodes/SOAR-SERVICE-UPLOAD-AVATAR-PROCESSING.md`
- `docs/architecture/nodes/SOAR-SERVICE-WALLET-CASHFLOW-CLASSIFIER.md`
- `docs/architecture/nodes/SOAR-SERVICE-WALLET-LEDGER.md`
- `docs/architecture/nodes/SOAR-SERVICE-WALLETS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-ADMIN-SUBSCRIPTIONS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-ADMIN-USERS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-API-KEYS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-AUTH.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-BACKTESTS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-BOTS-API.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-ICONS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-LOGS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-MARKETS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-PROFILE-SECURITY.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-REPORTS.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-STRATEGIES.md`
- `docs/architecture/nodes/SOAR-SERVICE-WEB-WALLETS.md`
- `docs/architecture/nodes/SOAR-TEST-AI-ASSISTANT-API.md`
- `docs/architecture/nodes/SOAR-TEST-AI-ASSISTANT-ORCHESTRATOR.md`
- `docs/architecture/nodes/SOAR-TEST-AI-ASSISTANT-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-AI-PROTOCOL-HARNESS.md`
- `docs/architecture/nodes/SOAR-TEST-API-AUTH-COOKIE.md`
- `docs/architecture/nodes/SOAR-TEST-API-AUTH-ERRORS.md`
- `docs/architecture/nodes/SOAR-TEST-API-AUTH-JWT.md`
- `docs/architecture/nodes/SOAR-TEST-API-AUTH-SERVICE.md`
- `docs/architecture/nodes/SOAR-TEST-API-AUTH-SESSION-DEEP.md`
- `docs/architecture/nodes/SOAR-TEST-API-CONFIG-SAFETY.md`
- `docs/architecture/nodes/SOAR-TEST-API-INFRASTRUCTURE-RESIDUAL.md`
- `docs/architecture/nodes/SOAR-TEST-API-LIB-SAFETY.md`
- `docs/architecture/nodes/SOAR-TEST-API-MIDDLEWARE-SAFETY.md`
- `docs/architecture/nodes/SOAR-TEST-API-PLATFORM-SAFETY.md`
- `docs/architecture/nodes/SOAR-TEST-API-RESIDUAL-EVIDENCE.md`
- `docs/architecture/nodes/SOAR-TEST-API-SUPPORT-ROUTES.md`
- `docs/architecture/nodes/SOAR-TEST-ARCHITECTURE-GRAPH.md`
- `docs/architecture/nodes/SOAR-TEST-AUTH-SESSION.md`
- `docs/architecture/nodes/SOAR-TEST-BACKTEST-REPLAY.md`
- `docs/architecture/nodes/SOAR-TEST-BACKTEST-WEB-UTILITIES.md`
- `docs/architecture/nodes/SOAR-TEST-BACKTESTS-API.md`
- `docs/architecture/nodes/SOAR-TEST-BACKTESTS-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-BOT-OWNERSHIP.md`
- `docs/architecture/nodes/SOAR-TEST-BOT-PORTFOLIO-HISTORY.md`
- `docs/architecture/nodes/SOAR-TEST-BOT-RUNTIME-API.md`
- `docs/architecture/nodes/SOAR-TEST-BOT-RUNTIME-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-BOT-SETUP-API.md`
- `docs/architecture/nodes/SOAR-TEST-BOT-SETUP-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-BOT-STRATEGY-PROJECTION-DRIFT.md`
- `docs/architecture/nodes/SOAR-TEST-BOTS-MONITORING-FUTURE-SIGNALS.md`
- `docs/architecture/nodes/SOAR-TEST-BOTS-PORTFOLIO-HISTORY-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-CCXT-FUTURES-CONNECTOR.md`
- `docs/architecture/nodes/SOAR-TEST-DASHBOARD-RUNTIME-HELPERS.md`
- `docs/architecture/nodes/SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-DASHBOARD-RUNTIME-SIGNALS.md`
- `docs/architecture/nodes/SOAR-TEST-DASHBOARD-RUNTIME.md`
- `docs/architecture/nodes/SOAR-TEST-ENGINE-RUNTIME-CORE.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-ADAPTER-BOUNDARY.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-ADAPTER.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-API-KEY-PROBE.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-AUTH-READ.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-CAPABILITY-CONTRACTS.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-CONNECTOR-FACTORY.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-MARKET-CATALOG.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-PUBLIC-MARKET-DATA.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-PUBLIC-READ.md`
- `docs/architecture/nodes/SOAR-TEST-EXCHANGE-SYMBOL-RULES.md`
- `docs/architecture/nodes/SOAR-TEST-GUARDRAILS.md`
- `docs/architecture/nodes/SOAR-TEST-ICONS-API.md`
- `docs/architecture/nodes/SOAR-TEST-LIVE-FEE-RECONCILIATION.md`
- `docs/architecture/nodes/SOAR-TEST-LIVE-ORDER-ADAPTER.md`
- `docs/architecture/nodes/SOAR-TEST-LOGS-API.md`
- `docs/architecture/nodes/SOAR-TEST-LOGS-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-MANUAL-ORDER.md`
- `docs/architecture/nodes/SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS.md`
- `docs/architecture/nodes/SOAR-TEST-MARKET-STREAM-API.md`
- `docs/architecture/nodes/SOAR-TEST-MARKETS-API.md`
- `docs/architecture/nodes/SOAR-TEST-MARKETS-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-ORDER-EXCHANGE-EVENTS.md`
- `docs/architecture/nodes/SOAR-TEST-ORDER-POSITIONS-E2E.md`
- `docs/architecture/nodes/SOAR-TEST-ORDER-QUANTITY-RULES.md`
- `docs/architecture/nodes/SOAR-TEST-ORDER-SERVICE.md`
- `docs/architecture/nodes/SOAR-TEST-PAPER-RUNTIME.md`
- `docs/architecture/nodes/SOAR-TEST-POSITIONS-RECONCILIATION.md`
- `docs/architecture/nodes/SOAR-TEST-POSITIONS-SERVICE.md`
- `docs/architecture/nodes/SOAR-TEST-POSITIONS-SNAPSHOT.md`
- `docs/architecture/nodes/SOAR-TEST-POSITIONS-TAKEOVER-ORPHAN.md`
- `docs/architecture/nodes/SOAR-TEST-PROFILE-API-KEY-PROBE.md`
- `docs/architecture/nodes/SOAR-TEST-PROFILE-API-KEYS-API.md`
- `docs/architecture/nodes/SOAR-TEST-PROFILE-API-KEYS-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-PROFILE-BASIC-API.md`
- `docs/architecture/nodes/SOAR-TEST-PROFILE-SECURITY-API.md`
- `docs/architecture/nodes/SOAR-TEST-RELEASE-AUDIT-TOOLING.md`
- `docs/architecture/nodes/SOAR-TEST-REPORTS-API.md`
- `docs/architecture/nodes/SOAR-TEST-REPORTS-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-RUNTIME-DCA-PNL.md`
- `docs/architecture/nodes/SOAR-TEST-RUNTIME-EXTERNAL-POSITION-OWNER.md`
- `docs/architecture/nodes/SOAR-TEST-RUNTIME-STRATEGY-CONTEXT.md`
- `docs/architecture/nodes/SOAR-TEST-RUNTIME-SUPPORT-SERVICES.md`
- `docs/architecture/nodes/SOAR-TEST-STRATEGIES-API.md`
- `docs/architecture/nodes/SOAR-TEST-STRATEGIES-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-STRATEGY-FORM-UTILS.md`
- `docs/architecture/nodes/SOAR-TEST-STRATEGY-INDICATORS.md`
- `docs/architecture/nodes/SOAR-TEST-SUBSCRIPTIONS-ADMIN-API.md`
- `docs/architecture/nodes/SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS.md`
- `docs/architecture/nodes/SOAR-TEST-UPLOAD-API.md`
- `docs/architecture/nodes/SOAR-TEST-WALLET-LEDGER.md`
- `docs/architecture/nodes/SOAR-TEST-WALLETS-API.md`
- `docs/architecture/nodes/SOAR-TEST-WALLETS-WEB.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-AUTH-CONTEXT.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-AUTH-FORM-TYPES.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-AUTH-FORMS.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-AUTH-HOOKS.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-AUTH-PUBLIC.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-EXCHANGE-CONNECTIONS.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-MANUAL-ORDER.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-POSITIONS.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-PROFILE-BASIC-SECURITY.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-RESIDUAL-SURFACES.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-RUNTIME-SURFACES.md`
- `docs/architecture/nodes/SOAR-TEST-WEB-SHELL-UI.md`
- `docs/architecture/nodes/SOAR-TOOL-OPERATOR-UNBLOCK-PACKET-CHECK.md`
- `docs/architecture/nodes/SOAR-TOOL-REPOSITORY-PATH-RESOLVER.md`
- `docs/architecture/nodes/SOAR-TOOL-REUSABLE-AUDIT-CHECKERS.md`
- `docs/architecture/nodes/SOAR-TOOL-V1-FINAL-PREFLIGHT.md`
- `docs/architecture/nodes/SOAR-TOOL-V1-RELEASE-GATE.md`
- `docs/architecture/nodes/SOAR-TYPES-ADMIN-SUBSCRIPTION-PLANS.md`
- `docs/architecture/nodes/SOAR-TYPES-ADMIN-USERS.md`
- `docs/architecture/nodes/SOAR-TYPES-AUTH.md`
- `docs/architecture/nodes/SOAR-TYPES-BACKTESTS.md`
- `docs/architecture/nodes/SOAR-TYPES-BOTS.md`
- `docs/architecture/nodes/SOAR-TYPES-DASHBOARD-RUNTIME.md`
- `docs/architecture/nodes/SOAR-TYPES-ICONS.md`
- `docs/architecture/nodes/SOAR-TYPES-LOGS.md`
- `docs/architecture/nodes/SOAR-TYPES-MARKETS.md`
- `docs/architecture/nodes/SOAR-TYPES-ORDERS.md`
- `docs/architecture/nodes/SOAR-TYPES-POSITIONS.md`
- `docs/architecture/nodes/SOAR-TYPES-PROFILE-API-KEYS.md`
- `docs/architecture/nodes/SOAR-TYPES-PROFILE-BASIC.md`
- `docs/architecture/nodes/SOAR-TYPES-PROFILE-SECURITY.md`
- `docs/architecture/nodes/SOAR-TYPES-STRATEGIES.md`
- `docs/architecture/nodes/SOAR-TYPES-WALLETS.md`
- `docs/architecture/nodes/SOAR-TYPES-WEB-AUTH-FORMS.md`
- `docs/architecture/nodes/SOAR-UI-PASSWORD-VISIBILITY-TOGGLE.md`
- `docs/architecture/nodes/SOAR-UTIL-BACKTEST-RUN-DETAILS-COPY.md`
- `docs/architecture/nodes/SOAR-UTIL-BOTS-MONITORING-FORMATTERS.md`
- `docs/architecture/nodes/SOAR-UTIL-BOTS-MONITORING-LABELS.md`
- `docs/architecture/nodes/SOAR-UTIL-RUNTIME-DERIVATIONS.md`
- `docs/architecture/nodes/SOAR-UTIL-RUNTIME-FORMATTERS.md`
- `docs/architecture/nodes/SOAR-UTIL-RUNTIME-SIGNAL-CONDITION-STATE.md`
- `docs/architecture/nodes/SOAR-UTIL-RUNTIME-TRADE-META.md`
- `docs/architecture/nodes/SOAR-UTIL-RUNTIME-UI-HELPERS.md`
- `docs/architecture/nodes/SOAR-UTIL-WEB-EXCHANGE-CAPABILITIES.md`
- `docs/architecture/nodes/SOAR-WEB-POSITIONS-SERVICE.md`
- `docs/architecture/nodes/SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-AI-ASSISTANT-FOUNDATION-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-API-PLATFORM-SAFETY-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-API-SUPPORT-ROUTES-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-AUTH-SESSION-DEEP-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-BACKTESTS-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-BOT-SETUP-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-ENGINE-RUNTIME-CORE-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-LOGS-AUDIT-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-MARKET-DATA-STREAM-ADAPTERS-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-MARKETS-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-OPS-CONFIG-PIPELINE-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-PROFILE-API-KEYS-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-RELEASE-AUDIT-TOOLING-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-REPORTS-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-RUNTIME-SUPPORT-SERVICES-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-STRATEGIES-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-SUBSCRIPTIONS-ADMIN-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-WALLETS-CORE-CHAIN.md`
- `docs/architecture/nodes/SOAR-WORKFLOW-WEB-RUNTIME-SURFACES-CHAIN.md`
- `docs/architecture/README.md`
- `docs/architecture/reference/admin-frontend-architecture.md`
- `docs/architecture/reference/app-shell-template-split-contract.md`
- `docs/architecture/reference/architecture-reference-contracts.md`
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
- `docs/architecture/registry/architecture-registry-guide.md`
- `docs/architecture/registry/README.md`
- `docs/architecture/system-architecture.md`
- `docs/architecture/tech-stack.md`
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
- `docs/modules/api-root.md`
- `docs/modules/api-strategies.md`
- `docs/modules/api-subscriptions.md`
- `docs/modules/api-upload.md`
- `docs/modules/api-users.md`
- `docs/modules/api-wallets.md`
- `docs/modules/module-deep-dive-template.md`
- `docs/modules/module-doc-status-index.md`
- `docs/modules/module-documentation.md`
- `docs/modules/module-registry.md`
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
