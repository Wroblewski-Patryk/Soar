# Module Confidence Ledger

Last updated: 2026-05-13

## Purpose

This ledger is the quick reality map for Soar. It tracks whether each important
trading, bot, backtest, exchange, dashboard, subscription, and operations
journey is implemented, verified, broken, blocked, or unknown. Keep it honest.
Do not turn uncertainty into optimism.

## Status Vocabulary

- `NOT_STARTED`: no meaningful implementation exists.
- `IN_PROGRESS`: implementation is actively changing.
- `IMPLEMENTED_NOT_VERIFIED`: code exists, but current proof is missing.
- `PARTIAL`: some scenarios pass, but important scenarios are missing or stale.
- `VERIFIED`: current evidence proves the journey for the target scope.
- `BROKEN`: a reproducible defect exists.
- `BLOCKED`: verification or implementation is blocked by access, decision,
  environment, dependency, or missing input.
- `DEFERRED`: explicitly out of the current release scope.

## Confidence Rules

- `High`: fresh reproducible evidence exists for the real journey.
- `Medium`: good local proof exists, but target, edge-case, or freshness is
  incomplete.
- `Low`: evidence is missing, stale, inferred, or chat-only.

## Ledger

| ID | Module | Journey / function | Priority | Status | Confidence | Evidence | Missing proof or defect | Next smallest action | Owner | Last verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SOAR-AUTH-001 | Auth | Login, logout, session validation, expired-session redirect, and protected-route cookie gate | P0 | PARTIAL | High | 2026-05-11 `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11`: API Auth e2e passed (`11/11`) and proves registration/login cookie TTLs, logout cookie clearing with subsequent `/auth/me` fail-closed behavior, deleted-user session expiry, expired JWT cookie clearing with session-expired message, and duplicate token precedence. Focused Web Auth tests passed (`5` files, `17` tests) and cover AuthProvider bootstrap, logout redirect, session-expired warning cleanup, API interceptor redirect to `/auth/login?session=expired`, middleware cookie gate, login form rendering/error alert, and login hook fail-closed missing-session-refresh behavior. | Local API and web session lifecycle proof is covered. Production-safe/non-local browser clickthrough for login/logout/session expiry remains missing. | Run production-safe Auth browser clickthrough on approved representative data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-PROFILE-001 | Profile | Basic profile update, timezone preference, password change, and account deletion guards | P0 | PARTIAL | High | 2026-05-11 `V1-PROFILE-LOCAL-PROOF-2026-05-11`: API Profile basic/security e2e passed (`2` files, `7` tests), proving self-delete route behavior, legacy delete rejection, valid timezone persistence, invalid timezone rejection, unauthenticated security access rejection, valid-current-password change, weak/invalid password rejection, old-login failure/new-login success, and password-confirmed account deletion. Focused Web Profile tests passed (`2` files, `5` tests), proving basic profile save success/error toasts, timezone preference payload, password mismatch short-circuit without API call, and successful password change payload/feedback. | Local API and Web proof is covered. Production-safe browser clickthrough for basic profile save and password/security update remains missing. Avatar upload transport is outside this V1 row. | Run production-safe Profile browser clickthrough on approved representative data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-PROFILE-API-KEYS-001 | Profile API Keys | Create, test, store, rotate, revoke, delete, and audit exchange API keys | P0 | PARTIAL | High | 2026-05-11 `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11`: API key e2e and probe service tests passed (`2` files, `25` tests). Evidence covers authenticated access, encrypted-only storage, masked responses, create/list/update/delete, rotate/revoke, owner-only mutation/test behavior, Binance and Gate.io provided/stored probes, no persistence of provided test secrets, audit log metadata without raw secrets, placeholder exchange probe fail-closed behavior, bad-key rejection, futures-missing rejection, and unauthorized ownership protections. Focused Web API key form/list tests passed (`2` files, `13` tests), covering connection-test-before-save, placeholder exchange save behavior, probe support status, stored-key test action, and delete risk confirmation. | Local API and Web proof is covered. Production-safe browser clickthrough and real operator-visible audit-log review remain missing. | Run production-safe Profile API Keys clickthrough for create, test, delete, and audit log visibility. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-WALLETS-001 | Wallets | Create, edit, delete, PAPER/LIVE modes, balance preview, reset guards, and ledger readback | P0 | PARTIAL | High | 2026-05-11 `V1-WALLETS-LOCAL-PROOF-2026-05-11`: API Wallets tests passed (`4` files, `43` tests), covering CRUD normalization, ownership isolation, active-bot edit/delete guards, LIVE api-key/allocation validation, exchange mismatch rejection, Gate.io PAPER/LIVE support, preview allocation modes, unsupported placeholder preview fail-closed behavior, Gate.io stored-key preview, paper reset mode/open-position/open-order guards, reset checkpoint preservation, cashflow classification, and wallet open-PnL scoping. Web Wallets tests passed (`9` files, `22` tests), covering list/empty/create routes, inline API-key state, clone payload, create/edit form validation, mode-specific fields, LIVE preview, metadata options, Gate.io PAPER submit, paper reset success/error states, preview summary/timeline/cashflow, partial ledger, and unavailable ledger fail-closed state. | Local API and Web proof is covered. Production-safe browser clickthrough for create/edit/delete/reset/preview remains missing. | Run production-safe Wallets clickthrough on approved fixture data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-MARKETS-001 | Markets | Universe create, edit, delete, catalog import, symbol composition, capability guards, and active-bot mutation guard | P0 | PARTIAL | High | 2026-05-11 `V1-MARKETS-LOCAL-PROOF-2026-05-11`: API Markets e2e passed (`1` file, `17` tests), covering authenticated CRUD, normalization, canonical symbol composition, linked symbol-group sync, empty symbol set handling, Binance/Gate.io catalog reads, placeholder exchange persistence, explicit not-implemented catalog response, active bot update/delete blocking, inactive PAPER/LIVE bot edits, deactivation-through-bot-API edits, stale legacy link ignore, active primary bot drift blocking, and cross-user isolation. Web Markets tests passed (`5` files, `12` tests), covering form preview parity, saved volume filter, whitelist/blacklist composition, catalog-hidden whitelist selection, empty preview submit, edit-mode saved selections, placeholder exchange submit, validation helper, table clone payload, and route shells. | Local API and Web proof is covered. Production-safe browser clickthrough for universe create/edit/delete/catalog/guard messaging remains missing. | Run production-safe Markets clickthrough on approved fixture data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-STRATEGIES-001 | Strategies | Strategy create, edit, delete, clone, import/export, indicator catalog, config validation, and active-bot mutation guard | P0 | PARTIAL | High | 2026-05-11 `V1-STRATEGIES-LOCAL-PROOF-2026-05-11`: API Strategies tests passed (`3` files, `17` tests), covering authenticated CRUD, export/import package contracts, advanced TSL valid/invalid validation, invalid import rejection, cross-user get/update/delete isolation, active-bot update/delete blocking, inactive bot update allowance, DCA reachability validation, and indicator catalog service behavior. Web Strategies tests passed (`14` files, `46` tests), covering list clone naming/create payload, create/edit/detail route shells, form validation and tab flow, zero lifetime, advanced TSL and reordered DCA validation, unreachable DCA blocking, preset utilities, indicator section behavior, form mapping, numeric normalization, close validation, indicator presentation, and taxonomy. | Local API and Web proof is covered. Production-safe browser clickthrough and representative runtime/backtest compatibility proof remain missing. | Run production-safe Strategies clickthrough and representative runtime/backtest compatibility proof before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-MANUAL-ORDERS-001 | Manual Orders | Manual context, PAPER order placement, validation, lifecycle readback, cancel/close, selected-bot scope, and Dashboard Home action states | P0 | PARTIAL | High | 2026-05-11 `V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11`: API Manual Orders tests passed (`7` files, `75` tests), covering manual context, PAPER market truth, open/cancel/close endpoints, order/position ownership, selected-bot write/read scope, quantity rules, position scope, LIVE risk guards, exchange-backed fail-closed cancel behavior, live fill resolution, and live cancel boundary. Web Manual Orders tests passed (`6` files, `20` tests), covering Dashboard Home submit, validation, context/venue/scope semantics, open-order source labels, open-order cancel actions, and submitted/waiting/ready/imported/position-opened/blocked action states. | Local API and Web proof is covered. Production-safe browser clickthrough for PAPER place/cancel/close with DB readback remains missing; LIVE exchange mutation remains blocked-risk without explicit safe plan. | Run production-safe Manual Orders clickthrough on approved fixture data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-POSITIONS-001 | Positions | Position list/read, close/update, takeover, exchange snapshot, import status, reconciliation, and runtime close UI states | P0 | PARTIAL | High | 2026-05-11 `V1-POSITIONS-LOCAL-PROOF-2026-05-11`: API Positions tests passed (`12` files, `90` tests), covering list/read ownership, symbol filter normalization, stale local exclusion, live status scoping, exchange snapshot selection/fail-closed behavior, Gate.io/Binance authenticated snapshots, takeover classification/rebind, bot-only management truth, orphan repair, imported lifecycle history hydration, live reconciliation ownership/ambiguity/stale-close/open-order handling, manual TP/SL safety, management-mode guards, EXCHANGE_SYNC runtime visibility, selected LIVE close, profitable PAPER manual close, carryover open orders, and pending external DCA separation. Web Positions tests passed (`3` files, `10` tests), covering runtime position PnL derivation/fallbacks, ignored/closed close-action states, pending close state, and runtime table action semantics. 2026-05-12 `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12` aligns Web Positions docs to canonical Dashboard Home/Bot Runtime ownership and legacy redirect behavior. | Local API and Web proof is covered. Production-safe browser clickthrough remains missing; LIVE exchange mutation remains blocked-risk without explicit safe plan. | Run production-safe Positions clickthrough on approved fixture data before marking verified. | QA/Test + Frontend Builder | 2026-05-12 |
| SOAR-ORDERS-001 | Orders | Order list/read/open/cancel/close, active-only filtering, exchange events, fills, fees, and open-order UI actions | P0 | PARTIAL | High | 2026-05-11 `V1-ORDERS-LOCAL-PROOF-2026-05-11`: API Orders tests passed (`10` files, `121` tests), covering active order filtering, PAPER/LIVE open contracts, missing price truth rejection, same-symbol add/reverse conflict handling, canonical bot context, LIVE pretrade/risk guards, exchange ids/status/fills/fees, propagated execution errors, manual context rules, close attribution, stale/open exchange-backed cancel and close fail-closed behavior, API list/get ownership, exchange event open/close/DCA/account-update lifecycle, partial/underfilled/capped fill progress, fee pending/backfill, live fill resolution, quantity rules, position scope, and live cancel boundary. Web Orders tests passed (`2` files, `3` tests), covering source labels, active open-order cancel action, and terminal order read-only behavior. 2026-05-12 `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12` aligns Web Orders docs to canonical Dashboard Home/Bot Runtime ownership and legacy redirect behavior. | Local API and Web proof is covered. Production-safe browser clickthrough remains missing; live mutation remains blocked-risk without explicit safe plan. | Run production-safe Orders clickthrough on approved fixture data before marking verified. | QA/Test + Frontend Builder | 2026-05-12 |
| SOAR-BACKTESTS-001 | Backtests | Backtest run create/list/get/delete, replay worker, report, timeline, parity, and UI details flow | P0 | PARTIAL | High | 2026-05-11 `V1-BACKTESTS-LOCAL-PROOF-2026-05-11`: API Backtests tests passed (`12` files, `110` tests), covering auth/ownership, create/list/get/delete, explicit `startAt/endAt` range validation, enriched list fields, pending report contract, strategy-to-backtest-to-paper/live critical flow, paper/live parity with reconciliation, venue consistency, market-universe symbol formula, empty-symbol fail-closed behavior, 3-symbol paper alignment, failed parity diagnostics, run queue/job persistence, replay core, runtime kernel parity, contract remediation, data gateway, fill model, range service, and indicator timeline series. Web Backtests tests passed (`13` files, `32` tests), covering list/create/detail route shells, create form behavior, run details presentation, legacy list view, runs table actions, core-data hook, view-models, non-overlapping trade segments, pair metrics, and timeline indicator overlays. | Local API and Web proof is covered. Production-safe browser clickthrough for create/delete/details/report/timeline on approved representative RSI strategy and market data remains missing. | Run production-safe Backtests clickthrough on approved fixture data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-REPORTS-001 | Reports | Cross-mode performance summaries, per-run report table, and dashboard reports route states | P1 | PARTIAL | High | 2026-05-11 `V1-REPORTS-LOCAL-PROOF-2026-05-11`: API Reports service tests passed (`1` file, `2` tests), covering weighted BACKTEST report aggregation and PAPER trade aggregation. Web Reports tests passed (`3` files, `5` tests), covering `/dashboard/reports` route shell, empty state, aggregated report cards/tables, and route-reachable locale copy. | Local API and Web proof is covered. Production-safe browser clickthrough on representative report data remains missing. Export/download is not part of the current implemented Reports surface. | Run production-safe Reports clickthrough on approved fixture data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-LOGS-001 | Logs/Audit Trail | Authenticated audit log filters, pagination, action-produced events, and metadata trace UI | P1 | PARTIAL | High | 2026-05-11 `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11`: API Logs tests passed (`2` files, `5` tests), covering unauthenticated rejection, owner-only reads, source/actor/severity filters, bot action-produced audit event visibility, and pagination defaults/bounds. Web Logs tests passed (`3` files, `4` tests), covering `/dashboard/logs` route shell, empty and loaded states, severity filter request payload, metadata trace rendering, and route-reachable locale copy. | Local API and Web proof is covered. Production-safe browser clickthrough on representative audit data remains missing. | Run production-safe Logs/Audit Trail clickthrough on approved fixture data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-EXCHANGE-ADAPTER-001 | Exchange Adapter | Binance/Gate.io capability boundaries, public/authenticated reads, API-key probes, live adapter fail-closed behavior, and UI capability wiring | P0 | PARTIAL | High | 2026-05-11 `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11`: fixed Gate.io public catalog symbol normalization at the exchange boundary, then API Exchange tests passed (`19` files, `93` tests), covering API-key probes, runtime exchange order guard, Binance public REST/user data stream, CCXT futures connector behavior, adapter boundary fail-closed support, adapter registry, authenticated read service/contracts, connector factory, execution capability contract, market catalog, metadata contract, public read/market data, symbol rules, live order adapter, live fee reconciliation, and position exchange snapshot normalization. Web Exchanges/Profile API-key tests passed (`5` files, `17` tests), covering capability gating, `/dashboard/exchanges` redirect, profile API-key integration, connection tests, stored-key tests, and delete risk confirmation. 2026-05-12 `V1-CAPABILITY-GATE-SCAN-CLASSIFICATION-2026-05-12` aligns V1 static scan classification with the approved exchange capability matrix so unsupported exchange fail-closed gates are not counted as unresolved findings. | Local API/Web proof is covered. Production-safe exchange-boundary proof with approved real credentials or read-only adapter operations remains missing; real live mutation remains blocked-risk without explicit safe plan. | Run production-safe exchange-boundary proof on approved data/credentials before marking verified. | QA/Test + Backend Builder + Frontend Builder | 2026-05-12 |
| SOAR-WORKERS-001 | Workers | Runtime loops, market stream, backtest worker, queue/process topology, readiness, and runtime freshness | P0 | PARTIAL | High | 2026-05-11 `V1-WORKERS-LOCAL-PROOF-2026-05-11`: API Workers/stream/runtime proof passed (`18` files, `88` tests), covering worker ownership/topology, market-stream source config, subscriptions, fanout retry, market-stream route contracts/e2e, Exchange polling source/fanout, Binance stream parsing, protected worker health/readiness, runtime freshness pass/fail/skip behavior, protected `/ready` diagnostics, PAPER runtime-flow worker telemetry, execution orchestrator behavior/import cleanup, execution adapter parity, backtest run job persistence, and queue tuning. This slice also tightened test isolation for runtime freshness and owned-import e2e cleanup. | Local API proof is covered. Production-safe protected worker/process proof for deployed health/readiness/freshness, queue/process lifecycle, and observability remains missing. | Run production-safe protected worker/process proof on approved deployed target before marking verified. | QA/Test + Backend Builder + Ops/Release | 2026-05-11 |
| SOAR-SECURITY-PRIVACY-001 | Security/Privacy | Auth, session, trusted origin, ops network, rate limits, headers, secret readiness, crypto, ownership isolation, API-key privacy, and abuse throttling | P0 | PARTIAL | High | 2026-05-11 `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11`: API Security/Privacy proof passed (`23` files, `111` tests), covering security/no-store headers, alerts/metrics admin access, `/ready` secret/runtime diagnostics, API error redaction, crypto keyring and legacy decrypt behavior, rate-limit degradation, ops-network/trusted-origin/auth middleware, critical secret readiness, Auth lifecycle/JWT/cookie/error contracts, cross-module data isolation, Profile API-key ownership/secret handling/probes, Profile password/account deletion, stage abuse throttling, and authenticated position snapshots. Web Auth/Profile proof passed (`13` files, `48` tests), covering middleware, AuthContext, login/register forms/hooks/types, public auth cache contract, profile page, API-key form/list, security form, and basic profile form. This slice also tightened test env restoration for JWT rotation and API-key encryption keyring variables. | Local API/Web security proof is covered. Production-safe protected security proof and external security review remain missing. | Run production-safe protected security proof on approved deployed target and schedule external/independent review before marking verified. | QA/Test + Security + Backend Builder + Frontend Builder | 2026-05-11 |
| SOAR-UX-A11Y-MOBILE-001 | UX/A11y/Mobile | Public/dashboard routes, loading/empty/error/success states, keyboard/focus, responsive shell, mobile navigation, screenshot evidence, and console health | P1 | PARTIAL | High | 2026-05-12 `V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11`: local authenticated route audit passed for implemented public/dashboard/legacy routes; focused Web UX/a11y/state tests passed (`25` files, `126` tests), covering shared state components, tables/tabs, form primitives, invalid-field focus, dashboard/page title a11y, responsive header/footer, Dashboard Home states, Bots, Wallets, Markets, Strategies, Backtests, Reports, Logs, Auth, Profile, and route locale smoke. Edge/CDP browser proof captured desktop Dashboard empty/onboarding, desktop Wallets empty state, mobile Dashboard, and mobile menu screenshots; mobile menu focus/click interaction was exercised; CDP console/exception check returned `0` events and no framework overlay was detected. | Local route, rendered desktop/mobile, keyboard/menu, and state/a11y proof is covered. Production browser clickthrough and external accessibility review remain missing. | Run production browser clickthrough and external accessibility review before marking verified. | QA/Test + Frontend Builder | 2026-05-12 |
| SOAR-SUBSCRIPTIONS-ADMIN-001 | Subscriptions/Admin | Admin-only subscription plans, entitlement validation, user role/plan assignment, and rendered admin routes | P0 | PARTIAL | High | 2026-05-12 `V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12`: API admin/subscription tests passed (`3` files, `18` tests), covering unauthenticated rejection, non-admin rejection, plan catalog read, plan price/entitlement update validation, invalid entitlement rejection, user listing with active subscription metadata, role/plan updates, self-demotion blocking, and profile subscription readback. Web admin/profile subscription tests passed (`3` files, `7` tests), covering loaded, error, role-toggle, and plan-assignment UI states. Local admin route audit passed with a throwaway admin, and Edge/CDP screenshots rendered `/admin/subscriptions` and `/admin/users` with no framework overlay. `V1-SUBSCRIPTIONS-FOCUSED-TESTS-2026-05-12` adds focused module coverage for invalid entitlement fallback and FREE-plan LIVE trading fail-closed behavior (`2/2`). `V1-API-SUBSCRIPTIONS-DOC-TRUTH-2026-05-12` aligns the API Subscriptions doc to the current checkout/admin/profile V1 boundary. `V1-MANUAL-PAYMENT-METADATA-CLEANUP-2026-05-12` removes placeholder wording from manual checkout metadata and passes focused profile subscription checkout proof (`8/8`). | Local API/Web/protected route proof is covered. Production admin clickthrough with approved non-destructive data remains missing. | Run production admin clickthrough with approved non-destructive data and entitlement checks before marking verified. | QA/Test + Backend Builder + Frontend Builder | 2026-05-12 |
| SOAR-OPERATIONS-001 | Operations | Deployment smoke, rollback guard/proof, SLO evidence, release gates, alerts, backup/restore, and liveimport readback | P0 | VERIFIED | High | 2026-05-13 `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13`: final `LIVEIMPORT-03` passed for `TRXUSDT`; final preflight has no blockers; production target-only V1 release gate is `ready`; build-info freshness, post-deploy smoke, runtime freshness, and rollback guard passed against production. Full local gate artifact remains `not_ready` only because Docker Desktop was unavailable for `test:go-live:smoke` after guardrails, typecheck, and build passed. | Full Docker-backed local go-live smoke was not rerun because Docker Desktop is unavailable on this workstation. This is an environment proof gap, not a production target blocker. Separate LIVE+PAPER simultaneous runtime proof remains a follow-up outside this Operations gate row. | Rerun `pnpm run test:go-live:smoke` when Docker Desktop is available; execute a dedicated LIVE+PAPER simultaneous runtime proof before claiming broad concurrent bot behavior. | Ops/Release + QA/Test | 2026-05-13 |
| SOAR-DASHBOARD-001 | Dashboard Home | Selected-bot runtime truth, wallet KPIs, runtime positions/orders/trades tables | P0 | PARTIAL | Medium | 2026-05-11 `V1-DASHBOARD-HOME-SELECTED-BOT-RENDERED-AUDIT-2026-05-11`: rendered `HomeLiveWidgets` proof covers loading state, retryable error state, selected-bot switching across two active PAPER bots, selected wallet KPI recalculation, open-orders tab data, trade-history tab data, and suppression of stale previous-bot rows. Focused Dashboard pack passed (`3` files, `35` tests), Web typecheck passed, guardrails passed, and diff check passed with line-ending warnings only. 2026-05-11 `V1-DASHBOARD-HOME-BROWSER-PROOF-2026-05-11`: local authenticated browser proof covers `/dashboard` empty/onboarding state on desktop `1280x720` and mobile `390x844`, no framework overlay, no console errors after `ThemeSwitcher` hydration-noise fix, and keyboard focus on `Open wallets`. 2026-05-11 `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11`: existing PAPER snapshot import now creates deterministic local PAPER wallet/session/stat/event fixture data for the imported bot; API readback proves `/runtime-sessions` `RUNNING`, session positions `openCount: 3`, aggregate `openCount: 3`, and local authenticated Playwright proof renders active rows for `BTCUSDT`, `BNBUSDT`, and `ETHUSDT` on desktop/tablet/mobile with status `RUNNING`, wallet baseline `10,000.00 USDT`, free funds `7,000.00 USDT`, and `Orders` tab interaction. | Dashboard Home active PAPER local proof is now present, with restricted-network resource console noise explained. Full V1 verification still requires production-safe clickthrough and non-local evidence. | Run production-safe Dashboard Home clickthrough on approved representative data after deploy, and keep restricted-network resource failures classified separately from app runtime errors. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-BOT-RUNTIME-001 | Bot Runtime | Canonical bot monitoring route, runtime sessions, symbol stats, open positions, open orders, trades, and legacy runtime redirects | P0 | PARTIAL | High | 2026-05-11 `V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11`: approved PAPER snapshot import created a representative running session for bot `2009f226-28ed-4231-878b-350d27057b5f`; API readbacks returned `200` for runtime sessions, aggregate, positions, symbol stats, and trades. The session is PAPER `RUNNING`, aggregate is `RUNNING`, positions readback has `openCount: 3`, reference balance `10000`, and free cash about `7000`. Authenticated local Playwright fallback proof rendered `/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/preview` on desktop/tablet/mobile with bot `asd`, `RUNNING`, `PAPER`, `BTCUSDT`, `BNBUSDT`, `ETHUSDT`, wallet KPI text, safe view switch to session mode, no console issues, and legacy runtime redirects landing on preview. 2026-05-11 `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`: snapshot import now also creates a deterministic `COMPLETED` PAPER session with one stopped event and three symbol-stat rows. API readbacks prove session list statuses `RUNNING,COMPLETED`, completed detail status `COMPLETED`, `eventsCount: 1`, `symbolsTracked: 3`, completed positions `openCount: 0`, and aggregate metadata `sessionsCount: 2`. Authenticated browser proof filtered Session status to `COMPLETED` and rendered PAPER completed session state with `0 open`, symbols, wallet totals, and a screenshot. 2026-05-11 `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`: `runtime-flow.e2e.test.ts` proves a real `RuntimeSignalLoop` PAPER lifecycle creates a `RUNNING` session, writes at least three runtime events, tracks `BTCUSDT` symbol stats with long and exit counters, closes the runtime position, and exposes the same telemetry through authenticated runtime session list, session detail, symbol-stats, and aggregate APIs. | Local UI/API fixture proof and live-loop worker telemetry proof are covered. Production-safe/non-local clickthrough remains missing. The local snapshot heartbeat is old, so completed/running heartbeat checks correctly show stale `CHECK` while runtime data renders. | Run production-safe Bot Runtime clickthrough on approved representative data before marking verified. | QA/Test + Frontend Builder | 2026-05-11 |
| SOAR-BOTS-001 | Bots | Create, edit, delete, start/stop, and monitor bot through real UI/API path | P0 | PARTIAL | Medium | 2026-05-11 `BOT-DELETE-ACTIVE-PAPER-2026-05-11`: active PAPER bot delete no longer routes through LIVE confirmation; Web Vitest passed (`147` files, `501` tests), API Bots e2e passed (`27/27`), Web typecheck passed, guardrails passed, diff check passed with line-ending warnings only. 2026-05-12 `V1-PROD-UI-INPUT-UNBLOCK-SYNC-00169D7F-2026-05-12`: current operator packet now lists `PROD_UI_AUDIT_*` auth and the `ops:ui:prod-clickthrough` PASS requirement before final V1 gate acceptance. 2026-05-12 `V1-RELEASE-GATE-PROD-UI-EVIDENCE-HARDENING-2026-05-12`: final V1 release gate now requires fresh PASS production UI clickthrough evidence for `/dashboard/bots` and `/dashboard/bots/create`. 2026-05-12 `V1-PROD-UI-CURRENT-BLOCKED-REFRESH-00169D7F-2026-05-12`: current no-auth production UI audit confirms `/dashboard/bots` and `/dashboard/bots/create` fail closed to `/auth/login`; this is current blocker evidence, not accepted Bots journey verification. | Production browser clickthrough on representative data is still missing; user-reported failure needs operator confirmation after deploy. The current session has no approved `PROD_UI_AUDIT_*` auth inputs. | Run safe production/non-destructive Bots action clickthrough with approved `PROD_UI_AUDIT_*` app/admin auth and representative data, then update this row to `VERIFIED` or `BROKEN` based on evidence. | QA/Test + Builder | 2026-05-12 |
| SOAR-REL-001 | Release confidence | Release-critical module inventory and proof map | P0 | IMPLEMENTED_NOT_VERIFIED | Low | Existing planning docs are broad and need current journey-level truth. | No current module-by-module proof ledger. | Inventory P0 journeys for bots, backtests, exchanges, strategies, wallets, subscriptions, auth, dashboard, runtime, and deployment; replace this row with real rows. | Planning | 2026-05-11 |

## Current Release Evidence Notes

- 2026-05-13
  `V1-PRODUCTION-UI-CLICKTHROUGH-REFRESH-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001`, `SOAR-UX-A11Y-MOBILE-001`, and
  `SOAR-SUBSCRIPTIONS-ADMIN-001`: authenticated production route/module
  reachability passed for deployed `00169d7f...` with public `PASS:4`,
  dashboard `PASS:18`, admin `PASS:3`, legacy `PASS:3`, and no blockers.
  Artifact scan found no raw credential/token/cookie/private-header values.
  Rows remain `PARTIAL` because this is GET-only protected route evidence; it
  does not prove every create/edit/delete/action journey or responsive browser
  rendering.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-MONITORING-PROPS-2026-05-13` applies to
  `SOAR-BOT-RUNTIME-001`: Bots Monitoring props now reuse shared runtime enum
  aliases for fee source and capital source, plus `BotRuntimeTrade["origin"]`
  for operational trade origin, removing a local prop-contract drift point.
  Evidence: focused `BotsManagement` test passed (`14/14`), Web typecheck
  passed, local duplicate-union scan returned no matches, and repository
  guardrails passed. The row remains `PARTIAL` pending production-safe
  clickthrough and broader V1 runtime proof.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime enum typing now
  reflects backend `FeeSource`, `TradingRecordOrigin`,
  `PositionManagementMode`, and runtime capital-source domains for runtime
  trade/order/position payloads. Stale Web fixtures using values the backend
  cannot emit were normalized. Evidence: focused Web runtime tests passed (`5`
  files, `47` tests), Web typecheck passed, stale-value scan returned no
  matches, and repository guardrails passed. Rows remain `PARTIAL` because
  production-safe clickthrough and the broader V1 route matrix are still
  separate lanes.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-RUNTIME-ORIGIN-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime position origin
  typing now includes backend `USER`, and Dashboard Home maps backend
  `origin=USER` to the Manual source label in the edit-position context while
  keeping legacy `MANUAL` payload compatibility. Evidence: focused Web test
  passed (`3/3`) and Web typecheck passed. Rows remain `PARTIAL` because the
  broader V1 route matrix and production-safe clickthrough are not complete.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-DASHBOARD-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime trade contract
  now matches backend nullable `orderId`, `positionId`, and `strategyId`;
  Bots Monitoring renders missing runtime relationship IDs as `-`; Web
  positions summary typing and empty API/Web aggregate payloads now carry
  `openPositionQty`. Evidence: Web focused tests passed (`2` files,
  `17` tests), API runtime monitoring aggregate e2e passed (`18/18`), API
  typecheck passed, and Web typecheck passed. Rows remain `PARTIAL` because the
  broader V1 route matrix and production-safe clickthrough are not complete.
- 2026-05-13
  `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: local DB-backed API/runtime evidence now proves
  two active PAPER bots plus active Binance LIVE and Gate.io LIVE bots can
  coexist while selected runtime position reads stay isolated by mode, wallet,
  API key, exchange, and market type. The slice also verifies venue-scoped LIVE
  overlap, Gate.io-safe runtime fallback market data through the exchange
  boundary, Binance-only derivative fallback degradation for Gate.io, duplicate
  guard regression, runtime PnL parity, API typecheck, and focused Dashboard
  Web rendering. A rendered Dashboard Home regression also proves all four
  bots appear in the selector and selected wallet/runtime rows re-scope when
  switching between PAPER, Binance LIVE, and Gate.io LIVE. These module rows
  remain `PARTIAL` because production-safe authenticated UI/runtime clickthrough
  and real live multi-bot operation evidence are still separate V1 lanes.
- 2026-05-13
  `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: final `LIVEIMPORT-03` passed for `TRXUSDT`, final
  preflight has no blockers, and the production target-only release gate is
  `ready` for deployed `00169d7f`. Production build-info freshness,
  post-deploy smoke, runtime freshness, and rollback guard passed. The
  remaining limitation is local-environment-only: full gate artifact
  `2026-05-13Tfinal-v1-gate` is `not_ready` because Docker Desktop was
  unavailable for local `test:go-live:smoke` after guardrails, typecheck, and
  build passed.
- 2026-05-13
  `V1-CONTROLLED-LIVE-PROOF-ATTEMPT-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: an approved controlled LIVE proof started a RUNNING
  session and cleaned up by deactivating the bot. Initial ETH/DOGE proof
  targeting was corrected after confirming the target bot's real managed
  symbol set; the accepted proof passed for `TRXUSDT`. A runner partial-update
  defect was fixed and production bot configuration was restored to inactive
  LIVE/import-capable state after proof.
- 2026-05-13
  `V1-CONTROLLED-LIVE-PROOF-PREACTIVATION-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: controlled LIVE proof preactivation confirms the
  no-order guard is fully active and the target LIVE bot is inactive and
  import-capable. The runner refused activation without explicit live-risk
  approval. Operations remains `BLOCKED`.
- 2026-05-13
  `V1-PROD-RESTORE-AND-LIVEIMPORT-TRUTH-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: production restore drill is fresh `PASS`, while
  LIVEIMPORT is fresh `failed` because the existing LIVE Binance futures bot
  has no running session. Operations remains `BLOCKED`; final preflight now
  has only `evidence:liveImportReadback:failed` as the V1 blocker.
- 2026-05-13 `V1-PROTECTED-PROOF-REDUCTION-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`,
  `SOAR-UX-A11Y-MOBILE-001`, and `SOAR-SUBSCRIPTIONS-ADMIN-001`:
  authenticated production UI clickthrough is now fresh `PASS`, and production
  rollback proof is fresh `PASS`. LIVEIMPORT production readback auth succeeds
  and finds one LIVE Binance futures bot, but no running session exists, so
  Operations remains `BLOCKED` and V1 remains `NO-GO`. Final preflight blockers
  are reduced to production DB restore context, LIVEIMPORT runtime readback,
  and stale backup/restore drill evidence.
- 2026-05-13 `V1-GATE4-PATRYK-SIGNOFF-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: Gate 4 is now approved with the user-authorized
  `Patryk` approver/owner fields, and final preflight reports RC evidence as
  fresh. Operations remains `BLOCKED` on protected technical proof and stale
  DB/rollback evidence.
- 2026-05-13 `V1-RC-CURRENT-BLOCKED-REFRESH-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: RC external gates, sign-off, and checklist are fresh
  for 2026-05-13 but remain failed/blocked because Gate 4 approver fields are
  missing. Operations remains `BLOCKED`.
- 2026-05-13 `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: production activation audit and activation evidence
  plan are fresh `NO-GO` artifacts for 2026-05-13. This removes the activation
  stale classification from final preflight, but Operations remains `BLOCKED`
  until protected auth, DB restore context, RC approval, rollback proof,
  `LIVEIMPORT-03`, authenticated production UI clickthrough, and the final
  release gate are complete.
- 2026-05-13 `V1-OPERATOR-PACKET-CURRENT-DAY-REFRESH-00169D7F-2026-05-13`
  applies to `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`, and
  `SOAR-UX-A11Y-MOBILE-001`: the current operator unblock packet now points to
  2026-05-13 final preflight, protected input readiness, and production UI
  audit artifacts. It is a handoff only, not production proof; statuses remain
  unchanged until protected inputs produce PASS artifacts and the final release
  gate returns `ready`.
- 2026-05-13 `V1-CURRENT-DAY-BLOCKER-REFRESH-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`, and
  `SOAR-UX-A11Y-MOBILE-001`: deployed build-info still matches
  `00169d7fdc3aff8317759137b05594b20e773c8e`, final preflight public smoke
  passes, and no protected input names were present in the current Codex
  shell. The fresh production UI audit is `BLOCKED_AUTH` with protected
  dashboard/admin/legacy routes failing closed to `/auth/login`; this is
  current blocker evidence, not accepted production UI proof. Operations stays
  `BLOCKED`, Bots stays `PARTIAL`, and production UX clickthrough remains
  missing until approved production app/admin auth and protected release inputs
  are available.
- 2026-05-12 `V1-PROTECTED-INPUT-READINESS-CURRENT-SWEEP-00169D7F-2026-05-12`
  applies to `SOAR-OPERATIONS-001` and `SOAR-BOTS-001`: the current no-secret
  env-name sweep found no matching `LIVEIMPORT_READBACK_*`,
  `ROLLBACK_GUARD_*`, `PROD_UI_AUDIT_*`, `PROD_UI_*`, `SOAR_PROD_*`,
  production DB check, RC, or Gate input families. No secret values were
  printed or stored. This keeps Operations `BLOCKED` and Bots `PARTIAL` until
  the operator packet is executed with approved protected inputs.
- 2026-05-12 `BOTMULTI-09-CONTAINMENT-SUPERSEDE-00169D7F-2026-05-12` applies
  to `SOAR-BOT-RUNTIME-001` and `SOAR-OPERATIONS-001`: the historical
  production promotion marker is closed as contained in the deployed V1 line,
  but production runtime verification is still not closed. Protected runtime
  readback remains in `LIVEIMPORT-03` and the final release gate.
- 2026-05-12 `PROD-UI-AUDIT-PLAN-SUPERSEDE-00169D7F-2026-05-12` applies to
  `SOAR-BOTS-001` and `SOAR-UX-A11Y-MOBILE-001`: the historical broad
  production UI audit plan is closed as superseded by the current
  `ops:ui:prod-clickthrough` release-gate lane. Production UI verification is
  still not closed; the final gate requires a fresh PASS
  `prod-ui-module-clickthrough-*` artifact with approved `PROD_UI_AUDIT_*`
  auth.

## Maintenance Rules

- Update this file when a feature ships, a bug is fixed, a regression appears,
  architecture changes, validation proves a journey, or a module is deferred.
- Prefer verification tasks before fix tasks when the only problem is missing
  evidence.
- Mark a journey `VERIFIED` only when evidence is current and reproducible.
- Mark a journey `BROKEN` when a real user journey fails, even if related tests
  pass.
- Link evidence to test names, commands, screenshots, smoke notes, commits, or
  task IDs. Chat-only evidence is not enough.
