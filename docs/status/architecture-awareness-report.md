# Architecture Awareness Report

Generated: 2026-05-29T21:16:40.029Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar

## Counts By Type

| Type | Count |
| --- | ---: |
| agent | 52 |
| api_endpoint | 37 |
| component | 97 |
| document | 2906 |
| feature | 212 |
| function | 2607 |
| migration | 56 |
| model | 106 |
| module | 15 |
| project | 1 |
| route | 346 |
| task | 646 |
| test | 364 |

## Counts By Status

| Status | Count |
| --- | ---: |
| blocked | 13 |
| deprecated | 8 |
| implemented | 6151 |
| in_progress | 8 |
| tested | 628 |
| verified | 637 |

## Health Signals

- Implementation entities without inferred tests: 2056
- Implementation entities without inferred docs: 798
- Entities without owner attribution: 0
- Disconnected entities: 0

## Top Missing Test Links

- api_endpoint: USE /avatars (apps/api/src/index.ts#/avatars)
- api_endpoint: POST /login (apps/api/src/modules/auth/auth.routes.ts#/login)
- api_endpoint: POST /logout (apps/api/src/modules/auth/auth.routes.ts#/logout)
- api_endpoint: GET /me (apps/api/src/modules/auth/auth.routes.ts#/me)
- api_endpoint: POST /register (apps/api/src/modules/auth/auth.routes.ts#/register)
- api_endpoint: GET / (apps/api/src/router/admin.routes.ts#/)
- api_endpoint: USE /subscriptions/plans (apps/api/src/router/admin.routes.ts#/subscriptions/plans)
- api_endpoint: USE /users (apps/api/src/router/admin.routes.ts#/users)
- api_endpoint: GET / (apps/api/src/router/dashboard.routes.ts#/)
- api_endpoint: USE /backtests (apps/api/src/router/dashboard.routes.ts#/backtests)
- api_endpoint: USE /bots (apps/api/src/router/dashboard.routes.ts#/bots)
- api_endpoint: USE /icons (apps/api/src/router/dashboard.routes.ts#/icons)
- api_endpoint: USE /logs (apps/api/src/router/dashboard.routes.ts#/logs)
- api_endpoint: USE /market-stream (apps/api/src/router/dashboard.routes.ts#/market-stream)
- api_endpoint: USE /markets (apps/api/src/router/dashboard.routes.ts#/markets)
- api_endpoint: USE /orders (apps/api/src/router/dashboard.routes.ts#/orders)
- api_endpoint: USE /positions (apps/api/src/router/dashboard.routes.ts#/positions)
- api_endpoint: USE /profile/apiKeys (apps/api/src/router/dashboard.routes.ts#/profile/apiKeys)
- api_endpoint: USE /profile/basic (apps/api/src/router/dashboard.routes.ts#/profile/basic)
- api_endpoint: USE /profile/security (apps/api/src/router/dashboard.routes.ts#/profile/security)
- api_endpoint: USE /profile/subscription (apps/api/src/router/dashboard.routes.ts#/profile/subscription)
- api_endpoint: USE /reports (apps/api/src/router/dashboard.routes.ts#/reports)
- api_endpoint: USE /strategies (apps/api/src/router/dashboard.routes.ts#/strategies)
- api_endpoint: USE /wallets (apps/api/src/router/dashboard.routes.ts#/wallets)
- api_endpoint: GET / (apps/api/src/router/index.ts#/)
- api_endpoint: USE /admin (apps/api/src/router/index.ts#/admin)
- api_endpoint: USE /auth (apps/api/src/router/index.ts#/auth)
- api_endpoint: USE /dashboard (apps/api/src/router/index.ts#/dashboard)
- api_endpoint: GET /health (apps/api/src/router/index.ts#/health)
- api_endpoint: GET /metrics (apps/api/src/router/index.ts#/metrics)
- api_endpoint: GET /ready (apps/api/src/router/index.ts#/ready)
- api_endpoint: GET /ready/details (apps/api/src/router/index.ts#/ready/details)
- api_endpoint: USE /upload (apps/api/src/router/index.ts#/upload)
- api_endpoint: GET /workers/health (apps/api/src/router/index.ts#/workers/health)
- api_endpoint: GET /workers/ready (apps/api/src/router/index.ts#/workers/ready)
- api_endpoint: GET /workers/runtime-freshness (apps/api/src/router/index.ts#/workers/runtime-freshness)
- component: PasswordVisibilityToggle.tsx (apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx)
- component: backtestRunDetailsCharts.tsx (apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx)
- component: BacktestRunDetailsTabPanels.tsx (apps/web/src/features/backtest/components/BacktestRunDetailsTabPanels.tsx)
- component: BotsMonitoringAttributionPills.tsx (apps/web/src/features/bots/components/bots-management/BotsMonitoringAttributionPills.tsx)

## Top Missing Doc Links

- api_endpoint: USE /avatars (apps/api/src/index.ts#/avatars)
- api_endpoint: POST /login (apps/api/src/modules/auth/auth.routes.ts#/login)
- api_endpoint: POST /logout (apps/api/src/modules/auth/auth.routes.ts#/logout)
- api_endpoint: GET /me (apps/api/src/modules/auth/auth.routes.ts#/me)
- api_endpoint: POST /register (apps/api/src/modules/auth/auth.routes.ts#/register)
- api_endpoint: GET / (apps/api/src/router/admin.routes.ts#/)
- api_endpoint: USE /subscriptions/plans (apps/api/src/router/admin.routes.ts#/subscriptions/plans)
- api_endpoint: USE /users (apps/api/src/router/admin.routes.ts#/users)
- api_endpoint: GET / (apps/api/src/router/dashboard.routes.ts#/)
- api_endpoint: USE /backtests (apps/api/src/router/dashboard.routes.ts#/backtests)
- api_endpoint: USE /bots (apps/api/src/router/dashboard.routes.ts#/bots)
- api_endpoint: USE /icons (apps/api/src/router/dashboard.routes.ts#/icons)
- api_endpoint: USE /logs (apps/api/src/router/dashboard.routes.ts#/logs)
- api_endpoint: USE /market-stream (apps/api/src/router/dashboard.routes.ts#/market-stream)
- api_endpoint: USE /markets (apps/api/src/router/dashboard.routes.ts#/markets)
- api_endpoint: USE /orders (apps/api/src/router/dashboard.routes.ts#/orders)
- api_endpoint: USE /positions (apps/api/src/router/dashboard.routes.ts#/positions)
- api_endpoint: USE /profile/apiKeys (apps/api/src/router/dashboard.routes.ts#/profile/apiKeys)
- api_endpoint: USE /profile/basic (apps/api/src/router/dashboard.routes.ts#/profile/basic)
- api_endpoint: USE /profile/security (apps/api/src/router/dashboard.routes.ts#/profile/security)
- api_endpoint: USE /profile/subscription (apps/api/src/router/dashboard.routes.ts#/profile/subscription)
- api_endpoint: USE /reports (apps/api/src/router/dashboard.routes.ts#/reports)
- api_endpoint: USE /strategies (apps/api/src/router/dashboard.routes.ts#/strategies)
- api_endpoint: USE /wallets (apps/api/src/router/dashboard.routes.ts#/wallets)
- api_endpoint: GET / (apps/api/src/router/index.ts#/)
- api_endpoint: USE /admin (apps/api/src/router/index.ts#/admin)
- api_endpoint: GET /alerts (apps/api/src/router/index.ts#/alerts)
- api_endpoint: USE /auth (apps/api/src/router/index.ts#/auth)
- api_endpoint: USE /dashboard (apps/api/src/router/index.ts#/dashboard)
- api_endpoint: GET /health (apps/api/src/router/index.ts#/health)
- api_endpoint: GET /metrics (apps/api/src/router/index.ts#/metrics)
- api_endpoint: GET /ready (apps/api/src/router/index.ts#/ready)
- api_endpoint: GET /ready/details (apps/api/src/router/index.ts#/ready/details)
- api_endpoint: USE /upload (apps/api/src/router/index.ts#/upload)
- api_endpoint: GET /workers/health (apps/api/src/router/index.ts#/workers/health)
- api_endpoint: GET /workers/ready (apps/api/src/router/index.ts#/workers/ready)
- api_endpoint: GET /workers/runtime-freshness (apps/api/src/router/index.ts#/workers/runtime-freshness)
- component: AuthContext.tsx (apps/web/src/context/AuthContext.tsx)
- component: AdminLayoutShell.tsx (apps/web/src/features/admin/layout/AdminLayoutShell.tsx)
- component: LoginForm.tsx (apps/web/src/features/auth/components/LoginForm.tsx)

## Notes

- This is an inferred baseline. CTO/Docs Memory must promote or correct important relations.
- Override input: `C:/Personal/Projekty/Aplikacje/Soar/docs/architecture/scanner-overrides.json` (entity entries: 0, relation entries: 0).
- Override summary: excluded files 0, entity overrides 0, relation overrides 0, critical entities tagged 0.
- `verified` still requires fresh command/browser/deploy evidence, not only file presence.