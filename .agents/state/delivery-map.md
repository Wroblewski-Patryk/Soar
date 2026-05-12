# Delivery Map

Last updated: 2026-05-12

## Current Product Target

- Product: Soar
- Current release or milestone: V1 trading/runtime confidence
- Primary user: trading operator
- Primary outcome: Core bot, backtest, exchange, wallet, dashboard, and subscription journeys work with proof.
- Top blockers: Dashboard Home, Bot Runtime, Auth, Profile API Keys, Profile, Subscriptions/Admin, Wallets, Markets, Strategies, Manual Orders, Positions, Orders, Backtests, Reports, Logs/Audit Trail, Exchange Adapter, Workers, Security/Privacy, and UX/A11y/Mobile are
  `PASS_LOCAL`;
  Operations has local proof and public production health proof, but V1 release
  readiness remains blocked on protected prod/stage evidence, Gate 4 sign-off,
  current backup/restore and rollback proof, and LIVEIMPORT-03 production
  readback. Production-safe clickthrough evidence is still needed before
  release readiness.
- Next mission: Operations protected/production-safe evidence, then production-
  safe clickthroughs for locally proven modules when approved.

## Source Inputs

| ID | Type | Source | What it defines | Status |
| --- | --- | --- | --- | --- |
| SRC-001 | architecture | `docs/architecture/` | Runtime, exchange, bot, safety, and product contracts | active |
| SRC-002 | planning | `docs/planning/mvp-execution-plan.md` | Historical and active release waves | active |
| SRC-003 | UX | `docs/ux/` | Dashboard design and screen quality rules | active |

## Module / Journey Map

| ID | Module | Journey or screen | Layers needed | Current state | Evidence | Next mission |
| --- | --- | --- | --- | --- | --- | --- |
| SOAR-DM-001 | Bots | Create, edit, delete, start/stop, monitor | web, API, DB, runtime, tests | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-BOTS-001`; `BOT-DELETE-ACTIVE-PAPER-2026-05-11` | Production-safe clickthrough on representative data. |
| SOAR-DM-004 | Bot Runtime | Selected bot monitoring route, runtime sessions, positions, symbol stats, trades, redirects | web, API, DB, runtime, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-BOT-RUNTIME-001`; `V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11`; `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`; `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11` | Production-safe clickthrough on representative data. |
| SOAR-DM-003 | Dashboard Home | Selected bot, loading/error/empty states, wallet KPIs, positions/orders/trades runtime truth | web, runtime API contracts, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-DASHBOARD-001`; `V1-DASHBOARD-HOME-SELECTED-BOT-RENDERED-AUDIT-2026-05-11`; `V1-DASHBOARD-HOME-BROWSER-PROOF-2026-05-11`; `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11` active snapshot proof | Local active browser proof now renders runtime-session-backed open positions and wallet KPIs. Production-safe clickthrough/non-local proof remains open. |
| SOAR-DM-005 | Auth | Login, logout, session expiry, protected-route cookie gate | web, API, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-AUTH-001`; `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11` | Production-safe browser clickthrough for login, logout, and expired-session redirect. |
| SOAR-DM-007 | Profile | Basic profile save, timezone preference, password change, and account deletion guards | web, API, DB, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-PROFILE-001`; `V1-PROFILE-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for basic profile save and password/security update. |
| SOAR-DM-008 | Wallets | Create, edit, delete, PAPER/LIVE modes, balance preview, reset guards, and ledger readback | web, API, DB, exchange read boundary, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-WALLETS-001`; `V1-WALLETS-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for create/edit/delete/reset/preview on approved fixture data. |
| SOAR-DM-009 | Markets | Universe CRUD, catalog import, symbol composition, capability guards, and active-bot mutation guard | web, API, DB, exchange catalog boundary, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-MARKETS-001`; `V1-MARKETS-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for universe create/edit/delete, catalog import, and active-bot guard messaging. |
| SOAR-DM-010 | Strategies | Strategy CRUD, clone, import/export, indicator catalog, config validation, and active-bot mutation guard | web, API, DB, engine/backtest compatibility, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-STRATEGIES-001`; `V1-STRATEGIES-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for create/edit/delete/clone/config validation and representative runtime/backtest compatibility proof. |
| SOAR-DM-011 | Manual Orders | PAPER order context, placement, validation, lifecycle readback, cancel/close, and Dashboard Home action states | web, API, DB, exchange boundary, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-MANUAL-ORDERS-001`; `V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for PAPER place/cancel/close with DB readback; LIVE remains blocked-risk without explicit safe plan. |
| SOAR-DM-012 | Positions | Position list/read, close/update, takeover, import status, exchange snapshots, reconciliation, and runtime close UI states | web, API, DB, exchange snapshot boundary, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-POSITIONS-001`; `V1-POSITIONS-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for list/close/update/takeover/import-status; LIVE mutation remains blocked-risk without explicit safe plan. |
| SOAR-DM-013 | Orders | Order list/read/open/cancel/close, active filtering, exchange events, fills, fees, and open-order UI actions | web, API, DB, exchange adapter boundary, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-ORDERS-001`; `V1-ORDERS-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for list/cancel/fill/fee readback; live mutation remains blocked-risk without explicit safe plan. |
| SOAR-DM-014 | Backtests | Run create/list/get/delete, replay worker, report, timeline, parity, and details presentation | web, API, DB, backtest worker, market data, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-BACKTESTS-001`; `V1-BACKTESTS-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for create/delete/details/report/timeline on approved representative RSI strategy and market data. |
| SOAR-DM-015 | Reports | Cross-mode performance summaries, per-run report table, and reports route states | web, API, DB, backtests, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-REPORTS-001`; `V1-REPORTS-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for summaries, cross-mode performance, and per-run report readback on approved data. |
| SOAR-DM-016 | Logs/Audit Trail | Audit filters, pagination, action-produced events, and metadata trace inspection | web, API, DB, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-LOGS-001`; `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for filters, pagination, action-produced events, and metadata trace inspection. |
| SOAR-DM-017 | Exchange Adapter | Capability boundaries, public/authenticated reads, probes, live adapter fail-closed behavior, and UI capability wiring | API, exchange adapter, web, tests, browser/prod-safe proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-EXCHANGE-ADAPTER-001`; `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11` | Production-safe exchange-boundary proof with approved credentials or read-only operations; live mutation remains blocked-risk without explicit safe plan. |
| SOAR-DM-018 | Workers | Runtime loops, market stream, backtest worker, queue/process topology, readiness, and runtime freshness | API, DB, workers, queues, observability, tests, production worker proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-WORKERS-001`; `V1-WORKERS-LOCAL-PROOF-2026-05-11` | Production-safe protected worker/process proof for deployed health/readiness/freshness, queue/process lifecycle, and observability. |
| SOAR-DM-019 | Security/Privacy | Auth, session, ownership isolation, headers/cache, secrets, rate limits, API-key privacy, ops/admin boundaries, and abuse throttling | API, Web, middleware, DB, secrets, security tests, production protected proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-SECURITY-PRIVACY-001`; `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11` | Production-safe protected security proof and external/independent security review. |
| SOAR-DM-020 | UX/A11y/Mobile | Public/dashboard route rendering, state coverage, keyboard/focus, responsive/mobile shell, screenshots, and console health | Web, browser proof, a11y tests, route audit, production clickthrough | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-UX-A11Y-MOBILE-001`; `V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11` | Production browser clickthrough and external accessibility review. |
| SOAR-DM-021 | Subscriptions/Admin | Admin subscription plans, entitlement validation, user role/plan assignment, and protected admin routes | API, Web, DB, auth/role middleware, route audit, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-SUBSCRIPTIONS-ADMIN-001`; `V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12` | Production admin clickthrough with approved non-destructive data and entitlement checks. |
| SOAR-DM-006 | Profile API Keys | Create, test, store, rotate, revoke, delete, and audit exchange keys | web, API, exchange probes, tests, browser proof | partial | `.agents/state/module-confidence-ledger.md` row `SOAR-PROFILE-API-KEYS-001`; `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11` | Production-safe clickthrough for create, test, delete, and audit log visibility. |
| SOAR-DM-002 | Release confidence | P0 journey inventory | web, API, runtime, ops, tests | planned | none | Replace with rows for bots, backtests, exchanges, wallets, strategies, subscriptions, auth, dashboard. |

## Visual Slice Map

| ID | Reference | Screen / zone | Components | States | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| SOAR-VIS-001 | Existing Dashboard Home runtime surface | Dashboard Home runtime data and sidebar | `HomeLiveWidgets`, `RuntimeSidebarSection`, `RuntimeDataSection`, `DataTable`, `Tabs` | loading, empty, error, success, blocked | partial | rendered selected-bot/KPI/table proof in `HomeLiveWidgets.runtime-table-audit.test.tsx`; authenticated empty/onboarding browser proof on desktop/mobile; active snapshot browser proof on desktop/tablet/mobile with open runtime rows and Orders tab interaction |
